import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ButtonLink, ClosingCta, PageHero, Placeholder, RuleList, SplitSection, Steps } from "@/components/site/ui"
import { serviceCategories } from "@/data/services"
import { SITE_URL } from "@/lib/site"
import { pageMetadata } from "@/lib/metadata"
import { JsonLd } from "@/lib/jsonld"

const description =
  "Web and mobile apps, AI features, cloud and IT, from first idea to long-term support. Software built by engineers who also teach."

export const metadata = pageMetadata({ title: "For businesses", description, path: "/services" })

const provider = { "@type": "Organization", name: "LumoraSpace", url: SITE_URL }

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "LumoraSpace services",
  description,
  url: `${SITE_URL}/services`,
  numberOfItems: serviceCategories.length,
  itemListElement: serviceCategories.map((category, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      "@id": `${SITE_URL}/services#${category.id}`,
      url: `${SITE_URL}/services#${category.id}`,
      name: category.title,
      serviceType: category.title,
      description: category.summary,
      provider,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: category.title,
        itemListElement: category.services.map((service) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: service, provider },
        })),
      },
    },
  })),
}

const SERVICES = [
  {
    title: "Custom development",
    body: "Software, web apps, full-stack development, websites and CMS, portals and dashboards, eCommerce.",
  },
  {
    title: "AI and data science",
    body: "AI integration and strategy, AI agents, natural language processing, data analytics.",
  },
  { title: "Mobile apps", body: "Native and cross-platform apps for iOS and Android." },
  { title: "Cloud and digital engineering", body: "Cloud infrastructure, digital engineering, research and development." },
  { title: "Zero to one", body: "MVP development and rapid prototyping, from idea to something users can try." },
  {
    title: "IT solutions",
    body: "Digital transformation, staff augmentation, technology consulting, maintenance and support.",
  },
  { title: "No-code development", body: "WordPress, Webflow, Wix, Shopify, Magento, Bubble, Framer and more." },
  { title: "Design", body: "UI/UX and product design, branding and visual identity, graphic design." },
  { title: "Marketing", body: "Inbound marketing, SEO, social media and paid ads." },
]

const PROCESS = [
  { title: "Conversation", body: "You tell us the problem, the users and the deadline." },
  { title: "Written scope", body: "A clear scope, timeline and estimate before any work starts." },
  { title: "Build", body: "Our engineers build it, with regular check-ins with you." },
  { title: "Launch and support", body: "We ship it and stay on for maintenance if you need us." },
]

const HIRING = [
  { title: "Hire from our cohorts", body: "Candidates whose projects you can see before you interview them." },
  { title: "Talent acquisition partner", body: "We source and screen candidates for your open roles." },
]

const PROJECT_HREF = "/contact?topic=project"

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-ls-ink">
        <JsonLd data={jsonLd} />
        <PageHero
          crumbs={[{ label: "Home", href: "/" }, { label: "For businesses" }]}
          eyebrow="For businesses"
          title="Software for your business, built by engineers who also teach."
          lead="Web and mobile apps, AI features, cloud and IT, from first idea to long-term support."
          actions={
            <>
              <ButtonLink href={PROJECT_HREF}>Start a project</ButtonLink>
              <ButtonLink href="/work" variant="outline">
                See our work
              </ButtonLink>
            </>
          }
        />

        <SplitSection eyebrow="Services" title="What we build" tone="glow">
          <RuleList items={SERVICES} />
        </SplitSection>

        <SplitSection eyebrow="Process" title="How we work" tone="ink2">
          <Steps steps={PROCESS} />
          <p className="m-0 text-[15px] text-ls-faint">[Draft: confirm this process with the team before publishing.]</p>
        </SplitSection>

        <SplitSection id="hiring" eyebrow="Hiring" title="Hiring support">
          <RuleList items={HIRING} />
        </SplitSection>

        <SplitSection eyebrow="Proof" title="Selected work" tone="ink2">
          <Placeholder label="Screenshot placeholder: client project" caption="[Client project screenshot]" ratio="16 / 8" />
          <p className="m-0">
            <strong className="font-semibold text-ls-fg">[Client project]</strong> · [What the client needed, what we built,
            and the result.]
          </p>
        </SplitSection>

        <ClosingCta
          title="Tell us what you’re building."
          body="One conversation is enough to know if we are the right team. A person reads every message."
          action={<ButtonLink href={PROJECT_HREF}>Start a project</ButtonLink>}
        />
      </main>
      <Footer />
    </>
  )
}
