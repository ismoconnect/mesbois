const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE_ORIGIN = 'https://www.brennholzkaufen.online';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/images/brennholzkaufen_logo_transparent.png`;
const CLIENT_BUILD_DIR = path.join(__dirname, '../apps/client/build');
const TEMPLATE_PATH = path.join(CLIENT_BUILD_DIR, 'index.html');
const PRODUCTS_JSON_PATH = path.join(__dirname, '../apps/client/products_export.json');
const TRANSLATIONS_PATH = path.join(__dirname, '../apps/client/src/data/productTranslations.js');

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error('❌ Template introuvable :', TEMPLATE_PATH);
  console.error('Veuillez exécuter react-scripts build d’abord.');
  process.exit(1);
}

const templateHtml = fs.readFileSync(TEMPLATE_PATH, 'utf8');

// 1. Charger les produits et traductions
let products = [];
try {
  products = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf8'));
} catch (err) {
  console.error('Erreur lecture products_export.json:', err.message);
}

let productTranslations = {};
try {
  const code = fs.readFileSync(TRANSLATIONS_PATH, 'utf8').replace(/export\s+const\s+productTranslations\s*=/, 'productTranslations =');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  productTranslations = sandbox.productTranslations || {};
} catch (err) {
  console.error('Erreur lecture productTranslations.js:', err.message);
}

const SLUGS_PATH = path.join(__dirname, '../apps/client/src/data/productSlugs.js');
let productSlugs = {};
try {
  const code = fs.readFileSync(SLUGS_PATH, 'utf8')
    .replace(/export\s+const\s+PRODUCT_SLUGS\s*=/, 'PRODUCT_SLUGS =')
    .replace(/export\s+const\s+SLUG_TO_ID\s*=/, 'SLUG_TO_ID =')
    .replace(/export\s+function/g, 'function');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox);
  productSlugs = sandbox.PRODUCT_SLUGS || {};
} catch (err) {
  console.error('Erreur lecture productSlugs.js:', err.message);
}

/**
 * Génère une page HTML complète avec balises SEO, JSON-LD et snapshot sémantique
 */
function buildHtml({
  lang = 'de',
  title = '',
  description = '',
  canonicalUrl = '',
  deUrl = '',
  frUrl = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  schemaJson = null,
  bodyContent = '',
}) {
  let html = templateHtml;

  // 1. Remplacement lang
  html = html.replace(/<html[^>]*>/, `<html lang="${lang}">`);

  // 2. Head Tags (Title, Meta Description, Canonical, Hreflang, OG, Twitter)
  const headSnippet = `
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <link rel="alternate" hreflang="de" href="${deUrl}" />
    <link rel="alternate" hreflang="fr" href="${frUrl}" />
    <link rel="alternate" hreflang="x-default" href="${deUrl}" />
    <!-- Google Search Console Verification -->
    <meta name="google-site-verification" content="google8ed680060d5c7d96" />
    <meta name="google-site-verification" content="8ed680060d5c7d96" />

    <!-- OpenGraph -->
    <meta property="og:type" content="${type === 'product' ? 'product' : 'website'}" />
    <meta property="og:site_name" content="brennholzkaufen" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(description)}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${image}" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(description)}" />
    <meta name="twitter:image" content="${image}" />

    ${schemaJson ? `<script type="application/ld+json" data-seo="json-ld">${JSON.stringify(schemaJson)}</script>` : ''}
  `;

  // Nettoyer les anciens title et descriptions dans le template
  html = html.replace(/<title>.*?<\/title>/i, '');
  html = html.replace(/<meta name="description"[^>]*>/i, '');

  // Insérer le headSnippet avant </head>
  html = html.replace('</head>', `${headSnippet}\n</head>`);

  // 3. Insérer un loader épuré dans <div id="root"> pour un rendu fluide et sans flash pour les humains
  // Et placer le contenu sémantique complet dans <noscript> pour les robots sans JavaScript
  const splashLoader = `
    <div style="min-height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#ffffff; font-family:Inter,-apple-system,sans-serif;">
      <img src="/images/brennholzkaufen_logo_transparent.png" alt="brennholzkaufen" style="height:46px; width:auto; margin-bottom:14px; object-fit:contain;" />
      <div style="width:28px; height:28px; border:3px solid #e2e8f0; border-top-color:#2c5530; border-radius:50%; animation:bk-spin 0.8s linear infinite;"></div>
      <style>@keyframes bk-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }</style>
    </div>
  `;

  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${splashLoader}</div>\n    <noscript>${bodyContent}</noscript>`
  );

  return html;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function writePage(relPath, htmlContent) {
  const fullPath = path.join(CLIENT_BUILD_DIR, relPath);
  ensureDir(fullPath);
  fs.writeFileSync(fullPath, htmlContent, 'utf8');
}

// ============================================================================
// TEMPLATES SÉMANTIQUES (Header, Navigation, Footer, Reassurance)
// ============================================================================

