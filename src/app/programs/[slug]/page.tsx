import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { programs } from "@/data/programs"
import { CAREER_PREP, programPages } from "@/data/program-pages"
import { FEE_ROWS, JOIN_STEPS } from "@/data/company"
import { toApplyProgram } from "@/components/programs/apply-program"
import { ApplyButton, ApplyProvider } from "@/components/programs/ApplyProvider"
import { courseJsonLd } from "@/components/programs/course-jsonld"
import {
  ButtonLink,
  buttonClass,
  Chips,
  ClosingCta,
  DefinitionRows,
  FactList,
  Faq,
  PageHero,
  RuleList,
  SplitSection,
  Steps,
} from "@/components/site/ui"
import { JsonLd } from "@/lib/jsonld"
import { pageMetadata } from "@/lib/metadata"
import { REGISTRATION } from "@/lib/site"

type Params = { params: Promise<{ slug: string }> }

// Only the programs in programs.ts exist; anything else is a 404.
export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(programs).map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const program = programs[slug]
  if (!program) return {}

  return pageMetadata({
    title: program.title,
    description: `${program.description} ${program.duration}, live online, ${program.fee}.`,
    path: `/programs/${program.slug}`,
  })
}

export default async function ProgramPage({ params }: Params) {
  const { slug } = await params
  const program = programs[slug]
  const page = programPages[slug]
  if (!program || !page) notFound()

  const applyNow = <ApplyButton className={buttonClass("amber", "lg", "border-none font-[inherit]")}>Apply now</ApplyButton>

  return (
    <>
      <JsonLd data={courseJsonLd(program)} />
      <Navbar />
      <ApplyProvider program={toApplyProgram(program)}>
        <main id="main" className="bg-ls-ink">
          <PageHero
            crumbs={[{ label: "Home", href: "/" }, { label: "For students", href: "/cohorts" }, { label: page.shortName }]}
            eyebrow="Cohort program"
            title={program.title}
            lead={page.lead}
            actions={
              <>
                {applyNow}
                <ButtonLink href="/cohorts" variant="outline">
                  Compare programs
                </ButtonLink>
              </>
            }
            aside={
              <FactList
                accent
                rows={[
                  { term: "Level", detail: page.level },
                  { term: "Duration", detail: program.duration },
                  { term: "Schedule", detail: "Mon–Fri, 1.5 hrs a day" },
                  { term: "Mode", detail: "Live online" },
                  { term: "Language", detail: page.language },
                  { term: "Fee", detail: "₹4,999 + GST" },
                  { term: "Registration", detail: `Opens ${REGISTRATION.opensShort}` },
                ]}
              />
            }
          />

          <SplitSection eyebrow="Skills" title="What you’ll be able to do">
            <RuleList items={page.skills} />
          </SplitSection>

          <SplitSection eyebrow="Projects" title="What you build" tone="ink2">
            <RuleList items={page.projects} min={560} />
            <p className="m-0 text-base">
              Across {program.duration} you complete{" "}
              <strong className="font-semibold text-ls-fg">10 weekly projects, 1 minor project and 1 major project</strong>. The
              major project must include an AI feature. A mentor reviews every submission.
            </p>
          </SplitSection>

          <SplitSection eyebrow="Tools" title="Tools you’ll use">
            <Chips label="Stack" items={page.stack} />
            <Chips label="AI tools, used every day" items={page.aiTools} />
          </SplitSection>

          <SplitSection eyebrow="Mentor" title="Your mentor" tone="ink2">
            <div className="flex flex-wrap items-start gap-6">
              <Image
                src={page.mentor.image}
                alt={page.mentor.name}
                width={140}
                height={140}
                className="h-[140px] w-[140px] flex-none rounded-lg object-cover"
              />
              <div className="flex flex-[1_1_300px] flex-col gap-1.5">
                <span className="text-[22px] font-semibold text-ls-fg">{page.mentor.name}</span>
                <span className="text-ls-soft">{page.mentor.role}</span>
                <span className="text-[15px] text-ls-faint">{page.mentor.meta}</span>
                <p className="m-0 mt-2.5 max-w-[48ch] text-lg text-ls-soft">“{page.mentor.quote}”</p>
              </div>
            </div>
          </SplitSection>

          <SplitSection eyebrow="Careers" title="Career preparation">
            <RuleList items={CAREER_PREP} />
          </SplitSection>

          <SplitSection eyebrow="Fee" title="Fee and payment" tone="glow2">
            <DefinitionRows rows={FEE_ROWS} />
            <p className="m-0 text-base">{page.feeNote}</p>
          </SplitSection>

          <SplitSection eyebrow="Enrollment" title="How to join">
            <Steps steps={JOIN_STEPS} />
          </SplitSection>

          <SplitSection eyebrow="FAQ" title="Questions" tone="ink2">
            <Faq items={page.faqs} />
          </SplitSection>

          <ClosingCta
            title={`Registration opens ${REGISTRATION.opens}.`}
            body="Apply now and our coordinator will call you before seats open."
            action={applyNow}
          />
        </main>
      </ApplyProvider>
      <Footer />
    </>
  )
}
