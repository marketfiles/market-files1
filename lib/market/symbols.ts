/**
 * Maps every instrument on the Market Files board to a data source.
 * Index levels (S&P 500, Dow, FTSE…) require paid exchange/index licenses for real-time use, so the
 * default setup tracks them through widely traded ETFs and relabels the tile (e.g. "S&P 500 · SPY").
 * Swap in an index-licensed provider later by changing the entries here — the site needs no other change.
 */
export type Source =
  | { kind: 'finnhub'; symbol: string; label: string }
  | { kind: 'fred'; series: string; label?: string; freq: 'daily' | 'monthly' }
  | { kind: 'fx'; pair: 'EURUSD' | 'USDJPY' | 'GBPUSD' | 'USDCNY' | 'USDCHF' | 'AUDUSD' }
  | { kind: 'coingecko'; id: string }
  | { kind: 'futures'; root: string };

export const SYMBOLS: Record<string, Source> = {
  SPX: { kind: 'finnhub', symbol: 'SPY', label: 'S&P 500 · SPY' },
  COMP: { kind: 'finnhub', symbol: 'QQQ', label: 'Nasdaq-100 · QQQ' },
  INDU: { kind: 'finnhub', symbol: 'DIA', label: 'Dow · DIA' },
  RUT: { kind: 'finnhub', symbol: 'IWM', label: 'Russell 2000 · IWM' },
  VIX: { kind: 'finnhub', symbol: 'VIXY', label: 'VIX futures · VIXY' },
  XLK: { kind: 'finnhub', symbol: 'XLK', label: 'Technology' }, XLF: { kind: 'finnhub', symbol: 'XLF', label: 'Financials' },
  XLV: { kind: 'finnhub', symbol: 'XLV', label: 'Health Care' }, XLY: { kind: 'finnhub', symbol: 'XLY', label: 'Cons. Discretionary' },
  XLC: { kind: 'finnhub', symbol: 'XLC', label: 'Communication' }, XLI: { kind: 'finnhub', symbol: 'XLI', label: 'Industrials' },
  XLP: { kind: 'finnhub', symbol: 'XLP', label: 'Cons. Staples' }, XLE: { kind: 'finnhub', symbol: 'XLE', label: 'Energy' },
  XLU: { kind: 'finnhub', symbol: 'XLU', label: 'Utilities' }, XLRE: { kind: 'finnhub', symbol: 'XLRE', label: 'Real Estate' },
  XLB: { kind: 'finnhub', symbol: 'XLB', label: 'Materials' },
  XAU: { kind: 'finnhub', symbol: 'GLD', label: 'Gold · GLD' },
  XAG: { kind: 'finnhub', symbol: 'SLV', label: 'Silver · SLV' },
  CL: { kind: 'finnhub', symbol: 'USO', label: 'Oil · USO' },
  HG: { kind: 'finnhub', symbol: 'CPER', label: 'Copper · CPER' },
  DXY: { kind: 'finnhub', symbol: 'UUP', label: 'U.S. dollar · UUP' },
  TSX: { kind: 'finnhub', symbol: 'EWC', label: 'Canada · EWC' },
  IBOV: { kind: 'finnhub', symbol: 'EWZ', label: 'Brazil · EWZ' },
  UKX: { kind: 'finnhub', symbol: 'EWU', label: 'U.K. · EWU' },
  DAX: { kind: 'finnhub', symbol: 'EWG', label: 'Germany · EWG' },
  CAC: { kind: 'finnhub', symbol: 'EWQ', label: 'France · EWQ' },
  SX5E: { kind: 'finnhub', symbol: 'FEZ', label: 'Euro Stoxx 50 · FEZ' },
  NKY: { kind: 'finnhub', symbol: 'EWJ', label: 'Japan · EWJ' },
  HSI: { kind: 'finnhub', symbol: 'EWH', label: 'Hong Kong · EWH' },
  SHCOMP: { kind: 'finnhub', symbol: 'ASHR', label: 'China A-shares · ASHR' },
  SENSEX: { kind: 'finnhub', symbol: 'INDA', label: 'India · INDA' },
  AS51: { kind: 'finnhub', symbol: 'EWA', label: 'Australia · EWA' },
  US2Y: { kind: 'fred', series: 'DGS2', freq: 'daily' },
  US5Y: { kind: 'fred', series: 'DGS5', freq: 'daily' },
  US10Y: { kind: 'fred', series: 'DGS10', freq: 'daily' },
  US30Y: { kind: 'fred', series: 'DGS30', freq: 'daily' },
  DE10Y: { kind: 'fred', series: 'IRLTLT01DEM156N', label: 'Germany 10Y · monthly', freq: 'monthly' },
  GB10Y: { kind: 'fred', series: 'IRLTLT01GBM156N', label: 'U.K. 10Y · monthly', freq: 'monthly' },
  JP10Y: { kind: 'fred', series: 'IRLTLT01JPM156N', label: 'Japan 10Y · monthly', freq: 'monthly' },
  FR10Y: { kind: 'fred', series: 'IRLTLT01FRM156N', label: 'France 10Y · monthly', freq: 'monthly' },
  IT10Y: { kind: 'fred', series: 'IRLTLT01ITM156N', label: 'Italy 10Y · monthly', freq: 'monthly' },
  EURUSD: { kind: 'fx', pair: 'EURUSD' }, USDJPY: { kind: 'fx', pair: 'USDJPY' }, GBPUSD: { kind: 'fx', pair: 'GBPUSD' },
  USDCNY: { kind: 'fx', pair: 'USDCNY' }, USDCHF: { kind: 'fx', pair: 'USDCHF' }, AUDUSD: { kind: 'fx', pair: 'AUDUSD' },
  BTC: { kind: 'coingecko', id: 'bitcoin' }, ETH: { kind: 'coingecko', id: 'ethereum' }, SOL: { kind: 'coingecko', id: 'solana' },
  XRP: { kind: 'coingecko', id: 'ripple' }, BNB: { kind: 'coingecko', id: 'binancecoin' }, DOGE: { kind: 'coingecko', id: 'dogecoin' },
  ADA: { kind: 'coingecko', id: 'cardano' }, LINK: { kind: 'coingecko', id: 'chainlink' },
  // Front-month futures (CME Group, ICE, Cboe). Exchange data needs a redistribution license — see README "Futures data".
  ...Object.fromEntries(['ES','NQ','YM','RTY','ZT','ZN','ZB','CL','BZ','NG','RB','GC','SI','HG','PL','ZC','ZS','ZW','LE','KC','SB','6E','6J','6B','BTC','ETH','VX']
    .map((root) => [`${root}1`, { kind: 'futures', root } as Source])),
};

