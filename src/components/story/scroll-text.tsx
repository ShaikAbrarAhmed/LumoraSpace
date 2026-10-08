"use client"

import { useRef, useSyncExternalStore } from "react"
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion"
import { cn } from "@/lib/utils"

const subscribe = () => () => {}

/** false during SSR and hydration, true afterwards. Keeps the server HTML fully readable. */
function useHydrated() {
  return useSyncExternalStore(subscribe, () => true, () => false)
}

type ScrollTextProps = {
  /** Use "\n" to break the text into lines. */
  text: string
  as?: "p" | "h2"
  /** What lights up as one step: each word, or each whole line. */
  unit?: "word" | "line"
  id?: string
  className?: string
  lineClassName?: string
}

/**
 * Large editorial statement whose words (or lines) brighten as it scrolls
 * through the viewport. Opacity only. Renders plain, fully visible text on the
 * server, without JS and for prefers-reduced-motion.
 */
export function ScrollText({ text, as: Tag = "p", unit = "word", id, className, lineClassName }: ScrollTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const hydrated = useHydrated()
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.55"] })

  const lines = text.split("\n")
  const animate = hydrated && !reduce

  if (!animate) {
    return (
      <div ref={ref}>
        <Tag id={id} className={className}>
          {lines.map((line, i) => (
            <span key={i} className={cn("block", lineClassName)}>
              {line}
            </span>
          ))}
        </Tag>
      </div>
    )
  }

  const tokenLines = lines.map((line) => (unit === "line" ? [line] : line.split(" ")))
  const total = tokenLines.reduce((sum, tokens) => sum + tokens.length, 0)
  const starts = tokenLines.map((_, i) => tokenLines.slice(0, i).reduce((sum, tokens) => sum + tokens.length, 0))

  return (
    <div ref={ref}>
      <Tag id={id} className={className}>
        <span className="sr-only">{lines.join(" ")}</span>
        <span aria-hidden="true">
          {tokenLines.map((tokens, li) => (
            <span key={li} className={cn("block", lineClassName)}>
              {tokens.map((token, ti) => {
                const index = starts[li] + ti
                return (
                  <Token key={ti} progress={scrollYProgress} range={[index / total, (index + 1) / total]}>
                    {ti < tokens.length - 1 ? `${token} ` : token}
                  </Token>
                )
              })}
            </span>
          ))}
        </span>
      </Tag>
    </div>
  )
}

function Token({ progress, range, children }: { progress: MotionValue<number>; range: [number, number]; children: string }) {
  const opacity = useTransform(progress, range, [0.18, 1])
  return <motion.span style={{ opacity }}>{children}</motion.span>
}
