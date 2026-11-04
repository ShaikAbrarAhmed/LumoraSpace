import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ButtonLink, Eyebrow, SmartLink, Wave } from "@/components/site/ui"
import { pageMetadata } from "@/lib/metadata"
import { CONTACT } from "@/lib/site"

// No path: a 404 has no canonical URL of its own.
export const metadata = pageMetadata({
  title: "Page not found",
  description: "This page does not exist on LumoraSpace.",
  noindex: true,
})

const DESTINATIONS = [
  { label: "Programs", note: "MERN Stack with GenAI and Data Analytics", href: "/cohorts" },
  { label: "For businesses", note: "Software, AI and hiring support", href: "/services" },
  { label: "For colleges", note: "Hackathons, programs and events on campus", href: "/colleges" },
  { label: "Our work", note: "LUMINIX’26 and the platforms we built", href: "/work" },
  { label: "Contact", note: CONTACT.hello, href: "/contact" },
]

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-ls-ink">
        <section className="relative overflow-hidden">
          <div aria-hidden className="absolute inset-x-0 bottom-0 h-60 overflow-hidden opacity-90">
            <Wave animate className="object-[center_25%]" />
          </div>
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-60 bg-[linear-gradient(180deg,#0A0A0A_0%,rgba(10,10,10,0.4)_55%,rgba(10,10,10,0)_100%)]"
          />
          <div className="ls-container relative flex flex-wrap gap-x-16 gap-y-12 pb-[220px] pt-[clamp(56px,8vw,104px)]">
            <div className="flex flex-[1.2_1_420px] flex-col gap-[22px]">
              <Eyebrow>Error 404</Eyebrow>
              <h1 className="m-0 max-w-[16ch] text-[clamp(40px,5.4vw,68px)] font-semibold leading-[1.02] tracking-[-0.035em] text-ls-fg">
                This page doesn’t exist.
              </h1>
              <p className="m-0 max-w-[44ch] text-[19px] text-ls-lead">
                The link may be out of date, or the page has moved. Pick up from one of these instead.
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <ButtonLink href="/">Back to home</ButtonLink>
              </div>
            </div>

            <nav aria-label="Popular pages" className="flex-[1_1_360px] self-end">
              <ul className="m-0 list-none border-t-2 border-ls-amber p-0">
                {DESTINATIONS.map((item) => (
                  <li key={item.href} className="border-b border-white/10">
                    <SmartLink
                      href={item.href}
                      className="group flex min-h-14 items-center justify-between gap-6 py-3 no-underline"
                    >
                      <span className="min-w-0">
                        <span className="block text-lg font-medium text-ls-fg group-hover:text-white">{item.label}</span>
                        <span className="block break-words text-[15px]">{item.note}</span>
                      </span>
                      <svg
                        aria-hidden
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="flex-none text-ls-faint transition-transform duration-200 group-hover:translate-x-1 group-hover:text-ls-fg"
                      >
                        <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
