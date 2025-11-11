import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  addDoc,
  updateDoc,
  
} from 'firebase/firestore';
import { db } from './config';

// Créer une commande
export const createOrder = async (orderData) => {
  try {
    const orderRef = await addDoc(collection(db, 'orders'), {
      ...orderData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    return { success: true, id: orderRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtenir les commandes d'un utilisateur
export const getUserOrders = async (userId) => {
  try {
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtenir une commande par ID
export const getOrderById = async (orderId) => {
  try {
    const orderDoc = await getDoc(doc(db, 'orders', orderId));
    if (orderDoc.exists()) {
      return { 
        success: true, 
        data: { id: orderDoc.id, ...orderDoc.data() } 
      };
    } else {
      return { success: false, error: 'Commande non trouvée' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mettre à jour le statut d'une commande
export const updateOrderStatus = async (orderId, status, trackingInfo = null) => {
  try {
    const updateData = {
      status,
      updatedAt: new Date()
    };
    
    if (trackingInfo) {
      updateData.trackingInfo = trackingInfo;
    }
    
    await updateDoc(doc(db, 'orders', orderId), updateData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtenir toutes les commandes (admin)
export const getAllOrders = async () => {
  try {
    const q = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: orders };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Annuler une commande
export const cancelOrder = async (orderId, reason) => {
  try {
    await updateDoc(doc(db, 'orders', orderId), {
      status: 'cancelled',
      cancellationReason: reason,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

