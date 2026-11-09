import { isEnglishItem } from '@/lib/english';
import { isOpinionOrPromo, isTrumpHeadline } from '@/lib/newsfilter';
import { biggest, matches, assignPhotos, type Item, type Pick, type Taken } from '@/lib/topstories';
import { rss, ogImage, okImg } from '@/lib/feeds';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * The biggest financial story of the day, the week and the month.
 * "Biggest" = the story covered by the most different news outlets in Google News
 * for that period (stories are grouped by shared headline words). Each pick differs
 * from the others: a different story, a different headline and a different topic (so a different photo). Every item links to the publisher via Google News. Cached 30 minutes.
 * The picking rules live in lib/topstories.ts.
 * Photos: each card gets the photo from its own story (publisher feeds, then a news search for the headline,
 * then the article's og:image). No two cards ever share a photo; with no story photo the page uses a unique fallback.
 */
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

// Publisher feeds that carry article photos (same outlets as the section pages).
const cnbc = (id: string) => `https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=${id}`;
const PHOTO_FEEDS: [string, string][] = [[cnbc('100003114'), 'CNBC'], [cnbc('20910258'), 'CNBC'], [cnbc('10000664'), 'CNBC'], [cnbc('100727362'), 'CNBC'], [cnbc('10001147'), 'CNBC'], [cnbc('15839135'), 'CNBC'],
  ['https://feeds.content.dowjones.io/public/rss/mw_marketpulse', 'MarketWatch'], ['https://feeds.bbci.co.uk/news/business/rss.xml', 'BBC News'], ['https://www.theguardian.com/business/rss', 'The Guardian'],
  ['https://www.coindesk.com/arc/outboundfeeds/rss/', 'CoinDesk'], ['https://decrypt.co/feed', 'Decrypt'], ['https://finance.yahoo.com/news/rssindex', 'Yahoo Finance']];

/** News search for one headline; Bing links wrap the publisher URL in ?url=, which is unwrapped so its photo can be read. */
const unwrap = (l: string) => { try { const u = new URL(l).searchParams.get('url'); return u && /^https?:\/\//.test(u) ? u : l; } catch { return l; } };
const search = async (q: string): Promise<Item[]> => (await rss(`https://www.bing.com/news/search?q=${encodeURIComponent(q)}&format=rss&setlang=en-us&cc=us`, 'Bing News')).map((i) => ({ ...i, link: unwrap(i.link), image: '' }));
const direct = (l: string) => /^https?:\/\//.test(l) && !/news\.google\.com|bing\.com/.test(l);

/** Up to five candidate photos for one story, best match first. */
async function photosFor(p: Pick, feed: Item[]): Promise<string[]> {
  const found = await search(p.title).catch(() => [] as Item[]);
  const cands = [...matches(p.title, feed, 3), ...matches(p.title, found, 4)];
  const imgs = await Promise.all(cands.map(async (c) => (c.image && okImg(c.image) ? c.image : direct(c.link) ? await ogImage(c.link) : '')));
  return [...new Set(imgs.filter(Boolean))];
}

const Q = ['"stock market" OR "Wall Street" OR stocks', '"Federal Reserve" OR economy OR inflation OR "interest rates"', 'earnings OR bitcoin OR oil OR "central bank" OR tariffs'];
let cache: { at: number; body: Record<string, Pick | null> } | null = null;

export async function GET() {
  if (cache && Date.now() - cache.at < 1_800_000) return Response.json(cache.body, { headers: { 'cache-control': 'public, s-maxage=900' } });
  try {
    const win = async (w: string) => (await Promise.all(Q.map((q) => gnews(`${q} when:${w}`).catch(() => [] as Item[])))).flat();
    const feedP = Promise.all(PHOTO_FEEDS.map(([u, src]) => rss(u, src).catch(() => [] as Item[]))).then((l) => l.flat()); // fetched alongside the headlines
    const [d, wk, mo] = await Promise.all([win('1d'), win('7d'), win('30d')]);
    const taken: Taken[] = []; // shared, so day, week and month can never repeat a story, headline or photo topic
    const body: Record<string, Pick | null> = { day: biggest(d, taken), week: biggest(wk, taken), month: biggest(mo, taken) };
    // Story photos: gather candidates for all three in parallel, then hand them out so none repeats.
    const keys = (['day', 'week', 'month'] as const).filter((k) => body[k]);
    const feed = await feedP;
    const cands = await Promise.all(keys.map((k) => photosFor(body[k]!, feed).catch(() => [] as string[])));
    assignPhotos(cands).forEach((img, i) => { if (img) body[keys[i]] = { ...body[keys[i]]!, image: img }; });
    if (body.day || body.week || body.month) cache = { at: Date.now(), body };
    return Response.json(body, { headers: { 'cache-control': 'public, s-maxage=900' } });
  } catch {
    return Response.json(cache?.body ?? { day: null, week: null, month: null });
  }
}
