import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

/** Shared frame for every portrait on the people pages and the home preview. */
export const photoFrame =
  "relative aspect-[4/5] overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111214]"

export function LinkedInLink({ name, href, className }: { name: string; href: string; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group/link inline-flex min-h-11 items-center gap-1.5 font-heading text-sm font-medium text-headings/80 transition-colors hover:text-headings",
        className
      )}
    >
      <span className="sr-only">{`${name} on `}</span>
      <span className="border-b border-white/20 pb-0.5 transition-colors group-hover/link:border-white/60">LinkedIn</span>
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-300 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5"
      />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}

/**
 * A person's own words, rendered verbatim. Italic display type with descenders,
 * so the line height stays above 1.1 and the block keeps a small bottom reserve.
 */
export function PersonQuote({
  quote,
  name,
  size = "lg",
  className,
}: {
  quote: string
  name: string
  size?: "xl" | "lg" | "md"
  className?: string
}) {
  return (
    <figure className={className}>
      <blockquote
        className={cn(
          "max-w-[34ch] pb-1 font-fancy font-light italic text-headings/90 text-pretty",
          size === "xl" && "max-w-[30ch] text-[1.75rem] leading-[1.2] sm:text-[2rem] lg:text-[2.75rem]",
          size === "lg" && "text-2xl leading-snug sm:text-[1.75rem] lg:text-[2rem]",
          size === "md" && "text-xl leading-snug sm:text-[1.375rem]"
        )}
      >
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>
      <figcaption className="sr-only">{name}</figcaption>
    </figure>
  )
}

export function ExpertiseTags({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul aria-label="Expertise" className={cn("flex flex-wrap gap-2", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="rounded-full border border-white/[0.08] px-3 py-1.5 text-[13px] leading-none text-muted-foreground"
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
