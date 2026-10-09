import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

/**
 * The two display sizes. `page` is every inner page's h1 (use it on hand-written h1s too, with
 * the `page-header` utility on the wrapper); `section` is every h2. The home hero and the
 * /our-story editorial h1 are deliberate exceptions.
 */
export const HEADING_SIZE = {
  page: "text-[2.75rem] sm:text-6xl lg:text-7xl",
  section: "text-4xl sm:text-5xl lg:text-6xl",
} as const

type SectionHeadingProps = {
  /** Optional. Plain words naming the topic, never a number ("01 Explore"). Most sections should leave it out. */
  eyebrow?: string
  title: ReactNode
  lead?: ReactNode
  align?: "left" | "center"
  as?: "h1" | "h2"
  /** Defaults to "page" for an h1 and "section" for an h2. */
  size?: keyof typeof HEADING_SIZE
  className?: string
}

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  as: Tag = "h2",
  size = Tag === "h1" ? "page" : "section",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
      <Tag className={cn(HEADING_SIZE[size], "font-fancy font-light leading-[1.05] tracking-tight text-headings text-balance")}>
        {title}
      </Tag>
      {lead && (
        <p className={cn("mt-6 text-base sm:text-lg leading-relaxed text-muted-foreground text-pretty", align === "center" && "mx-auto", "max-w-2xl")}>
          {lead}
        </p>
      )}
    </div>
  )
}
