import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const { user } = useAuth();
  const [unsub, setUnsub] = useState(null);

  // Charger le panier depuis le localStorage au montage
  useEffect(() => {
    const savedCart = localStorage.getItem('bois-de-chauffage-cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Erreur lors du chargement du panier:', error);
      }
    }
  }, []);

  // Sauvegarder le panier dans le localStorage à chaque changement
  useEffect(() => {
    localStorage.setItem('bois-de-chauffage-cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Synchronisation Firestore lorsque l'utilisateur est connecté
  useEffect(() => {
    // Nettoyer l'éventuel listener précédent
    if (unsub) {
      unsub();
      setUnsub(null);
    }

    const setup = async () => {
      if (!user) return; // pas connecté: rester en localStorage

      const cartRef = doc(db, 'carts', user.uid);
      try {
        const snap = await getDoc(cartRef);

        if (snap.exists()) {
          const remoteItems = snap.data()?.items || [];
          // Merge local->remote (priorité à la plus grande quantity)
          const map = new Map();
          for (const it of remoteItems) map.set(it.id, it);
          for (const it of cartItems) {
            const prev = map.get(it.id);
            if (!prev) map.set(it.id, it);
            else map.set(it.id, { ...prev, quantity: Math.max(prev.quantity || 0, it.quantity || 0) });
          }
          const merged = Array.from(map.values());
          setCartItems(merged);
          try {
            await setDoc(cartRef, { items: merged, updatedAt: serverTimestamp() }, { merge: true });
          } catch (e) {
            console.warn('Cart Firestore write skipped (permissions):', e?.code || e);
          }
        } else {
          try {
            await setDoc(cartRef, { items: cartItems, updatedAt: serverTimestamp() }, { merge: true });
          } catch (e) {
            console.warn('Cart Firestore init skipped (permissions):', e?.code || e);
          }
        }

        const unsubFn = onSnapshot(cartRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            const items = Array.isArray(data.items) ? data.items : [];
            setCartItems(items);
          }
        }, (e) => {
          console.warn('Cart Firestore listener error (permissions):', e?.code || e);
        });
        setUnsub(() => unsubFn);
      } catch (e) {
        console.warn('Cart Firestore read skipped (permissions):', e?.code || e);
        return; // rester en local
      }
    };

    setup();

    return () => {
      if (unsub) {
        unsub();
        setUnsub(null);
      }
    };
  }, [user]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        const newItems = prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
        // Persist Firestore si connecté
        if (user) {
          const cartRef = doc(db, 'carts', user.uid);
          setDoc(cartRef, { items: newItems, updatedAt: serverTimestamp() }, { merge: true });
        }
        return newItems;
      } else {
        const newItems = [...prevItems, { ...product, quantity }];
        if (user) {
          const cartRef = doc(db, 'carts', user.uid);
          setDoc(cartRef, { items: newItems, updatedAt: serverTimestamp() }, { merge: true });
        }
        return newItems;
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => {
      const newItems = prevItems.filter(item => item.id !== productId);
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        setDoc(cartRef, { items: newItems, updatedAt: serverTimestamp() }, { merge: true });
      }
      return newItems;
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems => {
      const newItems = prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      if (user) {
        const cartRef = doc(db, 'carts', user.uid);
        setDoc(cartRef, { items: newItems, updatedAt: serverTimestamp() }, { merge: true });
      }
      return newItems;
    });
  };

  const clearCart = () => {
    setCartItems([]);
    if (user) {
      const cartRef = doc(db, 'carts', user.uid);
      setDoc(cartRef, { items: [], updatedAt: serverTimestamp() }, { merge: true });
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = Number(item?.price) || 0;
      const qty = Number(item?.quantity) || 0;
      return total + price * qty;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item.id === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item.id === productId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isInCart,
    getCartItem
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

