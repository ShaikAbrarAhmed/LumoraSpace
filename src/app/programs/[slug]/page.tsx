import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { programs } from "@/data/programs"
import { toApplyProgram } from "@/components/programs/apply-program"
import { ApplyProvider } from "@/components/programs/ApplyProvider"
import { courseJsonLd } from "@/components/programs/course-jsonld"
import { JsonLd } from "@/lib/jsonld"
import { pageMetadata } from "@/lib/metadata"
import {
  ProgramHero,
  ProgramMedia,
  ProgramOverview,
  ProgramMentor,
  ProgramCompetencies,
  ProgramCurriculum,
  ProgramProjects,
  ProgramGenAI,
  ProgramCareerPrep,
  ProgramFAQ,
  ProgramFinalCTA,
} from "@/components/programs/ProgramSections"

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
  if (!program) notFound()

  return (
    <>
      <JsonLd data={courseJsonLd(program)} />
      <Navbar />
      <ApplyProvider program={toApplyProgram(program)}>
        <main id="main" className="bg-background">
          <ProgramHero program={program} />
          <ProgramMedia program={program} />
          <ProgramOverview program={program} />
          <ProgramMentor program={program} />
          <ProgramCompetencies program={program} />
          <ProgramCurriculum program={program} />
          <ProgramProjects program={program} />
          <ProgramGenAI program={program} />
          <ProgramCareerPrep program={program} />
          <ProgramFAQ program={program} />
          <ProgramFinalCTA program={program} />
        </main>
      </ApplyProvider>
      <Footer />
    </>
  )
}
