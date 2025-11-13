# 🔍 Guide de débogage - Images produits

## Étapes de test

### 1. **Lance le serveur client**
```bash
cd apps/client
npm start
```

### 2. **Accède à la page avec débogage**
```
http://localhost:3000/products?debugImages=1
```

### 3. **Ouvre la console du navigateur** (F12 → Console)

Tu devrais voir les logs suivants :

#### ✅ Logs attendus (dans l'ordre d'apparition):

1. **Initialisation du hook:**
   ```
   🔍 useProductImages: Initialisation du listener...
   ```

2. **Listener onSnapshot:**
   ```
   productImages onSnapshot fired: true
   productImages data keys: [Array(45)]  ← 45 produits trouvés
   ```

3. **Fallback getDoc (si onSnapshot est lent):**
   ```
   ✅ getDoc fallback réussi, images chargées: 45
   ```

4. **État du hook après chargement:**
   ```
   🖼️  useProductImages hook state: {
     loading: false,
     imageCount: 45,
     sampleIds: ['1AzxudizEE6eDEyLH0Yb', '1EaiqxbniZsxDubLZo8h', '4yFfIoJxjEuY3uFS3FR1'],
     productImages: {...}
   }
   ```

5. **État de chaque ProductCard:**
   ```
   [ProductCard 1AzxudizEE6eDEyLH0Yb] loading=false, imageUrl=https://res.cloudinary.com/...
   [ProductCard 1EaiqxbniZsxDubLZo8h] loading=false, imageUrl=https://res.cloudinary.com/...
   ...
   ```

---

## 🆘 Troubleshooting

### ❌ Si tu ne vois pas les logs "🔍 useProductImages":
- Le hook n'est pas appelé
- **Solution**: Vérifie que ProductCard importe et appelle le hook

### ❌ Si tu vois "productImages onSnapshot fired: false":
- Le document `settings/productImages` n'existe pas dans Firebase
- **Solution**: Clique sur le bouton `[DEBUG] Importer images` dans l'admin

### ❌ Si les images affichent "https://picsum.photos/..." :
- `productImages` est vide ou le fallback est utilisé
- **Solution**: 
  1. Vérifie que la console affiche "imageCount: 45" dans l'état du hook
  2. Si vide, le document n'existe pas ou onSnapshot échoue
  3. Regarde les erreurs réseau (onglet Network) pour les appels Firebase

### ❌ Si tu vois "ERR_NAME_NOT_RESOLVED":
- Problème de connectivité Firestore (DNS/VPN/firewall)
- **Solution**: 
  ```
  Ajoute dans le fichier .env du client:
  REACT_APP_FIRESTORE_FORCE_LONG_POLLING=true
  ```
  Puis redémarre le serveur (`npm start`)

---

## 📊 Vérifications visuelles

- ✅ Les images s'affichent sous chaque produit
- ✅ Les URLs en console commencent par `https://res.cloudinary.com/` ou `https://images.unsplash.com/`
- ✅ Pas d'erreurs 404 (onglet Network)
- ✅ loading passe à `false` après ~1-2 secondes

---

## 🐛 Alternative: Test direct depuis console

Exécute ceci dans la console (F12 > Console):
```javascript
window.testProductImages()
```

Ce script testéra:
1. Si Firebase est chargé
2. Si Firestore est accessible
3. Si les images sont dans le DOM
4. L'état du hook useProductImages

---

## 📝 Fichiers impliqués

- `apps/client/src/hooks/useProductImages.js` ← Récupère les images de `settings/productImages`
- `apps/client/src/components/Products/ProductCard.js` ← Utilise le hook
- `apps/client/src/pages/Products.js` ← Utilise le hook
- `apps/admin/src/pages/ImageManager.js` ← Bouton pour importer les images

---

## 🎯 Prochain pas si tout fonctionne:

1. Vérifie que les images s'affichent correctement visuellement
2. Clique sur quelques produits pour vérifier les images en détail
3. Teste l'ajout au panier pour confirmer le workflow complet

