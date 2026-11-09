import { isEnglishItem } from '@/lib/english';

/** Shared RSS + photo helpers for /api/news and /api/top. */
export interface Item { title: string; source: string; link: string; when: string; image?: string; summary?: string }
export const UA = { 'user-agent': 'Mozilla/5.0 (compatible; MarketFiles/1.0; +https://vercel.app)' };

export const decode = (s: string) => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16))).trim();
export const tag = (x: string, t: string) => { const m = x.match(new RegExp(`<${t}[^>]*>([\\s\\S]*?)</${t}>`)); return m ? decode(m[1]) : ''; };
export const attr = (x: string, re: RegExp) => { const m = x.match(re); return m ? decode(m[1]) : ''; };
const strip = (h: string) => decode(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const clip = (s: string, n = 220) => (s.length > n ? s.slice(0, s.lastIndexOf(' ', n)) + '…' : s);
export const okImg = (u: string) => /^https:\/\//.test(u) && !/\.(svg|gif)(\?|$)/i.test(u) && !/logo|favicon|placeholder|blank/i.test(u);

export function imageOf(x: string): string {
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

export async function rss(url: string, source?: string): Promise<Item[]> {
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
  }).filter((i) => i.title && /^https?:\/\//.test(i.link) && isEnglishItem(i)); // English-language outlets only
}

const OG = new Map<string, string>();
export async function ogImage(link: string): Promise<string> {
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

