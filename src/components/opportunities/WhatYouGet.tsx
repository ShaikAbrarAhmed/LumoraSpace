import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { cn } from "@/lib/utils"
import { offerings } from "./content"

// Four offerings, four cells. md: one wide cell, a pair, one wide cell. xl: a tall lead cell
// with two stacked cells beside it, then one full-width cell to close.
const cells = [
  {
    cell: "md:col-span-2 xl:col-span-5 xl:row-span-2",
    surface:
      "bg-[#0B0B0C] bg-[radial-gradient(ellipse_90%_70%_at_0%_0%,rgba(255,255,255,0.08),transparent_70%)] min-h-[13rem] sm:min-h-[15rem] xl:min-h-0 justify-end",
    title: "font-fancy text-4xl font-light leading-[1.1] tracking-tight sm:text-5xl",
  },
  { cell: "xl:col-span-7", surface: "bg-[#0B0B0C]", title: "font-heading text-xl font-medium sm:text-2xl" },
  { cell: "xl:col-span-7", surface: "bg-transparent", title: "font-heading text-xl font-medium sm:text-2xl" },
  {
    cell: "md:col-span-2 xl:col-span-12",
    surface:
      "bg-[#111214] bg-[radial-gradient(ellipse_55%_120%_at_100%_100%,rgba(255,255,255,0.06),transparent_70%)] xl:flex-row xl:items-end xl:justify-between xl:gap-16",
    title:
      "font-heading text-xl font-medium sm:text-2xl xl:font-fancy xl:text-4xl xl:font-light xl:leading-[1.1] xl:tracking-tight",
  },
]

export function WhatYouGet() {
  return (
    <section id="what-you-get" className="section-y bg-[#050505]">
      <div className="container-page">
        <SectionHeading title="Real work, real guidance, and proof of both." />

        <ul className="mt-12 grid gap-3 sm:mt-16 md:grid-cols-2 xl:grid-cols-12 xl:gap-4">
          {offerings.map((item, i) => {
            const style = cells[i]
            return (
              <li key={item.title} className={cn("flex", style.cell)}>
                <Reveal
                  y={16}
                  delay={i * 0.05}
                  className={cn(
                    "flex w-full flex-col gap-4 rounded-2xl border border-white/[0.08] p-7 sm:p-9",
                    style.surface,
                  )}
                >
                  <h3 className={cn("text-headings text-balance", style.title)}>{item.title}</h3>
                  <p className="max-w-md text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-base">
                    {item.body}
                  </p>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
