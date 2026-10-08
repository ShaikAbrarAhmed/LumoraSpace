import { CONTACT } from "@/lib/site"
import { Reveal } from "@/components/ui/reveal"
import { PROJECT_MAILTO } from "./shared"

export function ServicesCTA() {
  return (
    <section className="section-y border-t border-white/[0.06] bg-[#08080A]">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0B0B0C] px-6 py-16 text-center sm:px-12 sm:py-24">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_0%,rgba(217,217,217,0.08),transparent_70%)]"
            />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-fancy text-4xl font-light leading-[1.1] tracking-tight text-headings text-balance sm:text-5xl lg:text-6xl">
                Have a project in mind?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-lg">
                Write to{" "}
                <a
                  href={PROJECT_MAILTO}
                  className="text-headings underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
                >
                  {CONTACT.hello}
                </a>{" "}
                with what you are building, where it stands today and when you need it. A few lines are enough.
              </p>
              <a href={PROJECT_MAILTO} className="btn-primary mt-10">
                Start a project
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
