import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { TeamGrid } from "@/components/site/people"
import { ButtonLink, DefinitionRows, PageHero, SplitSection } from "@/components/site/ui"
import { LEADERSHIP, MENTORS } from "@/data/company"
import { pageMetadata } from "@/lib/metadata"
import { COMPANY, CONTACT } from "@/lib/site"

const description =
  "LumoraSpace is an education and technology company. We teach students, and we build software for businesses with the same team."

export const metadata = pageMetadata({ title: "About", description, path: "/our-story" })

export default function OurStoryPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-ls-ink">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
          eyebrow="About us"
          title="Talent exists everywhere. Guidance doesn’t."
          lead={description}
          actions={<ButtonLink href="/contact">Contact us</ButtonLink>}
        />

        <SplitSection eyebrow="Story" title="Our story">
          <div className="flex max-w-[64ch] flex-col gap-6 text-lg">
            <p className="m-0 text-ls-soft">
              Most students we meet don’t lack ability. They lack someone to tell them what to learn next, look at their work
              honestly, and help them finish what they start.
            </p>
            <p className="m-0">
              LumoraSpace was set up to close that gap. Our mentors work in industry and review every project. Our hackathons
              reward software that runs. Our internships put students on real client work. And because we also build software
              for businesses, the people who teach are the people who ship.
            </p>
            <p className="m-0">We teach in English, Hinglish and Telugu, so students can learn in the language they think in.</p>
          </div>
        </SplitSection>

        <SplitSection id="team" eyebrow="Team" title="Leadership and team" tone="glow2">
          <TeamGrid people={LEADERSHIP} />
        </SplitSection>

        <SplitSection id="mentors" eyebrow="Mentors" title="Mentors">
          <TeamGrid people={MENTORS} />
        </SplitSection>

        <SplitSection eyebrow="Company" title="Company details" tone="ink2">
          <DefinitionRows
            rows={[
              { term: "Legal name", detail: COMPANY.legalName },
              { term: "LLPIN", detail: COMPANY.llpin },
              { term: "Registered office", detail: COMPANY.office },
              {
                term: "Email",
                detail: (
                  <a href={`mailto:${CONTACT.hello}`} className="text-ls-fg underline-offset-4 hover:text-white">
                    {CONTACT.hello}
                  </a>
                ),
              },
            ]}
          />
        </SplitSection>
      </main>
      <Footer />
    </>
  )
}
