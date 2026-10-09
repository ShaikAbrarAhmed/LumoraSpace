"use client"

import { useRef, useSyncExternalStore } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"

export type MoveItem = { verb: string; line: string }

const subscribeNoop = () => () => {}

/**
 * Reduced-motion flag that stays false on the server and during hydration, so the
 * first client render matches the server HTML. After hydration it is the real
 * preference, and the scroll-linked values below switch to static full visibility.
 */
function useStaticMotion() {
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false)
  return Boolean(useReducedMotion()) && hydrated
}

function MoveRow({ item }: { item: MoveItem }) {
  const ref = useRef<HTMLLIElement>(null)
  const reduce = useStaticMotion()
  // Each verb brightens as its row rises into the middle of the viewport, so the
  // reader's place in the sequence is always the brightest word.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "start 45%"] })
  const opacity = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.3, 1])

  return (
    <li ref={ref} className="py-8 pl-7 first:pt-0 last:pb-0 sm:py-10 sm:pl-12">
      <motion.h3
        style={{ opacity }}
        className="font-fancy text-5xl font-light leading-[1.05] tracking-tight text-headings sm:text-6xl lg:text-7xl"
      >
        {item.verb}
      </motion.h3>
      <p className="mt-4 max-w-md text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
        {item.line}
      </p>
    </li>
  )
}

/** Verb list with a hairline on the left that fills as you scroll through it. */
export function MoveList({ items }: { items: MoveItem[] }) {
  const ref = useRef<HTMLOListElement>(null)
  const reduce = useStaticMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] })
  const fill = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1])

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden className="absolute inset-y-0 left-0 w-px bg-white/[0.08]" />
      <motion.span
        aria-hidden
        style={{ scaleY: fill }}
        className="absolute inset-y-0 left-0 w-px origin-top bg-white/60"
      />
      {items.map((item) => (
        <MoveRow key={item.verb} item={item} />
      ))}
    </ol>
  )
}
