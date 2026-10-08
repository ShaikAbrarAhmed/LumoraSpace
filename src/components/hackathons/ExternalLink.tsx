import type { AnchorHTMLAttributes, ReactNode } from "react"

type ExternalLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> & {
  href: string
  children: ReactNode
}

/** Link to a sister site. Opens in a new tab without leaking the opener, and says so to screen readers. */
export function ExternalLink({ href, children, ...rest }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
