/**
 * TikTok Pixel & E-commerce Events Tracking
 * Gère l'initialisation du pixel TikTok et l'envoi d'événements e-commerce
 */

const getPixelId = () => {
  return process.env.REACT_APP_TIKTOK_PIXEL_ID || '';
};

export const initTikTokPixel = () => {
  if (typeof window === 'undefined') return;

  const pixelId = getPixelId();
  if (!pixelId) {
    // Prêt pour l'insertion future sans faire planter l'application
    return;
  }

  // Évite d'initialiser deux fois
  if (window.ttq) return;

  (function (w, d, t) {
    w.TiktokAnalyticsObject = t;
    var ttq = w[t] = w[t] || [];
    ttq.methods = [
      'page', 'track', 'identify', 'instances', 'debug', 'on', 'off', 'once', 'ready',
      'alias', 'group', 'enableCookie', 'disableCookie'
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
 * Envoie un événement de tracking à TikTok Ads
 * Événements supportés : ViewContent, AddToCart, InitiateCheckout, CompletePayment
 */
export const trackTikTokEvent = (eventName, data = {}) => {
  if (typeof window === 'undefined') return;
  try {
    if (window.ttq && typeof window.ttq.track === 'function') {
      window.ttq.track(eventName, data);
    }
  } catch (err) {
    // Silencieux pour ne pas impacter l'expérience client
  }
};
