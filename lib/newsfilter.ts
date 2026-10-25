/**
 * Keeps opinion columns, predictions and "stocks to buy" promos out of the story cards.
 *
 * The "biggest story" cards rank headlines by how many outlets cover them, which can't tell
 * news from a pundit's forecast or a sales pitch. These patterns are deliberately narrow:
 * wrongly dropping a real news story is worse than letting one promo through, so headlines
 * like "Fed predicts two rate cuts" or "Prediction markets surge" must stay.
 */

// A leading label such as "Prediction:", "Opinion -" or "Sponsored |".
const LABEL = /^\s*(predictions?|opinion|op-ed|commentary|editorial|column|viewpoint|sponsored( content)?|advertisement|advertorial|paid content)\s*[:|–—-]\s/i;

const PROMO: RegExp[] = [
  /\bstocks? to (buy|own|watch)\b/i,
  /\b(best|top) (\w+ ){0,2}(stocks?|etfs?|cryptos?|cryptocurrenc(y|ies)) (to buy|for)\b/i,
  /\b(buy|buying|sell|selling) (right )?now\b/i,
  /\bshould you (buy|sell|invest)\b/i,
  /\bis it (a )?(good time|too late|too early) to (buy|sell|invest)\b/i,
  /\b(better|smarter) buy\b/i,
  /\bforever (stocks?|holds?)\b/i,
  /\b(make|turn) you (a )?(millionaire|rich)\b/i,
  /\bget rich\b/i,
  /\bpassive income\b/i,
  /\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten) (\w+ ){0,2}(stocks?|etfs?|cryptos?) (to buy|that could|that will|you)\b/i,
];

export const isOpinionOrPromo = (title: string | undefined | null): boolean => {
  const t = title || '';
  return LABEL.test(t) || PROMO.some((re) => re.test(t));
};

/**
 * Front-page lead stories only ("The biggest stories" band and the headlines slideshow).
 * Headlines that name Trump never lead the home page. They still appear in the section pages
 * (Markets, Global, ...) where tariff and policy news that moves markets belongs.
 */
export const isTrumpHeadline = (title: string | undefined | null): boolean => /\btrump(?:s|['’]s?)?\b/i.test(title || '');
