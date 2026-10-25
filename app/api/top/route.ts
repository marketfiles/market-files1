import { isEnglishItem } from '@/lib/english';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * The biggest financial story of the day, the week and the month.
 * "Biggest" = the story covered by the most different news outlets in Google News
 * for that period (stories are grouped by shared headline words). Each pick differs
 * from the others. Every item links to the publisher via Google News. Cached 30 minutes.
 */
interface Item { title: string; source: string; link: string; when: string }
interface Pick extends Item { count: number; sources: string[] }

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
  }).filter((i) => i.title && i.link && isEnglishItem(i)); // English-language outlets only
}

const STOP = new Set('that this with from have will after amid over into than what when where which while about their there they them more most just been were your says said could would should still today week month year years stock stocks market markets shares news live update updates latest report reports expected amid ahead could first last back down rise rises fall falls higher lower record set sets make makes take takes here know need what’s how why new big top time'.split(' '));
const toks = (t: string) => new Set(t.toLowerCase().replace(/[’'`]/g, '').split(/[^a-z0-9$%]+/).filter((w) => w.length >= 4 && !STOP.has(w)));
const overlap = (a: Set<string>, b: Set<string>) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n; };
const same = (a: Set<string>, b: Set<string>) => { const n = overlap(a, b); return n >= 3 || (n >= 2 && n / Math.max(1, Math.min(a.size, b.size)) >= 0.5); };

function biggest(items: Item[], taken: Set<string>[]): Pick | null {
  const T = items.map((i) => toks(i.title));
  let best: { i: number; srcs: Set<string> } | null = null;
  for (let i = 0; i < items.length; i++) {
    if (T[i].size < 2 || taken.some((t) => same(T[i], t))) continue;
    const srcs = new Set<string>();
    for (let j = 0; j < items.length; j++) if (i === j || same(T[i], T[j])) srcs.add(items[j].source);
    if (!best || srcs.size > best.srcs.size) best = { i, srcs };
  }
  if (!best) return null;
  taken.push(T[best.i]);
  const it = items[best.i];
  return { ...it, count: best.srcs.size, sources: [...best.srcs].filter((s) => s !== it.source).slice(0, 3) };
}

const Q = ['"stock market" OR "Wall Street" OR stocks', '"Federal Reserve" OR economy OR inflation OR "interest rates"', 'earnings OR bitcoin OR oil OR "central bank" OR tariffs'];
let cache: { at: number; body: Record<string, Pick | null> } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.at < 1_800_000) return Response.json(cache.body, { headers: { 'cache-control': 'public, s-maxage=900' } });
  try {
    const win = async (w: string) => (await Promise.all(Q.map((q) => gnews(`${q} when:${w}`).catch(() => [] as Item[])))).flat();
    const [d, wk, mo] = await Promise.all([win('1d'), win('7d'), win('30d')]);
    const taken: Set<string>[] = [];
    const body = { day: biggest(d, taken), week: biggest(wk, taken), month: biggest(mo, taken) };
    if (body.day || body.week || body.month) cache = { at: Date.now(), body };
    return Response.json(body, { headers: { 'cache-control': 'public, s-maxage=900' } });
  } catch {
    return Response.json(cache?.body ?? { day: null, week: null, month: null });
  }
}
