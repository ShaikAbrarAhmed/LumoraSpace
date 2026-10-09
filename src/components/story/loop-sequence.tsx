"use client"

import { useRef, useSyncExternalStore, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { ArrowRight, RotateCcw } from "lucide-react"

const subscribe = () => () => {}

/** false during SSR and hydration, true afterwards, so the server HTML stays fully visible. */
function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}

/**
 * The tutorial loop as a row of steps that light up one after another as the
 * list scrolls into view, ending on the step that sends you back to the start.
 * Opacity only; static under reduced motion and before hydration.
 */
export function LoopSequence({ steps, className }: { steps: readonly string[]; className?: string }) {
  const ref = useRef<HTMLOListElement>(null)
  const hydrated = useHydrated()
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] })
  const progress = hydrated && !reduce ? scrollYProgress : null

  return (
    <ol ref={ref} aria-label="The loop" className={className}>
      {steps.map((step, i) => {
        const last = i === steps.length - 1
        return (
          <Step key={step} progress={progress} range={[i / steps.length, (i + 1) / steps.length]}>
            <span className="inline-flex min-h-11 items-center rounded-full border border-white/15 bg-[#0B0B0C] px-4 font-heading text-sm text-headings sm:px-5 sm:text-[15px]">
              {step}
            </span>
            {last ? (
              <RotateCcw aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0 text-muted-foreground" />
            ) : (
              <ArrowRight aria-hidden="true" strokeWidth={1.5} className="size-4 shrink-0 text-muted-foreground" />
            )}
          </Step>
        )
      })}
    </ol>
  )
}

function Step({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number> | null
  range: [number, number]
  children: ReactNode
}) {
  if (!progress) {
    return <li className="flex items-center gap-3">{children}</li>
  }
  return <AnimatedStep progress={progress} range={range}>{children}</AnimatedStep>
}

function AnimatedStep({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>
  range: [number, number]
  children: ReactNode
}) {
  const opacity = useTransform(progress, range, [0.25, 1])
  return (
    <motion.li style={{ opacity }} className="flex items-center gap-3">
      {children}
    </motion.li>
  )
}
