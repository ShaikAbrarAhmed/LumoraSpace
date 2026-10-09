import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { serviceCategories } from "@/data/services"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
// Shared with the /services page, so every project enquiry lands with the same subject line.
import { PROJECT_MAILTO } from "@/components/services/shared"

export function ServicesPreviewSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="section-y border-t border-white/[0.06] bg-[#050505]"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            eyebrow="For businesses"
            title={<span id="services-title">Software, AI and cloud, built end to end.</span>}
            lead="LumoraSpace plans, builds and supports technology products for businesses."
          />
        </Reveal>

        <ul aria-label="Service categories" className="mt-12 flex max-w-5xl flex-wrap gap-2.5 sm:mt-16 sm:gap-4">
          {serviceCategories.map((category, i) => (
            <li key={category.id}>
              <Reveal y={12} delay={i * 0.04}>
                <Link
                  href={`/services#${category.id}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-white/[0.12] px-4 py-2 font-fancy text-lg font-light text-headings transition-colors duration-300 hover:border-white/40 hover:bg-white/[0.04] sm:px-7 sm:py-3 sm:text-2xl lg:text-[1.75rem]"
                >
                  {category.title}
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-12 flex flex-col items-stretch gap-3 sm:mt-14 sm:flex-row sm:items-center sm:gap-6">
          <a href={PROJECT_MAILTO} className="btn-primary">
            Start a project
          </a>
          <Link
            href="/services"
            className="group inline-flex min-h-11 items-center justify-center gap-1.5 font-heading text-sm font-medium text-headings/80 transition-colors duration-300 hover:text-headings"
          >
            Explore services
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
