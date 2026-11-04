import Image from "next/image"
import type { ReactNode } from "react"
import { ButtonLink, Dots, Placeholder, StatList, Steps, TextLink, Wave } from "@/components/site/ui"
import { CollegeInline } from "@/components/site/people"
import { HOME_PEOPLE, LUMINIX_STATS } from "@/data/company"
import { REGISTRATION } from "@/lib/site"
import { cn } from "@/lib/utils"

/** V4 home page sections, top to bottom. */

export function HomeHero() {
  return (
    <section className="relative min-h-[820px] overflow-hidden">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-[58%] overflow-hidden">
        <Wave animate priority className="object-[center_top]" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#0A0A0A_0%,#0A0A0A_46%,rgba(10,10,10,0)_80%)]"
      />
      <div className="ls-container relative pt-[clamp(72px,9vw,120px)]">
        <p className="m-0 mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-ls-amber">Education and technology</p>
        <h1 className="m-0 max-w-[17ch] text-[clamp(44px,6vw,80px)] font-semibold leading-none tracking-[-0.045em] text-ls-fg">
          Tech training for students. Software for businesses.
        </h1>
        <div className="mt-8 flex flex-wrap items-end justify-between gap-x-12 gap-y-7">
          <p className="m-0 max-w-[52ch] text-[19px] leading-relaxed text-ls-lead">
            Students learn from working engineers and build on real projects. Businesses hire that same team to build their
            web, AI and cloud software.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/cohorts">Explore programs</ButtonLink>
            <ButtonLink href="/services" variant="outline">
              Start a project
            </ButtonLink>
          </div>
        </div>
        <p className="m-0 mt-5 text-[15px] text-ls-faint">Next cohort: registration opens {REGISTRATION.opens}.</p>
      </div>
    </section>
  )
}

type Half = {
  label: string
  title: string
  description: string
  items: { title: string; detail: string }[]
  note: string
  cta: string
  href: string
  extra?: ReactNode
}

const HALVES: Half[] = [
  {
    label: "Education",
    title: "For students and colleges",
    description: "Learn a job-ready skill from engineers who work in industry, project by project.",
    items: [
      { title: "MERN Stack with GenAI", detail: "Mentor: Gokul · in English" },
      { title: "Data Analytics", detail: "Mentor: Sandeep · in Telugu" },
      { title: "Duration", detail: "15 weeks · 1.5 hrs on weekdays" },
      { title: "Fee", detail: "₹4,999 + GST" },
      { title: "Registration", detail: `Opens ${REGISTRATION.opens}` },
    ],
    note: "Also: hackathons, paid internships on client projects, and partnerships for colleges.",
    cta: "Explore programs",
    href: "/cohorts",
    extra: <CollegeInline />,
  },
  {
    label: "Technology",
    title: "For businesses and hiring teams",
    description: "Software built by engineers who also train the next generation.",
    items: [
      { title: "Product development", detail: "Web and mobile apps" },
      { title: "AI and data", detail: "Features, pipelines, dashboards" },
      { title: "Cloud and IT", detail: "Infrastructure and support" },
      { title: "Hiring support", detail: "Reviewed candidates, sourcing" },
    ],
    note: "Every project starts with a conversation and a written scope.",
    cta: "Start a project",
    href: "/services",
  },
]

