import type { NextConfig } from "next";

// Google Tag Manager (GTM-KCNSB85Z) and the GA4 tags it loads need these hosts.
const GTM = "https://www.googletagmanager.com https://*.googletagmanager.com";
const GA = "https://*.google-analytics.com https://*.analytics.google.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  // 'unsafe-eval' stays: GTM custom JavaScript variables rely on it.
  `script-src 'self' 'unsafe-eval' 'unsafe-inline' ${GTM}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob: https://lh3.googleusercontent.com https://lh5.googleusercontent.com https://*.google-analytics.com https://*.googletagmanager.com`,
  "font-src 'self' data:",
  `connect-src 'self' ${GA} https://*.googletagmanager.com`,
  "frame-src 'self' https://www.googletagmanager.com",
  "media-src 'self' data: blob:",
  "object-src 'none'",
  "base-uri 'self'",
  // form-action does not fall back to default-src. All forms here post to this origin.
  "form-action 'self'",
  // Same rule as X-Frame-Options below, for browsers that only honour the CSP directive.
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // The bare domain serves the same Worker; keep www as the one canonical host.
      // "/" gets its own rule: OpenNext leaves ":path*" unsubstituted when the path is empty.
      {
        source: "/",
        has: [{ type: "host", value: "^lumoraspace\\.in$" }],
        destination: "https://www.lumoraspace.in/",
        permanent: true,
      },
      {
        source: "/:path*",
        // Anchored: the value is a regex, and an unanchored one also matches www.lumoraspace.in (a loop).
        has: [{ type: "host", value: "^lumoraspace\\.in$" }],
        destination: "https://www.lumoraspace.in/:path*",
        permanent: true,
      },
      {
        source: "/courses/web-builder",
        destination: "/programs/web-development-with-genai",
        permanent: true,
      },
      // Planned programs without pages yet: send visitors to the live list.
      {
        source: "/programs/python-builder",
        destination: "/cohorts",
        permanent: false,
      },
      {
        source: "/programs/ai-builder",
        destination: "/cohorts",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";
initOpenNextCloudflareForDev();
