import { Fragment } from "react"
import { cn } from "@/lib/utils"

/**
 * Renders text that may contain the rupee sign, with the sign set in the system font.
 * "₹" (U+20B9) is outside the latin subset of Inter, Space Grotesk and Cormorant, so
 * drawing it in a web font downloads that font's whole latin-ext file. Every phone and
 * desktop system font has it. `signClassName` lets display sizes scale the sign to the numerals.
 */
export function Money({ children, signClassName }: { children: string; signClassName?: string }) {
  const parts = children.split("₹")
  if (parts.length === 1) return children
  return parts.map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <span className={cn("font-[family-name:system-ui,sans-serif]", signClassName)}>₹</span>}
      {part}
    </Fragment>
  ))
}
