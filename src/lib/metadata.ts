import type { Metadata } from "next"

/**
 * The file-based src/app/opengraph-image.jpg and twitter-image.jpg only attach to the root
 * segment. A page that sets its own `openGraph` or `twitter` object replaces the root one
 * entirely (shallow merge), so every inner page names the share image explicitly here.
 * Paths stay relative: `metadataBase` in the root layout turns them into absolute URLs.
 */
const SHARE_IMAGE = {
  width: 1200,
  height: 630,
  type: "image/jpeg",
  // Same text as src/app/opengraph-image.alt.txt.
  alt: "LumoraSpace logo, a silver four-point star on black",
}

type PageMetadataInput = {
  /** Plain page title. The root layout template adds " | LumoraSpace" to the <title>. */
  title: string
  /** Plain text, at most 155 characters, no em or en dashes. */
  description: string
  /**
   * Route path starting with "/", used for the canonical URL and og:url. Every routed page passes
   * it; only not-found.tsx, which has no URL of its own, leaves it out.
   */
  path?: string
  /** Title for share cards. Defaults to "<title> | LumoraSpace", matching the <title>. */
  shareTitle?: string
  /** Sets robots to { index: false, follow: false }, e.g. for sign-in and form pages. */
  noindex?: boolean
}

/** Page metadata with canonical, Open Graph and Twitter tags, including the share images. */
export function pageMetadata({ title, description, path, shareTitle, noindex }: PageMetadataInput): Metadata {
  const socialTitle = shareTitle ?? `${title} | LumoraSpace`

  return {
    title,
    description,
    ...(path ? { alternates: { canonical: path } } : {}),
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: "website",
      siteName: "LumoraSpace",
      locale: "en_US",
      ...(path ? { url: path } : {}),
      title: socialTitle,
      description,
      images: [{ url: "/opengraph-image.jpg", ...SHARE_IMAGE }],
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [{ url: "/twitter-image.jpg", ...SHARE_IMAGE }],
    },
  }
}
