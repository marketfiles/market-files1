import { SYMBOLS, YAHOO, COMPANY_TICKERS, isCompany } from './symbols';

export interface Quote { id: string; v: number; prev: number; label?: string; source: string; asOf: string; mc?: number; h?: number[] }
export type QuoteSet = 'core' | 'companies';
export interface ProviderStatus { ok: boolean; count: number; note?: string }

// Small per-instance cache so every visitor shares the same upstream calls; stale data is kept if a provider fails.
const cache = new Map<string, { at: number; data: Quote[]; status: ProviderStatus }>();
async function cached(key: string, ttlMs: number, fn: () => Promise<Quote[]>): Promise<{ data: Quote[]; status: ProviderStatus }> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return { data: hit.data, status: hit.status };
  try {
    const data = await fn();
    const status = { ok: data.length > 0, count: data.length, note: data.length ? undefined : 'no data returned' };
    if (data.length || !hit) cache.set(key, { at: Date.now(), data, status });
    return { data: data.length ? data : hit?.data ?? [], status };
  } catch (e) {
    const note = (e as Error).message;
    console.error(`[quotes] ${key}:`, note);
    return { data: hit?.data ?? [], status: { ok: false, count: hit?.data.length ?? 0, note } };
  }
}
const UA = 'Mozilla/5.0 (compatible; MarketFiles/1.0; +https://x.com/TheMarketFiles)';
const getText = async (url: string, headers: Record<string, string> = {}) => {
  const r = await fetch(url, { headers: { 'user-agent': UA, ...headers }, cache: 'no-store', signal: AbortSignal.timeout(9000) });
  if (!r.ok) throw new Error(`${r.status} ${url.split('?')[0]}`);
  return r.text();
};
const getJSON = async (url: string, headers: Record<string, string> = {}) => JSON.parse(await getText(url, { accept: 'application/json', ...headers }));

/** Run async jobs a few at a time. */
async function pool<T, R>(items: T[], size: number, fn: (x: T) => Promise<R>): Promise<R[]> {
  const out: R[] = []; let i = 0;
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, async () => { while (i < items.length) { const k = i++; out[k] = await fn(items[k]); } }));
  return out;
}

/* ---------- Yahoo Finance (no key) ---------- */
async function yahooOne(id: string, sym: string): Promise<Quote | null> {
  for (const host of ['query1', 'query2']) {
    try {
      const j = await getJSON(`https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=1mo&interval=1d&includePrePost=false`);
      const r = j?.chart?.result?.[0]; if (!r) continue;
      const m = r.meta || {};
      const closes: number[] = (r.indicators?.quote?.[0]?.close || []).filter((x: number | null) => x != null && isFinite(x));
      const v = isFinite(m.regularMarketPrice) ? m.regularMarketPrice : closes[closes.length - 1];
      if (!isFinite(v) || v <= 0) continue;
      const prev = closes.length >= 2 ? closes[closes.length - 2] : (m.chartPreviousClose ?? m.previousClose ?? v);
      const h = closes.slice(-30); if (h.length && h[h.length - 1] !== v) h.push(v);
      return { id, v, prev: isFinite(prev) && prev > 0 ? prev : v, source: `Yahoo Finance · ${sym} · delayed`, asOf: new Date((m.regularMarketTime || Date.now() / 1000) * 1000).toISOString(), h };
    } catch { /* try next host */ }
  }
  return null;
}
async function yahoo(ids: string[]): Promise<Quote[]> {
  const res = await pool(ids.filter((id) => YAHOO[id]), 10, (id) => yahooOne(id, YAHOO[id]));
  return res.filter(Boolean) as Quote[];
}