export function HomeHalves() {
  return (
    <section
      aria-label="What we offer"
      className="border-t border-white/10 bg-[radial-gradient(ellipse_38%_55%_at_50%_0%,rgba(242,181,68,0.07),rgba(242,181,68,0)_100%),#0A0A0A]"
    >
      <div className="ls-container flex flex-wrap">
        {HALVES.map((half, i) => (
          <div
            key={half.label}
            className={cn(
              "flex min-w-0 flex-[1_1_440px] flex-col gap-[18px] py-[clamp(56px,7vw,96px)]",
              // Side by side, the second half is ruled off on the left; stacked, on top.
              i === 0 ? "min-[960px]:pr-[clamp(0px,3vw,48px)]" : "border-t border-white/10 min-[960px]:border-l min-[960px]:border-t-0 min-[960px]:pl-[clamp(20px,3vw,48px)]",
            )}
          >
            <span className="text-sm font-semibold uppercase tracking-[0.08em] text-ls-amber">{half.label}</span>
            <h2 className="m-0 text-[clamp(32px,3.6vw,44px)] font-semibold leading-[1.08] tracking-[-0.03em] text-ls-fg">
              {half.title}
            </h2>
            <p className="m-0 max-w-[44ch]">{half.description}</p>
            <ul className="m-0 mt-1.5 list-none border-t border-white/10 p-0">
              {half.items.map((item) => (
                <li key={item.title} className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-b border-white/10 py-3.5">
                  <span className="font-medium text-ls-fg">{item.title}</span>
                  <span className="text-[15px]">{item.detail}</span>
                </li>
              ))}
            </ul>
            <p className="m-0 text-base text-ls-body">{half.note}</p>
            {half.extra}
            <div className="mt-2 flex flex-wrap gap-3">
              <ButtonLink href={half.href} variant="light" size="md">
                {half.cta}
              </ButtonLink>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const LOOP = [
  { title: "Businesses bring projects", body: "Companies come to us for software, AI and cloud work." },
  { title: "Students build them", body: "Selected students work on those projects, guided and reviewed by mentors." },
  { title: "Businesses get results", body: "Working software, plus people they’ve already seen at work." },
  { title: "Students get experience", body: "Real portfolios, paid internships and the confidence of shipped work." },
]

export function HomeLoop() {
  return (
    <section aria-label="How it works" className="relative border-t border-white/10 bg-ls-ink-2">
      <Dots />
      <div className="ls-container ls-section-y relative flex flex-col gap-12">
        <div className="flex flex-wrap items-end gap-x-12 gap-y-4">
          <h2 className="m-0 max-w-[18ch] flex-[1_1_320px] text-[clamp(30px,3.4vw,40px)] font-semibold leading-[1.12] tracking-[-0.025em] text-ls-fg">
            Why we do both. Each side makes the other better.
          </h2>
          <p className="m-0 max-w-[52ch] flex-[1.4_1_420px]">
            Most training stops at exercises. Most agencies hire people they never trained. We connect the two, so learning
            happens on work that matters and the work is done by people we know.
          </p>
        </div>
        <Steps steps={LOOP} large />
        <p className="m-0 text-[17px] text-ls-soft">Then it repeats: better engineers take on bigger projects.</p>
      </div>
    </section>
  )
}

export function HomeNumbers() {
  return (
    <section aria-label="LUMINIX’26 in numbers" className="relative overflow-hidden border-t border-white/10 bg-ls-ink-2">
      <LuminixWave />
      <div className="ls-container relative flex flex-col gap-8 pb-[190px] pt-[clamp(64px,7vw,96px)]">
        <p className="m-0 text-sm font-semibold uppercase tracking-[0.08em] text-ls-amber">LUMINIX’26, our first hackathon</p>
        <StatList stats={LUMINIX_STATS} />
      </div>
    </section>
  )
}

/** The feathered wave strip along the bottom of the LUMINIX sections. */
export function LuminixWave() {
  return (
    <div aria-hidden className="ls-fade absolute inset-x-0 bottom-0 h-[150px]">
      <Image src="/design/luminix-wave.jpg" alt="" fill sizes="100vw" className="object-cover object-top" />
    </div>
  )
}

/** Heading on the left, content on the right: the layout of the proof and people sections. */
function SideHeadingSection({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section aria-label={label} className="border-t border-white/10">
      <div className="ls-container ls-section-y flex flex-wrap gap-x-12 gap-y-8">
        <h2 className="m-0 flex-[1_1_260px] text-[32px] font-semibold leading-[1.15] tracking-[-0.02em] text-ls-fg">{title}</h2>
        <div className="min-w-0 flex-[2.4_1_600px]">{children}</div>
      </div>
    </section>
  )
}

export function HomeProof() {
  return (
    <SideHeadingSection label="Proof" title="What we’ve done so far">
      <div className="flex flex-wrap gap-x-12 gap-y-10">
        <div className="flex flex-[1_1_280px] flex-col gap-3.5">
          <h3 className="m-0 text-lg font-semibold text-ls-fg">LUMINIX’26 hackathon</h3>
          <p className="m-0">630 participants in 210 teams. Mentors judged working builds over two rounds and a final, not slides.</p>
          <TextLink href="/work#luminix">Read the case study</TextLink>
        </div>
        <div className="flex flex-[1_1_280px] flex-col gap-3.5">
          <h3 className="m-0 text-lg font-semibold text-ls-fg">[Client project]</h3>
          <Placeholder label="Screenshot placeholder: client project" caption="Screenshot of the delivered product" />
          <p className="m-0 text-base">[What the client needed, what we built, and who from our cohort worked on it.]</p>
        </div>
      </div>
    </SideHeadingSection>
  )
}

export function HomePeople() {
  return (
    <SideHeadingSection label="People" title="The people who teach are the people who ship">
      <div className="flex flex-col gap-5">
        <p className="m-0 max-w-[58ch]">
          Our mentors work in industry. The same team that reviews student projects leads client delivery, so students learn
          real standards and businesses get engineers who know how to teach.
        </p>
        <ul className="m-0 list-none border-t border-white/10 p-0">
          {HOME_PEOPLE.map((person) => (
            <li key={person.name} className="flex flex-wrap gap-x-5 gap-y-1 border-b border-white/10 py-3">
              <span className="flex-[1_1_200px] font-medium text-ls-fg">{person.name}</span>
              <span className="flex-[1.6_1_260px] text-base">{person.role}</span>
            </li>
          ))}
        </ul>
        <TextLink href="/our-story#team">Meet the full team</TextLink>
      </div>
    </SideHeadingSection>
  )
}
