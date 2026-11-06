// The biggest-stories band must always show three DIFFERENT stories. Run with: npm run test:unit
import test from 'node:test';
import assert from 'node:assert/strict';
import { pickTop } from '../../lib/topstories.ts';

const now = Date.parse('2026-11-06T13:00:00Z');
const h = (hours) => new Date(now - hours * 3_600_000).toISOString();
const it = (title, source, hoursAgo) => ({ title, source, link: `https://x/${encodeURIComponent(title + source)}`, when: h(hoursAgo) });

test('the same story worded differently by different outlets is never picked twice', () => {
  const fed = [
    it('Fed cuts interest rates by a quarter point as inflation cools', 'Reuters', 3),
    it('Federal Reserve cuts interest rates again, Powell signals pause', 'CNBC', 4),
    it('Powell: Fed cuts rates, sees inflation cooling', 'Bloomberg', 5),
    it('Fed delivers quarter-point interest rate cut', 'WSJ', 6),
  ];
  const day = [...fed, it('Oil prices tumble as OPEC boosts output', 'Reuters', 2)];
  const week = [...fed, it('Nvidia earnings crush estimates on AI chip demand', 'CNBC', 50), it('Nvidia quarterly earnings beat, AI demand soars', 'Reuters', 52), it('Oil prices tumble as OPEC boosts output', 'Reuters', 2)];
  const month = [...week, it('Bitcoin breaks above $150,000 for the first time', 'CoinDesk', 300), it('Bitcoin tops $150,000 in record rally', 'Reuters', 310)];
  const r = pickTop(day, week, month, now);
  const titles = [r.day, r.week, r.month].map((x) => x && x.title);
  assert.ok(titles.every(Boolean), JSON.stringify(titles));
  assert.equal(new Set(titles).size, 3);
  assert.match(r.day.title, /Fed|Powell/);
  assert.match(r.week.title, /Nvidia/);
  assert.match(r.month.title, /Bitcoin/);
});

test('identical feeds for every window still give different stories (or none), never repeats', () => {
  const all = [it('Stocks rally as Treasury yields slide', 'AP', 1), it('Treasury yields slide, stocks rally', 'CNBC', 2), it('Gold hits all-time high near $5,000', 'Reuters', 3), it('Apple unveils new iPhone lineup', 'Verge', 4)];
  const r = pickTop(all, all, all, now);
  const titles = [r.day, r.week, r.month].filter(Boolean).map((x) => x.title);
  assert.equal(new Set(titles).size, titles.length);
  assert.equal(titles.length, 3);
});
