import { ArrowUpRight } from "lucide-react"
import { ARENA } from "@/lib/site"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { ExternalLink } from "./ExternalLink"
import { RECORDS } from "./content"

export function RecordsSection() {
  return (
    <section id="results" className="section-y border-t border-white/[0.06]">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            title="Results you can check."
            lead={`Winners, standings and certificates are published on ${ARENA.name}.`}
          />
        </Reveal>

        <ul className="mt-12 border-t border-white/[0.08] sm:mt-16">
          {RECORDS.map((record, i) => (
            <li key={record.title} className="border-b border-white/[0.08]">
              <Reveal delay={i * 0.06}>
                <ExternalLink
                  href={record.href}
                  className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-7 sm:py-9 lg:grid-cols-[minmax(0,24rem)_1fr_auto]"
                >
                  <span className="font-fancy text-3xl font-light leading-tight text-headings sm:text-4xl">
                    {record.title}
                  </span>
                  <span className="col-start-1 row-start-2 text-[15px] text-muted-foreground sm:text-base lg:col-start-2 lg:row-start-1">
                    {record.body}
                  </span>
                  <span className="col-start-2 row-span-2 row-start-1 flex items-center gap-3 text-muted-foreground transition-colors duration-300 group-hover:text-headings lg:col-start-3 lg:row-span-1">
                    <span className="hidden font-heading text-xs sm:inline">
                      {ARENA.host}
                      {record.path}
                    </span>
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.12] transition-colors duration-300 group-hover:border-white/40">
                      <ArrowUpRight
                        aria-hidden
                        className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </span>
                  </span>
                </ExternalLink>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