function renderNavHeader(lang) {
  const isDe = lang === 'de';
  const homeUrl = isDe ? '/de' : '/fr';
  const productsUrl = isDe ? '/de/produkte' : '/fr/produits';
  const deliveryUrl = isDe ? '/de/lieferung' : '/fr/livraison';
  const aboutUrl = isDe ? '/de/ueber-uns' : '/fr/a-propos';
  const contactUrl = isDe ? '/de/kontakt' : '/fr/contact';

  return `
    <header style="background:#2c5530; color:#fff; padding:14px 20px;">
      <div style="max-width:1140px; margin:0 auto; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <a href="${homeUrl}" style="color:#fff; text-decoration:none; font-weight:800; font-size:20px; letter-spacing:-0.5px;">
          brennholzkaufen
        </a>
        <nav style="display:flex; gap:18px; align-items:center; font-size:14px; font-weight:500;">
          <a href="${homeUrl}" style="color:#fff; text-decoration:none;">${isDe ? 'Startseite' : 'Accueil'}</a>
          <a href="${productsUrl}" style="color:#fff; text-decoration:none;">${isDe ? 'Produkte' : 'Produits'}</a>
          <a href="${deliveryUrl}" style="color:#fff; text-decoration:none;">${isDe ? 'Lieferung' : 'Livraison'}</a>
          <a href="${aboutUrl}" style="color:#fff; text-decoration:none;">${isDe ? 'Über uns' : 'À propos'}</a>
          <a href="${contactUrl}" style="color:#fff; text-decoration:none;">${isDe ? 'Kontakt' : 'Contact'}</a>
        </nav>
        <div style="font-size:13px; color:#a7f3d0;">
          📞 +49 1633637236
        </div>
      </div>
    </header>
  `;
}

function renderTrustFooter(lang) {
  const isDe = lang === 'de';
  return `
    <footer style="background:#111827; color:#9ca3af; padding:36px 20px 24px; margin-top:48px; font-size:13px; border-top:1px solid #1f2937;">
      <div style="max-width:1140px; margin:0 auto; display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:24px;">
        <div>
          <h4 style="color:#fff; font-size:15px; margin-bottom:10px;">brennholzkaufen</h4>
          <p style="line-height:1.6;">${isDe ? 'Ihr verlässlicher Partner für ofenfertiges Brennholz (Eiche, Buche) und zertifizierte Holzpellets mit LKW-Mitnahmestapler-Lieferung deutschlandweit.' : 'Votre partenaire pour l’achat de bois de chauffage haute performance et granulés certifiés DINplus.'}</p>
        </div>
        <div>
          <h4 style="color:#fff; font-size:15px; margin-bottom:10px;">${isDe ? 'Rechtliches' : 'Informations Légales'}</h4>
          <ul style="list-style:none; padding:0; margin:0; line-height:2;">
            <li><a href="${isDe ? '/de/impressum' : '/fr/mentions-legales'}" style="color:#9ca3af; text-decoration:none;">${isDe ? 'Impressum (§ 5 TMG)' : 'Mentions Légales'}</a></li>
            <li><a href="${isDe ? '/de/agb' : '/fr/cgv'}" style="color:#9ca3af; text-decoration:none;">${isDe ? 'Allgemeine Geschäftsbedingungen' : 'CGV'}</a></li>
            <li><a href="${isDe ? '/de/datenschutz' : '/fr/confidentialite'}" style="color:#9ca3af; text-decoration:none;">${isDe ? 'Datenschutzerklärung (DSGVO)' : 'Politique de Confidentialité'}</a></li>
            <li><a href="${isDe ? '/de/rueckgabe' : '/fr/retours'}" style="color:#9ca3af; text-decoration:none;">${isDe ? 'Widerrufsbelehrung & Retouren' : 'Retours & Rétractation'}</a></li>
          </ul>
        </div>
        <div>
          <h4 style="color:#fff; font-size:15px; margin-bottom:10px;">${isDe ? 'Kundenservice' : 'Service Client'}</h4>
          <p style="line-height:1.8;">
            E-Mail: <a href="mailto:kontakt@brennholzkaufen.online" style="color:#a7f3d0; text-decoration:none;">kontakt@brennholzkaufen.online</a><br />
            Tel: +49 1633637236<br />
            3 Rue des Anges, 67000 Strasbourg
          </p>
        </div>
      </div>
      <div style="max-width:1140px; margin:24px auto 0; padding-top:16px; border-top:1px solid #1f2937; text-align:center; font-size:12px; color:#6b7280;">
        © ${new Date().getFullYear()} brennholzkaufen. ${isDe ? 'Alle Rechte vorbehalten.' : 'Tous droits réservés.'}
      </div>
    </footer>
  `;
}

// ============================================================================
// 2. GÉNÉRATION DES PAGES STATIQUES
// ============================================================================

let generatedCount = 0;

