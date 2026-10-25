// Per-instance sliding-window limiter. On multi-instance hosting, swap for a shared store (e.g. Upstash Redis).
// `cost` lets one expensive request count as several (e.g. deep research counts as 3).
const hits = new Map<string, number[]>();
export function rateLimit(key: string, limit: number, windowMs: number, cost = 1) {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < windowMs);
  if (list.length + cost > limit) { hits.set(key, list); return false; }
  for (let i = 0; i < cost; i++) list.push(now);
  hits.set(key, list);
  if (hits.size > 50_000) hits.clear();
  return true;
}
export const clientIp = (h: Headers) => (h.get('x-forwarded-for') || '').split(',')[0].trim() || h.get('x-real-ip') || 'anon';
