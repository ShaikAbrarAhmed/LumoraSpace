import { Reveal } from "@/components/ui/reveal"

const Term = ({ children }: { children: string }) => <span className="text-headings">{children}</span>

export function WhyDifferent() {
  return (
    <section id="why-its-different" className="section-y border-t border-white/[0.06] bg-[#050505]">
      <div className="container-page">
        <Reveal>
          <h2 className="font-fancy text-5xl font-light leading-[1.05] tracking-tight text-headings text-balance sm:text-7xl lg:text-8xl">
            No ghost listings.
          </h2>
          <p className="mt-8 max-w-5xl font-fancy text-[1.75rem] font-light leading-[1.25] tracking-tight text-muted-foreground text-pretty sm:mt-10 sm:text-4xl lg:text-5xl">
            Every internship comes from a trusted company, and every role states its <Term>start date</Term>,{" "}
            <Term>weekly hours</Term>, <Term>compensation</Term> and <Term>mentorship</Term> before you apply.
          </p>
        </Reveal>

        <Reveal className="mt-16 max-w-2xl border-t border-white/[0.08] pt-10 sm:mt-24">
          <h3 className="font-heading text-xl font-medium text-headings sm:text-2xl">Proof of work over resume filters.</h3>
          <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground text-pretty sm:text-lg">
            Your projects, code reviews and mentor feedback show what you can actually do. That says more than a keyword
            filter on a resume.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
