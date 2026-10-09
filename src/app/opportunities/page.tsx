import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { pageMetadata } from "@/lib/metadata"
import { OpportunitiesHero } from "@/components/opportunities/OpportunitiesHero"
import { WhatYouGet } from "@/components/opportunities/WhatYouGet"
import { HowItWorks } from "@/components/opportunities/HowItWorks"
import { WhyDifferent } from "@/components/opportunities/WhyDifferent"
import { MoreWaysIn } from "@/components/opportunities/MoreWaysIn"
import { ProgramsBridge } from "@/components/opportunities/ProgramsBridge"

export const metadata = pageMetadata({
  title: "Opportunities",
  description:
    "Verified internships, real projects on production codebases, 1:1 mentorship and competitions. Find your next step with Lumora Careers and Lumora Arena.",
  path: "/opportunities",
})

export default function OpportunitiesPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex min-h-screen flex-col bg-background">
        <OpportunitiesHero />
        <WhatYouGet />
        <HowItWorks />
        <WhyDifferent />
        <MoreWaysIn />
        <ProgramsBridge />
      </main>
      <Footer />
    </>
  )
}
