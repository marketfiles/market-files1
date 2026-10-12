import { getChart, RANGES, type Range } from '@/lib/market/chart';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 20;

/** Price history for one instrument: /api/chart?id=SPX&range=1d|5d|1mo|6mo|1y|5y (real, delayed; 404 when unavailable). */
export async function GET(req: Request) {
  const u = new URL(req.url);
  const id = (u.searchParams.get('id') || '').toUpperCase().slice(0, 12);
  const range = (RANGES as string[]).includes(u.searchParams.get('range') || '') ? (u.searchParams.get('range') as Range) : '1d';
  if (!/^[A-Z0-9.]{1,12}$/.test(id)) return Response.json({ error: 'Bad id' }, { status: 400 });
  const c = await getChart(id, range);
  if (!c) return Response.json({ error: 'Unavailable', id, range }, { status: 404, headers: { 'cache-control': 'public, s-maxage=60' } });
  const ttl = range === '1d' || range === '5d' ? 60 : 900;
  return Response.json(c, { headers: { 'cache-control': `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 4}` } });
}
