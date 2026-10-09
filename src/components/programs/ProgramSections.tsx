import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft, ArrowUpRight, Download, Plus } from "lucide-react"
import { splitLabel, type Program } from "@/data/programs"
import { CONTACT } from "@/lib/site"
import { cn } from "@/lib/utils"
import { Reveal } from "@/components/ui/reveal"
import { HEADING_SIZE, SectionHeading } from "@/components/ui/section-heading"
import { ApplyButton } from "./ApplyProvider"
import { Money } from "./money"
import { ScrollRail, ScrollScale } from "./scroll"

/*
 * Program detail page sections. Each section uses its own layout so the page never
 * repeats itself: stacked hero, media with a facts strip, sticky split, mentor profile,
 * four-column grid, timeline, centred type list, grouped columns, single-column FAQ,
 * pricing close. Server components; only ApplyButton and the scroll helpers are client.
 */

type Props = { program: Program }

function Section({
  id,
  tone = "base",
  className,
  labelledBy,
  children,
}: {
  id?: string
  tone?: "base" | "alt"
  className?: string
  labelledBy?: string
  children: ReactNode
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn(
        "section-y scroll-mt-16 border-t border-white/[0.06]",
        tone === "alt" ? "bg-[#08080A]" : "bg-background",
        className,
      )}
    >
      <div className="container-page">{children}</div>
    </section>
  )
}

function BrochureLink({ program, className }: Props & { className?: string }) {
  if (!program.brochureUrl) return null
  return (
    <a href={program.brochureUrl} download className={cn("btn-secondary min-h-12 gap-2", className)}>
      <Download aria-hidden className="size-4" />
      Download brochure
      <span className="font-normal text-muted-foreground">PDF</span>
    </a>
  )
}

/* 1. Hero: back link, title, one line, CTAs */
export function ProgramHero({ program }: Props) {
  return (
    <section className="bg-background">
      <div className="container-page page-header motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-4 motion-safe:duration-700">
        <Link
          href="/cohorts"
          className="eyebrow -ml-1 inline-flex min-h-11 items-center gap-2 rounded-full px-1 transition-colors hover:text-headings"
        >
          <ArrowLeft aria-hidden className="size-3.5" />
          All programs
        </Link>
        <h1
          className={cn(
            HEADING_SIZE.page,
            "mt-5 max-w-4xl font-fancy font-light leading-[1.05] tracking-tight text-headings text-balance",
          )}
        >
          {program.title}
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          {program.description}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <ApplyButton className="btn-primary min-h-12">Apply now</ApplyButton>
          <BrochureLink program={program} />
        </div>
      </div>
    </section>
  )
}

function Fact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-sm text-muted-foreground">{term}</dt>
      <dd className="mt-1.5 text-[15px] leading-snug text-headings sm:text-base">{children}</dd>
    </div>
  )
}

/* 2. Poster that settles into place, then the key facts in one strip */
export function ProgramMedia({ program }: Props) {
  const split = splitLabel(program)
  return (
    <section aria-label="Program facts" className="bg-background pb-20 md:pb-28">
      <div className="container-page">
        {program.promotionalGraphic && (
          <ScrollScale>
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0B0C]">
              <Image
                src={program.promotionalGraphic}
                alt={`${program.title} program poster`}
                fill
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-cover"
              />
            </div>
          </ScrollScale>
        )}
        <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/[0.08] pt-8 sm:grid-cols-3 lg:grid-cols-6">
          {program.status && <Fact term="Status">{program.status}</Fact>}
          <Fact term="Duration">{program.duration}</Fact>
          <Fact term="Schedule">{program.schedule}</Fact>
          <Fact term="Format">{program.mode}</Fact>
          {program.level && <Fact term="Level">{program.level}</Fact>}
          <Fact term="Fee">
            <Money>{program.fee}</Money>
            {split && (
              <span className="block text-sm text-muted-foreground">
                <Money>{split}</Money>
              </span>
            )}
          </Fact>
        </dl>
      </div>
    </section>
  )
}

