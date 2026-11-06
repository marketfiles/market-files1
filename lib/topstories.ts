/**
 * Picks the biggest story of the day, the week and the month — and guarantees the three are
 * three DIFFERENT stories.
 *
 * "Biggest" = the story covered by the most different outlets in the window (headlines are
 * grouped into one story when they share key words). Once a story is picked, every headline
 * in its group is remembered, so the same story told in different words by another outlet
 * cannot be picked again for a later slot.
 *
 * The week slot prefers stories older than a day and the month slot prefers stories older
 * than a week, so the three cards cover three different periods whenever the feed allows.
 */
export interface Item { title: string; source: string; link: string; when: string }
export interface Pick extends Item { count: number; sources: string[] }

const STOP = new Set('that this with from have will after amid over into than what when where which while about their there they them more most just been were your says said could would should still today week month year years stock stocks market markets shares news live update updates latest report reports expected ahead first last back down rise rises fall falls higher lower record set sets make makes take takes here know need what’s how why new big top time amid also says after before again since being doing does near nearly hits hit edge edges slip slips jump jumps gain gains drop drops'.split(' '));

export const toks = (t: string) => new Set(t.toLowerCase().replace(/[’'`]/g, '').split(/[^a-z0-9$%]+/).filter((w) => w.length >= 4 && !STOP.has(w)));
const overlap = (a: Set<string>, b: Set<string>) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n; };
/** Same story (used to count how many outlets cover it). */
const same = (a: Set<string>, b: Set<string>) => { const n = overlap(a, b); return n >= 3 || (n >= 2 && n / Math.max(1, Math.min(a.size, b.size)) >= 0.5); };
/** Too close to a story already on the band — stricter, so near-repeats are never shown twice. */
const related = (a: Set<string>, b: Set<string>) => overlap(a, b) >= 2;
const norm = (t: string) => t.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

export class Taken {
  toks: Set<string>[] = [];
  titles = new Set<string>();
  links = new Set<string>();
  has(it: Item, t: Set<string>) { return this.titles.has(norm(it.title)) || this.links.has(it.link) || this.toks.some((x) => related(t, x)); }
  add(items: Item[], T: Set<string>[], idx: number[]) { for (const j of idx) { this.toks.push(T[j]); this.titles.add(norm(items[j].title)); this.links.add(items[j].link); } }
}

export function biggest(items: Item[], taken: Taken): Pick | null {
  // the same article often comes back from more than one query — count it once
  const seen = new Set<string>();
  items = items.filter((i) => { const k = norm(i.title); if (seen.has(k)) return false; seen.add(k); return true; });
  const T = items.map((i) => toks(i.title));
  let best: { i: number; srcs: Set<string>; members: number[] } | null = null;
  for (let i = 0; i < items.length; i++) {
    if (T[i].size < 2 || taken.has(items[i], T[i])) continue;
    const srcs = new Set<string>(); const members: number[] = [];
    for (let j = 0; j < items.length; j++) if (i === j || same(T[i], T[j])) { srcs.add(items[j].source); members.push(j); }
    if (!best || srcs.size > best.srcs.size) best = { i, srcs, members };
  }
  if (!best) return null;
  taken.add(items, T, best.members);
  const it = items[best.i];
  return { ...it, count: best.srcs.size, sources: [...best.srcs].filter((s) => s !== it.source).slice(0, 3) };
}

const olderThan = (items: Item[], ms: number, now: number) => items.filter((i) => now - Date.parse(i.when) > ms);

/** Day, week and month picks — always three different stories (or null where the feed has nothing new). */
export function pickTop(day: Item[], week: Item[], month: Item[], now = Date.now()) {
  const taken = new Taken();
  const d = biggest(day, taken);
  const w = biggest(olderThan(week, 86_400_000, now), taken) ?? biggest(week, taken);
  const m = biggest(olderThan(month, 7 * 86_400_000, now), taken) ?? biggest(month, taken);
  return { day: d, week: w, month: m };
}