/* ---------- U.S. Treasury yield curve (no key) ---------- */
async function treasury(): Promise<Quote[]> {
  const yr = new Date().getUTCFullYear();
  const rows: string[][] = [];
  for (const y of [yr, yr - 1]) {
    const csv = await getText(`https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/${y}/all?type=daily_treasury_yield_curve&field_tdr_date_value=${y}&page&_format=csv`);
    const lines = csv.trim().split(/\r?\n/);
    const head = lines[0].split(',').map((s) => s.replace(/"/g, '').trim());
    const idx = Object.fromEntries(['2 Yr', '5 Yr', '10 Yr', '30 Yr'].map((k) => [k, head.indexOf(k)]));
    if (Object.values(idx).some((i) => i < 0)) throw new Error('treasury csv format changed');
    for (const l of lines.slice(1)) rows.push([l.split(',')[0].replace(/"/g, ''), ...['2 Yr', '5 Yr', '10 Yr', '30 Yr'].map((k) => l.split(',')[idx[k]]?.replace(/"/g, '') ?? '')]);
    if (rows.length >= 2) break;
  }
  if (rows.length < 2) return [];
  const [a, b] = rows; // newest first
  const asOf = a[0];
  return (['US2Y', 'US5Y', 'US10Y', 'US30Y'] as const).map((id, i) => ({ id, v: +a[i + 1], prev: +b[i + 1], source: 'U.S. Treasury · daily par yield curve', asOf })).filter((q) => isFinite(q.v) && isFinite(q.prev) && q.v > 0);
}

/* ---------- Finnhub (optional key; ETF proxies / gaps) ---------- */
async function finnhub(ids: string[]): Promise<Quote[]> {
  const key = process.env.FINNHUB_API_KEY; if (!key || !ids.length) return [];
  const entries = ids.map((id) => [id, SYMBOLS[id]] as const).filter(([, s]) => s && s.kind === 'finnhub') as [string, Extract<(typeof SYMBOLS)[string], { kind: 'finnhub' }>][];
  const out: Quote[] = [];
  for (let i = 0; i < entries.length; i += 8) {
    const batch = await Promise.all(entries.slice(i, i + 8).map(async ([id, s]) => {
      try {
        const j = await getJSON(`https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(s.symbol)}&token=${key}`);
        if (!j || !j.c) return null;
        return { id, v: j.c, prev: j.pc || j.c, label: s.label || undefined, source: `Finnhub · ${s.symbol} · delayed`, asOf: new Date((j.t || Date.now() / 1000) * 1000).toISOString() } as Quote;
      } catch { return null; }
    }));
    batch.forEach((q) => q && out.push(q));
  }
  return out;
}

/* ---------- FRED (optional key; non-U.S. 10-year yields) ---------- */
async function fred(): Promise<Quote[]> {
  const key = process.env.FRED_API_KEY; if (!key) return [];
  const entries = Object.entries(SYMBOLS).filter(([, s]) => s.kind === 'fred') as [string, Extract<(typeof SYMBOLS)[string], { kind: 'fred' }>][];
  const res = await Promise.all(entries.map(async ([id, s]) => {
    try {
      const j = await getJSON(`https://api.stlouisfed.org/fred/series/observations?series_id=${s.series}&api_key=${key}&file_type=json&sort_order=desc&limit=10`);
      const obs = (j.observations || []).filter((o: { value: string }) => o.value !== '.' && isFinite(+o.value));
      if (!obs.length) return null;
      return { id, v: +obs[0].value, prev: +(obs[1]?.value ?? obs[0].value), label: s.label, source: `FRED · ${s.series} · ${s.freq}`, asOf: obs[0].date } as Quote;
    } catch { return null; }
  }));
  return res.filter(Boolean) as Quote[];
}

/* ---------- FX reference rates (no key) ---------- */
async function fx(): Promise<Quote[]> {
  const base = (process.env.FX_API_BASE || 'https://api.frankfurter.app').replace(/\/$/, '');
  const start = new Date(Date.now() - 10 * 864e5).toISOString().slice(0, 10);
  const j = await getJSON(`${base}/${start}..?from=USD&to=EUR,JPY,GBP,CNY,CHF,AUD`);
  const dates = Object.keys(j.rates || {}).sort();
  if (dates.length < 1) return [];
  const now = j.rates[dates[dates.length - 1]], before = j.rates[dates[Math.max(0, dates.length - 2)]];
  const asOf = dates[dates.length - 1], source = 'ECB reference rate · Frankfurter · daily';
  const inv = (x: number) => 1 / x;
  return [
    { id: 'EURUSD', v: inv(now.EUR), prev: inv(before.EUR), source, asOf },
    { id: 'GBPUSD', v: inv(now.GBP), prev: inv(before.GBP), source, asOf },
    { id: 'AUDUSD', v: inv(now.AUD), prev: inv(before.AUD), source, asOf },
    { id: 'USDJPY', v: now.JPY, prev: before.JPY, source, asOf },
    { id: 'USDCNY', v: now.CNY, prev: before.CNY, source, asOf },
    { id: 'USDCHF', v: now.CHF, prev: before.CHF, source, asOf },
  ];
}

/* ---------- Crypto (no key) ---------- */
async function coingecko(): Promise<Quote[]> {
  const entries = Object.entries(SYMBOLS).filter(([, s]) => s.kind === 'coingecko') as [string, { kind: 'coingecko'; id: string }][];
  const ids = entries.map(([, s]) => s.id).join(',');
  const key = process.env.COINGECKO_API_KEY;
  const j = await getJSON(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h&sparkline=true`, key ? { 'x-cg-demo-api-key': key } : {});
  type Coin = { id: string; current_price: number; price_change_percentage_24h: number; market_cap: number; last_updated: string; sparkline_in_7d?: { price: number[] } };
  return entries.map(([id, s]) => {
    const c = (j as Coin[]).find((x) => x.id === s.id);
    if (!c || !c.current_price) return null;
    const pct = c.price_change_percentage_24h || 0;
    const sp = c.sparkline_in_7d?.price; const h = sp && sp.length > 24 ? sp.filter((_, i) => i % 6 === 0).concat(c.current_price) : undefined;
    return { id, v: c.current_price, prev: c.current_price / (1 + pct / 100), mc: c.market_cap, h, source: 'CoinGecko · 24h change', asOf: c.last_updated } as Quote;
  }).filter(Boolean) as Quote[];
}

/* ---------- CoinMarketCap (optional key; preferred crypto source when set) ---------- */
async function coinmarketcap(): Promise<Quote[]> {
  const key = process.env.COINMARKETCAP_API_KEY; if (!key) return [];
  const entries = Object.entries(SYMBOLS).filter(([, s]) => s.kind === 'coingecko').map(([id]) => id);
  const j = await getJSON(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${entries.join(',')}&convert=USD`, { 'X-CMC_PRO_API_KEY': key });
  return entries.map((id) => {
    const d = j?.data?.[id]; const d0 = Array.isArray(d) ? d[0] : d; const u = d0?.quote?.USD;
    if (!u || !u.price) return null;
    const pct = u.percent_change_24h || 0;
    return { id, v: u.price, prev: u.price / (1 + pct / 100), mc: u.market_cap || undefined, source: 'CoinMarketCap · 24h change', asOf: u.last_updated || new Date().toISOString() } as Quote;
  }).filter(Boolean) as Quote[];
}

/** Optional licensed futures feed you control (FUTURES_FEED_URL); overrides Yahoo for the roots it returns. */
async function futures(): Promise<Quote[]> {
  const url = process.env.FUTURES_FEED_URL; if (!url) return [];
  const rows = await getJSON(url, process.env.FUTURES_FEED_TOKEN ? { authorization: `Bearer ${process.env.FUTURES_FEED_TOKEN}` } : {});
  const roots = new Set(Object.values(SYMBOLS).filter((s) => s.kind === 'futures').map((s) => (s as { root: string }).root));
  return (Array.isArray(rows) ? rows : []).filter((r: { symbol: string; last: number }) => roots.has(r.symbol) && isFinite(r.last))
    .map((r: { symbol: string; last: number; prevSettle?: number; contract?: string; asOf?: string }) => ({
      id: `${r.symbol}1`, v: r.last, prev: r.prevSettle ?? r.last, source: `Futures · ${r.contract || r.symbol + ' front month'} · delayed`, asOf: r.asOf || new Date().toISOString(),
    }));
}

const CORE_IDS = Object.keys(SYMBOLS).filter((id) => !isCompany(id));
const merge = (...lists: Quote[][]) => { const m = new Map<string, Quote>(); for (const l of lists) for (const q of l) m.set(q.id, q); return [...m.values()]; };

export async function getQuotes(set: QuoteSet = 'core') {
  if (set === 'companies') {
    const y = await cached('yahoo-co', 120_000, () => yahoo(COMPANY_TICKERS));
    const missing = COMPANY_TICKERS.filter((id) => !y.data.some((q) => q.id === id));
    const f = await cached('finnhub-co', 180_000, () => finnhub(missing));
    return { asOf: new Date().toISOString(), quotes: merge(f.data, y.data), status: { yahoo: y.status, finnhub: { ...f.status, keySet: Boolean(process.env.FINNHUB_API_KEY) } } };
  }
  const [y, t, c, g, fu, fr, cm] = await Promise.all([
    cached('yahoo', 75_000, () => yahoo(CORE_IDS)),
    cached('treasury', 30 * 60_000, treasury),
    cached('fx', 60 * 60_000, fx),
    cached('coingecko', 45_000, coingecko),
    cached('futures', 30_000, futures),
    cached('fred', 60 * 60_000, fred),
    cached('coinmarketcap', 300_000, coinmarketcap),
  ]);
  const have = new Set([...y.data, ...t.data, ...c.data, ...fu.data, ...fr.data].map((q) => q.id));
  const fh = await cached('finnhub', 90_000, () => finnhub(CORE_IDS.filter((id) => !have.has(id) && SYMBOLS[id]?.kind === 'finnhub')));
  // Priority (last wins): fx reference < finnhub proxy < FRED < Yahoo < Treasury < CoinGecko < licensed futures feed
  const quotes = merge(c.data, fh.data, fr.data, y.data, t.data, g.data, cm.data.map((q) => ({ ...q, h: g.data.find((x) => x.id === q.id)?.h })), fu.data);
  return {
    asOf: new Date().toISOString(), quotes,
    status: { yahoo: y.status, treasury: t.status, fx: c.status, coingecko: g.status, finnhub: { ...fh.status, keySet: Boolean(process.env.FINNHUB_API_KEY) }, fred: { ...fr.status, keySet: Boolean(process.env.FRED_API_KEY) }, coinmarketcap: { ...cm.status, keySet: Boolean(process.env.COINMARKETCAP_API_KEY) }, futuresFeed: { ...fu.status, keySet: Boolean(process.env.FUTURES_FEED_URL) } },
  };
}
