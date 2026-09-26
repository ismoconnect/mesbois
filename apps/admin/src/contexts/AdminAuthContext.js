import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc, onSnapshot, collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const AdminAuthContext = createContext(null);

export const getAdminEmailDocId = (email) => {
  if (!email) return '';
  return `admin_${email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}`;
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [adminDoc, setAdminDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser || null);

      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (!fbUser) {
        setAdminDoc(null);
        setLoading(false);
        return;
      }

      try {
        const userEmail = (fbUser.email || '').toLowerCase().trim();
        const uidRef = doc(db, 'admins', fbUser.uid);
        const emailDocId = getAdminEmailDocId(userEmail);
        const emailRef = emailDocId ? doc(db, 'admins', emailDocId) : null;

        let foundData = null;
        let activeRef = uidRef;

        // 1. Vérification par UID
        try {
          const snap = await getDoc(uidRef);
          if (snap.exists()) {
            foundData = snap.data();
            activeRef = uidRef;
          }
        } catch (e) {
          // Ignorer l'erreur de permission si le document n'existe pas
        }

        // 2. Si non trouvé par UID, vérification par l'ID email (ex: admin_laudrinyves4_gmail_com)
        if (!foundData && emailRef) {
          try {
            const emailSnap = await getDoc(emailRef);
            if (emailSnap.exists()) {
              foundData = emailSnap.data();
              activeRef = emailRef;

              // Tentative de synchronisation vers l'UID sans bloquer si les permissions Firestore le refusent
              try {
                await setDoc(uidRef, {
                  ...foundData,
                  uid: fbUser.uid,
                  email: userEmail
                }, { merge: true });
                activeRef = uidRef;
              } catch {}
            }
          } catch (e) {
            // Ignorer
          }
        }

        // 3. Si toujours non trouvé, recherche par champ 'email'
        if (!foundData && userEmail) {
          try {
            const q = query(collection(db, 'admins'), where('email', '==', userEmail));
            const qSnap = await getDocs(q);
            if (!qSnap.empty) {
              foundData = qSnap.docs[0].data();
              activeRef = qSnap.docs[0].ref;
            }
          } catch (e) {
            // Ignorer
          }
        }

        if (foundData) {
          if (!foundData.role) {
            foundData.role = 'superadmin';
          }
          setAdminDoc(foundData);

          // Écouteur en temps réel sur le document actif existant
          try {
            unsubscribeDoc = onSnapshot(
              activeRef,
              (liveSnap) => {
                if (liveSnap.exists()) {
                  const liveData = liveSnap.data();
                  if (!liveData.role) liveData.role = 'superadmin';
                  setAdminDoc(liveData);
                }
              },
              () => {
                // En cas d'erreur de permission sur le flux temps réel, on conserve les données déjà chargées
              }
            );
          } catch {}
        } else {
          setAdminDoc(null);
        }

      } catch (err) {
        console.error('Erreur initialisation admin:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  const isAdmin = Boolean(
    user &&
    adminDoc &&
    (adminDoc.enabled === undefined || adminDoc.enabled === true)
  );

  // Super Admin check: rôle explicite 'superadmin' ou 'super_admin' ou isSuperAdmin === true
  const isSuperAdmin = Boolean(
    isAdmin &&
    (
      adminDoc?.role === 'superadmin' ||
      adminDoc?.role === 'super_admin' ||
      adminDoc?.isSuperAdmin === true ||
      !adminDoc?.role
    )
  );

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        adminDoc,
        isAdmin,
        isSuperAdmin,
        loading
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
