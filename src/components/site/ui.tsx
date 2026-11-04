import Image from "next/image"
import Link from "next/link"
import type { CSSProperties, ReactNode } from "react"
import { isExternal } from "@/lib/site"
import { cn } from "@/lib/utils"

/**
 * Building blocks of the redesign (V4 home, V6 inner pages): hairline-ruled lists,
 * a left heading column beside the content, amber accents on a near-black ground.
 */

type ButtonVariant = "amber" | "outline" | "light"
type ButtonSize = "lg" | "md" | "sm"

const BUTTON_BASE =
  "inline-flex items-center justify-center gap-2.5 rounded-[6px] no-underline transition-colors duration-200 cursor-pointer"

const BUTTON_VARIANT: Record<ButtonVariant, string> = {
  amber: "bg-ls-amber font-semibold text-ls-ink hover:bg-ls-amber-hover hover:text-ls-ink",
  outline: "border border-white/[0.28] font-medium text-ls-fg hover:border-white/50 hover:text-white",
  light: "bg-ls-fg font-medium text-ls-ink hover:bg-white hover:text-ls-ink",
}

const BUTTON_SIZE: Record<ButtonSize, string> = {
  lg: "min-h-[52px] px-7 text-[17px]",
  md: "min-h-12 px-[22px] text-[17px]",
  sm: "min-h-10 px-4 text-[15px]",
}

/** Class list for a design button, for elements that are not links (e.g. the apply dialog trigger). */
export function buttonClass(variant: ButtonVariant = "amber", size: ButtonSize = "lg", className?: string) {
  return cn(BUTTON_BASE, BUTTON_VARIANT[variant], BUTTON_SIZE[size], className)
}

type LinkishProps = { href: string; children: ReactNode; className?: string; onClick?: () => void }

/** Next.js Link for routes, a plain anchor (new tab) for other sites and mailto. */
export function SmartLink({ href, children, className, onClick }: LinkishProps) {
  if (isExternal(href)) {
    const newTab = !href.startsWith("mailto:")
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}

export function ButtonLink({
  variant = "amber",
  size = "lg",
  ...props
}: LinkishProps & { variant?: ButtonVariant; size?: ButtonSize }) {
  return <SmartLink {...props} className={buttonClass(variant, size, props.className)} />
}

/** Underlined inline link, the design's secondary action ("Read the case study"). */
export function TextLink({ className, ...props }: LinkishProps) {
  return (
    <SmartLink
      {...props}
      className={cn(
        "inline-flex min-h-11 items-center self-start font-medium text-ls-fg underline underline-offset-4 decoration-white/40 transition-colors hover:text-white hover:decoration-white",
        className,
      )}
    />
  )
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("m-0 text-sm font-semibold uppercase tracking-[0.1em] text-ls-amber", className)}>{children}</p>
  )
}

type Tone = "ink" | "ink2" | "glow" | "glow2"

const TONE: Record<Tone, string> = {
  ink: "bg-ls-ink",
  ink2: "bg-ls-ink-2",
  glow: "bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,rgba(242,181,68,0.08),rgba(242,181,68,0)_100%),#0A0A0A]",
  glow2: "bg-[radial-gradient(ellipse_45%_60%_at_50%_0%,rgba(242,181,68,0.08),rgba(242,181,68,0)_100%),#0F0F0F]",
}

/** Dot grid fading down from the top edge of a section. */
export function Dots({ className }: { className?: string }) {
  return <div aria-hidden className={cn("ls-dots absolute inset-x-0 top-0 h-[clamp(64px,7vw,96px)]", className)} />
}

type SectionProps = {
  children: ReactNode
  /** Accessible name of the section when it has no visible heading of its own. */
  label?: string
  id?: string
  tone?: Tone
  /** Alternate sections carry the dot grid. Defaults to on for the ink-2 tones. */
  dots?: boolean
  className?: string
}

export function Section({ children, label, id, tone = "ink", dots, className }: SectionProps) {
  const showDots = dots ?? (tone === "ink2" || tone === "glow2")
  return (
    <section
      id={id}
      aria-label={label}
      className={cn("relative scroll-mt-20 border-b border-white/10", TONE[tone], className)}
    >
      {showDots && <Dots />}
      {children}
    </section>
  )
}

export function SectionTitle({ children, className, as: Tag = "h2" }: { children: ReactNode; className?: string; as?: "h2" | "h3" }) {
  return (
    <Tag
      className={cn(
        "m-0 text-[clamp(28px,3vw,36px)] font-semibold leading-[1.12] tracking-[-0.025em] text-ls-fg",
        className,
      )}
    >
      {children}
    </Tag>
  )
}

/**
 * The standard V6 section: eyebrow and heading in a narrow left column, content on the right.
 * The columns wrap into one below roughly 900px.
 */
