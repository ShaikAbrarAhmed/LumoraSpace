import type { Metadata } from "next"
import { pageMetadata } from "@/lib/metadata"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { IntroScreen } from "@/components/IntroScreen"
import { ButtonLink, ClosingCta } from "@/components/site/ui"
import {
  HomeHalves,
  HomeHero,
  HomeLoop,
  HomeNumbers,
  HomePeople,
  HomeProof,
} from "@/components/home/HomeSections"
import { CONTACT } from "@/lib/site"

const title = "LumoraSpace | Tech training for students. Software for businesses."
const description =
  "Students learn from working engineers and build on real projects. Businesses hire that same team to build their web, AI and cloud software."

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
      <main id="main" className="flex min-h-screen flex-col bg-ls-ink">
        <HomeHero />
        <HomeHalves />
        <HomeLoop />
        <HomeNumbers />
        <HomeProof />
        <HomePeople />
        <div className="border-t border-white/10">
          <ClosingCta
            size="home"
            title="Whichever side you’re on, start with a conversation."
            body={`Students, businesses and colleges all reach the same team at ${CONTACT.hello}.`}
            action={<ButtonLink href="/contact">Contact us</ButtonLink>}
          />
        </div>
      </main>
      <Footer />
    </>
  )
}
