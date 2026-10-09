// Self-check for src/lib/firestore.ts with the network stubbed: node scripts/check-firestore.ts
import assert from "node:assert/strict"
import { createVerify, generateKeyPairSync } from "node:crypto"

const { privateKey, publicKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
})
process.env.FIREBASE_PROJECT_ID = "demo-project"
process.env.FIREBASE_CLIENT_EMAIL = "svc@demo-project.iam.gserviceaccount.com"
process.env.FIREBASE_PRIVATE_KEY = privateKey.replace(/\n/g, "\\n") // as stored in env vars

const calls: { url: string; body: string }[] = []
globalThis.fetch = (async (url: string, init: RequestInit) => {
  calls.push({ url, body: String(init.body) })
  if (url.includes("oauth2.googleapis.com")) return Response.json({ access_token: "tok", expires_in: 3600 })
  if (url.endsWith(":runQuery"))
    return Response.json([{ document: { name: "projects/p/databases/(default)/documents/users/abc", fields: { email: { stringValue: "a@b.co" }, n: { integerValue: "3" } } } }])
  return Response.json({})
}) as typeof fetch

const { addDoc, findOneByField, updateDoc } = await import("../src/lib/firestore.ts")

// token: a valid RS256 JWT for the service account
const found = await findOneByField("users", "email", "a@b.co")
const assertion = new URLSearchParams(calls[0].body).get("assertion")!
const [h, c, s] = assertion.split(".")
const verify = createVerify("RSA-SHA256")
verify.update(`${h}.${c}`)
assert.ok(verify.verify(publicKey, Buffer.from(s, "base64url")), "JWT signature verifies")
assert.equal(JSON.parse(Buffer.from(c, "base64url").toString()).iss, "svc@demo-project.iam.gserviceaccount.com")

// query + decode
assert.deepEqual(found, { id: "abc", data: { email: "a@b.co", n: 3 } })
const query = JSON.parse(calls[1].body).structuredQuery
assert.deepEqual(query.where.fieldFilter, { field: { fieldPath: "email" }, op: "EQUAL", value: { stringValue: "a@b.co" } })
assert.ok(calls[1].url.includes("/projects/demo-project/databases/(default)/documents:runQuery"))

// add: encoded fields, must-not-exist precondition, server timestamp; token is reused
await addDoc("cohort_applications", { name: "Asha", year: null, count: 2 }, ["createdAt"])
const add = JSON.parse(calls[2].body).writes[0]
assert.equal(calls.filter((x) => x.url.includes("oauth2")).length, 1, "token cached")
assert.deepEqual(add.update.fields, { name: { stringValue: "Asha" }, year: { nullValue: null }, count: { integerValue: "2" } })
assert.deepEqual(add.currentDocument, { exists: false })
assert.deepEqual(add.updateTransforms, [{ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" }])
assert.match(add.update.name, /documents\/cohort_applications\/[A-Za-z0-9]{20}$/)

// update: only the given fields, document must exist
await updateDoc("users", "abc", { password: "hash" })
const upd = JSON.parse(calls[3].body).writes[0]
assert.deepEqual(upd.updateMask, { fieldPaths: ["password"] })
assert.deepEqual(upd.currentDocument, { exists: true })

console.log("firestore client: all checks passed")
