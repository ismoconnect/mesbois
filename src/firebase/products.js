import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  limit,
  startAfter,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from './config';

// Obtenir tous les produits
export const getProducts = async (filters = {}, pagination = {}) => {
  try {
    let q = collection(db, 'products');
    
    // Appliquer les filtres
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.minPrice) {
      q = query(q, where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice) {
      q = query(q, where('price', '<=', filters.maxPrice));
    }
    if (filters.available) {
      q = query(q, where('stock', '>', 0));
    }
    
    // Tri
    q = query(q, orderBy('createdAt', 'desc'));
    
    // Pagination
    if (pagination.limit) {
      q = query(q, limit(pagination.limit));
    }
    
    const snapshot = await getDocs(q);
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtenir un produit par ID
export const getProductById = async (id) => {
  try {
    const productDoc = await getDoc(doc(db, 'products', id));
    if (productDoc.exists()) {
      return { 
        success: true, 
        data: { id: productDoc.id, ...productDoc.data() } 
      };
    } else {
      return { success: false, error: 'Produit non trouvé' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Rechercher des produits
export const searchProducts = async (searchTerm, filters = {}) => {
  try {
    let q = collection(db, 'products');
    
    // Appliquer les filtres de recherche
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.minPrice) {
      q = query(q, where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice) {
      q = query(q, where('price', '<=', filters.maxPrice));
    }
    
    const snapshot = await getDocs(q);
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return { success: true, data: products };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtenir les catégories
export const getCategories = async () => {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { success: true, data: categories };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Ajouter un produit (admin)
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...productData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Mettre à jour un produit (admin)
export const updateProduct = async (id, productData) => {
  try {
    await updateDoc(doc(db, 'products', id), {
      ...productData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Supprimer un produit (admin)
export const deleteProduct = async (id) => {
  try {
    await deleteDoc(doc(db, 'products', id));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

