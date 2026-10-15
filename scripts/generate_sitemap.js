const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE_ORIGIN = 'https://www.brennholzkaufen.online';
// Date stable de déploiement pour éviter le churn artificiel de lastmod
const BASE_MOD_DATE = '2026-10-15';

// Chargement dynamique de la liste des 45 produits depuis products_export.json
const productsFilePath = path.join(__dirname, '../apps/client/products_export.json');
let productIds = [];

try {
  if (fs.existsSync(productsFilePath)) {
    const rawData = fs.readFileSync(productsFilePath, 'utf8');
    const products = JSON.parse(rawData);
    productIds = products.map((p) => p.id).filter(Boolean);
  }
} catch (err) {
  console.warn('⚠️ Impossible de lire products_export.json, fallback sur la liste statique.', err.message);
}

if (!productIds.length) {
  productIds = [
    '1GvCQNHsSUV2u7N0Iu7n', '1kH3QPMgGRbgV5IGRhtJ', '4xnJQb0VbKjQm2y15VtK', '5vRLYaWDgBS7SZdq2zod',
    '6w51C7zL5oriNyIWDGgi', '70ZOY8ejkJtr4gRi4RbO', 'DxReN1VcrkjmtlxsLFfu', 'HtjwWTBbmKYRP4tSRAIn',
    'Ij2RgiYOA7hsOQatl3rN', 'K4jT9akyftIOBVN5Ny1b', 'LWNA3UFw1wkMHd3Toc4c', 'NnjCiLEuPyjpceDyXQO0',
    'ORl6EKPLt2mSsMWFb0GV', 'S11ZwI4gZgZrKQ77DVGE', 'SaeSGHJTps6aXWkqMg6D', 'TwucTXrkfwuACzm2apoK',
    'U2nMYzKlsY7Tmd66kCqQ', 'V7AG3YkpB1dgDoJ2oPIr', 'XBWIkgJqEfHTtL6tuf4P', 'XEWkhQhgRgr6tmQN9oBe',
    'Xgii2G5JvYU7PsLTHsj1', 'YA4EljGbSeGYNOoDA2Tz', 'ZuFfBaULE7wxFviKZEzN', 'a9i83iPwdq9FM2ToX2O7',
    'auIvyc6nBkbckvJheM0w', 'cJCzYcua4fkTLfyhKJdZ', 'dMw8NCGNlN9bTaTWX1XK', 'eDk5aVbpe4l1lruyjLjw',
    'h6bkiWTwmhNQdN2tggW5', 'haWGqYacqgvIVeEkVrxR', 'iNP4BmVghZcgjzIT3h1l', 'jqABEnQcTGTmuBtYZ3yY',
    'lPjWFxMW4zHoKfH84dvM', 'mrdELcaZljWUCgq8rr2q', 'qbOzwEGLD7LJSkeDxauA', 'rZDlEYtqyaiVjzzQfVk6',
    'sAf9Fn6Wz3a8I6diitoL', 'tUiQykklRGXrErQtt9Q5', 'vIm56w5tx1QIz77YT4vd', 'wIAKQ3Z5OlZp2ox6jHu0',
    'x2BPM7eiTq9tmnVAg5Uu', 'xPY8WMqt9rKwFcPYa4hF', 'xnbjMy0At54hQOBVm82Q', 'y0DfnhikbVZZOyXizxVq',
    'yOwHZLQzM7ZBgcfSMymH'
  ];
}

// Chargement des slugs de produits
const slugsFilePath = path.join(__dirname, '../apps/client/src/data/productSlugs.js');
let productSlugs = {};
try {
  const code = fs.readFileSync(slugsFilePath, 'utf8')
    .replace(/export\s+const\s+PRODUCT_SLUGS\s*=/, 'PRODUCT_SLUGS =')
    .replace(/export\s+const\s+SLUG_TO_ID\s*=/, 'SLUG_TO_ID =')
    .replace(/export\s+function/g, 'function');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  productSlugs = sandbox.PRODUCT_SLUGS || {};
} catch (err) {
  console.warn('⚠️ Impossible de lire productSlugs.js:', err.message);
}

const staticPages = [
  { de: '/de', fr: '/fr', priority: '1.0', changefreq: 'weekly' },
  { de: '/de/produkte', fr: '/fr/produits', priority: '0.9', changefreq: 'weekly' },
  { de: '/de/ueber-uns', fr: '/fr/a-propos', priority: '0.7', changefreq: 'monthly' },
  { de: '/de/kontakt', fr: '/fr/contact', priority: '0.8', changefreq: 'monthly' },
  { de: '/de/lieferung', fr: '/fr/livraison', priority: '0.8', changefreq: 'monthly' },
  { de: '/de/rueckgabe', fr: '/fr/retours', priority: '0.6', changefreq: 'monthly' },
  { de: '/de/datenschutz', fr: '/fr/confidentialite', priority: '0.5', changefreq: 'monthly' },
  { de: '/de/agb', fr: '/fr/cgv', priority: '0.5', changefreq: 'monthly' },
  { de: '/de/impressum', fr: '/fr/mentions-legales', priority: '0.5', changefreq: 'monthly' }
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

// 1. Pages statiques multilingues avec balises alternate hreflang et x-default
for (const p of staticPages) {
  // Entrée Allemand
  xml += `  <url>
    <loc>${SITE_ORIGIN}${p.de}</loc>
    <lastmod>${BASE_MOD_DATE}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="de" href="${SITE_ORIGIN}${p.de}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_ORIGIN}${p.fr}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${p.de}" />
  </url>
`;
  // Entrée Français
  xml += `  <url>
    <loc>${SITE_ORIGIN}${p.fr}</loc>
    <lastmod>${BASE_MOD_DATE}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
    <xhtml:link rel="alternate" hreflang="de" href="${SITE_ORIGIN}${p.de}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_ORIGIN}${p.fr}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${p.de}" />
  </url>
`;
}

// 2. Fiches des 45 produits avec URLs sémantiques mots-clés (DE et FR)
for (const id of productIds) {
  const deSlug = productSlugs[id]?.de || id;
  const frSlug = productSlugs[id]?.fr || id;
  const deProd = `/de/produkt/${deSlug}`;
  const frProd = `/fr/produit/${frSlug}`;

  xml += `  <url>
    <loc>${SITE_ORIGIN}${deProd}</loc>
    <lastmod>${BASE_MOD_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="de" href="${SITE_ORIGIN}${deProd}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_ORIGIN}${frProd}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${deProd}" />
  </url>
`;
  xml += `  <url>
    <loc>${SITE_ORIGIN}${frProd}</loc>
    <lastmod>${BASE_MOD_DATE}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <xhtml:link rel="alternate" hreflang="de" href="${SITE_ORIGIN}${deProd}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${SITE_ORIGIN}${frProd}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}${deProd}" />
  </url>
`;
}

xml += `</urlset>\n`;

const sitemapPublicPath = path.join(__dirname, '../apps/client/public/sitemap.xml');
fs.writeFileSync(sitemapPublicPath, xml, 'utf8');

const sitemapBuildPath = path.join(__dirname, '../apps/client/build/sitemap.xml');
if (fs.existsSync(path.dirname(sitemapBuildPath))) {
  fs.writeFileSync(sitemapBuildPath, xml, 'utf8');
}

console.log('✔ sitemap.xml généré avec succès avec slugs de mots-clés :', staticPages.length * 2 + productIds.length * 2, 'URLs canoniques indexables.');
