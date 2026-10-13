export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Real headlines.
 *  - /api/news                 → Google News mix (headline slideshow), as before.
 *  - /api/news?section=markets|global|crypto|companies → publisher RSS feeds with their photos
 *    (RSS media tags, or the article's own og:image), topped up with Google News.
 * Every item links to the original publisher. Cached 10 minutes per section.
 */
interface Item { title: string; source: string; link: string; when: string; image?: string; summary?: string }
const UA = { 'user-agent': 'Mozilla/5.0 (compatible; MarketFiles/1.0; +https://vercel.app)' };

const decode = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16))).trim();
const tag = (x: string, t: string) => { const m = x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ''; };
const attr = (x: string, re: RegExp) => { const m = x.match(re); return m ? decode(m[1]) : ''; };
const strip = (h: string) => decode(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const clip = (s: string, n = 220) => (s.length > n ? s.slice(0, s.lastIndexOf(' ', n)) + '…' : s);
const okImg = (u: string) => /^https:\/\//.test(u) && !/\.(svg|gif)(\?|$)/i.test(u) && !/logo|favicon|placeholder|blank/i.test(u);

function imageOf(x: string): string {
  const cands = [
    attr(x, /<media:content[^>]+url="([^"]+)"[^>]*(?:medium="image"|type="image)/i),
    attr(x, /<media:content[^>]+url="([^"]+)"/i),
    attr(x, /<media:thumbnail[^>]+url="([^"]+)"/i),
    attr(x, /<enclosure[^>]+url="([^"]+)"[^>]+type="image/i),
    attr(x, /<enclosure[^>]+type="image[^"]*"[^>]+url="([^"]+)"/i),
    attr(decode(tag(x, 'content:encoded') || tag(x, 'description')), /<img[^>]+src="([^"]+)"/i),
  ];
  return cands.find((u) => u && okImg(u)) || '';
}

async function rss(url: string, source?: string): Promise<Item[]> {
  const r = await fetch(url, { headers: UA, cache: 'no-store', signal: AbortSignal.timeout(7000) });
  if (!r.ok) throw new Error(String(r.status));
  const xml = await r.text();
  const feedTitle = source || tag(xml.split('<item')[0], 'title').replace(/\s*[-|:].*$/, '');
  return [...xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/g)].map((m) => {
    const x = m[1]; const src = tag(x, 'source') || feedTitle;
    let title = strip(tag(x, 'title')); if (src && title.endsWith(' - ' + src)) title = title.slice(0, -(src.length + 3));
    const link = tag(x, 'link') || attr(x, /<guid[^>]*isPermaLink="true"[^>]*>([^<]+)</);
    const when = new Date(tag(x, 'pubDate') || tag(x, 'dc:date') || Date.now());
    const summary = clip(strip(tag(x, 'description')));
    return { title, source: src, link, when: isNaN(+when) ? new Date().toISOString() : when.toISOString(), image: imageOf(x), summary: summary && summary !== title ? summary : '' };
  }).filter((i) => i.title && /^https?:\/\//.test(i.link));
}
const gnews = (q: string) => rss(`https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=en-US&gl=US&ceid=US:en`, '');

const cnbc = (id: string) => `https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=${id}`;
// cap: most stories one publisher may contribute to a section, so a frequent publisher cannot fill the page.
const FEEDS: Record<string, { feeds: [string, string][]; google: string | string[]; cap?: number; block?: RegExp }> = {
  // Market-moving news only: markets, the economy, central banks, trade and geopolitics. No personal-finance advice columns.
  markets: { feeds: [[cnbc('100003114'), 'CNBC'], [cnbc('20910258'), 'CNBC'], [cnbc('10000664'), 'CNBC'], ['https://feeds.content.dowjones.io/public/rss/mw_marketpulse', 'MarketWatch'], ['https://feeds.content.dowjones.io/public/rss/mw_bulletins', 'MarketWatch'], [cnbc('100727362'), 'CNBC'], [cnbc('10000113'), 'CNBC']],
    google: '(stocks OR "Wall Street" OR "Federal Reserve" OR "Treasury yields" OR tariffs OR "oil prices" OR "trade war" OR sanctions OR inflation) when:1d' },
  global: { feeds: [[cnbc('100727362'), 'CNBC'], ['https://feeds.bbci.co.uk/news/business/rss.xml', 'BBC News'], ['https://feeds.bbci.co.uk/news/world/rss.xml', 'BBC News'], ['https://www.theguardian.com/business/economics/rss', 'The Guardian'], [cnbc('20910258'), 'CNBC'], [cnbc('10000113'), 'CNBC']],
    google: '("central bank" OR "global economy" OR tariffs OR sanctions OR election OR "trade deal" OR OPEC OR currency) when:1d' },
  crypto: { feeds: [['https://www.coindesk.com/arc/outboundfeeds/rss/', 'CoinDesk'], ['https://cointelegraph.com/rss', 'Cointelegraph'], ['https://decrypt.co/feed', 'Decrypt'], ['https://www.theblock.co/rss.xml', 'The Block'], ['https://cryptoslate.com/feed/', 'CryptoSlate'], ['https://blockworks.com/feed', 'Blockworks'], ['https://blog.kraken.com/feed', 'Kraken']],
    // Coinbase, Binance and Hyperliquid publish no RSS feed, so exchange news comes through a targeted Google News query.
    google: ['bitcoin OR ethereum OR crypto OR ETF OR stablecoin when:1d', '(Coinbase OR Binance OR Kraken OR Hyperliquid OR OKX OR Bybit) (listing OR launch OR announces OR outage OR hack OR volume) when:2d'], cap: 3,
    // Price-data sites are not news: keep them out of the story list (their prices are still credited on the price tables).
    block: /coinmarketcap|coingecko|coin market cap/i },
  companies: { feeds: [[cnbc('15839135'), 'CNBC'], [cnbc('10001147'), 'CNBC'], ['https://www.theguardian.com/business/rss', 'The Guardian'], ['https://finance.yahoo.com/news/rssindex', 'Yahoo Finance']], google: 'earnings OR CEO OR merger OR acquisition when:1d' },
};

