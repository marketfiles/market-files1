export const runtime = 'nodejs';
export const maxDuration = 20;

/**
 * Key economic numbers for a country from the World Bank (free, no key).
 * GET /api/country?iso=JP → { stats: { gdp: { value, year }, ... }, source }
 * Most recent non-empty value per indicator; cached 24 hours.
 */
const IND: Record<string, string> = {
  gdp: 'NY.GDP.MKTP.CD',
  growth: 'NY.GDP.MKTP.KD.ZG',
  gdppc: 'NY.GDP.PCAP.CD',
  inflation: 'FP.CPI.TOTL.ZG',
  unemp: 'SL.UEM.TOTL.ZS',
  pop: 'SP.POP.TOTL',
  exports: 'NE.EXP.GNFS.ZS',
  mcap: 'CM.MKT.LCAP.GD.ZS',
};
type Stat = { value: number; year: string };
const cache = new Map<string, { at: number; body: unknown }>();

async function one(iso: string, id: string): Promise<Stat | null> {
  try {
    const r = await fetch(`https://api.worldbank.org/v2/country/${iso}/indicator/${id}?format=json&mrnev=1`, { signal: AbortSignal.timeout(8000) });
    if (!r.ok) return null;
    const j = await r.json();
    const row = Array.isArray(j) && Array.isArray(j[1]) ? j[1][0] : null;
    return row && row.value != null ? { value: Number(row.value), year: String(row.date) } : null;
  } catch { return null; }
}

export async function GET(req: Request) {
  const iso = (new URL(req.url).searchParams.get('iso') || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(iso)) return Response.json({ error: 'Bad country code' }, { status: 400 });
  const hit = cache.get(iso);
  if (hit && Date.now() - hit.at < 86_400_000) return Response.json(hit.body);
  const keys = Object.keys(IND);
  const vals = await Promise.all(keys.map((k) => one(iso, IND[k])));
  const stats: Record<string, Stat> = {};
  keys.forEach((k, i) => { if (vals[i]) stats[k] = vals[i]!; });
  const body = { iso, stats, source: 'World Bank, World Development Indicators' };
  if (Object.keys(stats).length) cache.set(iso, { at: Date.now(), body });
  return Response.json(body, { headers: { 'cache-control': 'public, s-maxage=86400, stale-while-revalidate=172800' } });
}
