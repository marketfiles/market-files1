/**
 * Sections that have real URLs (/markets, /crypto, ...). Everything else keeps its existing URL.
 * Keep in sync with REAL_PATHS in experience/source/market-files.html; `npm run experience:check` verifies it.
 */
export const SECTION_PATHS = ['markets','global-finance','crypto','companies','history','library','archive','dashboard','tools','newsletter','futures','on-this-date','search','research','timeline','latest','bitcoin','blockchain'] as const;

/** Page titles for the main sections (the layout appends " — Market Files"). */
export const SECTION_TITLES: Record<string, string> = {
  markets: 'Markets',
  'global-finance': 'Global',
  crypto: 'Crypto',
  companies: 'Companies',
  history: 'History',
  library: 'Library',
  archive: 'The Archive',
};

export const isSectionPath = (segment: string) => (SECTION_PATHS as readonly string[]).includes(segment);