/** Drops personal-finance advice letters, lifestyle and promo items so sections stay on market-moving news. */
const OFF_TOPIC = [
  /^[‘'"“](i|i'm|i’m|my|we|we're|we’re|our|me)\b/i, // advice-column quotes: ‘I have no children’: …
  /\b(moneyist|dear quentin|help desk|ask an advisor|the big move|retirement hacker|personal finance)\b/i,
  /\bmy (wife|husband|aunt|uncle|brother|sister|mother|father|mom|dad|son|daughter|kids|children|girlfriend|boyfriend|partner|family|in-laws?|stepchildren|parents|home|house|portfolio|401\(k\)|ira|savings|pension)\b/i,
  /\b(i|i'm|i’m|i've|i’ve|we're|we’re|should i|can i|do i|am i)\b.*\?\s*$/i,
  /\b(best (credit cards?|savings|cd rates|mortgage rates|personal loans?)|coupon|promo code|deal of the day|horoscope|recipe)\b/i,
];
const onTopic = (i: Item) => !OFF_TOPIC.some((re) => re.test(i.title));

const OG = new Map<string, string>();
async function ogImage(link: string): Promise<string> {
  if (OG.has(link)) return OG.get(link)!;
  let img = '';
  try {
    const r = await fetch(link, { headers: UA, redirect: 'follow', signal: AbortSignal.timeout(4000) });
    if (r.ok && (r.headers.get('content-type') || '').includes('html')) {
      const html = (await r.text()).slice(0, 250_000);
      img = attr(html, /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) || attr(html, /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) || attr(html, /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i);
      if (!okImg(img)) img = '';
    }
  } catch { /* ignore */ }
  OG.set(link, img); if (OG.size > 2000) OG.clear();
  return img;
}

const cache = new Map<string, { at: number; items: Item[] }>();
const json = (items: Item[]) => Response.json({ items }, { headers: { 'cache-control': 'public, s-maxage=300, stale-while-revalidate=600' } });

async function section(key: string): Promise<Item[]> {
  const cfg = FEEDS[key];
  const lists = await Promise.all([...cfg.feeds.map(([u, s]) => rss(u, s).catch(() => [] as Item[])), ...[cfg.google].flat().map((q) => gnews(q).catch(() => [] as Item[]))]);
  const dayAgo = Date.now() - 48 * 3600_000;
  const seen = new Set<string>(); const items: Item[] = [];
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 80);
  const srcKey = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const perSource = new Map<string, number>();
  // Round-robin across feeds. Pass 1 honours the per-publisher cap; if that leaves the page thin, pass 2 fills it without the cap.
  for (const cap of cfg.cap ? [cfg.cap, Infinity] : [Infinity]) {
    for (let i = 0; items.length < 24 && i < 40; i++) for (const l of lists) {
      const it = l[i]; if (!it || +new Date(it.when) < dayAgo || !onTopic(it)) continue;
      if (cfg.block && (cfg.block.test(it.source || '') || cfg.block.test(it.link))) continue;
      const k = norm(it.title); if (seen.has(k)) continue;
      const sk = srcKey(it.source || ''); if (sk && (perSource.get(sk) || 0) >= cap) continue;
      seen.add(k); items.push(it); if (sk) perSource.set(sk, (perSource.get(sk) || 0) + 1);
    }
    if (items.length >= 12) break;
  }
  items.sort((a, b) => +new Date(b.when) - +new Date(a.when));
  // Find photos for the stories that will be shown with an image (direct publisher links only).
  const need = items.slice(0, 12).filter((i) => !i.image && !/news\.google\.com/.test(i.link)).slice(0, 8);
  await Promise.all(need.map(async (i) => { i.image = await ogImage(i.link); }));
  return items;
}

/** Headlines about one company, stock or coin (research pages): /api/news?q=NVIDIA&t=NVDA&k=stock|crypto */
const clean = (v: string | null, n: number) => (v || '').replace(/[^\p{L}\p{N} .&'\-]/gu, '').replace(/\s+/g, ' ').trim().slice(0, n);
async function about(name: string, ticker: string, kind: string): Promise<Item[]> {
  const ck = `q:${name}|${ticker}|${kind}`; const hit = cache.get(ck);
  if (hit && Date.now() - hit.at < 600_000) return hit.items;
  const extra = kind === 'crypto' ? 'crypto OR price' : 'stock OR shares OR earnings';
  const qs = [`"${name}" (${extra}) when:7d`, ticker && ticker !== name.toUpperCase() ? `"${ticker}" ${kind === 'crypto' ? 'crypto' : 'stock'} when:7d` : ''].filter(Boolean);
  // Ticker feeds link straight to the publisher (so a photo can be found); Google News links are redirects with no photo.
  const tk = /^[A-Z.\-]{1,6}$/.test(ticker) && kind !== 'crypto' ? encodeURIComponent(ticker) : '';
  const direct = tk ? [
    rss(`https://feeds.finance.yahoo.com/rss/2.0/headline?s=${tk}&region=US&lang=en-US`, 'Yahoo Finance').catch(() => [] as Item[]),
    rss(`https://www.nasdaq.com/feed/rssoutbound?symbol=${tk}`, 'Nasdaq').catch(() => [] as Item[]),
  ] : [];
  const lists = await Promise.all([...direct, ...qs.map((q) => gnews(q).catch(() => [] as Item[]))]);
  const seen = new Set<string>(); const items: Item[] = [];
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim().slice(0, 80);
  for (let i = 0; items.length < 16 && i < 30; i++) for (const l of lists) {
    const it = l[i]; if (!it || !onTopic(it)) continue; const k = norm(it.title); if (seen.has(k)) continue; seen.add(k);
    items.push({ title: it.title, source: it.source || 'Google News', link: it.link, when: it.when, image: it.image, summary: it.summary });
  }
  items.sort((x, y) => +new Date(y.when) - +new Date(x.when));
  await Promise.all(items.slice(0, 10).filter((i) => !i.image && !/news\.google\.com/.test(i.link)).map(async (i) => { i.image = await ogImage(i.link); }));
  if (items.length) { cache.set(ck, { at: Date.now(), items }); if (cache.size > 400) cache.clear(); }
  return items.length ? items : hit?.items ?? [];
}

export async function GET(req: Request) {
  const sp = new URL(req.url).searchParams;
  const name = clean(sp.get('q'), 60);
  if (name) {
    try { return json(await about(name, clean(sp.get('t'), 12).toUpperCase(), sp.get('k') === 'crypto' ? 'crypto' : 'stock')); }
    catch { return json([]); }
  }
  const key = sp.get('section') || '';
  if (FEEDS[key]) {
    const hit = cache.get(key);
    if (hit && Date.now() - hit.at < 600_000) return json(hit.items);
    try {
      const items = await section(key);
      if (items.length) cache.set(key, { at: Date.now(), items });
      return json(items.length ? items : hit?.items ?? []);
    } catch { return json(hit?.items ?? []); }
  }
  const hit = cache.get('top');
  if (hit && Date.now() - hit.at < 300_000) return json(hit.items);
  try {
    const lists = await Promise.all(['stock market when:1d', 'economy OR "central bank" OR inflation when:1d', 'bitcoin OR crypto when:1d'].map((q) => gnews(q).catch(() => [] as Item[])));
    const seen = new Set<string>(); const items: Item[] = [];
    for (let i = 0; items.length < 12 && i < 12; i++) for (const l of lists) { const it = l[i]; if (it && onTopic(it) && !seen.has(it.title)) { seen.add(it.title); items.push({ title: it.title, source: it.source || 'Google News', link: it.link, when: it.when }); } }
    if (items.length) cache.set('top', { at: Date.now(), items });
    return json(items.length ? items : hit?.items ?? []);
  } catch { return json(hit?.items ?? []); }
}
