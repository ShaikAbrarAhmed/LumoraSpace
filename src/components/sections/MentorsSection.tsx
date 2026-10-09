import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { mentors, mentorCompanies } from "@/data/people"
import { CAREERS, CONTACT } from "@/lib/site"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { MentorsScroller } from "@/components/people/MentorsScroller"

const MENTOR_MAILTO = `mailto:${CONTACT.hello}?subject=${encodeURIComponent("Interested in Mentoring at LumoraSpace")}`

type Step = {
  title: string
  body: string
  link?: { label: string; href: string; external?: boolean }
}

// Only what the programs and the careers portal actually offer today.
const steps: Step[] = [
  {
    title: "Live, mentor-led programs",
    body: "Programs run live online, and mentors give direct feedback on the projects you build.",
    link: { label: "Explore programs", href: "/cohorts" },
  },
  {
    title: "Interview practice",
    body: "Career preparation in each program includes mock interviews with industry mentors.",
  },
  {
    title: "Mentored internships",
    body: `Internships on ${CAREERS.name} come with weekly mentor sessions, pull-request reviews and written feedback when you finish.`,
    link: { label: CAREERS.host, href: CAREERS.home, external: true },
  },
]

const linkClass =
  "group mt-3 inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-medium text-headings/85 transition-colors hover:text-headings"

export default function MentorsSection() {
  return (
    <>
      {/* Mentors first: the heading and the row of profiles share the opening screen */}
      <MentorsScroller
        mentors={mentors}
        lead={`Practitioners from ${mentorCompanies}, working across product, software, marketing and data science.`}
      />

      {/* How mentorship works: heading beside a short list */}
      <section className="section-y border-t border-white/[0.06] bg-[#08080A]">
        <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading
              title="How mentorship works"
              lead="You meet mentors inside the programs and internships you join."
            />
          </div>

          <ol className="border-t border-white/[0.08] lg:col-span-6">
            {steps.map((step, i) => (
              <li key={step.title} className="border-b border-white/[0.08]">
                <Reveal delay={i * 0.06} className="py-8 sm:py-10">
                  <h3 className="font-heading text-xl font-medium tracking-tight text-headings">{step.title}</h3>
                  <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                    {step.body}
                  </p>
                  {step.link &&
                    (step.link.external ? (
                      <a href={step.link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {step.link.label}
                        <ArrowUpRight
                          aria-hidden
                          className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link href={step.link.href} className={linkClass}>
                        {step.link.label}
                        <ArrowRight
                          aria-hidden
                          className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                      </Link>
                    ))}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Become a mentor */}
      <section id="mentor-with-us" className="section-y scroll-mt-16 border-t border-white/[0.06]">
        <Reveal className="container-page">
          <SectionHeading
            title="Mentor with LumoraSpace"
            lead={
              <>
                Work in tech and want to guide students? Email{" "}
                <span className="text-headings">{CONTACT.hello}</span> with your experience and the areas you can
                help with.
              </>
            }
          />
          <a href={MENTOR_MAILTO} className="btn-primary mt-10 min-h-12 whitespace-nowrap">
            Become a mentor
          </a>
        </Reveal>
      </section>
    </>
  )
}
