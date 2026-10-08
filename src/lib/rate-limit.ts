import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

/** Every request whose address cannot be trusted shares this one bucket. */
const UNKNOWN_CLIENT = "unknown";

// Number of reverse proxies in front of the app that append to X-Forwarded-For (see .env.example).
const trustedProxyHops = Math.max(0, Number.parseInt(process.env.TRUSTED_PROXY_HOPS ?? "0", 10) || 0);

/**
 * Client address for rate limiting. Headers a client can set itself are never trusted:
 * reading the left-most X-Forwarded-For entry would let anyone pick a fresh key per request.
 * - On Vercel the platform sets x-real-ip and overwrites x-forwarded-for.
 * - Elsewhere, x-forwarded-for is read only when TRUSTED_PROXY_HOPS says how many proxies
 *   appended to it, and then only the entry the outermost trusted proxy added.
 */
export function getClientIp(req: Request): string {
  // On Cloudflare Workers (CF_WORKERS is set in wrangler.jsonc) every request passes Cloudflare's
  // edge, which always sets cf-connecting-ip to the real client address.
  if (process.env.CF_WORKERS) {
    return req.headers.get("cf-connecting-ip")?.trim() || UNKNOWN_CLIENT;
  }

  if (process.env.VERCEL) {
    const realIp = req.headers.get("x-real-ip")?.trim();
    if (realIp) return realIp;
    const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    return forwarded || UNKNOWN_CLIENT;
  }

  if (trustedProxyHops > 0) {
    const ips = (req.headers.get("x-forwarded-for") ?? "")
      .split(",")
      .map((ip) => ip.trim())
      .filter(Boolean);
    const ip = ips[ips.length - trustedProxyHops];
    if (ip) return ip;
  }

  return UNKNOWN_CLIENT;
}

// In-Memory store fallback for local development or when Redis is down
interface MemoryRecord {
  count: number;
  expiresAt: number;
}

const memoryStore = new Map<string, MemoryRecord>();

function checkMemoryStore(key: string, limit: number, ttlMs: number): { count: number; allowed: boolean } {
  const now = Date.now();

  // Lazy cleanup of expired entries (5% chance on check to run full cleanup)
  if (Math.random() < 0.05) {
    for (const [k, record] of memoryStore.entries()) {
      if (record.expiresAt < now) {
        memoryStore.delete(k);
      }
    }
  }

  const record = memoryStore.get(key);
  if (record && record.expiresAt > now) {
    record.count += 1;
    return {
      count: record.count,
      allowed: record.count <= limit,
    };
  } else {
    memoryStore.set(key, {
      count: 1,
      expiresAt: now + ttlMs,
    });
    return {
      count: 1,
      allowed: true,
    };
  }
}

// Initialize Upstash Redis if connection environment variables are set
const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
const redis = url && token ? new Redis({ url, token }) : null;

// Warned on the first check, not at module load, so `next build` workers stay quiet.
let warnedMissingRedis = false;

function warnMissingRedisOnce() {
  if (redis || warnedMissingRedis) return;
  warnedMissingRedis = true;
  const message =
    "UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set. Rate limits fall back to per-instance memory.";
  // In production every serverless instance would count separately, so the limits are not really enforced.
  if (process.env.NODE_ENV === "production") console.error(message);
  else console.warn(message);
}

/** Fixed one-minute window limiter keyed by route and client address (Upstash Redis, memory fallback). */
export class RateLimiter {
  private limit: number;
  private route: string;

  constructor(options: { limit: number; route: string }) {
    this.limit = options.limit;
    this.route = options.route;
  }

  /**
   * Counts one request. `identifier` replaces the client address as the bucket key, e.g. a
   * lower-cased email so a login limit also holds when the attacker rotates addresses.
   */
  async check(req: Request, identifier?: string): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
    response?: NextResponse;
  }> {
    warnMissingRedisOnce();
    const ip = identifier ?? getClientIp(req);
    const now = Date.now();
    const currentWindow = Math.floor(now / 60000); // 1-minute window
    const key = `ratelimit:${this.route}:${ip}:${currentWindow}`;
    const ttlMs = 60000;

    let currentCount = 0;
    let allowed = true;

    if (redis) {
      try {
        const p = redis.pipeline();
        p.incr(key);
        p.expire(key, 60);
        const results = await p.exec();
        currentCount = results[0] as number;
        allowed = currentCount <= this.limit;
      } catch (err) {
        console.error("Upstash Redis rate-limit execution error, falling back to local memory store:", err);
        const memResult = checkMemoryStore(key, this.limit, ttlMs);
        currentCount = memResult.count;
        allowed = memResult.allowed;
      }
    } else {
      const memResult = checkMemoryStore(key, this.limit, ttlMs);
      currentCount = memResult.count;
      allowed = memResult.allowed;
    }

    const remaining = Math.max(0, this.limit - currentCount);
    const reset = Math.floor(((currentWindow + 1) * 60000) / 1000); // Reset time in seconds (epoch)

    if (!allowed) {
      // Log exceeded limits: Route, IP Address, Timestamp
      console.warn(
        // A custom identifier may be an email address, so only client addresses are logged.
        `[RATE LIMIT EXCEEDED] Route: ${this.route}, IP: ${identifier ? "(per-account limit)" : ip}, Timestamp: ${new Date(now).toISOString()}`
      );

      const headers = {
        "X-RateLimit-Limit": this.limit.toString(),
        "X-RateLimit-Remaining": remaining.toString(),
        "X-RateLimit-Reset": reset.toString(),
      };

      const response = NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers }
      );

      return {
        success: false,
        limit: this.limit,
        remaining,
        reset,
        response,
      };
    }

    return {
      success: true,
      limit: this.limit,
      remaining,
      reset,
    };
  }
}
