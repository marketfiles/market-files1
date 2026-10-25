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
  for (const t of ['Trump lifts 50% tariffs on some Canadian goods', "Trump's tariff plan rattles Wall Street", 'Stocks slide as TRUMP threatens China']) assert.equal(isTrumpHeadline(t), true, t);
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
