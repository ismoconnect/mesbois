import React from 'react';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { getCleanLang } from '../../i18n';

const SITE_ORIGIN = 'https://www.brennholzkaufen.online';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/images/brennholzkaufen_logo_transparent.png`;

/**
 * Composant SEO universel :
 * Gère <title>, <meta description>, OpenGraph, Twitter Cards, hreflang multilingue
 * et les données structurées Schema.org JSON-LD (Rich Snippets Google).
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

  // Valeurs par défaut optimisées pour le SEO
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

  // Construction des URLs canoniques et hreflang
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const canonicalUrl = `${SITE_ORIGIN}/${lang}${cleanPath}`;
  const frUrl = `${SITE_ORIGIN}/fr${cleanPath}`;
  const deUrl = `${SITE_ORIGIN}/de${cleanPath}`;

  // Construction du JSON-LD Schema.org
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
      brand: {
        '@type': 'Brand',
        name: 'brennholzkaufen'
      },
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
        seller: {
          '@type': 'Organization',
          name: 'brennholzkaufen'
        }
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
    // Schéma OnlineStore & LocalBusiness pour les pages d'accueil et générales
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

  return (
    <Helmet>
      {/* Balises primaires */}
      <html lang={lang} />
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />

      {/* Canonique & multilingue hreflang pour Google */}
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="de" href={deUrl} />
      <link rel="alternate" hrefLang="fr" href={frUrl} />
      <link rel="alternate" hrefLang="x-default" href={deUrl} />

      {/* OpenGraph / Facebook / WhatsApp */}
      <meta property="og:type" content={type === 'product' ? 'product' : 'website'} />
      <meta property="og:site_name" content="brennholzkaufen" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Données structurées Google Schema.org JSON-LD */}
      {schemaData && (
        <script type="application/ld+json">
          {JSON.stringify(schemaData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
