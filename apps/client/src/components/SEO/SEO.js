import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCleanLang } from '../../i18n';
import routeMapping from '../../utils/routeMapping.json';
import { getProductSlug, getProductIdFromSlug } from '../../data/productSlugs';

const SITE_ORIGIN = 'https://www.brennholzkaufen.online';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/images/brennholzkaufen_logo_transparent.png`;

/**
 * Résout les URLs réciproques allemande (de) et française (fr)
 * de manière 100% cohérente et conforme aux recommandations Google hreflang.
 */
function resolveAlternateUrls({ routeKey, path, pathDe, pathFr, product, lang }) {
  // 1. Si fiches produit
  if (product && product.id) {
    const deSlug = getProductSlug(product.id, 'de') || product.id;
    const frSlug = getProductSlug(product.id, 'fr') || product.id;
    const deUrl = `${SITE_ORIGIN}/de/produkt/${deSlug}`;
    const frUrl = `${SITE_ORIGIN}/fr/produit/${frSlug}`;
    return {
      deUrl,
      frUrl,
      canonicalUrl: lang === 'de' ? deUrl : frUrl,
    };
  }

  // 2. Si routeKey fournie (ex: 'about', 'legal', 'delivery', etc.)
  if (routeKey && routeMapping[routeKey]) {
    const deSlug = routeMapping[routeKey].de;
    const frSlug = routeMapping[routeKey].fr;
    const deUrl = `${SITE_ORIGIN}/de${deSlug ? `/${deSlug}` : ''}`;
    const frUrl = `${SITE_ORIGIN}/fr${frSlug ? `/${frSlug}` : ''}`;
    return {
      deUrl,
      frUrl,
      canonicalUrl: lang === 'de' ? deUrl : frUrl,
    };
  }

  // 3. Si pathDe et pathFr explicites
  if (pathDe || pathFr) {
    const deUrl = `${SITE_ORIGIN}/de${pathDe ? (pathDe.startsWith('/') ? pathDe : `/${pathDe}`) : ''}`;
    const frUrl = `${SITE_ORIGIN}/fr${pathFr ? (pathFr.startsWith('/') ? pathFr : `/${pathFr}`) : ''}`;
    return {
      deUrl,
      frUrl,
      canonicalUrl: lang === 'de' ? deUrl : frUrl,
    };
  }

  // 4. Fallback basé sur path (ex: '/impressum' ou '/de/produkte')
  const clean = (path || '').replace(/^\/(de|fr)(\/|$)/, '/').replace(/^\//, '');
  if (!clean) {
    // Page d'accueil
    return {
      deUrl: `${SITE_ORIGIN}/de`,
      frUrl: `${SITE_ORIGIN}/fr`,
      canonicalUrl: `${SITE_ORIGIN}/${lang}`,
    };
  }

  // Vérifier si clean correspond à un slug existant dans routeMapping
  for (const mapping of Object.values(routeMapping)) {
    if (mapping.de === clean || mapping.fr === clean) {
      const deUrl = `${SITE_ORIGIN}/de${mapping.de ? `/${mapping.de}` : ''}`;
      const frUrl = `${SITE_ORIGIN}/fr${mapping.fr ? `/${mapping.fr}` : ''}`;
      return {
        deUrl,
        frUrl,
        canonicalUrl: lang === 'de' ? deUrl : frUrl,
      };
    }
  }

  // Si produit avec slug ou ID (ex: 'produkt/kaminholz...' ou 'produit/123')
  const prodMatch = clean.match(/^(?:produkt|produit)\/([^/]+)/);
  if (prodMatch) {
    const rawIdOrSlug = prodMatch[1];
    const realId = getProductIdFromSlug(rawIdOrSlug) || rawIdOrSlug;
    const deSlug = getProductSlug(realId, 'de') || rawIdOrSlug;
    const frSlug = getProductSlug(realId, 'fr') || rawIdOrSlug;
    const deUrl = `${SITE_ORIGIN}/de/produkt/${deSlug}`;
    const frUrl = `${SITE_ORIGIN}/fr/produit/${frSlug}`;
    return {
      deUrl,
      frUrl,
      canonicalUrl: lang === 'de' ? deUrl : frUrl,
    };
  }

  // Fallback symétrique sécurisé
  return {
    deUrl: `${SITE_ORIGIN}/de/${clean}`,
    frUrl: `${SITE_ORIGIN}/fr/${clean}`,
    canonicalUrl: `${SITE_ORIGIN}/${lang}/${clean}`,
  };
}

/**
 * Composant SEO universel natif (100% compatible React 18 / StrictMode) :
 * - Balises <title> et <meta description> uniques par route
 * - URL canonique absolue stricte
 * - Balises <link rel="alternate" hreflang="..."> réciproques + x-default (DE)
 * - Données structurées Schema.org JSON-LD (Product, BreadcrumbList, Organization, WebSite)
 * - OpenGraph & Twitter Cards
 * - Directives d'indexation (noindex sur checkout/virement/espace privé)
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  path = '',
  pathDe,
  pathFr,
  routeKey,
  type = 'website',
  product = null,
  noindex = false,
}) => {
  const { i18n } = useTranslation();
  const lang = getCleanLang(i18n.language);
  const isDe = lang === 'de';

  // Valeurs par défaut optimisées pour le marché allemand
  const defaultTitle = isDe
    ? 'Brennholz Kaufen | Premium Kaminholz & Holzpellets – Lieferung Deutschland'
    : 'Bois de Chauffage & Granulés Premium | Vente en ligne & Livraison';

  const defaultDesc = isDe
    ? 'Kaufen Sie ofenfertiges Brennholz (Eiche, Buche), DINplus Holzpellets und Holzbriketts. Schnelle und zuverlässige Lieferung mit Mitnahmestapler direkt zu Ihnen.'
    : 'Achetez votre bois de chauffage sec (chêne, hêtre), pellets certifiés DINplus et bûches densifiées. Livraison soignée par chariot embarqué partout en France.';

  const defaultKeywords = isDe
    ? 'Brennholz, Kaminholz, Holzpellets, Holzbriketts, Brennholz kaufen, Kaminholz kaufen, Pellets 15kg, Lieferung Deutschland, Eiche, Buche'
    : 'bois de chauffage, bûches de bois, granulés de bois, pellets, bûches compressées, achat bois chauffage, livraison bois';

  const metaTitle = title ? `${title} | brennholzkaufen` : defaultTitle;
  const metaDescription = description || defaultDesc;
  const metaKeywords = keywords || defaultKeywords;
  const metaImage = image || DEFAULT_IMAGE;

  const { deUrl, frUrl, canonicalUrl } = resolveAlternateUrls({
    routeKey,
    path,
    pathDe,
    pathFr,
    product,
    lang,
  });

  useEffect(() => {
    // 1. Langue et Titre
    document.documentElement.lang = lang;
    document.title = metaTitle;

    // Helper <meta>
    const setMetaTag = (attribute, attrValue, content) => {
      let tag = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content || '');
    };

    // Helper <link>
    const setLinkTag = (rel, href, hreflang = null) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute('rel', rel);
        if (hreflang) tag.setAttribute('hreflang', hreflang);
        document.head.appendChild(tag);
      }
      tag.setAttribute('href', href);
    };

    // 2. Directives robots
    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1');
    }

    // 3. Description & Mots-clés
    setMetaTag('name', 'description', metaDescription);
    setMetaTag('name', 'keywords', metaKeywords);

    // 4. Balises Canoniques & Hreflang
    if (!noindex) {
      setLinkTag('canonical', canonicalUrl);
      setLinkTag('alternate', deUrl, 'de');
      setLinkTag('alternate', frUrl, 'fr');
      setLinkTag('alternate', deUrl, 'x-default');
    }

    // 5. OpenGraph
    setMetaTag('property', 'og:type', type === 'product' ? 'product' : 'website');
    setMetaTag('property', 'og:site_name', 'brennholzkaufen');
    setMetaTag('property', 'og:title', metaTitle);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', metaImage);

    // 6. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', metaTitle);
    setMetaTag('name', 'twitter:description', metaDescription);
    setMetaTag('name', 'twitter:image', metaImage);

    // 7. Données structurées Schema.org JSON-LD
    const schemas = [];

    // Organization & WebSite (sur toutes les pages publiques)
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'brennholzkaufen',
      url: SITE_ORIGIN,
      logo: DEFAULT_IMAGE,
      contactPoint: [{
        '@type': 'ContactPoint',
        telephone: '+49 1633637236',
        contactType: 'customer service',
        availableLanguage: ['German', 'French'],
        areaServed: ['DE', 'AT', 'CH', 'LU', 'FR'],
      }],
    });

    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'brennholzkaufen',
      url: SITE_ORIGIN,
      inLanguage: ['de', 'fr'],
    });

    // BreadcrumbList
    if (type === 'product' && product) {
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isDe ? 'Startseite' : 'Accueil',
            item: `${SITE_ORIGIN}/${lang}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: isDe ? 'Produkte' : 'Produits',
            item: `${SITE_ORIGIN}/${lang}/${isDe ? 'produkte' : 'produits'}`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: title || product.name,
            item: canonicalUrl,
          },
        ],
      });

      // Product Schema (sans fausses notes inventées, conforme Google Merchant)
      const productSchema = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title || product.name,
        image: [metaImage],
        description: metaDescription,
        sku: String(product.id || ''),
        mpn: String(product.id || ''),
        brand: { '@type': 'Brand', name: 'brennholzkaufen' },
        offers: {
          '@type': 'Offer',
          url: canonicalUrl,
          priceCurrency: 'EUR',
          price: product.price ? Number(product.price).toFixed(2) : '0.00',
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: (product.stock > 0 || product.stock === undefined || product.stock === null)
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'brennholzkaufen' },
          shippingDetails: {
            '@type': 'OfferShippingDetails',
            shippingRate: {
              '@type': 'MonetaryAmount',
              value: '0.00',
              currency: 'EUR',
            },
            shippingDestination: {
              '@type': 'DefinedRegion',
              addressCountry: 'DE',
            },
            deliveryTime: {
              '@type': 'ShippingDeliveryTime',
              handlingTime: {
                '@type': 'QuantitativeValue',
                minValue: 1,
                maxValue: 2,
                unitCode: 'd',
              },
              transitTime: {
                '@type': 'QuantitativeValue',
                minValue: 2,
                maxValue: 5,
                unitCode: 'd',
              },
            },
          },
          hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'DE',
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn',
          },
        },
      };

      // Si et seulement si un avis réel vérifié existe
      if (product.rating && product.reviewCount) {
        productSchema.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: String(product.rating),
          reviewCount: String(product.reviewCount),
          bestRating: '5',
          worstRating: '1',
        };
      }

      schemas.push(productSchema);
    } else if (title) {
      // Breadcrumb pour pages secondaires (ex: Lieferung, Über uns, etc.)
      schemas.push({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: isDe ? 'Startseite' : 'Accueil',
            item: `${SITE_ORIGIN}/${lang}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: title,
            item: canonicalUrl,
          },
        ],
      });
    }

    // Injection JSON-LD
    let scriptTag = document.querySelector('script[data-seo="json-ld"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-seo', 'json-ld');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : { '@context': 'https://schema.org', '@graph': schemas });
  }, [lang, isDe, metaTitle, metaDescription, metaKeywords, metaImage, canonicalUrl, deUrl, frUrl, type, product, noindex, title]);

  return null;
};

export default SEO;
