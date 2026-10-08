"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion"

const steps = [
  { title: "Discover", text: "We learn how your business runs, who the product is for and what it has to do." },
  { title: "Plan", text: "We agree on scope, priorities, stack and timeline." },
  { title: "Design & build", text: "We design the experience, then build it." },
  { title: "Launch", text: "We test the product and take it live." },
  { title: "Support", text: "Updates, fixes and improvements after launch." },
]

export function ServicesProcess() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduce = usePrefersReducedMotion()
  // The line fills as the steps pass through the middle of the screen, so the order reads as a sequence.
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 75%", "end 55%"] })
  const smooth = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 })
  // Under reduced motion the line is drawn in full and stays still.
  const fill = useTransform(smooth, [0, 1], reduce ? [1, 1] : [0, 1])

  return (
    <section className="section-y border-t border-white/[0.06] bg-[#08080A]">
      <div className="container-page">
        <SectionHeading
          title="How we work"
          lead="A typical project runs through five stages: discovery, planning, design and build, launch and support."
        />

        <div className="relative mt-14 sm:mt-20">
          {/* Track and fill: vertical under lg, horizontal from lg up */}
          <span aria-hidden className="absolute bottom-0 left-0 top-0 w-px bg-white/[0.1] lg:hidden" />
          <motion.span
            aria-hidden
            style={{ scaleY: fill }}
            className="absolute bottom-0 left-0 top-0 w-px origin-top bg-white/70 lg:hidden"
          />
          <span aria-hidden className="absolute inset-x-0 top-0 hidden h-px bg-white/[0.1] lg:block" />
          <motion.span
            aria-hidden
            style={{ scaleX: fill }}
            className="absolute inset-x-0 top-0 hidden h-px origin-left bg-white/70 lg:block"
          />

          <ol ref={listRef} className="grid gap-12 pl-8 sm:gap-14 sm:pl-10 lg:grid-cols-5 lg:gap-8 lg:pl-0 lg:pt-10">
            {steps.map((step, i) => (
              <li key={step.title}>
                <Reveal y={16} delay={reduce ? 0 : i * 0.06}>
                  <h3 className="font-fancy text-3xl font-light leading-tight text-headings sm:text-4xl lg:text-[2rem]">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-base lg:text-[15px]">
                    {step.text}
                  </p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
