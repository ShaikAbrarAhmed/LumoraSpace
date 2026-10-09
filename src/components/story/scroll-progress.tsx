"use client"

import { createContext, useContext, useRef, useSyncExternalStore, type ComponentPropsWithoutRef } from "react"
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

const subscribe = () => () => {}

/** Reduced motion, read only after hydration so the server HTML and the first client render match. */
function useStaticMotion() {
  const hydrated = useSyncExternalStore(subscribe, () => true, () => false)
  return Boolean(useReducedMotion()) && hydrated
}

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"]

const ProgressContext = createContext<MotionValue<number> | null>(null)

type ScrollSectionProps = ComponentPropsWithoutRef<"section"> & {
  /** framer-motion scroll offset for the section's progress (0 → 1). */
  offset?: ScrollOffset
}

/**
 * A <section> that measures how far it has been scrolled through and shares
 * that progress with any <ProgressLine> rendered inside it. Children can stay
 * server components.
 */
export function ScrollSection({ offset = ["start 0.7", "end 0.7"], className, children, ...rest }: ScrollSectionProps) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset })

  return (
    <section ref={ref} className={cn("relative", className)} {...rest}>
      <ProgressContext value={scrollYProgress}>{children}</ProgressContext>
    </section>
  )
}

type ProgressLineProps = {
  orientation?: "vertical" | "horizontal"
  className?: string
}

/**
 * Hairline that fills as the surrounding ScrollSection is scrolled. Transform-only.
 * Full and static under reduced motion or outside a ScrollSection.
 */
export function ProgressLine({ orientation = "vertical", className }: ProgressLineProps) {
  const progress = useContext(ProgressContext)
  const full = useMotionValue(1)
  const reduce = useStaticMotion()
  const scale = useTransform(progress ?? full, [0, 1], progress && !reduce ? [0, 1] : [1, 1])
  const vertical = orientation === "vertical"
  const style = vertical ? { scaleY: scale } : { scaleX: scale }

  return (
    <div aria-hidden="true" className={cn("relative overflow-hidden bg-white/[0.08]", vertical ? "w-px" : "h-px", className)}>
      <motion.div
        className={cn("absolute inset-0 bg-white/60", vertical ? "origin-top" : "origin-left")}
        style={style}
      />
    </div>
  )
}
