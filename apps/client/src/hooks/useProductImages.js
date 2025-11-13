import { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const CACHE_KEY = 'mesbois:productImages:v1';

export const useProductImages = () => {
  const [productImages, setProductImages] = useState(() => {
    // Charger l'état initial depuis sessionStorage pour un affichage rapide
    try {
      const raw = typeof window !== 'undefined' && window.sessionStorage ? sessionStorage.getItem(CACHE_KEY) : null;
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      // Structure du cache: { images: {...}, cacheBuster?: number }
      return parsed && parsed.images ? parsed.images : {};
    } catch (e) {
      return {};
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = doc(db, 'settings', 'productImages');

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() || {};
        const images = data.images || {};
        const cacheBuster = data.cacheBuster || 0;
        setProductImages(images);

        // Mettre à jour le cache avec les nouvelles données
        try {
          if (typeof window !== 'undefined' && window.sessionStorage) {
            const payload = { images, cacheBuster };
            sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload));
          }
        } catch (e) {}
      } else {
        
      }
      setLoading(false);
    }, (error) => {
      // En cas d'erreur (ex: réseau), on ne modifie pas l'état pour garder les données en cache.
      setLoading(false);
    });

    // Fallback: récupérer une fois via getDoc pour rafraîchir immédiatement
    (async () => {
      try {
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data() || {};
          const images = data.images || {};
          const cacheBuster = data.cacheBuster || 0;
          // Lire le cache courant pour comparer cacheBuster
          let cachedBuster = 0;
          try {
            const raw = typeof window !== 'undefined' && window.sessionStorage ? sessionStorage.getItem(CACHE_KEY) : null;
            if (raw) {
              const parsed = JSON.parse(raw);
              cachedBuster = parsed && parsed.cacheBuster ? parsed.cacheBuster : 0;
            }
          } catch {}

          if (cacheBuster !== cachedBuster) {
            setProductImages(images);
            try {
              if (typeof window !== 'undefined' && window.sessionStorage) {
                sessionStorage.setItem(CACHE_KEY, JSON.stringify({ images, cacheBuster }));
              }
            } catch {}
          }
        }
      } catch (e) {
        
      } finally {
        // Ne pas écraser loading=false si onSnapshot l'a déjà fait
      }
    })();

    // La fonction de nettoyage se chargera de détacher le listener
    return () => {
      unsubscribe();
    };
  }, []); // Le tableau de dépendances est vide pour n'exécuter l'effet qu'une seule fois

  return { productImages, loading };
};
