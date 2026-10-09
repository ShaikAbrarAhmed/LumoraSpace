import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { FORMATS } from "./content"

export function FormatsSection() {
  return (
    <section id="formats" className="section-y border-t border-white/[0.06] bg-[#08080A]">
      <div className="container-page">
        <Reveal>
          <SectionHeading title="Bring a team, or go solo." />
        </Reveal>

        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:mt-16 lg:grid-cols-2">
          {FORMATS.map((format, i) => (
            <Reveal key={format.id} delay={i * 0.08} className="flex flex-col bg-[#0B0B0C] p-6 sm:p-10">
              <h3 className="font-fancy text-4xl font-light tracking-normal text-headings sm:text-5xl">{format.title}</h3>
              <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground sm:text-base">{format.summary}</p>

              <dl className="mt-8 divide-y divide-white/[0.06] border-t border-white/[0.08]">
                {format.facts.map((fact) => (
                  <div key={fact.label} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-6">
                    <dt className="font-heading text-sm text-muted-foreground">{fact.label}</dt>
                    <dd className="text-[15px] leading-relaxed text-headings/90 sm:text-base">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
