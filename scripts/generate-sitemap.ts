import fs from 'fs';
import { ARTICLES } from '../src/data/articles';

const baseUrl = 'https://emre-pelit-sci-phi.ai.studio';
const todayStr = new Date().toISOString().slice(0, 10);
const langs = ['tr', 'en', 'de', 'fr', 'es', 'it', 'ru', 'ar', 'zh', 'ja'];

const allUrls = [
  { loc: `${baseUrl}/`, lastmod: todayStr, priority: '1.0', changefreq: 'hourly' },
  { loc: `${baseUrl}/analytics.html`, lastmod: todayStr, priority: '0.85', changefreq: 'daily' },
  ...ARTICLES.map((art) => ({
    loc: `${baseUrl}/makale/${encodeURIComponent(art.slug)}`,
    lastmod: /^\d{4}-\d{2}-\d{2}$/.test(art.date || '') ? art.date : todayStr,
    priority: art.featured ? '0.95' : '0.85',
    changefreq: 'daily'
  }))
];

function xmlEscape(str: string): string {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${xmlEscape(u.loc)}</loc>
    ${u.lastmod ? `<lastmod>${xmlEscape(u.lastmod)}</lastmod>` : ''}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
${langs.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(u.loc)}?lang=${l}" />`).join('\n')}
    <xhtml:link rel="alternate" hreflang="x-default" href="${xmlEscape(u.loc)}" />
  </url>`
  )
  .join('\n')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', xml, 'utf-8');
console.log('public/sitemap.xml written successfully with ' + allUrls.length + ' URLs');
