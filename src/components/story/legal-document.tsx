import type { ReactNode } from "react"
import { HEADING_SIZE } from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"

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
  "text-headings underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"

/** Class for bulleted lists inside legal copy. */
export const legalListClass = "list-disc space-y-2 pl-5 marker:text-white/40"

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  )
}

/**
 * Long-form legal page body: title, revision date, sticky contents on desktop, numbered sections.
 * The h1 uses the smaller `section` display size on purpose: a legal title is a label for the
 * text below it, not a headline.
 */
export function LegalDocument({ title, updated, sections }: LegalDocumentProps) {
  return (
    <div className="container-page pb-24 md:pb-32">
      <header className="page-header">
        <div className="max-w-3xl border-b border-white/[0.08] pb-10">
          <p className="eyebrow mb-5">Legal</p>
          <h1 className={cn(HEADING_SIZE.section, "leading-[1.05] tracking-tight text-headings")}>{title}</h1>
          <p className="mt-6 text-sm text-muted-foreground">
            Last updated <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
        </div>
      </header>

      <div className="grid gap-12 lg:grid-cols-12">
        <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
          <div className="sticky top-32">
            <p className="mb-3 font-heading text-sm text-headings">On this page</p>
            <ol className="space-y-0.5">
              {sections.map((section, i) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="flex gap-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-headings"
                  >
                    <span className="w-5 shrink-0 font-heading tabular-nums">{i + 1}.</span>
                    {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="max-w-[68ch] space-y-12 md:space-y-14 lg:col-span-8 lg:col-start-5">
          {sections.map((section, i) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="scroll-mt-28">
              <h2
                id={`${section.id}-title`}
                className="flex items-baseline gap-3 text-2xl leading-tight text-headings sm:text-3xl"
              >
                <span className="font-heading text-sm tabular-nums text-muted-foreground">{i + 1}.</span>
                {section.title}
              </h2>
              <div className="mt-4 space-y-4 text-[15px] leading-7 text-muted-foreground sm:text-base [&_strong]:font-medium [&_strong]:text-headings">
                {section.content}
              </div>
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
