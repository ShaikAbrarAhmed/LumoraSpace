import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Reveal } from "@/components/ui/reveal"
import { SectionHeading } from "@/components/ui/section-heading"
import { CHANNELS } from "@/components/community/channels"

export function CommunityPreviewSection() {
  return (
    <section
      id="community"
      aria-labelledby="community-title"
      className="section-y border-t border-white/[0.06] bg-[#050505]"
    >
      <div className="container-page">
        <Reveal>
          <SectionHeading
            title={<span id="community-title">Where the community meets.</span>}
            lead="Ask questions, share your progress and find people to build with."
          />
        </Reveal>

        <ul className="mt-12 border-t border-white/[0.08] sm:mt-16">
          {CHANNELS.map((channel, i) => (
            <li key={channel.id} className="border-b border-white/[0.08]">
              <Reveal delay={i * 0.06} y={16}>
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 py-7 sm:py-9 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)_auto] md:gap-x-10"
                >
                  <span className="font-fancy text-4xl font-light leading-[1.1] text-headings transition-transform duration-300 group-hover:translate-x-1 sm:text-5xl lg:text-6xl">
                    {channel.name}
                  </span>
                  <span className="col-start-1 row-start-2 md:col-start-2 md:row-start-1">
                    <span className="block text-[15px] text-headings/85 sm:text-base">{channel.summary}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">{channel.handle}</span>
                  </span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="col-start-2 row-span-2 row-start-1 size-6 text-muted-foreground transition-[color,transform] duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-headings md:col-start-3 md:row-span-1"
                  />
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal className="mt-12 flex flex-col items-stretch sm:mt-14 sm:flex-row">
          <Link href="/community" className="btn-secondary">
            Explore the community
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
