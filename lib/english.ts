/**
 * English-only guard for news items.
 * Google News and some publisher feeds mix in outlets that publish in other scripts
 * (Arabic, Cyrillic, CJK, ...). Those names and headlines render right-to-left or in
 * unreadable glyphs on the site, so we drop any item whose source name or headline
 * contains a letter outside the Latin script. Digits, punctuation, symbols and
 * emoji (Common/Inherited script) are fine.
 */
const NON_LATIN = /[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]/u;

export const isEnglishText = (s: string | undefined | null): boolean => !s || !NON_LATIN.test(s);

export const isEnglishItem = (i: { title?: string; source?: string }): boolean =>
  isEnglishText(i.title) && isEnglishText(i.source);
