const contactHits = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 5;

export function checkContactRateLimit(ip: string): { ok: true } | { ok: false; message: string } {
  const key = ip || "unknown";
  const now = Date.now();
  const entry = contactHits.get(key);

  if (!entry || now > entry.resetAt) {
    contactHits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }

  if (entry.count >= MAX_HITS) {
    return { ok: false, message: "Too many contact attempts. Please try again later." };
  }

  entry.count += 1;
  return { ok: true };
}
