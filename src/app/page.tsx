import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { IntroScreen } from "@/components/IntroScreen"

import HeroSection from "@/components/sections/HeroSection"
import { EcosystemSection } from "@/components/sections/EcosystemSection"
import { ProblemSection } from "@/components/sections/ProblemSection"
import { FrameworkSection } from "@/components/sections/FrameworkSection"
import { ProgramsPreviewSection } from "@/components/sections/ProgramsPreviewSection"
import { ArenaSection } from "@/components/sections/ArenaSection"
import { OpportunitiesPreviewSection } from "@/components/sections/OpportunitiesPreviewSection"
import { ServicesPreviewSection } from "@/components/sections/ServicesPreviewSection"
import { MentorsPreviewSection } from "@/components/sections/MentorsPreviewSection"
import { CommunityPreviewSection } from "@/components/sections/CommunityPreviewSection"
import { CTASection } from "@/components/sections/CTASection"

const title = "LumoraSpace | From Confused to Confident"
const description =
  "Mentor-led programs, hackathons and internships that take students from confused to confident. LumoraSpace also builds software and AI for businesses."

// The home title is the brand line itself, so it skips the layout's " | LumoraSpace" template.
export const metadata: Metadata = {
  ...pageMetadata({ title, description, path: "/", shareTitle: title }),
  title: { absolute: title },
}

export default function Home() {
  return (
    <>
      <IntroScreen />
      <Navbar />
      <main id="main" className="flex min-h-screen flex-col bg-background">
        <HeroSection />
        <EcosystemSection />
        <ProblemSection />
        <FrameworkSection />
        <ProgramsPreviewSection />
        <ArenaSection />
        <OpportunitiesPreviewSection />
        <ServicesPreviewSection />
        <MentorsPreviewSection />
        <CommunityPreviewSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}
