import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import FeaturesSection from "@/components/sections/FeaturesSection"
import { SectionHeading } from "@/components/ui/section-heading"
import { Reveal } from "@/components/ui/reveal"
import { EcosystemRows } from "@/components/features/ecosystem-rows"
import { ProgramList } from "@/components/features/program-list"
import { JoinLink } from "@/components/features/join-link"
import { plannedPrograms } from "@/data/programs"
import { CONTACT } from "@/lib/site"
import { pageMetadata } from "@/lib/metadata"

const title = "How LumoraSpace works"
const description =
  "How LumoraSpace helps students grow: mentor-led programs, a peer community, hackathons and challenges on Lumora Arena, and internships on Lumora Careers."

export const metadata = pageMetadata({ title: "How it works", description, path: "/features" })

const planned = new Intl.ListFormat("en-GB", { style: "long", type: "conjunction" }).format(plannedPrograms)

export default function FeaturesPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-background">
        {/* Header */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,255,255,0.06),transparent)]"
          />
          <div className="container-page page-header relative">
            <SectionHeading
              as="h1"
              title={title}
              lead="Mentor-led programs, a peer community, hackathons and internships, and where to find each one."
            />
          </div>
        </section>

        <FeaturesSection />

        {/* Where it happens */}
        <section id="ecosystem" className="section-y border-t border-white/[0.06] bg-[#08080A]">
          <div className="container-page">
            <SectionHeading
              title="Four places to start"
              lead="Each part of LumoraSpace has its own home: Academy for programs, Arena for hackathons and challenges, Careers for internships, and Services for businesses."
            />
            <EcosystemRows detailed className="mt-14 md:mt-20" />
          </div>
        </section>

        {/* Programs */}
        <section id="programs" className="section-y border-t border-white/[0.06]">
          <div className="container-page">
            <SectionHeading
              title="Programs you can join"
              lead="Mentor-led and taught live online, moving from fundamentals to a capstone project, with a certificate on completion."
            />
            <div className="mt-14 md:mt-20">
              <ProgramList />
            </div>
            {plannedPrograms.length > 0 && (
              <p className="mt-10 text-[15px] text-muted-foreground">Coming soon: {planned}.</p>
            )}
          </div>
        </section>

        {/* Call to action */}
        <section className="section-y border-t border-white/[0.06] bg-[#08080A]">
          <Reveal className="container-page">
            <h2 className="max-w-3xl text-4xl leading-[1.08] tracking-tight text-headings text-balance sm:text-5xl lg:text-6xl">
              Pick a starting point.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
              Questions first? Write to{" "}
              <a
                href={`mailto:${CONTACT.hello}`}
                className="text-headings underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
              >
                {CONTACT.hello}
              </a>
              .
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/cohorts" className="btn-primary min-h-12 text-[#050505]">
                Explore programs
              </Link>
              <JoinLink className="btn-secondary min-h-12" />
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  )
}
