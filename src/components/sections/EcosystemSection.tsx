"use client"

import { useRef, useSyncExternalStore } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { ARENA, EDU } from "@/lib/site"

type Door = {
  verb: string
  name: string
  text: string
  href: string
  label: string
  external: boolean
  /** Grid placement: a 7/5 row over a full-width row on large screens. */
  span: string
  surface: "silk" | "glow" | "plain"
  large: boolean
}

const doors: Door[] = [
  {
    verb: "Learn",
    name: EDU.name,
    text: "Structured, mentor-led programs with live, guided sessions and a certificate on completion.",
    href: EDU.home,
    label: EDU.host,
    external: true,
    span: "md:col-span-2 lg:col-span-7",
    surface: "silk",
    large: true,
  },
  {
    verb: "Compete",
    name: ARENA.name,
    text: "Ticketed team hackathons, plus solo global challenges every season with certificates.",
    href: ARENA.home,
    label: ARENA.host,
    external: true,
    span: "lg:col-span-5",
    surface: "plain",
    large: false,
  },
  {
    verb: "Build with us",
    name: "Technology services for businesses",
    text: "AI and data, cloud, full-stack and mobile apps, design and MVPs, planned and built end to end.",
    href: "/services",
    label: "Explore services",
    external: false,
    span: "md:col-span-2 lg:col-span-12",
    surface: "glow",
    large: true,
  },
]

export function EcosystemSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useStaticMotion()
  // Drives a slow drift of the silk texture in the Learn door, echoing the hero video above.
  // It stays bound and flattens to 0 under reduced motion, so the DOM always ends up static.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const drift = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [-40, 40])

  return (
    <section ref={sectionRef} id="explore" aria-labelledby="explore-title" className="section-y bg-[#050505]">
      <div className="container-page">
        <Reveal>
          <SectionHeading
            title={<span id="explore-title">Where do you want to go next?</span>}
            lead="Mentor-led programs, hackathons and internships for students, and end-to-end technology solutions for businesses. Start with what you need."
          />
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:mt-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {doors.map((door, index) => (
            <li key={door.verb} className={door.span}>
              <Reveal delay={(index % 2) * 0.08} className="h-full">
                <DoorCard door={door} drift={drift} />
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

const noopSubscribe = () => () => {}

// Framer already knows the reduced-motion preference on the first client render, which would make that
// render differ from the server HTML. Flattening only once hydration is done keeps the two identical.
function useStaticMotion() {
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false)
  return Boolean(useReducedMotion()) && hydrated
}

function DoorCard({ door, drift }: { door: Door; drift: MotionValue<number> }) {
  const Arrow = door.external ? ArrowUpRight : ArrowRight
  const className = `group relative isolate flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0B0C] p-6 transition-colors duration-300 hover:border-white/20 sm:p-8 ${
    door.large ? "md:min-h-[18rem] lg:min-h-[23rem] lg:p-10" : "md:min-h-[16rem] lg:min-h-[23rem]"
  }`

  const content = (
    <>
      {door.surface === "silk" && (
        <motion.span
          aria-hidden="true"
          style={{ y: drift }}
          className="pointer-events-none absolute -inset-y-16 inset-x-0 -z-10 bg-[url('/silk_flow_bg.jpg')] bg-cover bg-center opacity-30 mix-blend-screen [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        />
      )}
      {door.surface === "glow" && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_100%_100%,rgba(255,255,255,0.08),transparent_60%)]"
        />
      )}

      <span
        className={`font-fancy font-light leading-[1.1] text-headings ${
          door.large ? "text-5xl sm:text-6xl lg:text-7xl" : "text-[2.5rem] sm:text-5xl"
        }`}
      >
        {door.verb}
      </span>

      <div className="mt-auto pt-10 md:pt-12">
        <h3 className="font-heading text-lg font-medium text-headings">{door.name}</h3>
        <p className="mt-2 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {door.text}
        </p>
        <span className="mt-6 inline-flex items-center gap-1.5 font-heading text-sm text-headings/80 transition-colors duration-300 group-hover:text-headings">
          {door.label}
          <Arrow
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-0.5"
          />
        </span>
        {door.external && <span className="sr-only"> (opens in a new tab)</span>}
      </div>
    </>
  )

  return door.external ? (
    <a href={door.href} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={door.href} className={className}>
      {content}
    </Link>
  )
}
