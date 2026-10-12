import type { Metadata } from 'next';
import { getQuotes } from '@/lib/market/quotes';
import { probeChartSources } from '@/lib/market/chart';
import { SiteHeader, SiteFooter } from '@/components/SiteChrome';

export const metadata: Metadata = { title: 'System status', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 30;

type S = { ok: boolean; count?: number; note?: string; keySet?: boolean; points?: number };
const row = (name: string, s: S) => (
  <tr key={name}><td>{name}</td><td style={{ color: s.ok ? 'var(--up)' : 'var(--dn)' }}>{s.ok ? 'Working' : s.keySet === false ? 'Not set up (optional key)' : 'Not answering'}</td>
    <td className="mono">{s.count ?? s.points ?? 0}</td><td className="mono" style={{ color: 'var(--tx3)' }}>{s.note || ''}</td></tr>
);

/** Public, secret-free health page: which free data sources are answering right now. */
export default async function Status() {
  const [q, charts] = await Promise.all([getQuotes('core'), probeChartSources()]);
  const status = q.status as Record<string, S>;
  const ids = new Set(q.quotes.map((x) => x.id));
  const key = ['SPX', 'COMP', 'INDU', 'US10Y', 'XAU', 'CL', 'EURUSD', 'BTC'];
  return (<>
    <SiteHeader />
    <main id="main" className="wrap" style={{ padding: '32px 0 64px' }}>
      <header className="ph serif"><h1>System status</h1><p>Live check of the free data sources behind Market Files · {new Date(q.asOf).toUTCString()}</p></header>
      <h2 className="mono" style={{ fontSize: 12, letterSpacing: '.16em', color: '#F5C451', margin: '28px 0 10px' }}>PRICE SOURCES</h2>
      <table className="mono" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}><thead><tr style={{ textAlign: 'left', color: 'var(--tx3)' }}><th>Source</th><th>State</th><th>Prices</th><th>Note</th></tr></thead>
        <tbody>{Object.entries(status).map(([k, s]) => row(k, s))}</tbody></table>
      <h2 className="mono" style={{ fontSize: 12, letterSpacing: '.16em', color: '#F5C451', margin: '28px 0 10px' }}>CHART SOURCES (S&amp;P 500, 1 day)</h2>
      <table className="mono" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}><tbody>{row('yahoo', charts.yahoo)}{row('cnbc', charts.cnbc)}</tbody></table>
      <h2 className="mono" style={{ fontSize: 12, letterSpacing: '.16em', color: '#F5C451', margin: '28px 0 10px' }}>KEY PRICES</h2>
      <p className="mono" style={{ fontSize: 13 }}>{key.map((k) => `${k} ${ids.has(k) ? '✓' : '—'}`).join('   ')}</p>
      <p className="mono" style={{ fontSize: 12, color: 'var(--tx3)', marginTop: 18 }}>{q.quotes.length} prices live in total.</p>
    </main><SiteFooter /></>);
}
