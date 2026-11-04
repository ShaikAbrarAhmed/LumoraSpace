/** Form styling shared by every form in the redesign: contact, sign-in, create account and applications. */

export const formLabel = "text-[15px] text-ls-soft"

export const formField =
  "block min-h-12 w-full rounded-[6px] border border-white/[0.18] bg-ls-field px-3 text-base text-ls-fg placeholder:text-ls-faint transition-colors hover:border-white/30 focus-visible:border-white/60 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ls-fg aria-[invalid=true]:border-red-400/70"

/** Native selects: room on the right for the chevron the form draws itself. */
export const formSelect = `${formField} appearance-none pr-11 [&_option]:bg-ls-field [&_option]:text-ls-fg`

export const formHint = "text-sm text-ls-faint"

export const formError = "m-0 text-sm text-red-300"

export const formAlert =
  "m-0 rounded-[6px] border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-sm leading-relaxed text-red-200"

/** The amber rule over a form, as on the contact page. */
export const formFrame = "border-t-2 border-ls-amber pt-6"
