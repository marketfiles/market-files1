import { YAHOO } from './symbols';

/**
 * Price history for Market Files charts. Key-free sources, tried in order:
 *   1. Yahoo Finance chart API (true index levels, futures, FX, stocks, crypto)
 *   2. CNBC's public chart feed (backup when Yahoo turns away cloud servers)
 * Returns real, delayed data or nothing — never a made-up series.
 */
export type Range = '1d' | '5d' | '1mo' | '6mo' | '1y' | '5y';
export const RANGES: Range[] = ['1d', '5d', '1mo', '6mo', '1y', '5y'];
export interface Chart { id: string; range: Range; prev: number | null; points: [number, number][]; source: string }

// A mainstream browser UA: Yahoo and CNBC reject unknown bot agents from cloud IPs.
const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';
const H = { 'user-agent': BROWSER_UA, accept: 'application/json,text/plain,*/*', 'accept-language': 'en-US,en;q=0.9' };

const YAHOO_EXTRA: Record<string, string> = {
  BTC: 'BTC-USD', ETH: 'ETH-USD', SOL: 'SOL-USD', XRP: 'XRP-USD', BNB: 'BNB-USD', DOGE: 'DOGE-USD', ADA: 'ADA-USD', LINK: 'LINK-USD',
  US5Y: '^FVX', US10Y: '^TNX', US30Y: '^TYX',
};
export const yahooSymbol = (id: string) => YAHOO_EXTRA[id] || YAHOO[id] || (/^[A-Z.]{1,6}$/.test(id) ? id.replace('.', '-') : '');

const CNBC: Record<string, string> = {
  SPX: '.SPX', COMP: '.IXIC', INDU: '.DJI', RUT: '.RUT', VIX: '.VIX', DXY: '.DXY',
  XAU: '@GC.1', XAG: '@SI.1', CL: '@CL.1', HG: '@HG.1', GC1: '@GC.1', SI1: '@SI.1', HG1: '@HG.1', CL1: '@CL.1', BZ1: '@LCO.1', NG1: '@NG.1', PL1: '@PL.1',
  ES1: '@SP.1', NQ1: '@ND.1', YM1: '@DJ.1', RTY1: '@TFS.1', ZC1: '@C.1', ZS1: '@S.1', ZW1: '@W.1',
  US2Y: 'US2Y', US5Y: 'US5Y', US10Y: 'US10Y', US30Y: 'US30Y', DE10Y: 'DE10Y-DE', GB10Y: 'GB10Y-GB', JP10Y: 'JP10Y-JP', FR10Y: 'FR10Y-FR', IT10Y: 'IT10Y-IT',
  EURUSD: 'EUR=', USDJPY: 'JPY=', GBPUSD: 'GBP=', USDCNY: 'CNY=', USDCHF: 'CHF=', AUDUSD: 'AUD=',
  BTC: 'BTC.CM=', ETH: 'ETH.CM=',
  UKX: '.FTSE', DAX: '.GDAXI', CAC: '.FCHI', SX5E: '.STOXX50E', NKY: '.N225', HSI: '.HSI', SHCOMP: '.SSEC', SENSEX: '.BSESN', AS51: '.AXJO', TSX: '.GSPTSE', IBOV: '.BVSP',
};
const cnbcSymbol = (id: string) => CNBC[id] || (/^[A-Z.]{1,6}$/.test(id) && !YAHOO_EXTRA[id] && !['SOL','XRP','BNB','DOGE','ADA','LINK'].includes(id) ? id : '');

const YI: Record<Range, string> = { '1d': '5m', '5d': '15m', '1mo': '60m', '6mo': '1d', '1y': '1d', '5y': '1wk' };
async function yahoo(id: string, range: Range): Promise<Chart | null> {
  const sym = yahooSymbol(id); if (!sym) return null;
  for (const host of ['query1', 'query2']) {
    try {
      const r = await fetch(`https://${host}.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=${range}&interval=${YI[range]}&includePrePost=false`, { headers: H, cache: 'no-store', signal: AbortSignal.timeout(8000) });
      if (!r.ok) continue;
      const j = await r.json(); const res = j?.chart?.result?.[0]; if (!res) continue;
      const ts: number[] = res.timestamp || []; const cl: (number | null)[] = res.indicators?.quote?.[0]?.close || [];
      const points = ts.map((t, i) => [t, cl[i]] as [number, number | null]).filter((p): p is [number, number] => p[1] != null && isFinite(p[1]) && p[1] > 0);
      if (points.length < 2) continue;
      const m = res.meta || {};
      const prev = range === '1d' ? (m.chartPreviousClose ?? m.previousClose ?? null) : null;
      return { id, range, prev: isFinite(prev) ? prev : null, points, source: `Yahoo Finance · ${sym} · delayed` };
    } catch { /* next host */ }
  }
  return null;
}

