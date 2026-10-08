# LumoraSpace

Source for [www.lumoraspace.in](https://www.lumoraspace.in): the marketing site, program pages,
accounts (NextAuth with Google and email + password) and the program application form.

Next.js 16 (App Router), React 19, Tailwind CSS 4. Next.js 16 differs from older versions: read
the guides in `node_modules/next/dist/docs/` before changing framework code.

## Setup

1. Node.js 20 or newer.
2. `npm install`
3. Copy `.env.example` to `.env.local` and fill it in:
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`: sign-in.
   - `RESEND_API_KEY`, `ADMIN_EMAIL`: notification emails for new accounts and applications.
   - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`: Firestore (accounts, applications).
   - `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`: shared rate-limit counters. Without them
     each server instance counts in memory, which does not hold across serverless instances.
   - `TRUSTED_PROXY_HOPS`: only when self-hosting behind a reverse proxy (see the comment in `.env.example`).

   Never commit a real `.env*` file; `.gitignore` only lets `.env.example` through.

## Scripts

- `npm run dev`: development server on http://localhost:3000
- `npm run build`, then `npm run start`: production build and server
- `npm run lint`, `npx tsc --noEmit`: lint and type check

## Deploying

The site needs a Node.js host: NextAuth and the `/api/signup` and `/api/submit-form` routes run
on the server, so a static export (for example GitHub Pages) cannot serve it. The live site
responds from Vercel. The public URL used for canonicals, the sitemap and JSON-LD is fixed in
`src/lib/site.ts` (`SITE_URL`), not read from the environment.
