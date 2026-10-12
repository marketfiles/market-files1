import type { MetadataRoute } from 'next';
import { ARTICLES, siteUrl } from '@/lib/content';
import { listEvents } from '@/lib/db';
import { SECTION_PATHS } from '@/lib/sections';

// Sections that need a query or an id to show anything are not listed.
const NOT_LISTED = new Set<string>(['search', 'research', 'timeline']);
const MAIN = new Set<string>(['markets', 'global-finance', 'crypto', 'companies', 'history']);
export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const days = new Set<string>([...ARTICLES.filter((a) => a.prec !== 'y').map((a) => a.date), ...(await listEvents()).map((e) => e.date)]);
  return [
    { url: base, changeFrequency: 'always', priority: 1 },
    { url: `${base}/files`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/blog`, changeFrequency: 'daily', priority: 0.8 },
    ...SECTION_PATHS.filter((s) => !NOT_LISTED.has(s)).map((s) => ({ url: `${base}/${s}`, changeFrequency: 'daily' as const, priority: MAIN.has(s) ? 0.9 : 0.6 })),
    ...ARTICLES.map((a) => ({ url: `${base}/files/${a.slug}`, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...[...days].map((d) => ({ url: `${base}/day/${d}`, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ];
}