export function SplitSection({
  eyebrow,
  title,
  children,
  ...section
}: Omit<SectionProps, "label"> & { eyebrow: string; title: string }) {
  return (
    <Section label={title} {...section}>
      <div className="ls-container ls-section-y relative flex flex-wrap gap-x-12 gap-y-8">
        <div className="flex flex-[1_1_260px] flex-col gap-3.5">
          <Eyebrow>{eyebrow}</Eyebrow>
          <SectionTitle>{title}</SectionTitle>
        </div>
        <div className="flex min-w-0 flex-[2.4_1_600px] flex-col gap-6">{children}</div>
      </div>
    </Section>
  )
}

/** Responsive auto-fit grid that never forces a column wider than the screen. */
function autoGrid(min: number): CSSProperties {
  return { gridTemplateColumns: `repeat(auto-fit, minmax(min(${min}px, 100%), 1fr))` }
}

export type RuleItem = { title: string; body: string }

/** Title + one line of detail, each row on a hairline. */
export function RuleList({ items, min = 280 }: { items: RuleItem[]; min?: number }) {
  return (
    <ul className="m-0 grid list-none gap-x-10 border-t border-white/10 p-0" style={autoGrid(min)}>
      {items.map((item) => (
        <li key={item.title} className="flex flex-col gap-1 border-b border-white/10 py-4">
          <span className="text-lg font-medium text-ls-fg">{item.title}</span>
          <span className="text-base">{item.body}</span>
        </li>
      ))}
    </ul>
  )
}

export type Row = { term: string; detail: ReactNode }

