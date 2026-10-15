const fs = require('fs');
const path = require('path');
const vm = require('vm');

const prods = JSON.parse(fs.readFileSync(path.join(__dirname, '../apps/client/products_export.json'), 'utf8'));
const trCode = fs.readFileSync(path.join(__dirname, '../apps/client/src/data/productTranslations.js'), 'utf8')
  .replace(/export\s+const\s+productTranslations\s*=/, 'productTranslations =');
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(trCode, sandbox);
const tr = sandbox.productTranslations;

function slugify(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const productSlugs = {};
const slugToId = {};

for (const p of prods) {
  const t = tr[p.id] || {};
  const deName = t.de?.name || p.name;
  const frName = t.fr?.name || p.name;
  const deSlug = slugify(deName);
  const frSlug = slugify(frName);

  productSlugs[p.id] = {
    de: deSlug,
    fr: frSlug
  };

  slugToId[deSlug] = p.id;
  slugToId[frSlug] = p.id;
}

const content = `// Mapping sémantique officiel des 45 produits vers leurs URLs SEO (Slugs DE et FR)
// Optimisé pour le référencement naturel Google en Allemagne et France.

export const PRODUCT_SLUGS = ${JSON.stringify(productSlugs, null, 2)};

export const SLUG_TO_ID = ${JSON.stringify(slugToId, null, 2)};

/**
 * Renvoie le slug SEO du produit pour la langue spécifiée ('de' ou 'fr').
 * Si le paramètre passé est déjà un slug, renvoie le slug correspondant.
 */
export function getProductSlug(idOrSlug, lang = 'de') {
  if (!idOrSlug) return '';
  const cleanLang = lang === 'fr' ? 'fr' : 'de';
  
  // 1. Si c'est déjà un ID direct
  if (PRODUCT_SLUGS[idOrSlug]) {
    return PRODUCT_SLUGS[idOrSlug][cleanLang] || idOrSlug;
  }
  
  // 2. Si c'est un slug (DE ou FR), trouver l'ID associé
  const resolvedId = SLUG_TO_ID[idOrSlug];
  if (resolvedId && PRODUCT_SLUGS[resolvedId]) {
    return PRODUCT_SLUGS[resolvedId][cleanLang] || idOrSlug;
  }
  
  return idOrSlug;
}

/**
 * Retrouve l'ID Firebase / Catalogue à partir d'un slug (DE ou FR) ou d'un ID.
 */
export function getProductIdFromSlug(slugOrId) {
  if (!slugOrId) return '';
  if (PRODUCT_SLUGS[slugOrId]) return slugOrId;
  if (SLUG_TO_ID[slugOrId]) return SLUG_TO_ID[slugOrId];
  return slugOrId;
}

/**
 * Renvoie l'URL produit canonique localisée (ex: /de/produkt/kaminholz-eiche-30cm...)
 */
export function getLocalizedProductPath(idOrSlug, lang = 'de') {
  const cleanLang = lang === 'fr' ? 'fr' : 'de';
  const slug = getProductSlug(idOrSlug, cleanLang);
  const prefix = cleanLang === 'de' ? 'produkt' : 'produit';
  return '/' + cleanLang + '/' + prefix + '/' + slug;
}
`;

const destPath = path.join(__dirname, '../apps/client/src/data/productSlugs.js');
fs.writeFileSync(destPath, content, 'utf8');
console.log('✔ apps/client/src/data/productSlugs.js généré avec succès !', Object.keys(productSlugs).length, 'produits.');
