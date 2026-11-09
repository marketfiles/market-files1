/**
 * Picks "The biggest stories" for the home page: today, this week, this month.
 *
 * Hard rule from the editor: the three cards must never show the same story, the same headline
 * or the same photo. So each pick must be
 *   1. a different story (headlines may share at most one meaningful word with an earlier pick),
 *   2. a different topic (Fed, oil, crypto, ...), because the card photo is chosen by topic, and
 *   3. never the same link or headline text.
 * Only when no candidate passes rule 2 is it relaxed. Rules 1 and 3 are never relaxed.
 */
export interface Item { title: string; source: string; link: string; when: string; image?: string }
export interface Pick extends Item { count: number; sources: string[]; topic: string }

const STOP = new Set('that this with from have will after amid over into than what when where which while about their there they them more most just been were your says said could would should still today week month year years stock stocks market markets shares news live update updates latest report reports expected ahead first last back down rise rises rising fall falls falling higher lower record set sets make makes take takes here know need whats how why new big top time investors investor trading traders global price prices amid'.split(' '));

export const toks = (t: string) => new Set(t.toLowerCase().replace(/[’'`]/g, '').split(/[^a-z0-9$%]+/).filter((w) => w.length >= 4 && !STOP.has(w)));
const overlap = (a: Set<string>, b: Set<string>) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n; };

/** Grouping rule for counting how many outlets cover one story. */
const sameStory = (a: Set<string>, b: Set<string>) => { const n = overlap(a, b); return n >= 3 || (n >= 2 && n / Math.max(1, Math.min(a.size, b.size)) >= 0.5); };
/** Stricter rule for keeping the three cards apart: two shared meaningful words is already "the same story". */
export const tooClose = (a: Set<string>, b: Set<string>) => overlap(a, b) >= 2;

/** Topic key; the client picks the card photo from it, so it must match TB_TOPICS in the experience source. */
const TOPICS: [string, RegExp][] = [
  ['fed', /\b(fed|federal reserve|powell|rate cuts?|rate hikes?|interest rates?|fomc)\b/i],
  ['trade', /\b(tariffs?|trade war|trade deal|imports?|exports?|shipping|supply chain)\b/i],
  ['oil', /\b(oil|opec|crude|brent|wti|gasoline)\b/i],
  ['gold', /\b(gold|bullion)\b/i],
  ['crypto', /\b(bitcoin|crypto|ethereum|ether|stablecoin|coinbase|blockchain)\b/i],
  ['bonds', /\b(treasur(y|ies)|bonds?|yields?|debt ceiling|deficit)\b/i],
  ['inflation', /\b(inflation|cpi|consumer prices|pce)\b/i],
  ['jobs', /\b(jobs|payrolls?|unemployment|labor market|hiring|layoffs?)\b/i],
  ['europe', /\b(ecb|eurozone|euro|lagarde|europe|european)\b/i],
  ['uk', /\b(bank of england|pound|sterling|britain|u\.k\.|uk|london)\b/i],
  ['japan', /\b(japan|yen|nikkei|boj|tokyo)\b/i],
  ['china', /\b(china|chinese|beijing|yuan|hong kong|hang seng)\b/i],
  ['politics', /\b(white house|biden|president|congress|senate|election|shutdown|supreme court)\b/i],
  ['companies', /\b(earnings|ipo|nasdaq|nvidia|apple|microsoft|tesla|amazon|alphabet|google|meta|chips?|semiconductors?|ai)\b/i],
];
export const topicOf = (title: string) => (TOPICS.find(([, re]) => re.test(title)) || ['general'])[0];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export interface Taken { toks: Set<string>; topic: string; link: string; title: string }

export function biggest(items: Item[], taken: Taken[]): Pick | null {
  const T = items.map((i) => toks(i.title));
  const usedTopics = new Set(taken.map((t) => t.topic).filter((t) => t !== 'general'));
  const pick = (needNewTopic: boolean) => {
    let best: { i: number; srcs: Set<string> } | null = null;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (T[i].size < 2) continue;
      if (taken.some((t) => t.link === it.link || t.title === norm(it.title) || tooClose(T[i], t.toks))) continue;
      if (needNewTopic && usedTopics.has(topicOf(it.title))) continue;
      const srcs = new Set<string>();
      for (let j = 0; j < items.length; j++) if (i === j || sameStory(T[i], T[j])) srcs.add(items[j].source);
      if (!best || srcs.size > best.srcs.size) best = { i, srcs };
    }
    return best;
  };
  const best = pick(true) || pick(false);
  if (!best) return null;
  const it = items[best.i];
  const topic = topicOf(it.title);
  taken.push({ toks: T[best.i], topic, link: it.link, title: norm(it.title) });
  return { ...it, topic, count: best.srcs.size, sources: [...best.srcs].filter((s) => s !== it.source).slice(0, 3) };
}

/**
 * Card photos: every card shows the photo from its own story's article.
 * Candidates are other articles about the same story (sharing at least two key words with the headline),
 * best match first.
 */
export function matches<T extends { title: string }>(headline: string, items: T[], max = 5): T[] {
  const want = toks(headline);
  return items
    .map((it, i) => ({ it, i, n: overlap(want, toks(it.title)) }))
    .filter((x) => x.n >= 2)
    .sort((a, b) => b.n - a.n || a.i - b.i)
    .slice(0, max)
    .map((x) => x.it);
}

/** Same photo = same file, whatever size or cache parameters are on the URL. */
export const photoKey = (u: string) => { try { const x = new URL(u); return (x.hostname + x.pathname).toLowerCase(); } catch { return u.toLowerCase(); } };

/** Gives each pick, in order, the first candidate photo no earlier pick is using. */
export function assignPhotos(cands: string[][]): string[] {
  const used = new Set<string>();
  return cands.map((list) => {
    const img = list.find((u) => u && !used.has(photoKey(u))) || '';
    if (img) used.add(photoKey(img));
    return img;
  });
}
