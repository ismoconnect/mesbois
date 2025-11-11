import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { auth, db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';

const AdminRoute = ({ children }) => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const run = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setIsAdmin(false);
          return;
        }
        const ref = doc(db, 'admins', user.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;
        setIsAdmin(!!data && (data.enabled === undefined || data.enabled === true));
      } catch (e) {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return null;

  const user = auth.currentUser;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default AdminRoute;