/** Term on the left (200px), detail beside it; stacks on narrow screens. */
export function DefinitionRows({ rows }: { rows: Row[] }) {
  return (
    <dl className="m-0 border-t border-white/10">
      {rows.map((row) => (
        <div key={row.term} className="flex flex-wrap gap-x-5 gap-y-1 border-b border-white/10 py-3.5">
          <dt className="flex-[0_0_200px] text-ls-faint">{row.term}</dt>
          <dd className="m-0 flex-[1_1_260px] text-ls-fg">{row.detail}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Key facts with the value right-aligned, as in the program hero and program cards. */
export function FactList({ rows, accent = false, className }: { rows: Row[]; accent?: boolean; className?: string }) {
  return (
    <dl
      className={cn(
        "m-0 text-base",
        accent ? "border-t-2 border-ls-amber" : "border-t border-white/10",
        className,
      )}
    >
      {rows.map((row) => (
        <div key={row.term} className="flex justify-between gap-4 border-b border-white/10 py-3">
          <dt className="text-ls-faint">{row.term}</dt>
          <dd className="m-0 text-right text-ls-fg">{row.detail}</dd>
        </div>
      ))}
    </dl>
  )
}

/** Numbered steps joined by a rule: amber disc, then title and detail. */
export function Steps({ steps, large = false }: { steps: RuleItem[]; large?: boolean }) {
  return (
    <ol className="m-0 grid list-none gap-y-8 p-0" style={autoGrid(large ? 220 : 200)}>
      {steps.map((step, i) => (
        <li key={step.title} className={cn("flex flex-col", large ? "gap-3.5 pr-7" : "gap-3 pr-6")}>
          <div aria-hidden className="flex items-center gap-3">
            <span
              className={cn(
                "flex flex-none items-center justify-center rounded-full bg-ls-amber font-semibold text-ls-ink",
                large ? "h-10 w-10 text-[15px]" : "h-9 w-9 text-sm",
              )}
            >
              {i + 1}
            </span>
            <span className="h-px flex-1 bg-white/[0.18]" />
          </div>
          <strong className={cn("font-semibold text-ls-fg", large ? "text-[19px]" : "text-lg")}>{step.title}</strong>
          <span className="text-base">{step.body}</span>
        </li>
      ))}
    </ol>
  )
}

export function Chips({ label, items }: { label: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-[15px] text-ls-faint">{label}</span>
      <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
        {items.map((item) => (
          <li key={item} className="rounded-full border border-white/[0.18] px-3.5 py-2 text-[15px] text-ls-soft">
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export type Stat = { value: string; label: string }

/**
 * Big numbers. "hero" is the home page band, "feature" the Work page, "compact" a ruled row
 * used inside a split section.
 */
export function StatList({ stats, variant = "hero" }: { stats: Stat[]; variant?: "hero" | "feature" | "compact" }) {
  if (variant === "compact") {
    return (
      <dl className="m-0 grid border-t border-white/10" style={autoGrid(150)}>
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col-reverse pr-4 pt-4">
            <dt className="text-sm text-ls-faint">{stat.label}</dt>
            <dd className="m-0 text-[44px] font-semibold tracking-[-0.03em] text-ls-fg">{stat.value}</dd>
          </div>
        ))}
      </dl>
    )
  }
  const hero = variant === "hero"
  return (
    <dl className="m-0 grid gap-y-8" style={autoGrid(hero ? 220 : 200)}>
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col-reverse gap-1.5 border-l border-white/[0.12] px-6">
          <dt className="text-base text-ls-body">{stat.label}</dt>
          <dd
            className={cn(
              "m-0 font-semibold leading-none tracking-[-0.04em] text-ls-fg",
              hero ? "text-[clamp(56px,7vw,96px)]" : "text-[clamp(48px,6vw,80px)]",
            )}
          >
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  )
}

export function Faq({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <div className="border-t border-white/10">
      {items.map((item) => (
        <details key={item.question} className="group border-b border-white/10">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-6 py-[18px] text-lg font-medium text-ls-fg [&::-webkit-details-marker]:hidden">
            {item.question}
            <svg
              aria-hidden
              width="14"
              height="14"
              viewBox="0 0 12 12"
              className="flex-none text-ls-faint transition-transform duration-200 group-open:rotate-180"
            >
              <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </summary>
          <p className="m-0 mb-5 max-w-[64ch]">{item.answer}</p>
        </details>
      ))}
    </div>
  )
}

/** Grey box standing in for a screenshot or photo that the team still has to supply. */
export function Placeholder({ label, caption, ratio = "16 / 10" }: { label: string; caption: string; ratio?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      style={{ aspectRatio: ratio }}
      className="box-border flex items-end rounded-[4px] bg-ls-tile p-3.5 text-sm text-ls-faint"
    >
      {caption}
    </div>
  )
}

/** The animated wave image that grounds heroes and closing sections. */
export function Wave({ className, animate = false, priority = false }: { className?: string; animate?: boolean; priority?: boolean }) {
  return (
    <Image
      src="/design/wave.jpg"
      alt=""
      aria-hidden
      fill
      sizes="100vw"
      priority={priority}
      className={cn("object-cover", animate && "ls-wave", className)}
    />
  )
}

export type Crumb = { label: string; href?: string }

type PageHeroProps = {
  crumbs: Crumb[]
  eyebrow: string
  title: string
  lead: ReactNode
  actions?: ReactNode
  /** Key facts beside the copy (program and student pages). */
  aside?: ReactNode
}

/** Inner-page hero: breadcrumb, eyebrow, big heading, with the wave rising at the bottom. */
export function PageHero({ crumbs, eyebrow, title, lead, actions, aside }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div aria-hidden className="absolute inset-x-0 bottom-0 h-60 overflow-hidden opacity-90">
        <Wave animate priority className="object-[center_25%]" />
      </div>
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-60 bg-[linear-gradient(180deg,#0A0A0A_0%,rgba(10,10,10,0.4)_55%,rgba(10,10,10,0)_100%)]"
      />
      <div className="ls-container relative flex flex-wrap items-end gap-x-16 gap-y-10 pb-[200px] pt-[clamp(56px,8vw,104px)]">
        <div className="flex flex-[1.6_1_560px] flex-col gap-[22px]">
          <Breadcrumb crumbs={crumbs} />
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="m-0 max-w-[20ch] text-[clamp(40px,5.4vw,68px)] font-semibold leading-[1.02] tracking-[-0.035em] text-ls-fg">
            {title}
          </h1>
          <p className="m-0 max-w-[56ch] text-[19px] text-ls-lead">{lead}</p>
          {actions && <div className="mt-2 flex flex-wrap gap-3">{actions}</div>}
        </div>
        {aside && <div className="flex-[1_1_300px]">{aside}</div>}
      </div>
    </section>
  )
}

export function Breadcrumb({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="m-0 flex list-none flex-wrap gap-x-1.5 p-0 text-[15px] text-ls-faint">
        {crumbs.map((crumb, i) => (
          <li key={crumb.label} className="flex gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {crumb.href ? (
              <Link href={crumb.href} className="no-underline transition-colors hover:text-ls-fg">
                {crumb.label}
              </Link>
            ) : (
              <span aria-current="page">{crumb.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

/** Closing call to action over the wave, the last section of every page. */
export function ClosingCta({
  title,
  body,
  action,
  size = "page",
}: {
  title: string
  body: ReactNode
  action: ReactNode
  /** "home" is the larger V4 version. */
  size?: "page" | "home"
}) {
  const home = size === "home"
  return (
    <section className="relative overflow-hidden bg-ls-ink">
      <div aria-hidden className={cn("absolute inset-x-0 bottom-0 overflow-hidden opacity-85", home ? "h-[300px]" : "h-[260px]")}>
        <Wave className="object-[center_30%]" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(180deg,#0A0A0A_0%,#0A0A0A_45%,rgba(10,10,10,0)_100%)]"
      />
      <div
        className={cn(
          "ls-container relative flex flex-wrap items-end gap-x-12 pt-[clamp(72px,8vw,112px)]",
          home ? "gap-y-8 pb-[260px]" : "gap-y-6 pb-[240px]",
        )}
      >
        <div className="flex flex-[2_1_520px] flex-col gap-3.5">
          <h2
            className={cn(
              "m-0 font-semibold text-ls-fg",
              home
                ? "max-w-[18ch] text-[clamp(40px,5.4vw,72px)] leading-none tracking-[-0.04em]"
                : "max-w-[20ch] text-[clamp(32px,4.4vw,56px)] leading-[1.04] tracking-[-0.035em]",
            )}
          >
            {title}
          </h2>
          <p className="m-0 max-w-[52ch]">{body}</p>
        </div>
        <div className={cn("flex flex-wrap gap-3", home ? "flex-[1_1_260px]" : "flex-[1_1_240px]")}>{action}</div>
      </div>
    </section>
  )
}
