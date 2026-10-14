/**
 * TikTok Pixel & E-commerce Events Tracking (Conforme RGPD / DSGVO & TikTok Ads API)
 * 
 * - Ne charge aucun cookie ni script tiers sans le consentement explicite de l'utilisateur.
 * - Prend en charge l'identifiant TikTok Pixel via process.env.REACT_APP_TIKTOK_PIXEL_ID.
 * - Fournit l'initialisation à la volée dès l'accord sur la bannière de consentement.
 */

const COOKIE_CONSENT_KEY = 'cookie-consent';

export const getPixelId = () => {
  return process.env.REACT_APP_TIKTOK_PIXEL_ID || '';
};

/**
 * Vérifie si le visiteur a explicitement donné son consentement pour les cookies marketing/analytiques.
 */
export const hasTikTokConsent = () => {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted';
  } catch {
    return false;
  }
};

/**
 * Active le consentement utilisateur et lance l'initialisation du pixel si un ID est configuré.
 */
export const grantTikTokConsent = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
  } catch {
    // Ignore les erreurs de quota ou mode privé
  }
  initTikTokPixel();
};

/**
 * Initialise le SDK TikTok Pixel uniquement si l'accord légal a été accordé.
 */
export const initTikTokPixel = () => {
  if (typeof window === 'undefined') return;

  // Respect strict de la directive ePrivacy et du DSGVO
  if (!hasTikTokConsent()) {
    return;
  }

  const pixelId = getPixelId();
  if (!pixelId) {
    // Prêt pour une insertion immédiate dès configuration de la clé
    return;
  }

  // Évite d'initialiser deux fois
  if (window.ttq && window.ttq._i && window.ttq._i[pixelId]) return;

  (function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = (w[t] = w[t] || []);
    ttq.methods = [
      'page',
      'track',
      'identify',
      'instances',
      'debug',
      'on',
      'off',
      'once',
      'ready',
      'alias',
      'group',
      'enableCookie',
      'disableCookie',
    ];
    ttq.setAndDefer = function (t, e) {
      t[e] = function () {
        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
      };
    };
    for (var i = 0; i < ttq.methods.length; i++) {
      ttq.setAndDefer(ttq, ttq.methods[i]);
    }
    ttq.instance = function (t) {
      var e = ttq._i[t] || [];
      for (var n = 0; n < ttq.methods.length; n++) {
        ttq.setAndDefer(e, ttq.methods[n]);
      }
      return e;
    };
    ttq.load = function (e, n) {
      var i = 'https://analytics.tiktok.com/i18n/pixel/events.js';
      ttq._i = ttq._i || {};
      ttq._i[e] = [];
      ttq._i[e]._u = i;
      ttq._t = ttq._t || {};
      ttq._t[e] = +new Date();
      ttq._o = ttq._o || {};
      ttq._o[e] = n || {};
      var o = d.createElement('script');
      o.type = 'text/javascript';
      o.async = true;
      o.src = i + '?sdkid=' + e + '&lib=' + t;
      var a = d.getElementsByTagName('script')[0];
      a.parentNode.insertBefore(o, a);
    };

    ttq.load(pixelId);
    ttq.page();
  })(window, document, 'ttq');
};

/**
 * Envoie un événement e-commerce standardisé à TikTok Ads.
 * Événements recommandés : ViewContent, AddToCart, InitiateCheckout, PlaceAnOrder, CompletePayment.
 */
export const trackTikTokEvent = (eventName, data = {}) => {
  if (typeof window === 'undefined') return;
  if (!hasTikTokConsent()) return;

  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track(eventName, data);
    }
  } catch (err) {
    // Mode silencieux afin de préserver l'expérience utilisateur
  }
};
