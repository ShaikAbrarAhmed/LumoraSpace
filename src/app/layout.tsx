import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AuthSessionProvider from "@/components/auth/AuthSessionProvider";
import { SkipLink } from "@/components/Navbar";
import { JsonLd } from "@/lib/jsonld";
import { CONTACT, SITE_URL, SOCIAL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-fancy",
  weight: ["300", "400", "500", "600", "700"],
  // The italic display lines (hero, our story, programs...) need the real italic face, not a synthetic slant.
  style: ["normal", "italic"],
});

const GTM_ID = "GTM-KCNSB85Z";

const description =
  "LumoraSpace is an IT solutions company. Today we run mentor-led programs, hackathons and internships that take students from confused to confident.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "LumoraSpace | From Confused to Confident",
    template: "%s | LumoraSpace",
  },
  description,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "LumoraSpace",
    title: "LumoraSpace | From Confused to Confident",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "LumoraSpace | From Confused to Confident",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "LumoraSpace",
  url: SITE_URL,
  logo: `${SITE_URL}/logo4.png`,
  description:
    "IT solutions company for AI, data, cloud and web development, currently focused on mentor-led programs, hackathons and internships for students.",
  sameAs: [SOCIAL.instagram, SOCIAL.whatsapp, SOCIAL.discord],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: CONTACT.hello,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${cormorantGaramond.variable} min-h-screen bg-background font-sans text-foreground antialiased selection:bg-primary/20 selection:text-foreground`}
      >
        <SkipLink />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <JsonLd data={organizationSchema} />
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
