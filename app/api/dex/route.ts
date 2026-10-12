import { siteUrl } from '@/lib/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Active on-chain tokens, from DEX Screener's public API (no key needed).
 *
 * DEX Screener's own "trending" lists are driven by paid boosts, so they are used only to find
 * candidates. Every candidate is then checked against real pair data and kept only if it has real
 * liquidity, real volume and some age; the list is ranked by 24h trading volume, not by promotion.
 * Links go out to DEX Screener, DEXTools (no free API, link-out only) and, for Solana, Phantom.
 */
const API = 'https://api.dexscreener.com';
const UA = { 'user-agent': 'Mozilla/5.0 (compatible; MarketFiles/1.0)', accept: 'application/json' };

const MIN_LIQUIDITY = 75_000; // USD
const MIN_VOLUME_24H = 150_000; // USD
const MIN_AGE_DAYS = 2;
const MAX_ITEMS = 12;
const PER_REQUEST = 30; // DEX Screener limit for /tokens/v1/{chain}/{addresses}

// DEX Screener chain id → DEXTools chain slug (only chains we are sure of get a DEXTools link)
const DEXTOOLS: Record<string, string> = { solana: 'solana', ethereum: 'ether', bsc: 'bnb', base: 'base', arbitrum: 'arbitrum', polygon: 'polygon', avalanche: 'avalanche', optimism: 'optimism' };

interface Boost { chainId?: string; tokenAddress?: string }
interface Pair {
  chainId: string; url?: string; pairAddress: string; baseToken: { address: string; name: string; symbol: string };
  priceUsd?: string; priceChange?: { h24?: number }; volume?: { h24?: number }; liquidity?: { usd?: number };
  pairCreatedAt?: number; info?: { imageUrl?: string };
}
export interface DexItem {
  chain: string; symbol: string; name: string; address: string; pair: string;
  price: number; change24h: number | null; volume24h: number; liquidity: number; ageDays: number;
  image?: string; dexscreener: string; dextools?: string; phantom?: string;
}

async function get<T>(path: string): Promise<T> {
  const r = await fetch(API + path, { headers: UA, cache: 'no-store', signal: AbortSignal.timeout(8000) });
  if (!r.ok) throw new Error(String(r.status));
  return (await r.json()) as T;
}

const cache: { at: number; items: DexItem[] } = { at: 0, items: [] };

async function build(): Promise<DexItem[]> {
  const [top, latest] = await Promise.all([
    get<Boost[]>('/token-boosts/top/v1').catch(() => [] as Boost[]),
    get<Boost[]>('/token-boosts/latest/v1').catch(() => [] as Boost[]),
  ]);
  const byChain = new Map<string, Set<string>>();
  for (const b of [...top, ...latest]) {
    if (!b?.chainId || !b.tokenAddress || !/^[A-Za-z0-9]{20,64}$/.test(b.tokenAddress) || !/^[a-z0-9-]{2,24}$/.test(b.chainId)) continue;
    if (!byChain.has(b.chainId)) byChain.set(b.chainId, new Set());
    byChain.get(b.chainId)!.add(b.tokenAddress);
  }

  const requests: Promise<Pair[]>[] = [];
  for (const [chain, set] of byChain) {
    const addrs = [...set];
    for (let i = 0; i < addrs.length; i += PER_REQUEST) {
      requests.push(get<Pair[]>(`/tokens/v1/${chain}/${addrs.slice(i, i + PER_REQUEST).join(',')}`).catch(() => [] as Pair[]));
    }
  }
  const pairs = (await Promise.all(requests)).flat();

  // Best pair per token = the one with the most liquidity.
  const best = new Map<string, Pair>();
  for (const p of pairs) {
    if (!p?.baseToken?.address) continue;
    const k = `${p.chainId}:${p.baseToken.address}`;
    const cur = best.get(k);
    if (!cur || (p.liquidity?.usd ?? 0) > (cur.liquidity?.usd ?? 0)) best.set(k, p);
  }

  const now = Date.now();
  const items: DexItem[] = [];
  for (const p of best.values()) {
    const liquidity = p.liquidity?.usd ?? 0, volume24h = p.volume?.h24 ?? 0, price = Number(p.priceUsd);
    const ageDays = p.pairCreatedAt ? (now - p.pairCreatedAt) / 86_400_000 : 0;
    if (!isFinite(price) || price <= 0 || liquidity < MIN_LIQUIDITY || volume24h < MIN_VOLUME_24H || ageDays < MIN_AGE_DAYS) continue;
    const dexscreener = p.url && /^https:\/\/dexscreener\.com\//.test(p.url) ? p.url : `https://dexscreener.com/${p.chainId}/${p.pairAddress}`;
    const image = p.info?.imageUrl && /^https:\/\/cdn\.dexscreener\.com\//.test(p.info.imageUrl) ? p.info.imageUrl : undefined;
    const slug = DEXTOOLS[p.chainId];
    items.push({
      chain: p.chainId, symbol: String(p.baseToken.symbol || '').slice(0, 20), name: String(p.baseToken.name || '').slice(0, 60),
      address: p.baseToken.address, pair: p.pairAddress, price, change24h: typeof p.priceChange?.h24 === 'number' ? p.priceChange.h24 : null,
      volume24h, liquidity, ageDays: Math.floor(ageDays), image, dexscreener,
      dextools: slug ? `https://www.dextools.io/app/en/${slug}/pair-explorer/${p.pairAddress}` : undefined,
      // Phantom's universal link opens a page inside Phantom's in-app browser (Solana wallet).
      phantom: p.chainId === 'solana' ? `https://phantom.app/ul/browse/${encodeURIComponent(dexscreener)}?ref=${encodeURIComponent(siteUrl())}` : undefined,
    });
  }
  return items.sort((a, b) => b.volume24h - a.volume24h).slice(0, MAX_ITEMS);
}

const json = (items: DexItem[]) => Response.json({ items, source: 'DEX Screener', updated: new Date(cache.at || Date.now()).toISOString() }, { headers: { 'cache-control': 'public, s-maxage=120, stale-while-revalidate=300' } });

export async function GET() {
  if (cache.items.length && Date.now() - cache.at < 300_000) return json(cache.items);
  try {
    const items = await build();
    if (items.length) { cache.at = Date.now(); cache.items = items; }
    return json(items.length ? items : cache.items);
  } catch {
    return json(cache.items);
  }
}
