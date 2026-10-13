import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getCleanLang } from '../../i18n';

const SITE_ORIGIN = 'https://www.brennholzkaufen.online';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/images/brennholzkaufen_logo_transparent.png`;

/**
 * Composant SEO universel natif (100% compatible React 18 / StrictMode) :
 * Gère <title>, <meta description>, OpenGraph, Twitter Cards, hreflang multilingue
 * et les données structurées Schema.org JSON-LD (Rich Snippets Google).
 * Remplace react-helmet pour supprimer l'avertissement UNSAFE_componentWillMount / SideEffect(NullComponent).
 */
const SEO = ({
  title,
  description,
  keywords,
  image,
  path = '',
  type = 'website',
  product = null
}) => {
  const { i18n } = useTranslation();
  const lang = getCleanLang(i18n.language);
  const isDe = lang === 'de';

  // Valeurs par défaut optimisées pour le référencement
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

  // URLs canoniques et hreflang
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const canonicalUrl = `${SITE_ORIGIN}/${lang}${cleanPath}`;
  const frUrl = `${SITE_ORIGIN}/fr${cleanPath}`;
  const deUrl = `${SITE_ORIGIN}/de${cleanPath}`;

  useEffect(() => {
    // 1. Langue et Titre du document
    document.documentElement.lang = lang;
    document.title = metaTitle;

    // Helper pour créer ou mettre à jour une balise <meta>
    const setMetaTag = (attribute, attrValue, content) => {
      let tag = document.querySelector(`meta[${attribute}="${attrValue}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, attrValue);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content || '');
    };

    // Helper pour créer ou mettre à jour une balise <link>
    const setLinkTag = (rel, href, hreflang = null) => {
      const selector = hreflang
        ? `link[rel="${rel}"][hreflang="${hreflang}"]`
        : `link[rel="${rel}"]`;
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('link');
        tag.setAttribute(rel, rel);
        if (hreflang) tag.setAttribute('hreflang', hreflang);
        document.head.appendChild(tag);
      }
      tag.setAttribute('href', href);
    };

    // Meta descriptions & keywords
    setMetaTag('name', 'description', metaDescription);
    setMetaTag('name', 'keywords', metaKeywords);

    // Balises canoniques & hreflang pour Google
    setLinkTag('canonical', canonicalUrl);
    setLinkTag('alternate', deUrl, 'de');
    setLinkTag('alternate', frUrl, 'fr');
    setLinkTag('alternate', deUrl, 'x-default');

    // OpenGraph
    setMetaTag('property', 'og:type', type === 'product' ? 'product' : 'website');
    setMetaTag('property', 'og:site_name', 'brennholzkaufen');
    setMetaTag('property', 'og:title', metaTitle);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', metaImage);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', metaTitle);
    setMetaTag('name', 'twitter:description', metaDescription);
    setMetaTag('name', 'twitter:image', metaImage);

    // Données structurées Schema.org JSON-LD
    let schemaData = null;
    if (type === 'product' && product) {
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: metaTitle,
        image: [metaImage],
        description: metaDescription,
        sku: product.id,
        mpn: product.id,
        brand: { '@type': 'Brand', name: 'brennholzkaufen' },
        offers: {
          '@type': 'Offer',
          url: canonicalUrl,
          priceCurrency: 'EUR',
          price: product.price ? Number(product.price).toFixed(2) : '0.00',
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: (product.stock > 0 || product.stock === undefined)
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'brennholzkaufen' }
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating || '4.8',
          reviewCount: '42',
          bestRating: '5',
          worstRating: '1'
        }
      };
    } else {
      schemaData = {
        '@context': 'https://schema.org',
        '@type': 'OnlineStore',
        name: 'brennholzkaufen',
        url: SITE_ORIGIN,
        logo: DEFAULT_IMAGE,
        image: DEFAULT_IMAGE,
        description: defaultDesc,
        telephone: '+49 1633637236',
        priceRange: '€€',
        currenciesAccepted: 'EUR',
        paymentAccepted: 'Bank Transfer, PayPal, Credit Card',
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '18:00'
          }
        ]
      };
    }

    let scriptTag = document.querySelector('script[data-seo="json-ld"]');
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.setAttribute('type', 'application/ld+json');
      scriptTag.setAttribute('data-seo', 'json-ld');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(schemaData);
  }, [lang, metaTitle, metaDescription, metaKeywords, metaImage, canonicalUrl, deUrl, frUrl, type, product, defaultDesc]);

  return null;
};

export default SEO;
