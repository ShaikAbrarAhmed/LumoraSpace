import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ARENA, SITE_URL } from "@/lib/site"
import { pageMetadata } from "@/lib/metadata"
import { JsonLd } from "@/lib/jsonld"
import { HackathonsHero } from "@/components/hackathons/HackathonsHero"
import { FormatsSection } from "@/components/hackathons/FormatsSection"
import { HowItWorksSection } from "@/components/hackathons/HowItWorksSection"
import { TracksSection } from "@/components/hackathons/TracksSection"
import { RecordsSection } from "@/components/hackathons/RecordsSection"
import { HostSection } from "@/components/hackathons/HostSection"
import { SmallPrint } from "@/components/hackathons/SmallPrint"

const title = "Hackathons"
const shareTitle = "Hackathons | LumoraSpace"
const description =
  "Team hackathons and seasonal global challenges on Lumora Arena. Register your team, get QR tickets, and see winners, leaderboards and certificates."

export const metadata = pageMetadata({ title, description, path: "/hackathons" })

const pageUrl = `${SITE_URL}/hackathons`

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${pageUrl}#webpage`,
  url: pageUrl,
  name: shareTitle,
  description,
  isPartOf: { "@type": "WebSite", name: "LumoraSpace", url: SITE_URL },
  publisher: { "@type": "Organization", name: "LumoraSpace", url: SITE_URL },
  about: {
    "@type": "Organization",
    name: ARENA.name,
    url: ARENA.home,
    parentOrganization: { "@type": "Organization", name: "LumoraSpace", url: SITE_URL },
  },
  significantLink: [ARENA.hackathons, ARENA.challenges, ARENA.winners, ARENA.leaderboard, ARENA.verify, ARENA.rent],
}

export default function HackathonsPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex flex-col bg-background">
        <JsonLd data={jsonLd} />
        <HackathonsHero />
        <FormatsSection />
        <HowItWorksSection />
        <TracksSection />
        <RecordsSection />
        <HostSection />
        <SmallPrint />
      </main>
      <Footer />
    </>
  )
}
