import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { ARENA, CAREERS } from "@/lib/site"

const items = [
  {
    title: "Internships",
    body: "Verified roles with no ghost listings. Each one states start date, weekly hours, compensation and mentorship up front.",
  },
  { title: "Real projects", body: "Work on production codebases, with senior engineers reviewing your code." },
  { title: "Mentorship", body: "1:1 sessions, pull-request reviews and written feedback when you finish." },
  { title: "Competitions", body: `Team hackathons and seasonal solo challenges on ${ARENA.name}.` },
]

export function OpportunitiesPreviewSection() {
  return (
    <section
      id="opportunities"
      aria-labelledby="opportunities-title"
      className="section-y border-t border-white/[0.06] bg-[#08080A]"
    >
      <div className="container-page grid gap-12 xl:grid-cols-12 xl:gap-x-16 xl:gap-y-10">
        <Reveal className="xl:col-span-5 xl:row-start-1">
          <SectionHeading
            title={<span id="opportunities-title">Verified internships with senior code review.</span>}
            lead={`Internships, real projects and mentorship on ${CAREERS.name}, and competitions on ${ARENA.name}.`}
          />
        </Reveal>

        <ul className="grid gap-x-10 gap-y-10 sm:grid-cols-2 sm:gap-y-12 xl:col-span-7 xl:col-start-6 xl:row-span-2 xl:row-start-1 xl:pt-2">
          {items.map((item, i) => (
            <li key={item.title} className="border-t border-white/[0.08] pt-6">
              <Reveal y={16} delay={(i % 2) * 0.06}>
                <h3 className="font-heading text-xl font-medium text-headings">{item.title}</h3>
                <p className="mt-3 text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  {item.body}
                </p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="xl:col-span-5 xl:row-start-2">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
            <Link href="/opportunities" className="btn-secondary">
              Explore opportunities
            </Link>
            <a
              href={CAREERS.home}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center gap-1.5 font-heading text-sm font-medium text-headings/80 transition-colors duration-300 hover:text-headings"
            >
              Visit Careers
              <ArrowUpRight aria-hidden="true" className="size-4" />
              <span className="sr-only"> ({CAREERS.host}, opens in a new tab)</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
