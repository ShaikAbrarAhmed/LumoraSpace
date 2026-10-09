"use client"

import { useSyncExternalStore } from "react"

// Same hook as src/components/hackathons/use-prefers-reduced-motion.ts. Swap the imports for the
// shared copy once one exists outside the hackathons folder.

const QUERY = "(prefers-reduced-motion: reduce)"

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener("change", onChange)
  return () => mq.removeEventListener("change", onChange)
}

/**
 * Hydration-safe reduced-motion flag: false on the server and during hydration,
 * then the real preference. Used to switch off scroll-linked transforms.
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  )
}
