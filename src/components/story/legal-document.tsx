import type { ReactNode } from "react"
import { PageHero } from "@/components/site/ui"

export type LegalSection = {
  id: string
  title: string
  content: ReactNode
}

type LegalDocumentProps = {
  title: string
  /** ISO date (YYYY-MM-DD) of the last change to the legal text. */
  updated: string
  sections: LegalSection[]
}

/** Class for links inside legal copy. */
export const legalLinkClass =
  "text-ls-fg underline decoration-white/40 underline-offset-4 transition-colors hover:text-white hover:decoration-white"

/** Class for bulleted lists inside legal copy. */
export const legalListClass = "list-disc space-y-2 pl-5 marker:text-ls-amber"

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  )
}

/**
 * Long-form legal page in the redesign: the standard inner-page hero, then numbered sections
 * beside a sticky contents list (the V6 left-column/right-column split).
 */
export function LegalDocument({ title, updated, sections }: LegalDocumentProps) {
  return (
    <>
      <PageHero
        crumbs={[{ label: "Home", href: "/" }, { label: title }]}
        eyebrow="Legal"
        title={title}
        lead={
          <>
            Last updated <time dateTime={updated}>{formatDate(updated)}</time>.
          </>
        }
      />

      <div className="ls-container ls-section-y flex flex-wrap gap-x-12 gap-y-10">
        <nav aria-label="On this page" className="hidden flex-[1_1_260px] lg:block">
          <div className="sticky top-28">
            <p className="m-0 mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-ls-amber">On this page</p>
            <ol className="m-0 list-none border-t border-white/10 p-0">
              {sections.map((section, i) => (
                <li key={section.id} className="border-b border-white/10">
                  <a
                    href={`#${section.id}`}
                    className="flex min-h-11 items-center gap-3 py-2 text-[15px] text-ls-body no-underline transition-colors hover:text-ls-fg"
                  >
                    <span className="w-5 shrink-0 tabular-nums text-ls-faint">{i + 1}.</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="flex min-w-0 max-w-[68ch] flex-[2.4_1_600px] flex-col">
          {sections.map((section, i) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="scroll-mt-24 border-t border-white/10 py-10 first:border-t-0 first:pt-0"
            >
              <h2
                id={`${section.id}-title`}
                className="m-0 flex items-baseline gap-3 text-[clamp(24px,2.4vw,30px)] font-semibold leading-tight tracking-[-0.02em] text-ls-fg"
              >
                <span className="text-sm tabular-nums text-ls-amber">{i + 1}.</span>
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-7 [&_strong]:font-medium [&_strong]:text-ls-fg">
                {section.content}
              </div>
            </section>
          ))}
        </article>
      </div>
    </>
  )
}
