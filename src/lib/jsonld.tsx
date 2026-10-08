const SCHEMA_CONTEXT = "https://schema.org"

/**
 * Serialises JSON-LD for a <script> tag: adds "@context": "https://schema.org" when the object has
 * none, and escapes "<" as < (Next.js JSON-LD guide) so a value can never close the tag early.
 */
export function jsonLdString(data: object): string {
  const withContext = Array.isArray(data) || "@context" in data ? data : { "@context": SCHEMA_CONTEXT, ...data }
  return JSON.stringify(withContext).replace(/</g, "\\u003c")
}

/** Renders one `<script type="application/ld+json">` from `data` via jsonLdString(). Server-safe. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(data) }} />
}
