import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { CollegeList } from "@/components/site/people"
import {
  ButtonLink,
  ClosingCta,
  DefinitionRows,
  FactList,
  PageHero,
  RuleList,
  SplitSection,
  Steps,
  TextLink,
} from "@/components/site/ui"
import { courseJsonLd, programUrl } from "@/components/programs/course-jsonld"
import { FEE_ROWS, JOIN_STEPS } from "@/data/company"
import { programList } from "@/data/programs"
import { DATA_HREF, MERN_HREF } from "@/data/site-nav"
import { JsonLd } from "@/lib/jsonld"
import { pageMetadata } from "@/lib/metadata"
import { REGISTRATION } from "@/lib/site"

export const metadata = pageMetadata({
  title: "For students",
  description:
    "Two live cohort programs, MERN Stack with GenAI and Data Analytics: 15 weeks each, taught by engineers from industry, with every project reviewed by a mentor.",
  path: "/cohorts",
})

const TRACKS = [
  {
    track: "Track 1",
    name: "MERN Stack with GenAI",
    body: "Full-stack web apps with MongoDB, Express, React, Node.js and Next.js, with AI features built in.",
    facts: [
      { term: "Mentor", detail: "Gokul · Cirakas Consultancy" },
      { term: "Language", detail: "English" },
      { term: "Level", detail: "Beginner to intermediate" },
      { term: "Duration", detail: "15 weeks" },
    ],
    href: MERN_HREF,
  },
  {
    track: "Track 2",
    name: "Data Analytics",
    body: "Excel, SQL, Python and Tableau to turn raw data into business decisions, with AI-assisted workflows.",
    facts: [
      { term: "Mentor", detail: "Sandeep · byteXL" },
      { term: "Language", detail: "Telugu" },
      { term: "Level", detail: "No coding needed" },
      { term: "Duration", detail: "15 weeks" },
    ],
    href: DATA_HREF,
  },
]

const FORMAT = [
  { title: "Live classes", body: "Monday to Friday, about 1.5 hours a day. Holiday classes are recorded, not skipped." },
  { title: "10 weekly projects", body: "One small build every week, reviewed by your mentor." },
  { title: "1 minor project", body: "A bigger build that brings several weeks together." },
  { title: "1 major project with AI", body: "Your capstone, with an AI feature, ready for your portfolio." },
  { title: "Mentor reviews", body: "Feedback on every submission inside LumoraSpace Academy." },
  { title: "Career preparation", body: "Resume, GitHub, LinkedIn and mock interviews." },
]

const BEYOND = [
  { title: "Hackathons on Arena", body: "Team hackathons and solo challenges, like LUMINIX’26 with 630 participants." },
  {
    title: "Paid internships",
    body: "Students selected through an assessment work on our client projects, paid on performance.",
  },
  { title: "Verified internships", body: "Listings for our learners on LumoraSpace Careers." },
]

const APPLY_HREF = "/contact?topic=programs"

export default function CohortsPage() {
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
      <main id="main" className="bg-ls-ink">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "For students" }]}
          eyebrow="For students"
          title="Learn a tech skill from engineers who do it for a living."
          lead={`Two live cohort programs, 15 weeks each, with every project reviewed by a mentor. Registration opens ${REGISTRATION.opens}.`}
          actions={
            <>
              <ButtonLink href={APPLY_HREF}>Apply now</ButtonLink>
              <ButtonLink href="#programs" variant="outline">
                Compare programs
              </ButtonLink>
            </>
          }
          aside={
            <FactList
              accent
              rows={[
                { term: "Programs", detail: "2 tracks" },
                { term: "Duration", detail: "15 weeks" },
                { term: "Schedule", detail: "Mon–Fri, 1.5 hrs a day" },
                { term: "Mode", detail: "Live online" },
                { term: "Fee", detail: "₹4,999 + GST" },
                { term: "Registration", detail: `Opens ${REGISTRATION.opensShort}` },
              ]}
            />
          }
        />

        <SplitSection id="programs" eyebrow="Programs" title="Choose your program" tone="glow">
          <div className="flex flex-wrap gap-10">
            {TRACKS.map((track) => (
              <div key={track.name} className="flex flex-[1_1_340px] flex-col gap-3.5 border-t-2 border-ls-amber pt-5">
                <span className="text-[15px] text-ls-faint">{track.track}</span>
                <h3 className="m-0 text-[26px] font-semibold tracking-[-0.02em] text-ls-fg">{track.name}</h3>
                <p className="m-0">{track.body}</p>
                <FactList rows={track.facts} />
                <TextLink href={track.href}>See the full program</TextLink>
              </div>
            ))}
          </div>
          <p className="m-0 text-base">More tracks are on the roadmap: Python Builder and AI Builder. Coming soon.</p>
        </SplitSection>

        <SplitSection eyebrow="Format" title="How a cohort works" tone="ink2">
          <RuleList items={FORMAT} />
        </SplitSection>

        <SplitSection eyebrow="Fee" title="Fee and payment">
          <DefinitionRows rows={FEE_ROWS} />
          <p className="m-0 text-base">Same fee for both tracks.</p>
        </SplitSection>

        <SplitSection eyebrow="Next steps" title="Beyond the cohort" tone="ink2">
          <RuleList items={BEYOND} />
        </SplitSection>

        <SplitSection eyebrow="Colleges" title="Partner colleges">
          <CollegeList />
          <TextLink href="/colleges">Bring LumoraSpace to your college</TextLink>
        </SplitSection>

        <SplitSection eyebrow="Enrollment" title="How to join" tone="ink2">
          <Steps steps={JOIN_STEPS} />
        </SplitSection>

        <ClosingCta
          title={`Registration opens ${REGISTRATION.opens}.`}
          body="Apply now and our coordinator will call you before seats open."
          action={<ButtonLink href={APPLY_HREF}>Apply now</ButtonLink>}
        />
      </main>
      <Footer />
    </>
  )
}
