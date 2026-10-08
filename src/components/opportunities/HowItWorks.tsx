"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { SectionHeading } from "@/components/ui/section-heading"
import { usePrefersReducedMotion } from "@/components/ui/use-prefers-reduced-motion"
import { steps } from "./content"

type Step = (typeof steps)[number]

// Scroll progress runs 0 to 1 while the list passes a reading line at 65% of the viewport,
// so step i reaches that line at roughly i / steps.length. The line between two steps fills
// as you read from one to the next. Under reduced motion every output range is [1, 1], so each
// step is shown as reached; the motion values are always passed, so server and client markup match.
const reachedAt = (i: number) => i / steps.length

function StepItem({
  step,
  index,
  progress,
  reduce,
}: {
  step: Step
  index: number
  progress: MotionValue<number>
  reduce: boolean
}) {
  const at = reachedAt(index)
  const isLast = index === steps.length - 1
  const lit = useTransform(progress, [at - 0.04, at + 0.01], reduce ? [1, 1] : [0, 1])
  const text = useTransform(progress, [at - 0.08, at + 0.01], reduce ? [1, 1] : [0.5, 1])
  const fill = useTransform(progress, [at, reachedAt(index + 1)], reduce ? [1, 1] : [0, 1])

  return (
    <li className="relative pb-14 pl-11 last:pb-0 sm:pb-16 sm:pl-16">
      {!isLast && (
        <>
          <span aria-hidden className="absolute -bottom-3 left-[7px] top-[26px] w-px bg-white/[0.1]" />
          <motion.span
            aria-hidden
            style={{ scaleY: fill }}
            className="absolute -bottom-3 left-[7px] top-[26px] w-px origin-top bg-white/60"
          />
        </>
      )}
      <span aria-hidden className="absolute left-0 top-3 block size-[15px] rounded-full border border-white/25 bg-[#08080A]" />
      <motion.span
        aria-hidden
        style={{ opacity: lit }}
        className="absolute left-0 top-3 block size-[15px] rounded-full bg-white shadow-[0_0_0_5px_rgba(255,255,255,0.07)]"
      />

      <motion.div style={{ opacity: text }}>
        <h3 className="font-fancy text-4xl font-light leading-[1.1] tracking-tight text-headings sm:text-5xl">
          {step.verb}
        </h3>
        <p className="mt-3 max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty sm:mt-4 sm:text-lg">
          {step.body}
        </p>
      </motion.div>
    </li>
  )
}

export function HowItWorks() {
  const listRef = useRef<HTMLOListElement>(null)
  const reduce = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 65%", "end 65%"] })

  return (
    <section id="how-it-works" className="section-y scroll-mt-16 border-t border-white/[0.06] bg-[#08080A]">
      <div className="container-page grid gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow="How it works"
              title="What happens when you apply."
              lead="A mentor works with you from the day you are matched until you finish."
            />
          </div>
        </div>

        <ol ref={listRef} className="relative lg:col-span-7 lg:pt-2">
          {steps.map((step, i) => (
            <StepItem key={step.verb} step={step} index={i} progress={scrollYProgress} reduce={reduce} />
          ))}
        </ol>
      </div>
    </section>
  )
}
