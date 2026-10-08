import type { ComponentType } from "react"
import { BrainCircuit, Globe } from "lucide-react"
import { FaJava } from "react-icons/fa6"
import { SiCplusplus, SiJavascript, SiNodedotjs, SiPython, SiReact } from "react-icons/si"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { TRACKS } from "./content"

// One mark per track, drawn in the text colour so the logos stay in the site's monochrome palette.
const TRACK_ICONS: Record<(typeof TRACKS)[number], ComponentType<{ className?: string }>> = {
  Python: SiPython,
  Java: FaJava,
  "C/C++": SiCplusplus,
  JavaScript: SiJavascript,
  "Web Development": Globe,
  React: SiReact,
  "Node.js": SiNodedotjs,
  "AI/ML": BrainCircuit,
}

export function TracksSection() {
  return (
    <section id="tracks" className="section-y border-t border-white/[0.06] bg-[#08080A]">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            align="center"
            title="Build in the stack you know."
            lead="Hackathon tracks on Arena include these languages and frameworks."
          />
        </Reveal>
        <Reveal delay={0.1}>
          <ul className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-2.5 sm:mt-14 sm:gap-3">
            {TRACKS.map((track) => {
              const Icon = TRACK_ICONS[track]
              return (
                <li
                  key={track}
                  className="group inline-flex items-center gap-2.5 rounded-full border border-white/[0.12] bg-white/[0.02] px-5 py-2.5 font-heading text-sm text-headings/90 transition-colors duration-300 hover:border-white/30 hover:bg-white/[0.05] sm:gap-3 sm:px-7 sm:py-3.5 sm:text-lg"
                >
                  <Icon
                    aria-hidden
                    className="size-4 shrink-0 text-headings/60 transition-colors duration-300 group-hover:text-headings sm:size-5"
                  />
                  {track}
                </li>
              )
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
