import Image from "next/image"
import Link from "next/link"
import { mentors } from "@/data/people"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { photoFrame } from "@/components/people/PersonParts"

// Snap-scroll card widths below lg, four columns from lg.
const CARD_SIZES =
  "(min-width: 1280px) 280px, (min-width: 1024px) 22vw, (min-width: 768px) 31vw, (min-width: 640px) 42vw, 68vw"

export function MentorsPreviewSection() {
  return (
    <section
      id="mentors"
      aria-labelledby="mentors-title"
      className="section-y border-t border-white/[0.06] bg-[#08080A]"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            title={<span id="mentors-title">Mentors who work in the field.</span>}
            lead="Practitioners in product, software, marketing and data science who guide LumoraSpace learners."
          />
        </Reveal>

        <Reveal className="mt-12 sm:mt-16">
          <ul
            data-allow-overflow
            className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 [scrollbar-width:none] sm:-mx-8 sm:scroll-px-8 sm:gap-6 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {mentors.map((m) => (
              <li key={m.slug} className="w-[68%] shrink-0 snap-start sm:w-[42%] md:w-[31%] lg:w-auto">
                <Link href={`/mentors#${m.slug}`} className="group block rounded-2xl">
                  <div className={`${photoFrame} transition-colors duration-300 group-hover:border-white/20`}>
                    <Image
                      src={m.image}
                      alt=""
                      fill
                      sizes={CARD_SIZES}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                      style={{ objectPosition: m.imagePosition }}
                    />
                  </div>
                  <h3 className="mt-5 font-heading text-lg font-medium tracking-tight text-headings">{m.name}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                    {m.role} at {m.company}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="mt-12 flex flex-col items-stretch sm:mt-14 sm:flex-row">
          <Link href="/mentors" className="btn-secondary">
            Meet the mentors
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