// CNBC bars: /harmony/app/bars/{symbol}/{interval}/{from}/{to}/adjusted/EST5EDT.json (times in New York time)
const CI: Record<Range, [string, number][]> = { '1d': [['5M', 6]], '5d': [['15M', 9], ['5M', 9]], '1mo': [['1H', 35], ['1D', 35]], '6mo': [['1D', 190]], '1y': [['1D', 370]], '5y': [['1W', 1830], ['1D', 1830]] };
const etStamp = (d: Date) => { const p = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23' }).formatToParts(d); const g = (t: string) => p.find((x) => x.type === t)?.value || '00'; return `${g('year')}${g('month')}${g('day')}${g('hour')}${g('minute')}${g('second')}`; };
type Bar = { tradeTimeinMills?: string | number; tradeTime?: string; close?: string | number };
export const CNBC_DEBUG: string[] = [];
const dbg = (m: string) => { CNBC_DEBUG.push(m.slice(0, 400)); if (CNBC_DEBUG.length > 12) CNBC_DEBUG.shift(); };
const dayStamp = (d: Date) => etStamp(d).slice(0, 8) + '000000';
async function cnbc(id: string, range: Range): Promise<Chart | null> {
  const sym = cnbcSymbol(id); if (!sym) return null;
  for (const [iv, days] of CI[range]) {
    try {
      const url = `https://ts-api.cnbc.com/harmony/app/bars/${encodeURIComponent(sym)}/${iv}/${dayStamp(new Date(Date.now() - days * 864e5))}/${dayStamp(new Date(Date.now() + 864e5))}/adjusted/EST5EDT.json`;
      const r = await fetch(url, { headers: H, cache: 'no-store', signal: AbortSignal.timeout(8000) });
      const txt = await r.text();
      if (!r.ok) { dbg(`${r.status} ${url} ${txt.slice(0, 120)}`); continue; }
      let j: any; try { j = JSON.parse(txt); } catch { dbg(`not json ${url} ${txt.slice(0, 120)}`); continue; }
      const bars: Bar[] = j?.barData?.priceBars || [];
      if (bars.length < 2) dbg(`bars=${bars.length} keys=${Object.keys(j || {}).join(',')} ${url} ${txt.slice(0, 200)}`);
      else dbg(`ok ${bars.length} sample=${JSON.stringify(bars[bars.length - 1]).slice(0, 220)}`);
      let pts = bars.map((b) => [Math.round(+(b.tradeTimeinMills ?? 0) / 1000), +String(b.close ?? '').replace(/,/g, ''), String(b.tradeTime || '').slice(0, 8)] as [number, number, string])
        .filter((p) => p[0] > 0 && isFinite(p[1]) && p[1] > 0).sort((a, b) => a[0] - b[0]);
      if (pts.length < 2) continue;
      let prev: number | null = null;
      if (range === '1d') {
        const day = (p: [number, number, string]) => p[2] || new Date(p[0] * 1000).toLocaleDateString('en-CA', { timeZone: 'America/New_York' });
        const last = day(pts[pts.length - 1]); const before = pts.filter((p) => day(p) !== last);
        prev = before.length ? before[before.length - 1][1] : null;
        pts = pts.filter((p) => day(p) === last);
        if (pts.length < 2) continue;
      }
      return { id, range, prev, points: pts.map((p) => [p[0], p[1]] as [number, number]), source: `CNBC · ${sym} · delayed` };
    } catch (e) { dbg(`err ${String(e).slice(0, 120)}`); }
  }
  return null;
}

const cache = new Map<string, { at: number; c: Chart | null }>();
export async function getChart(id: string, range: Range): Promise<Chart | null> {
  const k = `${id}|${range}`, ttl = range === '1d' || range === '5d' ? 60_000 : 30 * 60_000, hit = cache.get(k);
  if (hit && Date.now() - hit.at < ttl) return hit.c;
  const c = (await cnbc(id, range)) || (await yahoo(id, range));
  if (c || !hit) cache.set(k, { at: Date.now(), c });
  if (cache.size > 1500) cache.clear();
  return c ?? hit?.c ?? null;
}

/** For /status: which chart source answers right now. */
export async function probeChartSources() {
  const [y, c] = await Promise.all([yahoo('SPX', '1d'), cnbc('SPX', '1d')]);
  return { yahoo: { ok: !!y, points: y?.points.length ?? 0 }, cnbc: { ok: !!c, points: c?.points.length ?? 0, note: CNBC_DEBUG.slice(-4).join(' || ') } };
}
