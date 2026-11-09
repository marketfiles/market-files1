// Unit tests for the news filters and the rate limiter. Run with: npm run test:unit
import test from 'node:test';
import assert from 'node:assert/strict';
import { isEnglishText, isEnglishItem } from '../../lib/english.ts';
import { isOpinionOrPromo, isTrumpHeadline } from '../../lib/newsfilter.ts';
import { rateLimit } from '../../lib/ratelimit.ts';

test('English filter drops non-Latin outlets and headlines', () => {
  for (const s of ['شبكة تواصل', 'الإخبارية', 'Центральный банк', '日本経済新聞', '한국경제']) assert.equal(isEnglishText(s), false, s);
  assert.equal(isEnglishItem({ title: 'Stocks rally', source: 'الإخبارية' }), false);
  assert.equal(isEnglishItem({ title: 'الأسهم ترتفع', source: 'Reuters' }), false);
});

test('English filter keeps normal English items, symbols and accents', () => {
  for (const s of ['The Motley Fool', 'WION', 'S&P 500 +1.2% €', 'Café Müller Ltd.', 'Wall Street’s “biggest” week: 3.7%', '']) assert.equal(isEnglishText(s), true, s);
  assert.equal(isEnglishItem({ title: 'Fed holds rates', source: 'CNBC' }), true);
});

test('Opinion and promo headlines are filtered', () => {
  for (const t of [
    'Prediction: The Stock Market Will Soar After Midterm Elections',
    'Opinion: Why the dollar will fall',
    'Sponsored | Retire early with this one move',
    '3 Stocks to Buy Right Now',
    'Best dividend stocks to buy in 2027',
    'Is It Too Late to Buy Nvidia Stock?',
    'This ETF could make you a millionaire',
    'Should you buy bitcoin before the halving?',
  ]) assert.equal(isOpinionOrPromo(t), true, t);
});

test('Real news headlines are not filtered', () => {
  for (const t of [
    'Fed predicts two rate cuts in 2027',
    'Prediction markets surge as election nears',
    'Stocks fall as Treasury yields jump',
    'Trump lifts 50% tariffs on some Canadian goods',
    'Annual Inflation Rate Rose To 3.7% In September',
    'Nvidia earnings beat estimates, shares rise after hours',
  ]) assert.equal(isOpinionOrPromo(t), false, t);
});

test('Front-page lead filter drops Trump headlines only', () => {
  for (const t of ['Trump lifts 50% tariffs on some Canadian goods', "Trump's tariff plan rattles Wall Street", 'Stocks slide as TRUMP threatens China', 'Trumps tariffs hit markets', 'Trump-backed plan lifts bank stocks', 'Donald J. Trump signs order']) assert.equal(isTrumpHeadline(t), true, t);
  for (const t of ['Stocks fall as Treasury yields jump', 'Fed holds rates steady', 'Trumpf earnings beat estimates', '']) assert.equal(isTrumpHeadline(t), false, t);
});

test('Rate limiter allows up to the limit then blocks', () => {
  const k = `t1:${Math.random()}`;
  for (let i = 0; i < 3; i++) assert.equal(rateLimit(k, 3, 60_000), true);
  assert.equal(rateLimit(k, 3, 60_000), false);
});

test('Rate limiter cost: deep research counts as 3 requests', () => {
  const k = `t2:${Math.random()}`;
  assert.equal(rateLimit(k, 6, 60_000), true);            // 1 used
  assert.equal(rateLimit(k, 6, 60_000, 2), true);         // 3 used (a deep request in total)
  assert.equal(rateLimit(k, 6, 60_000), true);            // 4
  assert.equal(rateLimit(k, 6, 60_000, 2), true);         // 6
  assert.equal(rateLimit(k, 6, 60_000), false);           // full
  assert.equal(rateLimit(`t3:${Math.random()}`, 2, 60_000, 3), false); // a request costing more than the limit never passes
});

// "The biggest stories" band: day, week and month must never repeat a story, a headline or a photo topic.
import { biggest, topicOf } from '../../lib/topstories.ts';
const it = (title, source, link = title) => ({ title, source, link, when: new Date().toISOString() });

test('Biggest stories: the same event worded differently is never picked twice', () => {
  const taken = [];
  const day = biggest([it('Fed cuts interest rates by quarter point', 'CNBC'), it('Federal Reserve cuts interest rates again', 'Reuters'), it('Apple unveils new chips', 'Bloomberg')], taken);
  const week = biggest([it('Powell: Fed cuts interest rates, signals pause', 'WSJ'), it('Fed cuts interest rates by quarter point', 'AP'), it('Oil jumps as OPEC trims output', 'Reuters'), it('OPEC output cut lifts crude', 'FT')], taken);
  assert.match(day.title, /Fed|Federal Reserve/);
  assert.equal(week.topic, 'oil');
  assert.notEqual(week.title, day.title);
});

test('Biggest stories: three picks have three different topics when candidates allow', () => {
  const pool = [
    it('Fed holds interest rates steady', 'CNBC'), it('Fed holds interest rates as expected', 'Reuters'), it('Powell says Fed in no rush on rates', 'AP'),
    it('Bitcoin tops $150,000 for first time', 'CoinDesk'), it('Bitcoin hits fresh all-time high', 'Bloomberg'),
    it('Nvidia earnings beat estimates', 'WSJ'),
  ];
  const taken = [];
  const picks = [biggest(pool, taken), biggest(pool, taken), biggest(pool, taken)];
  assert.equal(new Set(picks.map((p) => p.topic)).size, 3);
  assert.equal(new Set(picks.map((p) => p.link)).size, 3);
});

test('Biggest stories: the identical link or headline is never reused, even if nothing else is left', () => {
  const taken = [];
  const a = biggest([it('Gold climbs to record high', 'Reuters')], taken);
  const b = biggest([it('Gold climbs to record high', 'AP', 'other-link')], taken);
  assert.ok(a);
  assert.equal(b, null);
  assert.equal(topicOf('Treasury yields slide'), 'bonds');
});
