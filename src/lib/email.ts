const HTML_ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }

/** Escapes a user-supplied value before it goes into the HTML body of a notification email. */
export const escapeHtml = (value: unknown): string =>
  String(value ?? "").replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char)

/** Team inboxes for notification emails: ADMIN_EMAIL is a comma-separated list, support@ by default. */
export const adminRecipients = (): string[] => {
  const list = (process.env.ADMIN_EMAIL ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)
  return list.length ? list : ["support@lumoraspace.in"]
}

/** Email subjects are plain text: strip line breaks and angle brackets, cap the length at 120. */
export const plainText = (value: unknown): string =>
  String(value ?? "").replace(/[\r\n<>]+/g, " ").trim().slice(0, 120)
