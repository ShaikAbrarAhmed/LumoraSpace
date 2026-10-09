import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import CommunitySection from "@/components/sections/CommunitySection"
import { pageMetadata } from "@/lib/metadata"

export const metadata = pageMetadata({
  title: "Community",
  description:
    "Join the LumoraSpace community of student developers and designers. Ask questions, share your work and find hackathon teammates on Discord and WhatsApp.",
  path: "/community",
})

export default function CommunityPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-background">
        <CommunitySection />
      </main>
      <Footer />
    </>
  )
}