/** Large listed companies (Companies page). Loaded only while that page is open. */
export const COMPANY_TICKERS = ['NVDA','MSFT','AAPL','AVGO','ORCL','AMD','CRM','CSCO','IBM','NOW','ADBE','QCOM','TXN','INTC','BRK.B','JPM','V','MA','BAC','WFC','GS','MS','AXP','C','BLK','SCHW','COIN','HOOD','PYPL','LLY','JNJ','ABBV','UNH','MRK','ABT','TMO','ISRG','AMGN','PFE','AMZN','TSLA','HD','MCD','BKNG','TJX','LOW','SBUX','NKE','GOOGL','META','NFLX','TMUS','DIS','T','VZ','CMCSA','GE','CAT','RTX','UBER','HON','UNP','DE','BA','LMT','UPS','WMT','COST','PG','KO','PM','PEP','MO','MDLZ','TGT','XOM','CVX','COP','EOG','SLB','MPC','PSX','OXY','NEE','SO','CEG','DUK','AEP','SRE','D','PLD','WELL','AMT','EQIX','SPG','O','PSA','LIN','SHW','ECL','APD','FCX','NEM','DOW'];
for (const t of COMPANY_TICKERS) SYMBOLS[t] = { kind: 'finnhub', symbol: t, label: '' };

/**
 * Key-free primary source: Yahoo Finance chart data (true index levels, futures, FX, ETFs and stocks).
 * Used when it answers; Finnhub (if a key is set) only fills the gaps with ETF proxies.
 */
export const YAHOO: Record<string, string> = {
  SPX: '^GSPC', COMP: '^IXIC', INDU: '^DJI', RUT: '^RUT', VIX: '^VIX',
  XLK: 'XLK', XLF: 'XLF', XLV: 'XLV', XLY: 'XLY', XLC: 'XLC', XLI: 'XLI', XLP: 'XLP', XLE: 'XLE', XLU: 'XLU', XLRE: 'XLRE', XLB: 'XLB',
  XAU: 'GC=F', XAG: 'SI=F', CL: 'CL=F', HG: 'HG=F', DXY: 'DX-Y.NYB',
  TSX: '^GSPTSE', IBOV: '^BVSP', UKX: '^FTSE', DAX: '^GDAXI', CAC: '^FCHI', SX5E: '^STOXX50E', NKY: '^N225', HSI: '^HSI', SHCOMP: '000001.SS', SENSEX: '^BSESN', AS51: '^AXJO',
  EURUSD: 'EURUSD=X', USDJPY: 'JPY=X', GBPUSD: 'GBPUSD=X', USDCNY: 'CNY=X', USDCHF: 'CHF=X', AUDUSD: 'AUDUSD=X',
  ES1: 'ES=F', NQ1: 'NQ=F', YM1: 'YM=F', RTY1: 'RTY=F', ZT1: 'ZT=F', ZN1: 'ZN=F', ZB1: 'ZB=F', CL1: 'CL=F', BZ1: 'BZ=F', NG1: 'NG=F', RB1: 'RB=F',
  GC1: 'GC=F', SI1: 'SI=F', HG1: 'HG=F', PL1: 'PL=F', ZC1: 'ZC=F', ZS1: 'ZS=F', ZW1: 'ZW=F', LE1: 'LE=F', KC1: 'KC=F', SB1: 'SB=F',
  '6E1': '6E=F', '6J1': '6J=F', '6B1': '6B=F', BTC1: 'BTC=F', ETH1: 'ETH=F',
  ...Object.fromEntries(COMPANY_TICKERS.map((t) => [t, t.replace('.', '-')])),
};
export const isCompany = (id: string) => COMPANY_TICKERS.includes(id);
