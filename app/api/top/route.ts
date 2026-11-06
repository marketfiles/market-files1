import { isEnglishItem } from '@/lib/english';
import { isOpinionOrPromo, isTrumpHeadline } from '@/lib/newsfilter';
import { pickTop, type Item, type Pick } from '@/lib/topstories';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * The biggest financial story of the day, the week and the month.
 * "Biggest" = the story covered by the most different news outlets in Google News
 * for that period (stories are grouped by shared headline words). Each pick differs
 * from the others: never the same story twice, even when outlets word it differently. Every item links to the publisher via Google News. Cached 30 minutes.
 */
// Selection rules (three different stories, never a repeat) live in lib/topstories.ts
const decode = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).trim();
const tag = (x: string, t: string) => { const m = x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ''; };

async function gnews(q: string): Promise<Item[]> {
  const r = await fetch(`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; MarketFiles/1.0)' }, cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(String(r.status));
  const xml = await r.text();
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map((m) => {
    const x = m[1]; const source = tag(x, 'source');
    let title = tag(x, 'title'); if (source && title.endsWith(' - ' + source)) title = title.slice(0, -(source.length + 3));
    return { title, source: source || 'Google News', link: tag(x, 'link'), when: new Date(tag(x, 'pubDate') || Date.now()).toISOString() };
  }).filter((i) => i.title && i.link && isEnglishItem(i) && !isOpinionOrPromo(i.title) && !isTrumpHeadline(i.title)); // English-language news only, no opinion or promos, and no Trump headline leading the home page
}

const Q = ['"stock market" OR "Wall Street" OR stocks', '"Federal Reserve" OR economy OR inflation OR "interest rates"', 'earnings OR bitcoin OR oil OR "central bank" OR tariffs'];
let cache: { at: number; body: Record<string, Pick | null> } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.at < 1_800_000) return Response.json(cache.body, { headers: { 'cache-control': 'public, s-maxage=900' } });
  try {
    const win = async (w: string) => (await Promise.all(Q.map((q) => gnews(`${q} when:${w}`).catch(() => [] as Item[])))).flat();
    const [d, wk, mo] = await Promise.all([win('1d'), win('7d'), win('30d')]);
    const body: Record<string, Pick | null> = pickTop(d, wk, mo);
    if (body.day || body.week || body.month) cache = { at: Date.now(), body };
    return Response.json(body, { headers: { 'cache-control': 'public, s-maxage=900' } });
  } catch {
    return Response.json(cache?.body ?? { day: null, week: null, month: null });
  }
}