// A. Accueil (DE & FR)
for (const lang of ['de', 'fr']) {
  const isDe = lang === 'de';
  const canonicalUrl = `${SITE_ORIGIN}/${lang}`;
  const deUrl = `${SITE_ORIGIN}/de`;
  const frUrl = `${SITE_ORIGIN}/fr`;

  const title = isDe
    ? 'Brennholz Kaufen | Premium Kaminholz & Holzpellets – Lieferung Deutschland'
    : 'Bois de Chauffage & Granulés Premium | Vente en ligne & Livraison';

  const description = isDe
    ? 'Kaufen Sie ofenfertiges Brennholz (Eiche, Buche), DINplus Holzpellets und Holzbriketts. Schnelle und zuverlässige Lieferung mit Mitnahmestapler direkt zu Ihnen.'
    : 'Achetez votre bois de chauffage sec (chêne, hêtre), pellets certifiés DINplus et bûches densifiées. Livraison soignée par chariot embarqué partout en France.';

  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'brennholzkaufen',
        url: SITE_ORIGIN,
        logo: DEFAULT_IMAGE,
        contactPoint: [{
          '@type': 'ContactPoint',
          telephone: '+49 1633637236',
          contactType: 'customer service',
          availableLanguage: ['German', 'French'],
          areaServed: ['DE', 'AT', 'CH', 'LU', 'FR']
        }]
      },
      {
        '@type': 'WebSite',
        name: 'brennholzkaufen',
        url: SITE_ORIGIN,
        inLanguage: ['de', 'fr']
      }
    ]
  };

  const bodyContent = `
    ${renderNavHeader(lang)}
    <main style="max-width:1140px; margin:0 auto; padding:32px 16px; font-family:Inter, sans-serif;">
      <section style="background:linear-gradient(135deg, #1b3b22 0%, #2c5530 100%); color:#fff; padding:44px 28px; border-radius:14px; text-align:center; margin-bottom:32px;">
        <span style="display:inline-block; background:rgba(255,255,255,0.15); color:#a7f3d0; font-size:12px; font-weight:700; padding:4px 12px; border-radius:999px; margin-bottom:12px;">
          ${isDe ? '100% ofenfertiges Brennholz & DINplus Holzpellets' : 'Bois 100% sec & Granulés certifiés DINplus'}
        </span>
        <h1 style="font-size:32px; font-weight:800; margin:0 0 12px; letter-spacing:-0.5px;">
          ${isDe ? 'Premium Brennholz & Holzpellets direkt zu Ihnen geliefert' : 'Bois de Chauffage & Granulés Premium Livrés Chez Vous'}
        </h1>
        <p style="font-size:16px; max-width:700px; margin:0 auto 24px; color:#e2e8f0; line-height:1.6;">
          ${isDe ? 'Ofenfertiges Hartholz (< 20% Restfeuchte), zertifizierte Holzpellets und bequeme Anlieferung per LKW mit geländegängigem Mitnahmestapler direkt an Ihren Lagerplatz.' : 'Bûches fendues prêtes à l’emploi (humidité < 20%), pellets de haute performance et livraison soignée à domicile avec chariot tout-terrain.'}
        </p>
        <div style="display:flex; justify-content:center; gap:12px; flex-wrap:wrap;">
          <a href="${isDe ? '/de/produkte' : '/fr/produits'}" style="background:#22c55e; color:#022c22; font-weight:700; padding:12px 24px; border-radius:8px; text-decoration:none;">
            ${isDe ? 'Alle 45 Produkte ansehen' : 'Découvrir nos 45 produits'}
          </a>
          <a href="${isDe ? '/de/lieferung' : '/fr/livraison'}" style="background:rgba(255,255,255,0.15); color:#fff; font-weight:600; padding:12px 24px; border-radius:8px; text-decoration:none; border:1px solid rgba(255,255,255,0.25);">
            ${isDe ? 'Lieferung & Ablauf' : 'Modalités de livraison'}
          </a>
        </div>
      </section>

      <section style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:40px;">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:20px; text-align:center;">
          <h3 style="color:#0f172a; margin:0 0 6px; font-size:16px;">${isDe ? 'Kammergetrocknet < 20%' : 'Humidité garantie < 20%'}</h3>
          <p style="color:#64748b; font-size:13px; margin:0;">${isDe ? 'Garantierte Restfeuchte für sofortige Verbrennung und maximalen Brennwert.' : 'Séchage optimal en séchoir pour une chaleur intense sans encrassement.'}</p>
        </div>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:20px; text-align:center;">
          <h3 style="color:#0f172a; margin:0 0 6px; font-size:16px;">${isDe ? 'Mitnahmestapler-Lieferung' : 'Livraison chariot tout-terrain'}</h3>
          <p style="color:#64748b; font-size:13px; margin:0;">${isDe ? 'Unsere LKW bringen die Palette mit Stapler direkt unter Ihren Carport oder in die Garage.' : 'Dépose directe de vos palettes sous abri même sur sol difficile ou gravier.'}</p>
        </div>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:20px; text-align:center;">
          <h3 style="color:#0f172a; margin:0 0 6px; font-size:16px;">${isDe ? '100% Hartholz & DINplus' : '100% Bois dur & DINplus'}</h3>
          <p style="color:#64748b; font-size:13px; margin:0;">${isDe ? 'Ausschließliche Auswahl bester Harthölzer (Buche, Eiche) und zertifizierter Pellets.' : 'Sélection exclusive d’essences dures (chêne, hêtre) issues de forêts durables.'}</p>
        </div>
      </section>

      <section>
        <h2 style="font-size:22px; font-weight:800; color:#0f172a; margin-bottom:20px;">
          ${isDe ? 'Ausgewählte Produkte unseres Katalogs' : 'Nos combustibles phares'}
        </h2>
        <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:20px;">
          ${products.slice(0, 8).map(p => {
            const trans = productTranslations[p.id]?.[lang] || {};
            const name = trans.name || p.name;
            const desc = trans.description || p.description;
            const unit = trans.unit || 'Stück';
            const slug = productSlugs[p.id]?.[lang] || p.id;
            const prodUrl = isDe ? `/de/produkt/${slug}` : `/fr/produit/${slug}`;
            return `
              <article style="border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; background:#fff; display:flex; flex-direction:column;">
                <a href="${prodUrl}" style="text-decoration:none; color:inherit;">
                  <img src="${p.image}" alt="${escapeHtml(name)}" loading="lazy" style="width:100%; height:190px; object-fit:cover; background:#f1f5f9;" />
                </a>
                <div style="padding:14px; display:flex; flex-direction:column; flex:1;">
                  <h3 style="font-size:15px; font-weight:700; margin:0 0 6px; line-height:1.4;">
                    <a href="${prodUrl}" style="text-decoration:none; color:#0f172a;">${escapeHtml(name)}</a>
                  </h3>
                  <p style="font-size:12.5px; color:#64748b; margin:0 0 12px; line-height:1.5; flex:1;">
                    ${escapeHtml(desc.slice(0, 110))}...
                  </p>
                  <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:10px;">
                    <div>
                      <span style="font-size:18px; font-weight:800; color:#1b3b22;">${Number(p.price).toFixed(2)} €</span>
                      <span style="font-size:12px; color:#64748b;"> / ${escapeHtml(unit)}</span>
                    </div>
                    <a href="${prodUrl}" style="background:#2c5530; color:#fff; text-decoration:none; font-size:12px; font-weight:700; padding:6px 12px; border-radius:6px;">
                      ${isDe ? 'Details' : 'Voir'}
                    </a>
                  </div>
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    </main>
    ${renderTrustFooter(lang)}
  `;

  const html = buildHtml({
    lang,
    title,
    description,
    canonicalUrl,
    deUrl,
    frUrl,
    type: 'website',
    schemaJson,
    bodyContent
  });

  writePage(`${lang}/index.html`, html);
  generatedCount++;
}

// B. Catalogue / Liste des 45 produits (DE & FR)
for (const lang of ['de', 'fr']) {
  const isDe = lang === 'de';
  const pageSlug = isDe ? 'produkte' : 'produits';
  const canonicalUrl = `${SITE_ORIGIN}/${lang}/${pageSlug}`;
  const deUrl = `${SITE_ORIGIN}/de/produkte`;
  const frUrl = `${SITE_ORIGIN}/fr/produits`;

  const title = isDe
    ? 'Brennholz, Kaminholz & Holzpellets – Katalog & Preise | brennholzkaufen'
    : 'Bois de Chauffage & Granulés de Bois – Catalogue & Prix | brennholzkaufen';

  const description = isDe
    ? 'Entdecken Sie unser gesamtes Sortiment: Kammergetrocknetes Brennholz (Eiche, Buche), DINplus Pellets und Holzbriketts. Transparente Preise und bundesweite Lieferung.'
    : 'Catalogue complet de bois de chauffage sec, granulés certifiés DINplus et briquettes haute performance. Tarifs transparents et livraison soignée.';

  const schemaJson = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: isDe ? 'Startseite' : 'Accueil', item: `${SITE_ORIGIN}/${lang}` },
          { '@type': 'ListItem', position: 2, name: isDe ? 'Produkte' : 'Produits', item: canonicalUrl }
        ]
      }
    ]
  };

  const bodyContent = `
    ${renderNavHeader(lang)}
    <main style="max-width:1140px; margin:0 auto; padding:28px 16px; font-family:Inter, sans-serif;">
      <nav style="font-size:12px; color:#64748b; margin-bottom:12px;">
        <a href="${SITE_ORIGIN}/${lang}" style="color:#64748b; text-decoration:none;">${isDe ? 'Startseite' : 'Accueil'}</a> &gt; 
        <span style="color:#0f172a; font-weight:600;">${isDe ? 'Produkte' : 'Produits'}</span>
      </nav>
      <header style="margin-bottom:28px;">
        <h1 style="font-size:28px; font-weight:800; color:#0f172a; margin:0 0 8px; letter-spacing:-0.4px;">
          ${isDe ? 'Brennholz, Kaminholz & Holzpellets – Gesamter Katalog' : 'Nos Combustibles, Bois de Chauffage & Granulés'}
        </h1>
        <p style="color:#64748b; font-size:14px; margin:0; max-width:760px; line-height:1.6;">
          ${isDe ? 'Wählen Sie ofenfertiges Scheitholz in 25 cm, 30 cm oder 33 cm, DINplus Pellets im 15kg-Sack oder lose im Silo. Alle 45 Produkte sind direkt online bestellbar.' : 'Sélectionnez vos stères de bois dur fendu (chêne, hêtre), bûches compressées ou pellets certifiés DINplus. Livraison tout-terrain incluse.'}
        </p>
      </header>

      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:20px;">
        ${products.map(p => {
          const trans = productTranslations[p.id]?.[lang] || {};
          const name = trans.name || p.name;
          const desc = trans.description || p.description;
          const unit = trans.unit || 'Stück';
          const slug = productSlugs[p.id]?.[lang] || p.id;
          const prodUrl = isDe ? `/de/produkt/${slug}` : `/fr/produit/${slug}`;
          return `
            <article style="border:1px solid #e2e8f0; border-radius:10px; overflow:hidden; background:#fff; display:flex; flex-direction:column;">
              <a href="${prodUrl}" style="text-decoration:none; color:inherit;">
                <img src="${p.image}" alt="${escapeHtml(name)}" loading="lazy" style="width:100%; height:190px; object-fit:cover; background:#f1f5f9;" />
              </a>
              <div style="padding:14px; display:flex; flex-direction:column; flex:1;">
                <h2 style="font-size:15px; font-weight:700; margin:0 0 6px; line-height:1.4;">
                  <a href="${prodUrl}" style="text-decoration:none; color:#0f172a;">${escapeHtml(name)}</a>
                </h2>
                <p style="font-size:12.5px; color:#64748b; margin:0 0 12px; line-height:1.5; flex:1;">
                  ${escapeHtml(desc.slice(0, 110))}...
                </p>
                <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid #f1f5f9; padding-top:10px;">
                  <div>
                    <span style="font-size:18px; font-weight:800; color:#1b3b22;">${Number(p.price).toFixed(2)} €</span>
                    <span style="font-size:12px; color:#64748b;"> / ${escapeHtml(unit)}</span>
                  </div>
                  <a href="${prodUrl}" style="background:#2c5530; color:#fff; text-decoration:none; font-size:12px; font-weight:700; padding:6px 12px; border-radius:6px;">
                    ${isDe ? 'Details' : 'Voir'}
                  </a>
                </div>
              </div>
            </article>
          `;
        }).join('')}
      </div>
    </main>
    ${renderTrustFooter(lang)}
  `;

  const html = buildHtml({
    lang,
    title,
    description,
    canonicalUrl,
    deUrl,
    frUrl,
    type: 'website',
    schemaJson,
    bodyContent
  });

  writePage(`${lang}/${pageSlug}/index.html`, html);
  generatedCount++;
}

// C. Fiches des 45 Produits individuels (DE & FR)
for (const p of products) {
  const deSlug = productSlugs[p.id]?.de || p.id;
  const frSlug = productSlugs[p.id]?.fr || p.id;

  for (const lang of ['de', 'fr']) {
    const isDe = lang === 'de';
    const trans = productTranslations[p.id]?.[lang] || {};
    const name = trans.name || p.name;
    const desc = trans.description || p.description;
    const unit = trans.unit || 'Stück';
    const prodSlug = isDe ? 'produkt' : 'produit';
    const currentSlug = isDe ? deSlug : frSlug;
    const canonicalUrl = `${SITE_ORIGIN}/${lang}/${prodSlug}/${currentSlug}`;
    const deUrl = `${SITE_ORIGIN}/de/produkt/${deSlug}`;
    const frUrl = `${SITE_ORIGIN}/fr/produit/${frSlug}`;

    const title = `${name} | brennholzkaufen`;
    const description = desc.slice(0, 160);

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: isDe ? 'Startseite' : 'Accueil', item: `${SITE_ORIGIN}/${lang}` },
            { '@type': 'ListItem', position: 2, name: isDe ? 'Produkte' : 'Produits', item: `${SITE_ORIGIN}/${lang}/${isDe ? 'produkte' : 'produits'}` },
            { '@type': 'ListItem', position: 3, name: name, item: canonicalUrl }
          ]
        },
        {
          '@type': 'Product',
          name: name,
          image: [p.image],
          description: desc,
          sku: String(p.id),
          mpn: String(p.id),
          brand: { '@type': 'Brand', name: 'brennholzkaufen' },
          offers: {
            '@type': 'Offer',
            url: canonicalUrl,
            priceCurrency: 'EUR',
            price: Number(p.price).toFixed(2),
            priceValidUntil: '2027-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: (p.stock > 0 || p.stock === undefined) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            seller: { '@type': 'Organization', name: 'brennholzkaufen' },
            shippingDetails: {
              '@type': 'OfferShippingDetails',
              shippingRate: { '@type': 'MonetaryAmount', value: '0.00', currency: 'EUR' },
              shippingDestination: { '@type': 'DefinedRegion', addressCountry: 'DE' },
              deliveryTime: {
                '@type': 'ShippingDeliveryTime',
                handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'd' },
                transitTime: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 5, unitCode: 'd' }
              }
            },
            hasMerchantReturnPolicy: {
              '@type': 'MerchantReturnPolicy',
              applicableCountry: 'DE',
              returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
              merchantReturnDays: 14,
              returnMethod: 'https://schema.org/ReturnByMail',
              returnFees: 'https://schema.org/FreeReturn'
            }
          }
        }
      ]
    };

    const bodyContent = `
      ${renderNavHeader(lang)}
      <main style="max-width:1040px; margin:0 auto; padding:28px 16px; font-family:Inter, sans-serif;">
        <nav style="font-size:12px; color:#64748b; margin-bottom:16px;">
          <a href="${SITE_ORIGIN}/${lang}" style="color:#64748b; text-decoration:none;">${isDe ? 'Startseite' : 'Accueil'}</a> &gt; 
          <a href="${SITE_ORIGIN}/${lang}/${isDe ? 'produkte' : 'produits'}" style="color:#64748b; text-decoration:none;">${isDe ? 'Produkte' : 'Produits'}</a> &gt; 
          <span style="color:#0f172a; font-weight:600;">${escapeHtml(name)}</span>
        </nav>

        <article style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:32px; background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:24px;">
          <div>
            <img src="${p.image}" alt="${escapeHtml(name)}" style="width:100%; max-height:420px; object-fit:cover; border-radius:10px; background:#f1f5f9;" />
            <div style="margin-top:14px; display:flex; gap:8px; flex-wrap:wrap; font-size:11px; font-weight:700;">
              <span style="background:#ecfdf5; color:#047857; border:1px solid #a7f3d0; padding:3px 8px; border-radius:6px;">✓ ${isDe ? 'Auf Lager & lieferbar' : 'En stock'}</span>
              <span style="background:#fef3c7; color:#92400e; border:1px solid #fde68a; padding:3px 8px; border-radius:6px;">⚡ ${isDe ? 'Restfeuchte < 20%' : 'Humidité < 20%'}</span>
              <span style="background:#eff6ff; color:#1e40af; border:1px solid #bfdbfe; padding:3px 8px; border-radius:6px;">🚚 ${isDe ? 'Lieferung mit Stapler' : 'Chariot tout-terrain'}</span>
            </div>
          </div>

          <div>
            <h1 style="font-size:24px; font-weight:800; color:#0f172a; margin:0 0 12px; line-height:1.3;">
              ${escapeHtml(name)}
            </h1>

            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:16px; margin-bottom:20px;">
              <div style="font-size:28px; font-weight:800; color:#1b3b22;">
                ${Number(p.price).toFixed(2)} €
                <span style="font-size:13px; font-weight:500; color:#64748b;"> inkl. MwSt. / ${escapeHtml(unit)}</span>
              </div>
              <div style="font-size:12px; color:#16a34a; font-weight:600; margin-top:4px;">
                ${isDe ? 'Kostenlose Lieferung deutschlandweit' : 'Livraison offerte à domicile'}
              </div>
            </div>

            <h3 style="font-size:14px; font-weight:700; color:#0f172a; margin:0 0 8px;">${isDe ? 'Produktbeschreibung' : 'Description du produit'}</h3>
            <p style="font-size:14px; color:#475569; line-height:1.7; margin:0 0 20px;">
              ${escapeHtml(desc)}
            </p>

            <h3 style="font-size:14px; font-weight:700; color:#0f172a; margin:0 0 8px;">${isDe ? 'Technische Daten & Eigenschaften' : 'Caractéristiques techniques'}</h3>
            <ul style="font-size:13px; color:#475569; line-height:1.8; margin:0 0 24px; padding-left:18px;">
              <li><strong>${isDe ? 'Kategorie' : 'Catégorie'} :</strong> ${escapeHtml(p.category || 'Brennholz')}</li>
              <li><strong>${isDe ? 'Verkaufseinheit' : 'Unité'} :</strong> ${escapeHtml(unit)}</li>
              <li><strong>${isDe ? 'Restfeuchte' : 'Taux d’humidité'} :</strong> ${isDe ? '< 20% garantiert (kammergetrocknet)' : '< 20% garanti (séché en séchoir)'}</li>
              <li><strong>${isDe ? 'Lieferung' : 'Livraison'} :</strong> ${isDe ? 'LKW mit geländegängigem Mitnahmestapler direkt an Ihren Wunschort' : 'Camion avec chariot élévateur tout-terrain sous abri'}</li>
              <li><strong>${isDe ? 'Zahlung' : 'Paiement'} :</strong> ${isDe ? 'Sichere Vorkasse / Banküberweisung' : 'Virement bancaire sécurisé'}</li>
            </ul>

            <div style="border-top:1px solid #e2e8f0; padding-top:16px;">
              <a href="${isDe ? '/de/kasse' : '/fr/commande'}" style="display:inline-block; background:#2c5530; color:#fff; text-decoration:none; font-weight:700; font-size:15px; padding:12px 28px; border-radius:8px;">
                ${isDe ? 'Jetzt bestellen' : 'Commander maintenant'}
              </a>
            </div>
          </div>
        </article>
      </main>
      ${renderTrustFooter(lang)}
    `;

    const html = buildHtml({
      lang,
      title,
      description,
      canonicalUrl,
      deUrl,
      frUrl,
      image: p.image,
      type: 'product',
      schemaJson,
      bodyContent
    });

    // 1. Page officielle avec slug sémantique optimisé SEO
    writePage(`${lang}/${prodSlug}/${currentSlug}/index.html`, html);

    // 2. Redirection permanente pour l'ancien ID technique (ex: /de/produkt/4xnJQb0VbKjQm2y15VtK)
    if (p.id !== currentSlug) {
      const redirectHtml = `<!DOCTYPE html>
