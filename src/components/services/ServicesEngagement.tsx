import { ArrowUpRight } from "lucide-react"
import { ARENA } from "@/lib/site"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"

type Engagement = {
  title: string
  text: string
  link?: { href: string; label: string }
}

const engagements: Engagement[] = [
  {
    title: "Fixed-scope project",
    text: "A defined project with an agreed scope and timeline.",
  },
  {
    title: "Dedicated team",
    text: "Engineers and designers who join your team and work to your process (IT staff augmentation).",
  },
  {
    title: "Ongoing maintenance",
    text: "Updates, fixes and improvements for a product that is already live.",
  },
  {
    title: "Hackathon platform",
    text: "Colleges, clubs and companies can rent Lumora Arena to run their own events: ticket sales and team registration, QR check-in, live attendance and payments straight to your own UPI.",
    link: { href: ARENA.rent, label: ARENA.host },
  },
]

export function ServicesEngagement() {
  return (
    <section className="section-y border-t border-white/[0.06] bg-background">
      <div className="container-page">
        <SectionHeading
          title="Ways to work with us"
          lead="Not sure which fits? Tell us about the project and we will suggest one."
        />

        <dl className="mt-14 sm:mt-20">
          {engagements.map((e) => (
            <Reveal
              key={e.title}
              y={16}
              className="grid gap-3 border-t border-white/[0.08] py-8 sm:py-10 lg:grid-cols-12 lg:gap-16"
            >
              <dt className="font-fancy text-3xl font-light leading-tight text-headings sm:text-4xl lg:col-span-5">
                {e.title}
              </dt>
              <dd className="lg:col-span-7 lg:pt-2">
                <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-base">
                  {e.text}
                </p>
                {e.link && (
                  <a
                    href={e.link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-3 inline-flex min-h-11 items-center gap-2 font-heading text-sm text-headings"
                  >
                    <span className="underline decoration-white/30 underline-offset-4 transition-colors group-hover:decoration-white">
                      {e.link.label}
                    </span>
                    <ArrowUpRight
                      aria-hidden
                      className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  )
}
