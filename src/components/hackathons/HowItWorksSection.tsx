import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { StepsTimeline } from "./StepsTimeline"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="section-y border-t border-white/[0.06]">
      <div className="container-page grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <Reveal>
              <SectionHeading title="How a team hackathon works." />
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:pt-3">
          <StepsTimeline />
        </div>
      </div>
    </section>
  )
}
