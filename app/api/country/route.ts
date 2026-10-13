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

const WB = 'https://api.worldbank.org/v2/country';
const getJ = async (url: string, ms: number) => {
  const r = await fetch(url, { signal: AbortSignal.timeout(ms), headers: { accept: 'application/json', 'user-agent': 'Mozilla/5.0 (compatible; MarketFiles/1.0)' } });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
};

/** One request for all indicators (the World Bank answers a multi-indicator call far more reliably than eight parallel ones). */
async function batch(iso: string): Promise<Record<string, Stat>> {
  const ids = Object.values(IND).join(';');
  const j = await getJ(`${WB}/${iso}/indicator/${ids}?source=2&format=json&mrnev=1&per_page=100`, 12000);
  const rows: { indicator?: { id: string }; value: number | null; date: string }[] = Array.isArray(j) && Array.isArray(j[1]) ? j[1] : [];
  const out: Record<string, Stat> = {};
  for (const [k, id] of Object.entries(IND)) {
    const row = rows.find((x) => x.indicator?.id === id && x.value != null);
    if (row) out[k] = { value: Number(row.value), year: String(row.date) };
  }
  return out;
}

async function one(iso: string, id: string): Promise<Stat | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const j = await getJ(`${WB}/${iso}/indicator/${id}?format=json&mrv=8&per_page=8`, 12000);
      const row = Array.isArray(j) && Array.isArray(j[1]) ? j[1].find((x: { value: number | null }) => x.value != null) : null;
      return row ? { value: Number(row.value), year: String(row.date) } : null;
    } catch { /* retry once */ }
  }
  return null;
}

export async function GET(req: Request) {
  const iso = (new URL(req.url).searchParams.get('iso') || '').toUpperCase();
  if (!/^[A-Z]{2}$/.test(iso)) return Response.json({ error: 'Bad country code' }, { status: 400 });
  const hit = cache.get(iso);
  if (hit && Date.now() - hit.at < 86_400_000) return Response.json(hit.body);
  let stats: Record<string, Stat> = {};
  try { stats = await batch(iso); } catch { /* fall back to one call per indicator */ }
  if (Object.keys(stats).length < 3) {
    const keys = Object.keys(IND);
    const vals = await Promise.all(keys.filter((k) => !stats[k]).map(async (k) => [k, await one(iso, IND[k])] as const));
    for (const [k, v] of vals) if (v) stats[k] = v;
  }
  const body = { iso, stats, source: 'World Bank, World Development Indicators' };
  if (Object.keys(stats).length) cache.set(iso, { at: Date.now(), body });
  return Response.json(body, { headers: { 'cache-control': Object.keys(stats).length ? 'public, s-maxage=86400, stale-while-revalidate=172800' : 'no-store' } });
}
