import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { LuminixWave } from "@/components/home/HomeSections"
import { ButtonLink, ClosingCta, Eyebrow, PageHero, SectionTitle, SplitSection, StatList } from "@/components/site/ui"
import { LUMINIX_STATS } from "@/data/company"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({
  title: "Our work",
  description:
    "Events we have run, programs we teach and software we have shipped, including LUMINIX’26 and the platforms we built for ourselves.",
  path: "/work",
})

const PROJECTS = [
  { project: "LUMINIX’26", area: "Education", year: "2026", summary: "Online hackathon with two judging rounds and a final" },
  {
    project: "Cohort programs",
    area: "Education",
    year: "2026",
    summary: "MERN with GenAI and Data Analytics, every project reviewed",
  },
  { project: "LumoraSpace Academy", area: "Product", year: "2026", summary: "Our LMS: live classes, submissions and mentor reviews" },
  {
    project: "Lumora Arena",
    area: "Product",
    year: "2026",
    summary: "Hackathon and event platform with ticketing and QR check-in",
  },
  { project: "[Client project]", area: "Technology", year: "[Year]", summary: "[What we built and the result]" },
]

const PROJECT_HREF = "/contact?topic=project"
const th = "border-b border-white/[0.18] pb-3 pr-4 font-medium"
const td = "border-b border-white/10 py-[18px] pr-4"

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-ls-ink">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
          eyebrow="Our work"
          title="Events we’ve run, programs we teach, and software we’ve shipped."
          lead="Including the platforms we built for ourselves."
          actions={<ButtonLink href={PROJECT_HREF}>Start a project</ButtonLink>}
        />

        <section
          id="luminix"
          aria-label="Featured: LUMINIX’26"
          className="relative scroll-mt-20 overflow-hidden border-b border-white/10 bg-ls-ink-2"
        >
          <LuminixWave />
          <div className="ls-container relative flex flex-col gap-7 pb-[190px] pt-[clamp(72px,8vw,104px)]">
            <Eyebrow>Featured</Eyebrow>
            <SectionTitle>LUMINIX’26, our first hackathon</SectionTitle>
            <p className="m-0 max-w-[60ch] text-ls-soft">
              We ran registration, team formation, two rounds of judging and a final on our own platform. Mentors judged working
              builds, not slides.
            </p>
            <StatList stats={LUMINIX_STATS} variant="feature" />
          </div>
        </section>

        <SplitSection eyebrow="Index" title="All projects">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-base">
              <thead>
                <tr className="text-left text-sm text-ls-faint">
                  <th scope="col" className={th}>Project</th>
                  <th scope="col" className={th}>Area</th>
                  <th scope="col" className={th}>Year</th>
                  <th scope="col" className={th}>Summary</th>
                </tr>
              </thead>
              <tbody>
                {PROJECTS.map((row) => (
                  <tr key={row.project}>
                    <td className={`${td} font-medium text-ls-fg`}>{row.project}</td>
                    <td className={td}>{row.area}</td>
                    <td className={td}>{row.year}</td>
                    <td className={`${td} pr-0 text-ls-soft`}>{row.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SplitSection>

        <ClosingCta
          title="Want to be the next case study?"
          body="Tell us what you are building."
          action={<ButtonLink href={PROJECT_HREF}>Start a project</ButtonLink>}
        />
      </main>
      <Footer />
    </>
  )
}
