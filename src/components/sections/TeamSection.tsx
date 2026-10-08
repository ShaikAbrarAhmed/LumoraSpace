import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { coreTeam, founders } from "@/data/people"
import { ARENA, CAREERS, EDU } from "@/lib/site"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { PersonRow } from "@/components/people/PersonRow"
import { PersonCompact } from "@/components/people/PersonCompact"

export default function TeamSection() {
  return (
    <>
      {/* Hero */}
      <section className="page-header">
        <div className="container-page">
          <SectionHeading
            as="h1"
            title="The people behind LumoraSpace"
            lead={`Built by students. Meet the founders and core team building ${EDU.name}, ${ARENA.name} and ${CAREERS.name}.`}
          />
        </div>
      </section>

      {/* Founders: large editorial rows */}
      <section aria-labelledby="founders" className="section-y border-t border-white/[0.06]">
        <div className="container-page">
          <SectionHeading title={<span id="founders">Founders</span>} />
          <ol className="mt-12 sm:mt-16">
            {founders.map((person, i) => (
              <li
                key={person.slug}
                className="border-t border-white/[0.06] py-12 first:border-t-0 first:pt-0 last:pb-0 sm:py-16"
              >
                <PersonRow person={person} as="h3" variant="statement" eager={i === 0} />
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Core team: compact roster */}
      <section aria-labelledby="core-team" className="section-y border-t border-white/[0.06] bg-[#08080A]">
        <div className="container-page">
          <SectionHeading title={<span id="core-team">Core team</span>} />
          <ul className="mt-12 border-t border-white/[0.08] sm:mt-16">
            {coreTeam.map((person, i) => (
              <li key={person.slug} className="border-b border-white/[0.08] py-8 sm:py-10">
                <Reveal delay={i * 0.06}>
                  <PersonCompact person={person} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Work with us */}
      <section className="section-y border-t border-white/[0.06]">
        <Reveal className="container-page">
          <SectionHeading
            title="Work with us"
            lead={`Roles on the remote team are posted on ${CAREERS.name}. If you work in tech and want to guide students, you can also apply to mentor.`}
          />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <a
              href={CAREERS.home}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary group min-h-12 gap-2 whitespace-nowrap"
            >
              Visit Careers
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            <Link href="/mentors#mentor-with-us" className="btn-secondary min-h-12 whitespace-nowrap">
              Become a mentor
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
