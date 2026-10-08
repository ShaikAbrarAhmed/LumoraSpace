import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextResponse } from "next/server";
import { findOneByField, firestoreConfigured, updateDoc } from "@/lib/firestore";
import * as crypto from "crypto";
import bcrypt from "bcryptjs";
import { RateLimiter } from "@/lib/rate-limit";

const loginLimiter = new RateLimiter({
  limit: 5,
  route: "/api/auth/signin",
});

// Say it once per server process, not on every sign-in attempt.
let warnedAboutTestFallback = false;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Accounts are stored with a lowercased email (see SignupSchema).
        const typedEmail = credentials.email.trim();
        const email = typedEmail.toLowerCase();

        try {
          if (!firestoreConfigured()) {
            // Local development without Firebase credentials: allow a fixed test account only.
            if (process.env.NODE_ENV !== "production") {
              if (!warnedAboutTestFallback) {
                warnedAboutTestFallback = true;
                console.warn("Firestore db not available; using NextAuth local test fallback.");
              }
              if (email === "test@example.com" && credentials.password === "password") {
                return { id: "test-user", name: "Test User", email: "test@example.com" };
              }
            } else {
              console.error("Credentials sign-in unavailable: Firestore is not configured.");
            }
            return null;
          }

          let userDoc = await findOneByField("users", "email", email);
          if (!userDoc && typedEmail !== email) {
            // Older accounts may have been saved with the email exactly as it was typed.
            userDoc = await findOneByField("users", "email", typedEmail);
          }
          if (!userDoc) return null;

          const user = userDoc.data as { name?: string; email?: string; password: string };

          // 1. Try to verify password using bcrypt
          let isMatch = await bcrypt.compare(credentials.password, user.password);

          if (!isMatch) {
            // 2. Fallback check: try SHA-256 for legacy users
            const sha256Hash = crypto.createHash("sha256").update(credentials.password).digest("hex");
            if (user.password === sha256Hash) {
              isMatch = true;

              // 3. Lazy upgrade legacy hash to bcrypt in the background
              try {
                const newBcryptHash = await bcrypt.hash(credentials.password, 12);
                await updateDoc("users", userDoc.id, { password: newBcryptHash });
                // Log the document id, never the email address.
                console.log(`Migrated legacy password hash to bcrypt for user ${userDoc.id}.`);
              } catch (upgradeError) {
                console.error("Failed to upgrade legacy password:", upgradeError);
              }
            }
          }

          if (isMatch) {
            return {
              id: userDoc.id,
              name: user.name,
              email: user.email,
            };
          }
        } catch (error) {
          console.error("Error in NextAuth credentials authorize:", error);
        }
        return null;
      }
    })
  ],
  // Send sign-in prompts and OAuth errors to our own page instead of NextAuth's default screens.
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? `__Secure-next-auth.session-token` : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

// next-auth/react's signIn() reads `url` from the JSON body and takes the error code from it,
// so answer in that shape and the sign-in page can show a "too many attempts" message.
function rateLimited(req: Request, headers: Headers) {
  return NextResponse.json(
    { error: "Too many requests. Please try again later.", url: new URL("/signin?error=RateLimited", req.url).toString() },
    { status: 429, headers }
  );
}

/**
 * Per-account bucket key for a credentials sign-in, so the limit also holds when an attacker
 * rotates addresses. Reads a clone (NextAuth still reads the original body) and hashes the
 * email, so the address itself never reaches the rate-limit store or the logs.
 */
async function accountKey(req: Request): Promise<string | null> {
  try {
    const email = (await req.clone().formData()).get("email");
    if (typeof email !== "string" || !email.trim()) return null;
    const hash = crypto.createHash("sha256").update(email.trim().toLowerCase()).digest("hex");
    return `email:${hash.slice(0, 32)}`;
  } catch {
    return null;
  }
}

async function authHandler(req: Request, context: { params: Promise<{ nextauth: string[] }> }) {
  if (req.method === "POST") {
    const url = new URL(req.url);
    const isCredentials = url.pathname.includes("/callback/credentials");
    if (url.pathname.includes("/signin") || isCredentials) {
      const limitResult = await loginLimiter.check(req);
      if (!limitResult.success && limitResult.response) {
        return rateLimited(req, limitResult.response.headers);
      }
    }
    if (isCredentials) {
      const key = await accountKey(req);
      if (key) {
        const accountResult = await loginLimiter.check(req, key);
        if (!accountResult.success && accountResult.response) {
          return rateLimited(req, accountResult.response.headers);
        }
      }
    }
  }
  return handler(req, context);
}

export { authHandler as GET, authHandler as POST };
