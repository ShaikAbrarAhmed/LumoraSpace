"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Reveal } from "@/components/ui/reveal"

export function CTASection() {
  const { status } = useSession()
  const isSignedIn = status === "authenticated"

  return (
    <section
      aria-labelledby="cta-title"
      className="section-y relative overflow-hidden border-t border-white/[0.06] bg-[#08080A]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[26rem] bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.05),transparent_65%)]"
      />
      <Reveal className="container-page relative text-center">
        <h2
          id="cta-title"
          className="mx-auto max-w-4xl text-balance font-fancy text-[2.75rem] font-light leading-[1.05] tracking-tight text-headings sm:text-6xl lg:text-7xl"
        >
          Your next skill could change your direction.
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
          Start with one program and build from there.
        </p>
        <div className="mx-auto mt-10 flex max-w-xs flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          {!isSignedIn && (
            <Link href="/create-account" className="btn-primary">
              Join LumoraSpace
            </Link>
          )}
          <Link href="/cohorts" className={isSignedIn ? "btn-primary" : "btn-secondary"}>
            Explore programs
          </Link>
        </div>
      </Reveal>
    </section>
  )
}
