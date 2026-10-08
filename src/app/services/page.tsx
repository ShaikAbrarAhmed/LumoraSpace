import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { SectionHeading } from "@/components/ui/section-heading"
import { ServicesHero } from "@/components/services/ServicesHero"
import { ServicesCatalog } from "@/components/services/ServicesCatalog"
import { ServicesProcess } from "@/components/services/ServicesProcess"
import { ServicesEngagement } from "@/components/services/ServicesEngagement"
import { ServicesCTA } from "@/components/services/ServicesCTA"
import { serviceCategories } from "@/data/services"
import { SITE_URL } from "@/lib/site"
import { pageMetadata } from "@/lib/metadata"
import { JsonLd } from "@/lib/jsonld"

const description =
  "AI and data, custom software, mobile apps, cloud, no-code, design, marketing and MVPs. LumoraSpace plans, builds and supports products for businesses."

export const metadata = pageMetadata({ title: "Services", description, path: "/services" })

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

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-background">
        <JsonLd data={jsonLd} />
        <ServicesHero />

        <section aria-labelledby="capabilities-title" className="section-y bg-background">
          <div className="container-page">
            <div id="capabilities" className="scroll-mt-4">
              <SectionHeading
                title={<span id="capabilities-title">What we do</span>}
                lead="From a first prototype to long-term support. Bring us one piece of the work or the whole product."
              />
            </div>
            <div className="mt-14 sm:mt-20">
              <ServicesCatalog />
            </div>
          </div>
        </section>

        <ServicesProcess />
        <ServicesEngagement />
        <ServicesCTA />
      </main>
      <Footer />
    </>
  )
}
