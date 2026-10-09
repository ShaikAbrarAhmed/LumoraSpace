import type { CSSProperties } from "react"
import { ArrowUpRight } from "lucide-react"
import { SOCIAL } from "@/lib/site"
import { cn } from "@/lib/utils"
import { CHANNELS } from "./channels"

// The entrance runs on CSS keyframes, so it plays straight from the server HTML
// with no hydration step to get wrong. `motion-safe:` leaves every element in its
// resting state for reduced-motion users.
const KEYFRAMES =
  "@keyframes ls-community-rise{from{opacity:0;transform:translate3d(0,1.25rem,0)}}" +
  "@keyframes ls-community-fill{from{transform:scaleY(0)}}" +
  "@keyframes ls-community-lit{from{opacity:0}}"

const rise = "motion-safe:animate-[ls-community-rise_1s_cubic-bezier(0.16,1,0.3,1)_both]"
const fill = "motion-safe:animate-[ls-community-fill_1s_linear_both]"
const lit = "motion-safe:animate-[ls-community-lit_0.3s_ease-out_both]"

const delay = (seconds: number): CSSProperties => ({ animationDelay: `${seconds}s` })

/** When the first channel appears, and the gap before each next one. */
const CHANNEL_START = 0.6
const CHANNEL_STEP = 0.25

const external = { target: "_blank", rel: "noopener noreferrer" } as const

export function CommunityHero() {
  return (
    <section aria-labelledby="community-hero-title" className="relative isolate flex min-h-[100dvh] flex-col overflow-hidden">
      <style>{KEYFRAMES}</style>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_20%_0%,rgba(255,255,255,0.06),transparent_70%)]"
      />

      <div className="container-page flex flex-1 flex-col gap-14 pb-12 pt-24 sm:pb-16 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
        <div className="lg:col-span-7 lg:self-start">
          <p className={cn("eyebrow", rise)} style={delay(0.05)}>
            Community
          </p>
          <h1
            id="community-hero-title"
            className={cn(
              "mt-6 max-w-4xl text-balance font-fancy text-[2.75rem] font-light leading-[1.02] tracking-tight text-headings sm:text-6xl lg:text-7xl xl:text-8xl",
              rise,
            )}
            style={delay(0.15)}
          >
            {"Don't build your future "}
            <span className="italic text-white/60">alone.</span>
          </h1>
          <p
            className={cn("mt-7 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-lg", rise)}
            style={delay(0.28)}
          >
            Ask questions, share your work and find teammates among students learning the same things as you.
          </p>
          <div className={cn("mt-10 flex flex-col gap-3 sm:flex-row", rise)} style={delay(0.4)}>
            <a href={SOCIAL.whatsapp} {...external} className="btn-primary w-full gap-2 whitespace-nowrap sm:w-auto">
              Join WhatsApp
              <ArrowUpRight aria-hidden className="size-4" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>

        <ChannelRail />
      </div>
    </section>
  )
}

/**
 * The three places the community meets, in the order the page describes them:
 * the hero's picture of where to go. From lg up they hang off a rail that fills
 * channel by channel on load. Below lg they stack under a hairline.
 */
function ChannelRail() {
  return (
    <div className="relative mt-auto border-t border-white/[0.08] pt-4 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:self-end lg:border-t-0 lg:pt-0">
      <span aria-hidden className="absolute inset-y-0 left-0 hidden w-px bg-white/[0.1] lg:block" />
      <span
        aria-hidden
        className={cn("absolute inset-y-0 left-0 hidden w-px origin-top bg-white/60 lg:block", fill)}
        style={delay(CHANNEL_START - 0.2)}
      />
      <ul aria-label="Community channels">
        {CHANNELS.map((channel, i) => {
          const at = CHANNEL_START + i * CHANNEL_STEP
          return (
            <li key={channel.id} className={rise} style={delay(at - 0.1)}>
              <a
                href={channel.href}
                {...external}
                className="group flex min-h-11 flex-col py-3 lg:py-4 lg:pl-10"
              >
                <span className="relative flex items-center gap-3">
                  <span aria-hidden className="absolute -left-10 top-1/2 hidden h-px w-5 bg-white/30 lg:block" />
                  <span
                    aria-hidden
                    className={cn("absolute -left-10 top-1/2 hidden h-px w-5 bg-white lg:block", lit)}
                    style={delay(at)}
                  />
                  <span className="font-fancy text-4xl font-light leading-[1.1] text-headings sm:text-5xl xl:text-6xl">
                    {channel.name}
                  </span>
                  <ArrowUpRight
                    aria-hidden
                    className="size-5 shrink-0 text-muted-foreground transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-headings"
                  />
                </span>
                <span className="mt-1 text-sm text-muted-foreground transition-colors duration-300 group-hover:text-headings/85 sm:text-[15px]">
                  {channel.summary}
                </span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