/* 3. Sticky heading, three rows */
export function ProgramOverview({ program }: Props) {
  const rows = [
    { title: "What it is", body: program.overview.whatIsIt },
    { title: "What you work on", body: program.overview.whatYouWorkOn },
    { title: "How you learn", body: program.overview.learningExperience },
  ]
  return (
    <Section id="overview">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading title="About the program" />
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          {rows.map((row, i) => (
            <Reveal key={row.title} y={16} delay={i * 0.05}>
              <div
                className={cn(
                  "grid gap-3 py-8 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:py-10",
                  i > 0 && "border-t border-white/[0.08]",
                  i === 0 && "pt-0 sm:pt-2",
                )}
              >
                <h3 className="font-heading text-base font-medium text-headings">{row.title}</h3>
                <p className="text-base leading-relaxed text-white/75 text-pretty sm:text-xl sm:leading-relaxed">
                  {row.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  )
}

/* 4. Mentor profile: photo, who they are, their words */
export function ProgramMentor({ program }: Props) {
  const mentor = program.mentors?.[0]
  if (!mentor) return null
  const linkedinHost = mentor.linkedin ? new URL(mentor.linkedin).host.replace(/^www\./, "") : null
  const expertise = mentor.expertise
    .split("·")
    .map((item) => item.trim())
    .filter(Boolean)

  return (
    <Section id="mentor" tone="alt" labelledBy="mentor-name">
      <div className="grid gap-10 md:grid-cols-12 md:items-center lg:gap-16">
        <Reveal className="md:col-span-5 lg:col-span-4">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0B0C] md:mx-0">
            <Image
              src={mentor.image}
              alt={mentor.name}
              fill
              sizes="(min-width: 768px) 384px, 90vw"
              className="object-cover object-[50%_35%]"
            />
          </div>
        </Reveal>

        <div className="min-w-0 md:col-span-7 lg:col-span-8">
          <p className="eyebrow">Your mentor</p>
          <h2
            id="mentor-name"
            className="mt-5 font-fancy text-5xl font-light leading-[1.05] text-headings sm:text-6xl"
          >
            {mentor.name}
          </h2>
          <p className="mt-5 font-heading text-base text-headings sm:text-lg">{mentor.role}</p>
          <p className="mt-1 text-[15px] text-muted-foreground sm:text-base">{mentor.company}</p>

          {expertise.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Experience and expertise">
              {expertise.map((item) => (
                <li key={item} className="rounded-full border border-white/10 px-3 py-1 text-sm text-headings/80">
                  {item}
                </li>
              ))}
            </ul>
          )}

          {mentor.quote && (
            <blockquote className="mt-10 max-w-2xl border-l border-white/20 pl-6">
              <p className="pb-1 font-fancy text-2xl font-light italic leading-snug text-headings/90 sm:text-3xl">
                &ldquo;{mentor.quote}&rdquo;
              </p>
            </blockquote>
          )}

          {mentor.linkedin && (
            <a
              href={mentor.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-8 inline-flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 font-heading text-sm font-medium text-headings"
            >
              {mentor.name} on LinkedIn
              <span className="inline-flex items-center gap-1 text-muted-foreground transition-colors group-hover:text-headings">
                {linkedinHost}
                <ArrowUpRight aria-hidden className="size-4" />
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
    </Section>
  )
}

/* 5. Four-column grid of skills */
export function ProgramCompetencies({ program }: Props) {
  if (!program.competencies?.length) return null
  return (
    <Section id="skills">
      <SectionHeading title="What you will be able to do" />
      <ul className="mt-14 grid gap-x-8 gap-y-10 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
        {program.competencies.map((item, i) => (
          <li key={item.title} className="border-t border-white/[0.12] pt-6">
            <Reveal y={16} delay={(i % 4) * 0.06}>
              <h3 className="font-heading text-lg font-medium leading-snug text-headings">{item.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{item.description}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </Section>
  )
}

/** Hidden while the owner keeps `showCurriculum: false`; the data stays in programs.ts. */
export function ProgramCurriculum({ program }: Props) {
  if (program.showCurriculum === false || !program.curriculum?.length) return null
  return (
    <Section id="curriculum" tone="alt">
      <SectionHeading title="Week by week" />
      <ol className="mt-12 max-w-4xl">
        {program.curriculum.map((week, i) => (
          <li key={week.week} className={cn(i > 0 && "border-t border-white/[0.08]")}>
            <details className="group">
              <summary className="flex min-h-14 cursor-pointer list-none items-start gap-4 py-5 [&::-webkit-details-marker]:hidden">
                <span className="w-20 shrink-0 pt-0.5 font-heading text-sm tabular-nums text-muted-foreground">
                  Week {week.week}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-heading text-base font-medium text-headings sm:text-lg">{week.title}</span>
                  {week.milestone && (
                    <span className="mt-1 block text-sm text-muted-foreground">Milestone: {week.milestone}</span>
                  )}
                </span>
                <Plus
                  aria-hidden
                  className="mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                />
              </summary>
              <div className="pb-6 sm:pl-24">
                <ul className="flex flex-wrap gap-2">
                  {week.topics.map((topic) => (
                    <li key={topic} className="rounded-full border border-white/10 px-3 py-1 text-sm text-muted-foreground">
                      {topic}
                    </li>
                  ))}
                </ul>
                {week.practicalWork && (
                  <p className="mt-4 text-[15px] leading-relaxed text-headings/85">
                    <span className="text-muted-foreground">Practical work: </span>
                    {week.practicalWork}
                  </p>
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>
    </Section>
  )
}

/* 6. Timeline: the line fills as the projects grow toward the capstone */
export function ProgramProjects({ program }: Props) {
  if (!program.projects?.length) return null
  return (
    <Section id="projects" tone="alt">
      <SectionHeading
        title="What you will build"
        lead="Projects grow in scope from the first weeks to the capstone."
      />
      <ScrollRail className="mt-14 sm:mt-16 lg:ml-[33.333%]">
        <ol className="space-y-14 sm:space-y-16">
          {program.projects.map((project) => (
            <li key={project.title} className="pl-8 sm:pl-12">
              <p className="font-heading text-sm text-muted-foreground">{project.stage}</p>
              <h3 className="mt-2 font-fancy text-3xl font-light leading-tight text-headings text-balance sm:text-4xl">
                {project.title}
              </h3>
              <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {project.description}
              </p>
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Technologies in ${project.title}`}>
                {project.technologies.map((tech) => (
                  <li key={tech} className="rounded-full border border-white/10 px-3 py-1 text-sm text-headings/80">
                    {tech}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </ScrollRail>
    </Section>
  )
}

/* 7. Centred statement with the tools set as type */
export function ProgramGenAI({ program }: Props) {
  if (!program.genAI) return null
  return (
    <Section id="ai" labelledBy="ai-title">
      <div className="mx-auto max-w-4xl text-center">
        <SectionHeading
          align="center"
          title={<span id="ai-title">AI in your workflow</span>}
          lead={program.genAI.description}
        />
      </div>
      <h3 className="sr-only">Tools covered</h3>
      <ul className="mx-auto mt-12 flex max-w-6xl flex-wrap items-baseline justify-center gap-x-8 gap-y-3 border-t border-white/[0.08] pt-10 sm:gap-x-12">
        {program.genAI.tools.map((tool) => (
          <li key={tool} className="font-fancy text-3xl font-light text-headings sm:text-4xl lg:text-5xl">
            {tool}
          </li>
        ))}
      </ul>
    </Section>
  )
}

const GROUP_LABEL: Record<string, string> = {
  Profile: "Your profile",
  Interviews: "Interview preparation",
}

/* 8. Career preparation, grouped into two columns */
export function ProgramCareerPrep({ program }: Props) {
  if (!program.careerPrep?.length) return null
  const groups = program.careerPrep.reduce<{ key: string; items: Program["careerPrep"] }[]>((acc, item) => {
    const key = item.group ?? "More"
    const group = acc.find((g) => g.key === key)
    if (group) group.items.push(item)
    else acc.push({ key, items: [item] })
    return acc
  }, [])

  return (
    <Section id="career" tone="alt">
      <SectionHeading
        title="Preparation for the job search"
        lead="Built into the program alongside the technical work."
      />
      <div className={cn("mt-14 grid gap-12 sm:mt-16", groups.length > 1 && "md:grid-cols-2 md:gap-16")}>
        {groups.map((group) => (
          <div key={group.key} className="min-w-0">
            <h3 className="border-b border-white/[0.16] pb-4 font-heading text-lg font-medium text-headings">
              {GROUP_LABEL[group.key] ?? "More"}
            </h3>
            <dl className="mt-6 space-y-6">
              {group.items.map((item) => (
                <div key={item.title}>
                  <dt className="font-heading text-base font-medium text-headings">{item.title}</dt>
                  <dd className="mt-1 text-[15px] leading-relaxed text-muted-foreground">{item.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </Section>
  )
}

/* 9. Single-column questions */
export function ProgramFAQ({ program }: Props) {
  if (!program.faqs?.length) return null
  return (
    <Section id="faq">
      <div className="mx-auto max-w-3xl">
        <SectionHeading title="Common questions" />
        <div className="mt-10 border-t border-white/[0.12]">
          {program.faqs.map((faq) => (
            <details key={faq.question} className="group border-b border-white/[0.08]">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="font-heading text-base font-medium leading-snug text-headings sm:text-lg">
                  {faq.question}
                </h3>
                <Plus
                  aria-hidden
                  className="size-5 shrink-0 text-muted-foreground transition-transform duration-300 group-open:rotate-45"
                />
              </summary>
              <p className="max-w-2xl pb-6 pr-10 text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                <Money>{faq.answer}</Money>
              </p>
            </details>
          ))}
        </div>
        <p className="mt-8 text-[15px] leading-relaxed text-muted-foreground">
          Something else on your mind? Write to{" "}
          <a
            href={`mailto:${CONTACT.support}`}
            className="wrap-anywhere text-headings underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
          >
            {CONTACT.support}
          </a>
          .
        </p>
      </div>
    </Section>
  )
}

/* 10. Close: how applying works, next to the fee and the two payment plans */
export function ProgramFinalCTA({ program }: Props) {
  return (
    <Section id="apply" tone="alt">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <h2 className="font-fancy text-5xl font-light leading-[1.05] tracking-tight text-headings text-balance sm:text-6xl">
            Start with a short application.
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
            No payment is needed to apply. A program coordinator contacts you, confirms your payment plan and completes
            your enrollment.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <ApplyButton className="btn-primary min-h-12">Apply now</ApplyButton>
            <BrochureLink program={program} />
          </div>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <p className="text-sm text-muted-foreground">Program fee</p>
          <p className="mt-3 font-fancy text-6xl font-light leading-none text-headings sm:text-7xl">
            <Money signClassName="text-[0.82em]">{program.fee}</Money>
          </p>
          <dl className="mt-10 border-t border-white/[0.12]">
            {program.paymentPlans.map((plan, i) => {
              const split = plan.type === "SPLIT PAYMENT"
              return (
                <div
                  key={plan.type}
                  className={cn(
                    "grid gap-1 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6",
                    i > 0 && "border-t border-white/[0.08]",
                  )}
                >
                  <dt className="font-heading text-base font-medium text-headings">
                    {split ? "Pay in instalments" : "Pay in full"}
                  </dt>
                  <dd className="text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                    {split && plan.schedule?.length ? (
                      plan.schedule.map((line) => (
                        <span key={line} className="block">
                          <Money>{line}</Money>
                        </span>
                      ))
                    ) : (
                      <>
                        <Money>{plan.amount}</Money>, {plan.description.toLowerCase()}
                      </>
                    )}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </div>
    </Section>
  )
}
