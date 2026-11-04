import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { CollegeList } from "@/components/site/people"
import { ButtonLink, ClosingCta, PageHero, RuleList, SplitSection, StatList } from "@/components/site/ui"
import { LUMINIX_STATS } from "@/data/company"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({
  title: "For colleges",
  description:
    "Campus hackathons, event ticketing on Lumora Arena, mentor-led programs and teaching support. LumoraSpace runs industry-led programs with colleges.",
  path: "/colleges",
})

const OFFER = [
  { title: "Campus hackathons on Arena", body: "Team registration, judging rounds and finals, run on our own platform." },
  {
    title: "Event ticketing and QR check-in",
    body: "Rent Arena for your own events: tickets, QR check-in, live attendance and UPI payments to your account.",
  },
  { title: "Mentor-led programs for students", body: "Our cohort programs, delivered to your students." },
  { title: "Teaching assistant support", body: "Our team supports your faculty in technical courses." },
  { title: "Student community access", body: "Your students join the LumoraSpace community, hackathons and internships." },
]

const TALK_HREF = "/contact?topic=college"

export default function CollegesPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-ls-ink">
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "For colleges" }]}
          eyebrow="For colleges"
          title="Bring industry-led programs and hackathons to your campus."
          lead="We run hackathons, mentor-led programs and events with colleges, using our own platforms and mentors from industry."
          actions={
            <>
              <ButtonLink href={TALK_HREF}>Talk to us</ButtonLink>
              <ButtonLink href="/work#luminix" variant="outline">
                See LUMINIX’26
              </ButtonLink>
            </>
          }
        />

        <SplitSection eyebrow="Offer" title="What we run with colleges" tone="glow">
          <RuleList items={OFFER} />
        </SplitSection>

        <SplitSection eyebrow="Partners" title="Colleges we work with" tone="ink2">
          <CollegeList />
        </SplitSection>

        <SplitSection eyebrow="Track record" title="Proof: LUMINIX’26">
          <StatList stats={LUMINIX_STATS} variant="compact" />
          <p className="m-0">
            Our first online hackathon, run end to end on our own platform with mentors judging working builds.
          </p>
        </SplitSection>

        <ClosingCta
          title="Let’s plan something for your students."
          body="Tell us your college, department and what you would like to run. We reply with a proposal."
          action={<ButtonLink href={TALK_HREF}>Talk to us</ButtonLink>}
        />
      </main>
      <Footer />
    </>
  )
}