<html lang="${lang}">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="refresh" content="0; url=/${lang}/${prodSlug}/${currentSlug}" />
    <link rel="canonical" href="${canonicalUrl}" />
    <script>window.location.replace('/${lang}/${prodSlug}/${currentSlug}');</script>
    <title>${escapeHtml(name)} | brennholzkaufen</title>
  </head>
  <body>
    <p>Weiterleitung zu <a href="/${lang}/${prodSlug}/${currentSlug}">${escapeHtml(name)}</a>...</p>
  </body>
</html>`;
      writePage(`${lang}/${prodSlug}/${p.id}/index.html`, redirectHtml);
    }
    generatedCount++;
  }
}

// D. Pages de Réassurance et Légales (DE & FR)
const pagesConfig = [
  {
    key: 'delivery',
    deSlug: 'lieferung',
    frSlug: 'livraison',
    deTitle: 'Lieferung & Versandinformationen | brennholzkaufen',
    frTitle: 'Modalités de Livraison | brennholzkaufen',
    deDesc: 'Informationen zur deutschlandweiten Anlieferung von Kaminholz und Pellets mit LKW und geländegängigem Mitnahmestapler direkt an Ihren Lagerplatz.',
    frDesc: 'Modalités de livraison de bois de chauffage et granulés avec chariot embarqué tout-terrain directement sous abri.',
    renderBody: (isDe) => `
      <h1 style="font-size:28px; font-weight:800; color:#1b3b22; margin-bottom:12px;">${isDe ? 'Lieferung & Versandbedingungen' : 'Conditions de Livraison'}</h1>
      <p style="color:#64748b; font-size:14px; margin-bottom:24px;">${isDe ? 'Zuverlässige Anlieferung von Kaminholz & Pellets direkt an Ihren Wunschort mit geländegängigem Mitnahmestapler.' : 'Livraison soignée de vos stères de bois et pellets directement sous votre abri.'}</p>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:16px; margin-bottom:28px;">
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:18px;">
          <h3 style="color:#0f172a; margin:0 0 6px;">${isDe ? '1. Mitnahmestapler-Entladung' : '1. Chariot tout-terrain'}</h3>
          <p style="color:#475569; font-size:13px; margin:0; line-height:1.6;">${isDe ? 'Unsere LKW verfügen über geländegängige Gabelstapler, um Paletten direkt unter Ihren Carport oder in die Garage zu befördern.' : 'Nos camions disposent d’un chariot embarqué capable de rouler sur graviers et pelouse pour déposer vos palettes sous abri.'}</p>
        </div>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:18px;">
          <h3 style="color:#0f172a; margin:0 0 6px;">${isDe ? '2. Telefonische Avisierung' : '2. Prise de rendez-vous'}</h3>
          <p style="color:#475569; font-size:13px; margin:0; line-height:1.6;">${isDe ? 'Der Spediteur kontaktiert Sie 24 bis 48 Stunden vor Anlieferung telefonisch zur Abstimmung des genauen Zeitfensters.' : 'Le transporteur vous contacte par téléphone 24 à 48h avant pour fixer le créneau horaire exact.'}</p>
        </div>
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:18px;">
          <h3 style="color:#0f172a; margin:0 0 6px;">${isDe ? '3. Lieferfristen' : '3. Délais constatés'}</h3>
          <p style="color:#475569; font-size:13px; margin:0; line-height:1.6;">${isDe ? 'Regellaufzeit der Spedition : 2 bis 5 Werktage nach Auftragsbestätigung und Zahlungseingang.' : 'Délai d’acheminement : 2 à 5 jours ouvrés à compter de la confirmation de votre commande.'}</p>
        </div>
      </div>
    `
  },
  {
    key: 'about',
    deSlug: 'ueber-uns',
    frSlug: 'a-propos',
    deTitle: 'Über uns | brennholzkaufen',
    frTitle: 'À propos de nous | brennholzkaufen',
    deDesc: 'Ihr Partner für ofenfertiges Brennholz und zertifizierte Pellets. Erfahren Sie mehr über unsere Werte, Herkunft und Qualität.',
    frDesc: 'Spécialiste du bois de chauffage haute performance et granulés certifiés DINplus issus de forêts gérées durablement.',
    renderBody: (isDe) => `
      <h1 style="font-size:28px; font-weight:800; color:#1b3b22; margin-bottom:12px;">${isDe ? 'Über brennholzkaufen' : 'À propos de notre entreprise'}</h1>
      <p style="color:#475569; font-size:14px; line-height:1.7;">${isDe ? 'Seit unserer Gründung haben wir uns verpflichtet, Brennholz von höchster Qualität anzubieten. Unsere Leidenschaft für den Wald und der Respekt vor der Umwelt treiben uns an, ausschließlich Harthölzer (Eiche, Buche) aus nachhaltig bewirtschafteten Forsten auszuwählen.' : 'Depuis notre création, nous sélectionnons rigoureusement nos essences de bois dur pour vous garantir un rendement calorifique maximal.'}</p>
    `
  },
  {
    key: 'contact',
    deSlug: 'kontakt',
    frSlug: 'contact',
    deTitle: 'Kontakt & Kundenservice | brennholzkaufen',
    frTitle: 'Contactez notre équipe | brennholzkaufen',
    deDesc: 'Unser Team berät Sie gerne bei Fragen zu Brennholz, Pellets und Lieferung. Telefon: +49 1633637236, E-Mail: kontakt@brennholzkaufen.online.',
    frDesc: 'Notre équipe est à votre disposition pour toute question sur nos produits ou votre livraison. E-mail : kontakt@brennholzkaufen.online.',
    renderBody: (isDe) => `
      <h1 style="font-size:28px; font-weight:800; color:#1b3b22; margin-bottom:12px;">${isDe ? 'Kontakt & Kundenservice' : 'Contactez notre service client'}</h1>
      <p style="color:#475569; font-size:14px; line-height:1.7;">${isDe ? 'Haben Sie Fragen zu unseren Produkten, den Holzarten oder der Anlieferung? Unser Team berät Sie gerne.' : 'Une question sur nos bois, nos granulés ou la livraison ? Contactez nos conseillers.'}</p>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:20px; margin-top:20px;">
        <p style="margin:0 0 10px; font-size:14px;"><strong>📞 ${isDe ? 'Telefon' : 'Téléphone'} :</strong> +49 1633637236</p>
        <p style="margin:0 0 10px; font-size:14px;"><strong>✉️ E-Mail :</strong> <a href="mailto:kontakt@brennholzkaufen.online" style="color:#1b3b22;">kontakt@brennholzkaufen.online</a></p>
        <p style="margin:0; font-size:14px;"><strong>📍 ${isDe ? 'Adresse' : 'Adresse'} :</strong> 3 Rue des Anges, 67000 Strasbourg</p>
      </div>
    `
  },
  {
    key: 'legal',
    deSlug: 'impressum',
    frSlug: 'mentions-legales',
    deTitle: 'Impressum | Gesetzliche Anbieterkennzeichnung (§ 5 TMG)',
    frTitle: 'Mentions Légales | brennholzkaufen',
    deDesc: 'Gesetzliche Anbieterkennzeichnung und rechtliche Informationen der brennholzkaufen Online-Plattform gemäß § 5 TMG.',
    frDesc: 'Mentions légales et informations relatives à l’éditeur du site brennholzkaufen.',
    renderBody: (isDe) => `
      <h1 style="font-size:28px; font-weight:800; color:#1b3b22; margin-bottom:12px;">${isDe ? 'Impressum' : 'Mentions Légales'}</h1>
      <p style="color:#64748b; font-size:14px; margin-bottom:20px;">${isDe ? 'Angaben gemäß § 5 TMG / Gesetzliche Anbieterkennzeichnung' : 'Informations légales et éditeur du site'}</p>
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:20px; font-size:13.5px; line-height:1.8; color:#334155;">
        <strong>brennholzkaufen</strong><br />
        3 Rue des Anges, 67000 Strasbourg<br />
        SIREN : 921 445 120 | SIRET : 921 445 120 00018<br />
        USt-IdNr. : FR 45 921445120<br />
        E-Mail : kontakt@brennholzkaufen.online<br />
        Telefon : +49 1633637236
      </div>
    `
  },
  {
    key: 'privacy',
    deSlug: 'datenschutz',
    frSlug: 'confidentialite',
    deTitle: 'Datenschutzerklärung | DSGVO / GDPR | brennholzkaufen',
    frTitle: 'Politique de Confidentialité | RGPD | brennholzkaufen',
    deDesc: 'Informationen zur Verarbeitung personenbezogener Daten auf der brennholzkaufen Plattform gemäß Datenschutz-Grundverordnung (DSGVO).',
    frDesc: 'Informations sur le traitement et la protection de vos données personnelles conformément au RGPD.',
    renderBody: (isDe) => `
      <h1 style="font-size:28px; font-weight:800; color:#1b3b22; margin-bottom:12px;">${isDe ? 'Datenschutzerklärung' : 'Politique de Confidentialité'}</h1>
      <p style="color:#475569; font-size:14px; line-height:1.7;">${isDe ? 'Der Schutz Ihrer personenbezogenen Daten ist uns ein wichtiges Anliegen. Wir verarbeiten Ihre Daten streng gemäß den Bestimmungen der EU-Datenschutz-Grundverordnung (DSGVO).' : 'La protection de vos données personnelles est au cœur de nos engagements, dans le respect du RGPD.'}</p>
    `
  },
  {
    key: 'terms',
    deSlug: 'agb',
    frSlug: 'cgv',
    deTitle: 'Allgemeine Geschäftsbedingungen (AGB) | brennholzkaufen',
    frTitle: 'Conditions Générales de Vente (CGV) | brennholzkaufen',
    deDesc: 'Allgemeine Geschäftsbedingungen für den Kauf von Brennholz, Kaminholz und Pellets auf brennholzkaufen.',
    frDesc: 'Conditions Générales de Vente régissant les achats de bois et granulés sur le site brennholzkaufen.',
    renderBody: (isDe) => `
      <h1 style="font-size:28px; font-weight:800; color:#1b3b22; margin-bottom:12px;">${isDe ? 'Allgemeine Geschäftsbedingungen (AGB)' : 'Conditions Générales de Vente (CGV)'}</h1>
      <p style="color:#475569; font-size:14px; line-height:1.7;">${isDe ? 'Gültig für alle Verträge über die Lieferung von Brennholz, Kaminholz und Pellets über den Online-Shop brennholzkaufen.' : 'Régissant l’ensemble des commandes passées sur notre plateforme brennholzkaufen.'}</p>
    `
  },
  {
    key: 'returns',
    deSlug: 'rueckgabe',
    frSlug: 'retours',
    deTitle: 'Widerrufsbelehrung & Rückgaberecht | brennholzkaufen',
    frTitle: 'Retours & Droit de Rétractation | brennholzkaufen',
    deDesc: 'Gesetzliche Widerrufsbelehrung und 14 Tage Rückgaberecht für Bestellungen auf brennholzkaufen.',
    frDesc: 'Modalités du droit de rétractation de 14 jours et conditions de retour chez brennholzkaufen.',
    renderBody: (isDe) => `
      <h1 style="font-size:28px; font-weight:800; color:#1b3b22; margin-bottom:12px;">${isDe ? 'Widerrufsbelehrung & Rückgaberecht' : 'Retours & Droit de Rétractation'}</h1>
      <p style="color:#475569; font-size:14px; line-height:1.7;">${isDe ? 'Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.' : 'Vous disposez d’un délai de rétractation légal de 14 jours à compter de la réception de vos marchandises.'}</p>
    `
  }
];

for (const cfg of pagesConfig) {
  for (const lang of ['de', 'fr']) {
    const isDe = lang === 'de';
    const slug = isDe ? cfg.deSlug : cfg.frSlug;
    const canonicalUrl = `${SITE_ORIGIN}/${lang}/${slug}`;
    const deUrl = `${SITE_ORIGIN}/de/${cfg.deSlug}`;
    const frUrl = `${SITE_ORIGIN}/fr/${cfg.frSlug}`;
    const title = isDe ? cfg.deTitle : cfg.frTitle;
    const description = isDe ? cfg.deDesc : cfg.frDesc;

    const schemaJson = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: isDe ? 'Startseite' : 'Accueil', item: `${SITE_ORIGIN}/${lang}` },
            { '@type': 'ListItem', position: 2, name: title.split('|')[0].trim(), item: canonicalUrl }
          ]
        }
      ]
    };

    const bodyContent = `
      ${renderNavHeader(lang)}
      <main style="max-width:920px; margin:0 auto; padding:36px 16px; font-family:Inter, sans-serif;">
        <nav style="font-size:12px; color:#64748b; margin-bottom:16px;">
          <a href="${SITE_ORIGIN}/${lang}" style="color:#64748b; text-decoration:none;">${isDe ? 'Startseite' : 'Accueil'}</a> &gt; 
          <span style="color:#0f172a; font-weight:600;">${title.split('|')[0].trim()}</span>
        </nav>
        ${cfg.renderBody(isDe)}
      </main>
      ${renderTrustFooter(lang)}
    `;

    const html = buildHtml({
      lang,
      title,
      description,
      canonicalUrl,
      deUrl,
      frUrl,
      type: 'website',
      schemaJson,
      bodyContent
    });

    writePage(`${lang}/${slug}/index.html`, html);
    generatedCount++;
  }
}

// E. Synchroniser les fichiers essentiels (vérification Google, sitemap, robots) dans build/
const filesToSync = [
  {
    src: 'public/google8ed680060d5c7d96.html',
    dests: [
      'google8ed680060d5c7d96.html',
      'de/google8ed680060d5c7d96.html',
      'fr/google8ed680060d5c7d96.html'
    ]
  },
  { src: 'public/sitemap.xml', dests: ['sitemap.xml'] },
  { src: 'public/robots.txt', dests: ['robots.txt'] }
];

for (const item of filesToSync) {
  const srcPath = path.join(__dirname, '../apps/client', item.src);
  if (fs.existsSync(srcPath)) {
    const data = fs.readFileSync(srcPath);
    for (const dest of item.dests) {
      const destPath = path.join(CLIENT_BUILD_DIR, dest);
      ensureDir(destPath);
      fs.writeFileSync(destPath, data);
    }
  }
}

console.log(`✅ Pré-rendu statique terminé avec succès ! ${generatedCount} pages HTML statiques générées dans ${CLIENT_BUILD_DIR}.`);
