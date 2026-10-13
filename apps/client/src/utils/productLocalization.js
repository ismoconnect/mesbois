import { productTranslations } from '../data/productTranslations';
import { getCleanLang } from '../i18n';

/**
 * Retourne le produit avec son titre, sa description et son unité traduits
 * selon la langue courante ('fr' ou 'de').
 */
export const getLocalizedProduct = (product, rawLang = 'fr') => {
  if (!product) return product;

  const lang = getCleanLang(rawLang);
  const trans = productTranslations[product.id]?.[lang];

  if (trans) {
    return {
      ...product,
      name: trans.name || product.name,
      description: trans.description || product.description,
      unit: trans.unit || product.unit || (lang === 'de' ? 'Palette' : 'Palette')
    };
  }

  // Si pas de traduction exacte par ID, fallback intelligent
  const isDe = lang === 'de';
  let name = product.name || '';
  let description = product.description || '';

  if (isDe) {
    // Si le titre original est en français, traductions génériques
    name = name
      .replace(/Bois de chauffage/gi, 'Brennholz')
      .replace(/Chêne/gi, 'Eiche')
      .replace(/Hêtre/gi, 'Buche')
      .replace(/stères?/gi, 'Raummeter')
      .replace(/Granulés de bois/gi, 'Holzpellets')
      .replace(/Bûches densifiées/gi, 'Hartholzbriketts')
      .replace(/Bûches compressées/gi, 'Holzbriketts')
      .replace(/Poêle à granulés/gi, 'Pelletofen')
      .replace(/Poêle à bois/gi, 'Kaminofen');

    if (description.includes('qualité premium')) {
      description = 'Ofenfertiges Premium-Qualitätsprodukt mit garantiert hohem Heizwert und schneller Lieferung.';
    }
  }

  return {
    ...product,
    name,
    description
  };
};

/**
 * Traduit une liste de produits
 */
export const getLocalizedProducts = (products = [], rawLang = 'fr') => {
  if (!Array.isArray(products)) return [];
  return products.map(p => getLocalizedProduct(p, rawLang));
};
