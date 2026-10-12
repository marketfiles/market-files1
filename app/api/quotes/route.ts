import { getQuotes } from '@/lib/market/quotes';
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;
/**
 * Live (delayed) prices. Works with no API keys: Yahoo Finance, the U.S. Treasury, ECB (Frankfurter) and CoinGecko.
 * Optional keys (Finnhub, FRED) fill gaps. Open /api/quotes on your site to see which sources are answering ("status").
 */
export async function GET(req: Request) {
  const set = new URL(req.url).searchParams.get('set') === 'companies' ? 'companies' : 'core';
  const data = await getQuotes(set);
  return Response.json(data, { headers: { 'cache-control': 'public, s-maxage=20, stale-while-revalidate=60' } });
}
