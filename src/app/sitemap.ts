import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { programs } from "@/data/programs";

const ROUTES = [
  "/",
  "/cohorts",
  "/hackathons",
  "/opportunities",
  "/services",
  "/community",
  "/mentors",
  "/features",
  "/our-story",
  "/privacy",
  "/terms",
];

const PRIORITY: Record<string, number> = {
  "/": 1,
  "/cohorts": 0.9,
  "/hackathons": 0.8,
  "/opportunities": 0.8,
  "/services": 0.8,
  "/privacy": 0.3,
  "/terms": 0.3,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ROUTES.map((route) => ({
    url: route === "/" ? SITE_URL : `${SITE_URL}${route}`,
    priority: PRIORITY[route] ?? 0.6,
  }));

  const programPages = Object.keys(programs).map((slug) => ({
    url: `${SITE_URL}/programs/${slug}`,
    priority: 0.8,
  }));

  return [...pages, ...programPages];
}
