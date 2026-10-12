# Stages 2-6: Crypto, Gold & Silver, Stocks, Global hubs and the Learn section

One commit on top of Stage 1 (PR #6, commit 02f9eec). Apply only after Stage 1 is merged.
It is one commit rather than one per hub because all five hubs share one template in one source file.

## What is new
- `#/crypto-guide`: 9 tabs (prices and heat map, basics, Bitcoin and white paper, wallets, exchanges by country, how-tos, terminology, news and sources, risks and failures)
- `#/metals` (Gold & Silver): 8 tabs (prices, basics, what moves prices, ways to own, how to trade, where to buy, history, risks)
- `#/stocks-guide`: 9 tabs (prices, basics, how markets work, reading a company, how to trade, brokers by country, charting, history, risks)
- `#/world` (Global politics & markets): 9 tabs (world prices, how it fits together, central banks, currencies, rates and bonds, institutions, commodities and energy, key data and calendar, history)
- `#/learn`: middle school, high school, college, higher ed and professional, printable activities, how to make learning stick, safety and fairness, plus three original games (flashcards, a 10-question quiz, a compound-interest explorer). No accounts, nothing stored or sent, play numbers only.
- Home: a "Learn everything about what you're investing in" strip above the Bitcoin block (Bitcoin stays at the very bottom). Top nav gains "Learn". Drawer and footer links added.
- Regenerated: public/experience/market-files.js, app/globals.css, app/experience-shell.ts. No protected system touched.

## Where the content came from
The 2026-10-12 research pack written by ChatGPT. Every item shows its source link and "checked Oct 12, 2026".
Claude published only items the pack marked as confirmed. Items it could not confirm are left out or say "not verified" on the page.

## Checked by Claude
- Generator check passes; bundle passes `node --check`; patch applies cleanly on Stage 1.
- Headless Chrome at 1440px and 390px (simulated prices): all 5 hubs and every tab render, live price tabs show tiles and heat maps, all 3 games work end to end, nav shows Learn, home strip shows 5 cards with Bitcoin after it, no page errors, no horizontal overflow.
- Compound-interest game output checked by hand ($1,000 + $100/month, 6%, 20 years = $49,514).

## NOT checked, so CI and the owner must confirm
- `npm run typecheck`, `npm run build`, `npm run test:smoke` (Claude's sandbox cannot reach npm).
- Live prices and the TradingView blocks (production only).
- Every external link was taken from the research pack, not re-opened by Claude. Spot-check a few.

## Known gaps shown honestly on the pages
- Not verified in the pack, so not summarised: exchange names for the UK, EU, Germany, France, South Korea, Australia, India, Brazil; QuadrigaCX; PBoC and RBI mandates; WTO, G7, G20; Plaza Accord and Asian crisis; Hunt brothers silver episode; dot-com history; metals peak prices; short-selling mechanics; wallet audits and incident histories beyond the ones listed.
- Mobile games and web simulators were not added because their current terms and data handling were not verified. Registered competitions are excluded because they need sign-up.
- No top-level "Futures" nav item was added (same as Stage 1).

## Owner review checklist (Vercel Preview)
1. Open each: `#/crypto-guide`, `#/metals`, `#/stocks-guide`, `#/world`, `#/learn`. Click through every tab.
2. Prices tabs show live tiles and heat maps; clicking a tile opens the contract or instrument panel.
3. Learn: play each game once on your phone.
4. Home: scroll down. The hubs strip is above the Bitcoin block.
5. Spot-check five source links, including one wallet and one regulator link.
6. Read the Exchanges tab disclaimer: names are examples from regulator pages, not recommendations.
