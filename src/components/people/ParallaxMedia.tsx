"use client"

import { useRef, useSyncExternalStore, type ReactNode } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

type ParallaxMediaProps = {
  children: ReactNode
  className?: string
  /** Vertical travel in percent of the frame height, each direction. */
  strength?: number
}

const noopSubscribe = () => () => {}

/**
 * A clipped frame whose content drifts slightly as the frame crosses the
 * viewport. Transform-only, and static for prefers-reduced-motion.
 */
export function ParallaxMedia({ children, className, strength = 4 }: ParallaxMediaProps) {
  const ref = useRef<HTMLDivElement>(null)
  // False on the server and during hydration, so the first client render matches the HTML;
  // the reduced-motion preference applies right after.
  const hydrated = useSyncExternalStore(noopSubscribe, () => true, () => false)
  const reduce = Boolean(useReducedMotion()) && hydrated
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : [`-${strength}%`, `${strength}%`])
  // The overscan that hides the drift at the frame edges is only needed while it moves.
  const overscan = 1 + (strength * 2 + 2) / 100
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [overscan, overscan])

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        {children}
      </motion.div>
    </div>
  )
}
