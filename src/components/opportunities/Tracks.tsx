"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"
import { HEADING_SIZE } from "@/components/ui/section-heading"
import { CAREERS } from "@/lib/site"
import { cn } from "@/lib/utils"
import { tracks } from "./content"

/** The track list stays folded away until the heading is clicked. */
export function Tracks() {
  const [open, setOpen] = useState(false)

  return (
    <section id="tracks" className="section-y border-t border-white/[0.06] bg-[#08080A]">
      <div className="container-page">
        <h2
          className={cn(HEADING_SIZE.section, "font-fancy font-light leading-[1.05] tracking-tight text-headings")}
        >
          <button
            type="button"
            aria-expanded={open}
            aria-controls="tracks-list"
            onClick={() => setOpen((value) => !value)}
            className="group flex w-full cursor-pointer items-center justify-between gap-6 text-left"
          >
            Pick a track.
            <span
              aria-hidden
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/[0.15] text-headings transition-colors duration-300 group-hover:border-white/40 sm:size-14"
            >
              <Plus
                strokeWidth={1.5}
                className={cn("size-5 transition-transform duration-500 ease-out sm:size-6", open && "rotate-45")}
              />
            </span>
          </button>
        </h2>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground text-pretty sm:text-lg">
          {`Internship tracks on ${CAREERS.name}, and the tools each one works with.`}
        </p>

        <div
          id="tracks-list"
          inert={!open}
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
          )}
        >
          <div className="overflow-hidden">
            <ul className="mt-12 border-b border-white/[0.08] sm:mt-16">
              {tracks.map((track, i) => (
                <li key={track.name} className="border-t border-white/[0.08]">
                  <Reveal
                    y={16}
                    delay={i * 0.06}
                    className="grid gap-5 py-8 sm:py-10 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-12"
                  >
                    <h3 className="font-fancy text-5xl font-light leading-[1.1] tracking-tight text-headings sm:text-7xl lg:col-span-7 lg:text-8xl">
                      {track.name}
                    </h3>
                    <ul aria-label={`${track.name} focus areas`} className="flex flex-wrap gap-2 lg:col-span-5 lg:justify-end">
                      {track.focus.map((f) => (
                        <li
                          key={f}
                          className="cursor-default rounded-full border border-white/[0.12] bg-[#08080A] px-4 py-2 font-heading text-sm text-headings/85 transition-[transform,border-color,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:border-white/40 hover:bg-[#17181B] hover:text-headings hover:shadow-[0_12px_28px_-10px_rgba(0,0,0,0.9)] motion-safe:hover:-translate-y-1.5 motion-safe:hover:scale-110"
                        >
                          {f}
                        </li>
                      ))}
                    </ul>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
