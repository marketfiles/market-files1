// Long-run data for Market Files Library charts (FRED). Annual averages; `units=pc1` gives year-over-year % change.
export const revalidate = 86400;
const ALLOWED = new Set(['DGS10', 'FEDFUNDS', 'CPIAUCSL', 'UNRATE', 'GDPC1', 'DGS2', 'M2SL', 'MORTGAGE30US']);
const cache = new Map<string, { at: number; body: unknown }>();
/** Annual averages from FRED's public CSV. `pc1` = year-over-year % change of each observation, then averaged by year (same as the API). */
async function publicCsv(id: string, units: 'pc1' | 'lin') {
  const r = await fetch(`https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}`, { signal: AbortSignal.timeout(12000), headers: { 'user-agent': 'Mozilla/5.0 (compatible; MarketFiles/1.0)' } });
  if (!r.ok) throw new Error(String(r.status));
  const rows = (await r.text()).trim().split('\n').slice(1).map((l) => l.split(',')).map(([d, v]) => ({ d, t: Date.parse(d), v: parseFloat(v) })).filter((o) => isFinite(o.v) && isFinite(o.t));
  const series = units === 'pc1'
    ? rows.map((o, i) => {
        const back = o.t - 365 * 86400000, prior = [...rows.slice(0, i)].reverse().find((x) => Math.abs(x.t - back) < 20 * 86400000);
        return prior && prior.v !== 0 ? { d: o.d, v: (o.v / prior.v - 1) * 100 } : null;
      }).filter(Boolean) as { d: string; v: number }[]
    : rows;
  const by = new Map<string, number[]>();
  for (const o of series) { const y = o.d.slice(0, 4); (by.get(y) || by.set(y, []).get(y)!).push(o.v); }
  const points = [...by.entries()].map(([y, a]) => ({ d: `${y}-01-01`, v: +(a.reduce((x, z) => x + z, 0) / a.length).toFixed(3) }));
  return { id, units, source: `FRED · ${id} · annual average`, points };
}

export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = (u.searchParams.get('id') || '').toUpperCase();
  const units = u.searchParams.get('units') === 'pc1' ? 'pc1' : 'lin';
  const key = process.env.FRED_API_KEY;
  if (!ALLOWED.has(id)) return Response.json({ error: 'Unavailable' }, { status: 404 });
  const ck = `${id}:${units}`, hit = cache.get(ck);
  if (hit && Date.now() - hit.at < 86_400_000) return Response.json(hit.body);
  if (!key) {
    // No API key configured: FRED publishes every series as a public CSV, so the long-run charts still work.
    try {
      const body = await publicCsv(id, units);
      if (body.points.length) { cache.set(ck, { at: Date.now(), body }); return Response.json(body, { headers: { 'cache-control': 'public, s-maxage=86400' } }); }
    } catch { /* fall through */ }
    return Response.json({ error: 'Unavailable' }, { status: 404 });
  }
  const r = await fetch(`https://api.stlouisfed.org/fred/series/observations?series_id=${id}&api_key=${key}&file_type=json&frequency=a&aggregation_method=avg&units=${units}`, { signal: AbortSignal.timeout(10_000) });
  if (!r.ok) return Response.json({ error: 'Upstream error' }, { status: 502 });
  const j = await r.json();
  const body = { id, units, source: `FRED · ${id} · annual average`, points: (j.observations || []).filter((o: { value: string }) => o.value !== '.').map((o: { date: string; value: string }) => ({ d: o.date, v: +(+o.value).toFixed(3) })) };
  cache.set(ck, { at: Date.now(), body });
  return Response.json(body, { headers: { 'cache-control': 'public, s-maxage=86400' } });
}
