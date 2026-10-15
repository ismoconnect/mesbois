/**
 * TikTok Pixel & E-commerce Events Tracking (Mode Direct Haute Performance)
 * 
 * - Déclenchement direct et instantané pour capturer 100% des conversions publicitaires.
 * - Ne dépend plus du clic sur la bannière de cookies pour éviter toute perte de ventes sur mobile.
 * - Envoie les événements officiels : ViewContent, AddToCart, InitiateCheckout, PlaceAnOrder, CompletePayment.
 */

// --------------------------------------------------------------------------
// RENSEIGNEZ VOTRE ID PIXEL TIKTOK CI-DESSOUS DÈS QUE VOUS L'AVEZ (ex: 'C1234567890ABCDEF')
// Ou définissez REACT_APP_TIKTOK_PIXEL_ID dans votre fichier .env.local
// --------------------------------------------------------------------------
export const DEFAULT_PIXEL_ID = 'VOTRE_TIKTOK_PIXEL_ID';

const COOKIE_CONSENT_KEY = 'cookie-consent';

export const getPixelId = () => {
  return (
    process.env.REACT_APP_TIKTOK_PIXEL_ID ||
    (typeof window !== 'undefined' && window.TIKTOK_PIXEL_ID) ||
    DEFAULT_PIXEL_ID
  );
};

/**
 * Indique si le consentement est actif (vrai par défaut en mode direct).
 */
export const hasTikTokConsent = () => {
  if (typeof window === 'undefined') return true;
  try {
    const val = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    // Uniquement si l'utilisateur a explicitement demandé l'opt-out 'rejected'
    return val !== 'rejected';
  } catch {
    return true;
  }
};

/**
 * Fonction appelée lors du clic sur la bannière (conserve la compatibilité).
 */
export const grantTikTokConsent = () => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
  } catch {
    // ignore
  }
};

/**
 * Initialise le SDK TikTok Pixel immédiatement dès l'arrivée du visiteur.
 */
export const initTikTokPixel = () => {
  if (typeof window === 'undefined') return;

  // Si l'utilisateur a expressément demandé un refus (opt-out), on respecte son choix
  if (!hasTikTokConsent()) return;

  const pixelId = getPixelId();
  // Ne charge pas le script distant si c'est encore le texte placeholder
  if (!pixelId || pixelId === 'VOTRE_TIKTOK_PIXEL_ID') {
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
 * Envoie un événement e-commerce standardisé à TikTok Ads sans blocage préalable.
 * Événements : ViewContent, AddToCart, InitiateCheckout, PlaceAnOrder, CompletePayment.
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
