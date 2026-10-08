import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/signin", "/create-account", "/cohorts/join", "/dashboard", "/app"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
