import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import MentorsSection from "@/components/sections/MentorsSection"
import { mentorsJsonLd } from "@/components/people/JsonLd"
import { JsonLd } from "@/lib/jsonld"
import { pageMetadata } from "@/lib/metadata"
import { mentors, mentorCompanies } from "@/data/people"

export const metadata = pageMetadata({
  title: "Mentors",
  description: `Mentors from ${mentorCompanies} who guide LumoraSpace learners in product, software, marketing and data science.`,
  path: "/mentors",
})

export default function MentorsPage() {
  return (
    <>
      <JsonLd data={mentorsJsonLd(mentors)} />
      <Navbar />
      <main id="main" className="flex-1 bg-background">
        <MentorsSection />
      </main>
      <Footer />
    </>
  )
}
