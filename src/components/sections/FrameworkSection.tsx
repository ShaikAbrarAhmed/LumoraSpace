"use client"

import { useRef, useSyncExternalStore } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"

const steps = [
  {
    title: "Discover",
    text: "Find your domain and the exact tools you need to work in it.",
  },
  {
    title: "Learn",
    text: "Go deep on architecture, clean code and production frameworks in a mentor-led program.",
  },
  {
    title: "Build",
    text: "Ship real full-stack applications, with a mentor reviewing your work along the way.",
  },
  {
    title: "Connect",
    text: "Work with other builders in hackathons and open-source projects.",
  },
  {
    title: "Grow",
    text: "Move on to internships and real project work through Lumora Careers.",
  },
]

// The line tip follows a fixed point 60% down the viewport, and each step lights up as the tip reaches it.
// Under reduced motion every value flattens to its end state (line full, steps lit) but stays bound,
// so the DOM is corrected even when the server HTML was rendered with the animated starting style.
const READ_LINE = 0.6

export function FrameworkSection() {
  const trackRef = useRef<HTMLDivElement>(null)
  const reduceMotion = useStaticMotion()
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: [`start ${READ_LINE}`, `end ${READ_LINE}`],
  })
  const rail = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [0, 1])

  return (
    <section id="framework" className="section-y border-t border-white/[0.06] bg-[#050505]">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow="How it works" title="The path, step by step." />
            </div>
          </div>

          <div ref={trackRef} className="relative lg:col-span-7">
            <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-white/[0.1]" />
            <motion.span
              aria-hidden="true"
              style={{ scaleY: rail }}
              className="absolute bottom-3 left-[7px] top-3 w-px origin-top bg-white/70"
            />
            <ol className="space-y-14 sm:space-y-20">
              {steps.map((step) => (
                <Step key={step.title} title={step.title} text={step.text} animate={!reduceMotion} />
              ))}
            </ol>
          </div>
        </div>

        <Reveal className="mt-24 border-t border-white/[0.08] pt-12 sm:mt-32 sm:pt-16">
          <p className="max-w-4xl text-balance font-fancy text-[2rem] font-light leading-[1.15] text-headings sm:text-5xl">
            Not another tutorial.{" "}
            <span className="text-muted-foreground">A structured path toward becoming a builder.</span>
          </p>
          <Link
            href="/features"
            className="group mt-8 inline-flex min-h-11 items-center gap-2 font-heading text-sm font-medium text-headings"
          >
            How LumoraSpace works
            <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
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

type StepProps = { title: string; text: string; animate: boolean }

function Step({ title, text, animate }: StepProps) {
  const ref = useRef<HTMLLIElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", `start ${READ_LINE}`] })
  const opacity = useTransform(scrollYProgress, [0, 1], animate ? [0.3, 1] : [1, 1])
  const dot = useTransform(scrollYProgress, [0.8, 1], animate ? [0, 1] : [1, 1])

  return (
    <li ref={ref} className="relative pl-10 sm:pl-14">
      <span
        aria-hidden="true"
        className="absolute left-0 top-2.5 flex size-[15px] sm:top-4 items-center justify-center rounded-full border border-white/30 bg-[#050505]"
      >
        <motion.span style={{ scale: dot }} className="block size-[7px] rounded-full bg-white" />
      </span>
      <motion.div style={{ opacity }}>
        <h3 className="font-fancy text-4xl font-light leading-none text-headings sm:text-5xl">{title}</h3>
        <p className="mt-4 max-w-lg text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
          {text}
        </p>
      </motion.div>
    </li>
  )
}
