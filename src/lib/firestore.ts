/**
 * Minimal Firestore client over the REST API, authenticated with the service account via WebCrypto.
 * firebase-admin can't run on Cloudflare Workers: its protobuf layer compiles code with Function(),
 * which Workers forbid. This covers the three operations the app uses and runs on Workers and Node.
 */

type Credentials = { projectId: string; clientEmail: string; privateKey: string }
export type FirestoreDoc = { id: string; data: Record<string, unknown> }
type Value = Record<string, unknown>

// Unconfigured environments check on every request; say so once per process.
let warnedMissingCredentials = false

function credentials(): Credentials | null {
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
  if (!projectId || !clientEmail || !privateKey) {
    if (!warnedMissingCredentials) {
      warnedMissingCredentials = true
      console.warn("Firebase credentials missing. Firestore is not available.")
    }
    return null
  }
  return { projectId, clientEmail, privateKey: privateKey.replace(/\\n/g, "\n") }
}

/** True when the Firebase service-account credentials are set. */
export function firestoreConfigured() {
  return credentials() !== null
}

const base64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
const utf8 = (s: string) => new TextEncoder().encode(s)

let cachedToken: { value: string; expiresAt: number } | null = null

async function accessToken(c: Credentials): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  if (cachedToken && cachedToken.expiresAt - 60 > now) return cachedToken.value

  const der = Uint8Array.from(atob(c.privateKey.replace(/-----[^-]+-----|\s/g, "")), (ch) => ch.charCodeAt(0))
  const key = await crypto.subtle.importKey("pkcs8", der, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["sign"])
  const header = base64url(utf8(JSON.stringify({ alg: "RS256", typ: "JWT" })))
  const claims = base64url(
    utf8(
      JSON.stringify({
        iss: c.clientEmail,
        scope: "https://www.googleapis.com/auth/datastore",
        aud: "https://oauth2.googleapis.com/token",
        iat: now,
        exp: now + 3600,
      })
    )
  )
  const signature = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, utf8(`${header}.${claims}`)))

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${header}.${claims}.${base64url(signature)}`,
    }),
  })
  if (!res.ok) throw new Error(`Google token request failed (${res.status}): ${await res.text()}`)
  const body = (await res.json()) as { access_token: string; expires_in: number }
  cachedToken = { value: body.access_token, expiresAt: now + body.expires_in }
  return body.access_token
}

function encode(v: unknown): Value {
  if (v === null || v === undefined) return { nullValue: null }
  if (typeof v === "string") return { stringValue: v }
  if (typeof v === "boolean") return { booleanValue: v }
  if (typeof v === "number") return Number.isInteger(v) ? { integerValue: String(v) } : { doubleValue: v }
  if (v instanceof Date) return { timestampValue: v.toISOString() }
  throw new Error(`Unsupported Firestore value: ${typeof v}`)
}

function decode(v: Value): unknown {
  if ("stringValue" in v) return v.stringValue
  if ("integerValue" in v) return Number(v.integerValue)
  if ("doubleValue" in v) return v.doubleValue
  if ("booleanValue" in v) return v.booleanValue
  if ("timestampValue" in v) return v.timestampValue
  if ("mapValue" in v) return decodeFields((v.mapValue as { fields?: Record<string, Value> }).fields)
  if ("arrayValue" in v) return ((v.arrayValue as { values?: Value[] }).values ?? []).map(decode)
  return null
}

const decodeFields = (fields: Record<string, Value> = {}) =>
  Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decode(v)]))

const encodeFields = (data: Record<string, unknown>) =>
  Object.fromEntries(Object.entries(data).map(([k, v]) => [k, encode(v)]))

async function call(path: string, body: unknown) {
  const c = credentials()
  if (!c) throw new Error("Firestore is not configured")
  const res = await fetch(`https://firestore.googleapis.com/v1/projects/${c.projectId}/databases/(default)/documents${path}`, {
    method: "POST",
    headers: { authorization: `Bearer ${await accessToken(c)}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`Firestore ${path} failed (${res.status}): ${await res.text()}`)
  return { json: await res.json(), projectId: c.projectId }
}

const docName = (projectId: string, collection: string, id: string) =>
  `projects/${projectId}/databases/(default)/documents/${collection}/${id}`

/** First document in `collection` whose `field` equals `value`, or null. */
export async function findOneByField(collection: string, field: string, value: string): Promise<FirestoreDoc | null> {
  const { json } = await call(":runQuery", {
    structuredQuery: {
      from: [{ collectionId: collection }],
      where: { fieldFilter: { field: { fieldPath: field }, op: "EQUAL", value: encode(value) } },
      limit: 1,
    },
  })
  const hit = (json as { document?: { name: string; fields?: Record<string, Value> } }[]).find((r) => r.document)?.document
  return hit ? { id: hit.name.split("/").pop()!, data: decodeFields(hit.fields) } : null
}

/** Creates a document with a random id; `serverTimestamps` fields are set to the server's write time. */
export async function addDoc(collection: string, data: Record<string, unknown>, serverTimestamps: string[] = []) {
  const id = Array.from(crypto.getRandomValues(new Uint8Array(20)), (b) => "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"[b % 62]).join("")
  const c = credentials()
  if (!c) throw new Error("Firestore is not configured")
  await call(":commit", {
    writes: [
      {
        update: { name: docName(c.projectId, collection, id), fields: encodeFields(data) },
        currentDocument: { exists: false },
        updateTransforms: serverTimestamps.map((fieldPath) => ({ fieldPath, setToServerValue: "REQUEST_TIME" })),
      },
    ],
  })
  return id
}

/** Overwrites the given fields of an existing document, leaving its other fields as they are. */
export async function updateDoc(collection: string, id: string, data: Record<string, unknown>) {
  const c = credentials()
  if (!c) throw new Error("Firestore is not configured")
  await call(":commit", {
    writes: [
      {
        update: { name: docName(c.projectId, collection, id), fields: encodeFields(data) },
        updateMask: { fieldPaths: Object.keys(data) },
        currentDocument: { exists: true },
      },
    ],
  })
}
