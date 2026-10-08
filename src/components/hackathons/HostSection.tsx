import { ArrowUpRight } from "lucide-react"
import { ARENA, CONTACT } from "@/lib/site"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { ExternalLink } from "./ExternalLink"
import { HOST_GROUPS } from "./content"

export function HostSection() {
  return (
    <section id="host" className="section-y relative isolate overflow-hidden border-t border-white/[0.06] bg-[#08080A]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_0%_0%,rgba(255,255,255,0.05),transparent_70%)]"
      />
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="For colleges, clubs and companies"
            title="Host your hackathon on Arena."
            lead="Run your own event on Lumora Arena, with registration, tickets, check-in and payments in one place."
          />
          <div className="mt-10 flex flex-col gap-x-8 gap-y-4 sm:flex-row sm:items-center">
            <ExternalLink href={ARENA.rent} className="btn-primary w-full gap-2 whitespace-nowrap sm:w-auto">
              Host on Arena
              <ArrowUpRight aria-hidden className="h-4 w-4" />
            </ExternalLink>
            <a
              href={`mailto:${CONTACT.hello}`}
              className="inline-flex min-h-11 items-center justify-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-headings sm:justify-start"
            >
              Or email
              <span className="wrap-anywhere text-headings underline decoration-white/30 underline-offset-4">
                {CONTACT.hello}
              </span>
            </a>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-10 sm:mt-20 md:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr_1.1fr] lg:gap-12">
          {HOST_GROUPS.map((group, i) => (
            <Reveal key={group.title} delay={i * 0.08} className="border-t border-white/[0.14] pt-6">
              <h3 className="font-heading text-base font-medium text-headings">{group.title}</h3>
              <ul className="mt-5 space-y-3">
                {group.items.map((item) => (
                  <li key={item} className="text-[15px] leading-snug text-muted-foreground sm:text-base">
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
