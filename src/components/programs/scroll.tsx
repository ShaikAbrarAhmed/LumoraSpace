"use client"

import { useRef, useSyncExternalStore, type ReactNode } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)"

function subscribeReduce(onChange: () => void) {
  const mq = window.matchMedia(REDUCE_QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

/**
 * Hydration-safe reduced-motion flag: false on the server and during hydration, then the real
 * preference (same pattern as the hackathons hook). The scroll-linked values below always stay
 * in `style` and only their output ranges collapse to the resting value, so server and client
 * markup match and reduced-motion users see everything static at full size and opacity.
 */
function useReduce() {
  return useSyncExternalStore(
    subscribeReduce,
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false,
  )
}

/**
 * Vertical hairline on the left that fills as the block scrolls through the viewport.
 * Children should leave room on the left (e.g. pl-8 sm:pl-12).
 */
export function ScrollRail({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReduce()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 55%"] })
  const scaleY = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1])

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-px bg-white/[0.08]">
        <motion.div className="absolute inset-0 origin-top bg-white/70" style={{ scaleY }} />
      </div>
      {children}
    </div>
  )
}

/** Media that settles from slightly smaller to full size as it scrolls into view. Never crops. */
export function ScrollScale({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReduce()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 35%"] })
  const scale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.93, 1])
  const opacity = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.55, 1])

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ scale, opacity }} className="origin-top will-change-transform">
        {children}
      </motion.div>
    </div>
  )
}
