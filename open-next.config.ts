import { defineCloudflareConfig } from "@opennextjs/cloudflare"
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache"

// Every page is built ahead of time and nothing revalidates, so the read-only static-assets
// cache is enough (no R2 bucket). ponytail: switch to the R2 cache if a page ever uses revalidate.
const config = defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
})

export default {
  ...config,
  // Webpack for the Worker build: Turbopack's hashed .next/node_modules links make OpenNext create
  // symlinks, which Windows refuses without admin rights or Developer Mode. `next dev` stays on Turbopack.
  buildCommand: "npx next build --webpack",
}
