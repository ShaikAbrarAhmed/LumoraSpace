"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { STEPS } from "./content"
import { usePrefersReducedMotion } from "./use-prefers-reduced-motion"

const LAST = STEPS.length - 1

/**
 * The four steps on a vertical rail. Each segment of the rail fills as the
 * list scrolls through the viewport and a step's title brightens when the fill
 * reaches it, so the reader sees how far along the sequence they are. Body
 * copy never dims. Transform and opacity only; static under reduced motion.
 */
export function StepsTimeline() {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = usePrefersReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] })

  return (
    <ol ref={ref} className="relative">
      {STEPS.map((step, i) => (
        <Step key={step.title} index={i} title={step.title} body={step.body} progress={scrollYProgress} reduce={reduce} />
      ))}
    </ol>
  )
}

function Step({
  index,
  title,
  body,
  progress,
  reduce,
}: {
  index: number
  title: string
  body: string
  progress: MotionValue<number>
  reduce: boolean
}) {
  const at = index / LAST
  const next = (index + 1) / LAST
  // Under reduced motion every output range collapses to [1, 1], so the rail is
  // full and the titles are bright whatever the scroll position. The motion
  // values are always passed to `style`, which keeps the server and client
  // markup identical (`reduce` is false until after hydration).
  const segment = useTransform(progress, [at, next], reduce ? [1, 1] : [0, 1])
  const lit = useTransform(progress, [Math.max(0, at - 0.04), at], reduce ? [1, 1] : [0, 1])
  const titleOpacity = useTransform(progress, [Math.max(0, at - 0.3), at], reduce ? [1, 1] : [0.5, 1])

  return (
    <li className="relative pb-14 pl-9 last:pb-0 sm:pb-16 sm:pl-12">
      {index < LAST && (
        <>
          <span aria-hidden className="absolute -bottom-[16px] left-0 top-[16px] w-px bg-white/[0.1]" />
          <motion.span
            aria-hidden
            style={{ scaleY: segment }}
            className="absolute -bottom-[16px] left-0 top-[16px] w-px origin-top bg-white/60"
          />
        </>
      )}
      <span aria-hidden className="absolute left-0 top-[15px] h-px w-5 bg-white/30" />
      <motion.span
        aria-hidden
        style={{ opacity: lit }}
        className="absolute left-0 top-[15px] h-px w-5 bg-white"
      />
      <motion.h3
        style={{ opacity: titleOpacity }}
        className="font-heading text-xl font-medium leading-snug text-headings sm:text-2xl"
      >
        {title}
      </motion.h3>
      <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground sm:text-base">{body}</p>
    </li>
  )
}
