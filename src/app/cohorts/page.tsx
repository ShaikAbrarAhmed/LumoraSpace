import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Reveal } from "@/components/ui/reveal"
import { HEADING_SIZE, SectionHeading } from "@/components/ui/section-heading"
import { ProgramRow } from "@/components/programs/ProgramCard"
import { ScrollRail } from "@/components/programs/scroll"
import { courseJsonLd, programUrl } from "@/components/programs/course-jsonld"
import { plannedPrograms, programList } from "@/data/programs"
import { JsonLd } from "@/lib/jsonld"
import { pageMetadata } from "@/lib/metadata"
import { CONTACT, EDU } from "@/lib/site"
import { cn } from "@/lib/utils"

const list = new Intl.ListFormat("en", { style: "long", type: "conjunction" })

export const metadata = pageMetadata({
  title: "Programs",
  description: `Live, mentor-led programs at LumoraSpace: ${list.format(
    programList.map((p) => p.title),
  )}. Real projects, direct mentor feedback and career preparation.`,
  path: "/cohorts",
})

const METHOD = [
  {
    title: "Learn",
    body: "Live weekday sessions with your mentor, taught through real code and real examples.",
  },
  {
    title: "Practice",
    body: "Each week ends with practical work on that week's topics, so nothing stays theory for long.",
  },
  {
    title: "Build",
    body: "Portfolio projects that grow in scope each week and end in a capstone you present.",
  },
  {
    title: "Review",
    body: "Direct feedback from your mentor on the projects you build, so you know what to fix and why.",
  },
  {
    title: "Grow",
    body: "Resume, GitHub, LinkedIn and mock interview preparation, then a certificate of completion once your capstone is done.",
  },
]

const JOIN_STEPS = [
  {
    title: "Apply",
    body: "Open a program page and send the short application form. No payment is needed at this step.",
  },
  {
    title: "Talk to the coordinator",
    body: "A program coordinator contacts you, answers your questions and confirms your payment plan.",
  },
  {
    title: "Start learning",
    body: "Pay in full or in two instalments, then join the live sessions with your mentor and cohort.",
  },
]

const linkClass =
  "group inline-flex min-h-11 items-center gap-2 font-heading text-sm font-medium text-headings underline-offset-4 hover:underline"

export default function CohortsPage() {
  const allOpen = programList.every((program) => program.status === "Enrollment open")
  const jsonLd = {
    "@type": "ItemList",
    name: "LumoraSpace programs",
    itemListElement: programList.map((program, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: programUrl(program),
      item: courseJsonLd(program),
    })),
  }

  return (
    <>
      <JsonLd data={jsonLd} />
      <Navbar />
      <main id="main" className="bg-background">
        {/* Hero: eyebrow, headline, one line, one CTA */}
        <section className="border-b border-white/[0.06]">
          <div className="container-page page-header motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
            <p className="eyebrow">Programs</p>
            {/* 2.4rem below sm keeps "Become something more." on one line at 360 to 390px. */}
            <h1
              className={cn(
                HEADING_SIZE.page,
                "text-[2.4rem] mt-6 max-w-5xl pb-1 font-fancy font-light leading-[1.1] tracking-tight text-headings text-balance",
              )}
            >
              Learn something. Build something.{" "}
              <span className="italic text-white/60">Become something more.</span>
            </h1>
            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-lg">
              Live, mentor-led programs where you build real projects, get feedback on your work and finish with a
              portfolio.
            </p>
            <a href="#programs" className="btn-primary mt-10 min-h-12">
              Explore programs
            </a>
          </div>
        </section>

        {/* Programs, straight from programs.ts */}
        <section id="programs" aria-labelledby="programs-title" className="section-y scroll-mt-16">
          <div className="container-page">
            <SectionHeading
              title={<span id="programs-title">{allOpen ? "Open for enrollment" : "Our programs"}</span>}
              lead="Each program runs live on weekdays, with a mentor who reviews your work and a capstone project at the end."
            />

            <div className="mt-14 space-y-20 sm:mt-20 md:space-y-28">
              {programList.map((program) => (
                <Reveal key={program.slug}>
                  <ProgramRow program={program} />
                </Reveal>
              ))}
            </div>

            <div className="mt-20 grid gap-4 border-t border-white/[0.08] pt-8 md:mt-28 md:grid-cols-2 md:items-center">
              <p className="text-[15px] text-muted-foreground sm:text-base">
                <span className="font-heading text-headings">Coming soon:</span> {list.format(plannedPrograms)}.
              </p>
              <a
                href={EDU.courses}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 font-heading text-sm font-medium text-headings md:justify-self-end"
              >
                More programs on {EDU.name}
                <span className="inline-flex items-center gap-1 text-muted-foreground transition-colors group-hover:text-headings">
                  {EDU.host}
                  <ArrowUpRight aria-hidden className="size-4" />
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </section>

        {/* Method: sticky heading, steps fill a progress line as you read */}
        <section className="section-y border-t border-white/[0.06] bg-[#08080A]">
          <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-32">
                <SectionHeading
                  title="A structured way from confused to confident."
                  lead="Every program is built on the same five steps."
                />
                <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2">
                  <Link href="/mentors" className={linkClass}>
                    Meet the mentors
                    <ArrowRight aria-hidden className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
                  </Link>
                  <Link href="/community" className={linkClass}>
                    Explore the community
                    <ArrowRight aria-hidden className="size-4 transition-transform motion-safe:group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </div>

            <ScrollRail className="lg:col-span-7">
              <ol className="space-y-12 sm:space-y-16">
                {METHOD.map((step) => (
                  <li key={step.title} className="pl-8 sm:pl-12">
                    <h3 className="font-fancy text-3xl font-light text-headings sm:text-4xl">{step.title}</h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                      {step.body}
                    </p>
                  </li>
                ))}
              </ol>
            </ScrollRail>
          </div>
        </section>

        {/* How to join: stacked heading, then term / detail rows */}
        <section className="section-y border-t border-white/[0.06]">
          <div className="container-page">
            <SectionHeading
              title="How to join"
              lead="Applying takes a few minutes. A program coordinator takes it from there."
            />
            <ol className="mt-12 max-w-4xl sm:mt-16">
              {JOIN_STEPS.map((step, i) => (
                <li key={step.title} className="border-t border-white/[0.08] first:border-white/[0.16]">
                  <Reveal delay={i * 0.06} y={12} className="grid gap-2 py-7 sm:grid-cols-[16rem_1fr] sm:gap-10 sm:py-9">
                    <h3 className="font-heading text-lg font-medium text-headings sm:text-xl">{step.title}</h3>
                    <p className="max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">{step.body}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
            <p className="mt-10 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Questions before you apply? Write to{" "}
              <a
                href={`mailto:${CONTACT.support}`}
                className="wrap-anywhere text-headings underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
              >
                {CONTACT.support}
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
