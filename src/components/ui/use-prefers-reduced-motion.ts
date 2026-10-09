"use client"

import { useSyncExternalStore } from "react"

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

/**
 * Hydration-safe reduced-motion flag: false on the server and during hydration, then the real
 * preference. Use it to switch scroll-linked transforms to static values, e.g.
 * `useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.3, 1])`, and always pass the
 * motion value in `style` so server and client markup match.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
