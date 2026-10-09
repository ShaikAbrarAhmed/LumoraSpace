import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { ARENA } from "@/lib/site"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"

const SEASONS = ["Winter", "Spring", "Summer", "Monsoon", "Autumn"]

const FORMATS = [
  {
    title: "Team hackathons",
    body: "The team leader buys tickets for everyone. Each member gets a personal, single-use QR ticket by email and is scanned in at the door.",
  },
  {
    title: "Global challenges",
    body: "Solo challenges in five seasons a year, three per season, with a certificate for your work.",
  },
]

export function ArenaSection() {
  return (
    <section
      id="hackathons"
      aria-labelledby="hackathons-title"
      className="section-y border-t border-white/[0.06] bg-[#050505]"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            title={<span id="hackathons-title">Compete with a team, or on your own.</span>}
            lead={`Ticketed team hackathons and seasonal global challenges, run on ${ARENA.name}.`}
          />
        </Reveal>

        <Reveal className="mt-12 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0B0C] sm:mt-16">
          <div className="grid md:grid-cols-2">
            {FORMATS.map((format, i) => (
              <div
                key={format.title}
                className={`p-6 sm:p-10 ${i > 0 ? "border-t border-white/[0.08] md:border-l md:border-t-0" : ""}`}
              >
                <h3 className="font-fancy text-[2rem] font-light leading-[1.1] tracking-normal text-headings sm:text-4xl">
                  {format.title}
                </h3>
                <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                  {format.body}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/[0.08] bg-[#08080A] px-6 py-6 sm:px-10 xl:grid xl:grid-cols-[11rem_1fr] xl:items-center xl:gap-8 xl:py-0">
            <p className="text-sm text-muted-foreground xl:py-8">Challenge seasons</p>
            <ol
              aria-label="Global challenge seasons"
              className="mt-3 flex flex-wrap gap-x-6 gap-y-1 sm:flex-nowrap sm:justify-between sm:gap-x-4 xl:mt-0 xl:grid xl:grid-cols-5 xl:gap-0 xl:divide-x xl:divide-white/[0.08]"
            >
              {SEASONS.map((season, i) => (
                <li key={season} className="xl:py-8 xl:text-center">
                  <Reveal y={12} delay={i * 0.07}>
                    <span className="font-fancy text-2xl font-light text-headings md:text-3xl">{season}</span>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        <Reveal className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link href="/hackathons" className="btn-secondary">
            Explore hackathons
          </Link>
          <a
            href={ARENA.home}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center gap-1.5 font-heading text-sm font-medium text-headings/80 transition-colors duration-300 hover:text-headings"
          >
            Visit Arena
            <ArrowUpRight aria-hidden="true" className="size-4" />
            <span className="sr-only"> ({ARENA.host}, opens in a new tab)</span>
          </a>
        </Reveal>
      </div>
    </section>
  )
}
