import Link from "next/link"
import { Reveal } from "@/components/ui/reveal"
import { programs } from "@/data/programs"

const programTitles = new Intl.ListFormat("en", { style: "long", type: "conjunction" }).format(
  Object.values(programs).map((p) => p.title),
)

export function ProgramsBridge() {
  return (
    <section className="relative overflow-hidden border-t border-white/[0.06] bg-[#08080A]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-80 bg-[radial-gradient(ellipse_50%_60%_at_50%_100%,rgba(255,255,255,0.05),transparent_70%)]"
      />
      <div className="container-page section-y relative">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2 className="font-fancy text-4xl font-light leading-[1.1] tracking-tight text-headings text-balance sm:text-5xl lg:text-6xl">
            <span className="block">Not ready yet?</span> Start with a program.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            Live online, mentor-led programs: {programTitles}.
          </p>
          <div className="mt-10 flex justify-center">
            <Link href="/cohorts" className="btn-primary min-h-12 w-full sm:w-auto">
              Explore programs
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
