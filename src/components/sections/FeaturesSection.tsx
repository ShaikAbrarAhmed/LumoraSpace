import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"
import { ProgressLine, ScrollSection } from "@/components/story/scroll-progress"

type Pillar = {
  title: string
  body: string
  link?: { label: string; href: string }
}

const pillars: Pillar[] = [
  {
    title: "Direction",
    body: "A week-by-week plan that ends in shipped projects, not a playlist of tutorials. Each week sets out what to learn and why it matters.",
  },
  {
    title: "Mentorship",
    body: "Practitioners from industry teach the programs and give direct feedback on the code and projects you build.",
    link: { label: "Meet the mentors", href: "/mentors" },
  },
  {
    title: "Community",
    body: "Learn alongside other students. Ask questions, share progress and find teammates for your next hackathon.",
    link: { label: "Explore the community", href: "/community" },
  },
  {
    title: "Accountability",
    body: "Programs run live, Monday to Friday, with a project at every stage and feedback from your mentor. A fixed rhythm keeps you moving when motivation dips.",
  },
  {
    title: "Opportunities",
    body: "Compete in hackathons and seasonal challenges on Lumora Arena, earn certificates anyone can verify, and apply for verified internships on Lumora Careers.",
  },
]

/** /features: the ideas behind LumoraSpace, with a sticky heading and a line that fills as you read through them. */
export default function FeaturesSection() {
  return (
    <ScrollSection id="model" offset={["start 0.6", "end 0.75"]} className="section-y border-t border-white/[0.06]">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              title="What makes it work"
              lead="Five ideas shape every program, event and opportunity we run."
            />
          </div>
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7">
          <ProgressLine className="absolute inset-y-0 left-0" />
          <ul className="space-y-12 pl-6 sm:pl-10 md:space-y-16">
            {pillars.map((pillar) => (
              <li key={pillar.title}>
                <Reveal y={16}>
                  <h3 className="text-2xl font-medium text-headings sm:text-[1.75rem]">{pillar.title}</h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-base">
                    {pillar.body}
                  </p>
                  {pillar.link && (
                    <Link
                      href={pillar.link.href}
                      className="group mt-2 inline-flex min-h-11 items-center gap-1.5 font-heading text-sm text-headings"
                    >
                      <span className="underline decoration-white/20 underline-offset-4 transition-colors group-hover:decoration-white/70">
                        {pillar.link.label}
                      </span>
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </ScrollSection>
  )
}
