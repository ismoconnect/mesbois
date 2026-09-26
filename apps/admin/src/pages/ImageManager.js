import React, { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { 
  FiImage, FiSave, FiArrowLeft, FiUploadCloud, FiHome, FiPackage, 
  FiChevronDown, FiChevronUp, FiSearch, FiCheckCircle, FiAlertCircle, FiX, FiLoader
} from 'react-icons/fi';

const Container = styled.div`
  max-width: 1250px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 20px;
  padding: 16px 10px 32px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    gap: 24px;
    padding: 24px 16px 40px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: 800;
  color: #2c5530;
  margin: 0;
  
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const PageSubtitle = styled.p`
  margin: 4px 0 0 0;
  color: #6b7c6d;
  font-size: 13px;
  
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 1.5px solid #e6eae7;
  color: #2c5530;
  padding: 8px 14px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #f5f7f6;
    border-color: #2c5530;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 8px;
  border-bottom: 2px solid #e6eae7;
  padding-bottom: 2px;
`;

const Tab = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 12px 18px;
  font-size: 14px;
  font-weight: 700;
  color: ${p => p.$active ? '#2c5530' : '#6b7c6d'};
  border-bottom: 3px solid ${p => p.$active ? '#2c5530' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #2c5530;
    background: #f8faf8;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  border: 1px solid #e6eae7;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03);

  @media (min-width: 768px) {
    padding: 24px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: #2c5530;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
`;

/* ── DropZone & Upload ── */
const DropZoneContainer = styled.div`
  border: 2px dashed ${p => p.$isDragging ? '#2c5530' : '#d0d7d1'};
  background: ${p => p.$isDragging ? '#f0f7f2' : '#f9faf9'};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  position: relative;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &:hover {
    border-color: #2c5530;
    background: #f4f8f5;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 8px;
`;

const OverlayActions = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.2s ease;

  ${DropZoneContainer}:hover & {
    opacity: 1;
  }
`;

const OverlayBtn = styled.button`
  background: rgba(255, 255, 255, 0.95);
  color: ${p => p.$danger ? '#c0392b' : '#2c5530'};
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #ffffff;
    transform: scale(1.03);
  }
`;

const UploadPrompt = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #6b7c6d;

  svg {
    font-size: 32px;
    color: #2c5530;
    opacity: 0.7;
  }

  span {
    font-size: 13px;
    font-weight: 600;
  }

  small {
    font-size: 11px;
    color: #95a596;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #2c5530;
  font-weight: 700;
  font-size: 13px;

  svg {
    animation: spin 1s linear infinite;
    font-size: 28px;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const UrlInputToggle = styled.button`
  background: none;
  border: none;
  color: #6b7c6d;
  font-size: 11px;
  text-decoration: underline;
  cursor: pointer;
  margin-top: 6px;
  align-self: flex-end;

  &:hover {
    color: #2c5530;
  }
`;

const ManualInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d0d7d1;
  border-radius: 6px;
  font-size: 12px;
  margin-top: 8px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #2c5530;
  }
`;

/* ── Grid Layouts ── */
const HomeGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CategoryBox = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 16px;
  display: grid;
  gap: 12px;
`;

const CategoryLabel = styled.label`
  font-weight: 700;
  color: #2c5530;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

/* ── Collapsible Product Category Section ── */
const AccordionSection = styled.div`
  border: 1px solid #e6eae7;
  border-radius: 12px;
  margin-bottom: 16px;
  overflow: hidden;
  background: #fff;
`;

const AccordionHeader = styled.div`
  background: #f8faf8;
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;

  &:hover {
    background: #eff4f0;
  }
`;

const AccordionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 800;
  font-size: 16px;
  color: #2c5530;
`;

const Badge = styled.span`
  background: #eaf4ee;
  color: #2c5530;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
`;

const AccordionBody = styled.div`
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;

  @media (min-width: 650px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1000px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ProductCard = styled.div`
  background: #fcfdfc;
  border: 1px solid #e9eee9;
  border-radius: 12px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ProductName = styled.h4`
  margin: 0;
  font-size: 14px;
  font-weight: 700;
  color: #1f2d1f;
  line-height: 1.3;
  min-height: 36px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

/* ── Actions Bar ── */
const SaveBar = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e6eae7;
`;

const SaveBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #2c5530;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1e3a22;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f5f7f6;
  border: 1.5px solid #e6eae7;
  border-radius: 10px;
  padding: 8px 14px;
  width: 100%;
  max-width: 320px;
  box-sizing: border-box;

  input {
    border: none;
    background: transparent;
    font-size: 13px;
    width: 100%;
    outline: none;
  }
`;

/* ── Toast Notifications ── */
const ToastContainer = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ToastItem = styled.div`
  background: ${p => p.$type === 'error' ? '#c0392b' : '#2c5530'};
  color: #fff;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
`;

/* ── Cloudinary Upload Helper ── */
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'ml_default');

  const response = await fetch('https://api.cloudinary.com/v1_1/dxvbuhadg/image/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    throw new Error('Échec du téléversement sur Cloudinary');
  }

  const data = await response.json();
  return data.secure_url;
};

/* ── Component DropZone ── */
const DropZone = ({ currentUrl, onUrlChange, onUploadSuccess, onError }) => {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      onUrlChange(url);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      if (onError) onError("Erreur d'upload : " + err.message);
    } finally {
      setUploading(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <DropZoneContainer
        $isDragging={isDragging}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
          accept="image/*"
          style={{ display: 'none' }}
        />

        {uploading ? (
          <LoadingSpinner>
            <FiLoader />
            <span>Upload en cours...</span>
          </LoadingSpinner>
        ) : currentUrl ? (
          <>
            <PreviewImage src={currentUrl} alt="Preview" onError={(e) => { e.currentTarget.src = '/placeholder-wood.jpg'; }} />
            <OverlayActions onClick={(e) => e.stopPropagation()}>
              <OverlayBtn onClick={() => fileInputRef.current?.click()}>
                <FiUploadCloud size={14} /> Changer
              </OverlayBtn>
              <OverlayBtn $danger onClick={() => onUrlChange('')}>
                <FiX size={14} /> Effacer
              </OverlayBtn>
            </OverlayActions>
          </>
        ) : (
          <UploadPrompt>
            <FiUploadCloud />
            <span>Glissez une image ici</span>
            <small>ou cliquez pour parcourir vos fichiers</small>
          </UploadPrompt>
        )}
      </DropZoneContainer>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <UrlInputToggle type="button" onClick={() => setShowManual(!showManual)}>
          {showManual ? 'Masquer URL manuelle' : 'Saisir une URL manuellement'}
        </UrlInputToggle>
      </div>

      {showManual && (
        <ManualInput
          type="text"
          value={currentUrl || ''}
          onChange={(e) => onUrlChange(e.target.value)}
          placeholder="https://..."
        />
      )}
    </div>
  );
};

/* ── Main Component ── */
const ImageManager = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [loading, setLoading] = useState(true);
  const [savingHome, setSavingHome] = useState(false);
  const [savingProducts, setSavingProducts] = useState(false);
  
  const [homeValues, setHomeValues] = useState({
    bois: '',
    accessoires: '',
    buches_densifiees: '',
    pellets: '',
    poeles: ''
  });

  const [products, setProducts] = useState([]);
  const [productImages, setProductImages] = useState({});
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      // 1. Home Category Images
      const homeSnap = await getDoc(doc(db, 'settings', 'home'));
      if (homeSnap.exists()) {
        const data = homeSnap.data() || {};
        const ci = data.categoryImages || {};
        setHomeValues({
          bois: ci.bois || '',
          accessoires: ci.accessoires || '',
          buches_densifiees: ci.buches_densifiees || '',
          pellets: ci.pellets || '',
          poeles: ci.poeles || ''
        });
      }

      // 2. Centralized product images settings
      const prodImgSnap = await getDoc(doc(db, 'settings', 'productImages'));
      let centralImages = {};
      if (prodImgSnap.exists()) {
        centralImages = prodImgSnap.data()?.images || {};
      }

      // 3. Products list
      const productsSnap = await getDocs(collection(db, 'products'));
      const list = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(list);

      // Merge images: central > product doc
      const mergedImages = { ...centralImages };
      list.forEach(p => {
        if (!mergedImages[p.id] && p.image) {
          mergedImages[p.id] = p.image;
        }
      });
      setProductImages(mergedImages);

    } catch (err) {
      console.error('Erreur chargement:', err);
      addToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHomeImages = async () => {
    setSavingHome(true);
    try {
      await setDoc(doc(db, 'settings', 'home'), {
        categoryImages: { ...homeValues },
        updatedAt: new Date()
      }, { merge: true });
      addToast("Images de la page d'accueil enregistrées !");
    } catch (err) {
      console.error(err);
      addToast("Erreur lors de la sauvegarde des images d'accueil", 'error');
    } finally {
      setSavingHome(false);
    }
  };

  const saveAllProductImages = async () => {
    setSavingProducts(true);
    try {
      // Save settings doc
      await setDoc(doc(db, 'settings', 'productImages'), {
        images: { ...productImages },
        updatedAt: new Date(),
        cacheBuster: Date.now()
      }, { merge: true });

      // Batch update products docs for integrity
      for (const [productId, imageUrl] of Object.entries(productImages)) {
        try {
          await updateDoc(doc(db, 'products', productId), {
            image: imageUrl,
            updatedAt: new Date()
          });
        } catch (e) {
          // ignore single product update fail if doc missing
        }
      }

      addToast('Toutes les images des produits ont été enregistrées !');
      loadAll();
    } catch (err) {
      console.error(err);
      addToast('Erreur lors de la sauvegarde des images produits', 'error');
    } finally {
      setSavingProducts(false);
    }
  };

  const toggleCategory = (catKey) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [catKey]: !prev[catKey]
    }));
  };

  const categoryLabels = {
    bois: 'Bois de chauffage',
    pellets: 'Pellets & Granulés',
    buches_densifiees: 'Bûches densifiées',
    poeles: 'Poêles & Foyers',
    accessoires: 'Accessoires & Entretien',
    autre: 'Autres produits'
  };

  const homeFields = [
    { key: 'bois', label: 'Bois de chauffage' },
    { key: 'pellets', label: 'Pellets & Granulés' },
    { key: 'buches_densifiees', label: 'Bûches densifiées' },
    { key: 'poeles', label: 'Poêles' },
    { key: 'accessoires', label: 'Accessoires' }
  ];

  // Group products by category
  const groupedProducts = (() => {
    const groups = {};
    const q = searchQuery.toLowerCase().trim();

    products.forEach(p => {
      if (q && !(p.name || '').toLowerCase().includes(q)) return;
      
      const cat = p.category && categoryLabels[p.category] ? p.category : 'autre';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(p);
    });

    return groups;
  })();

  if (loading) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7c6d' }}>
          <FiLoader size={32} style={{ animation: 'spin 1s linear infinite' }} />
          <p style={{ marginTop: '12px', fontWeight: 600 }}>Chargement des images...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Toast system */}
      <ToastContainer>
        {toasts.map(t => (
          <ToastItem key={t.id} $type={t.type}>
            {t.type === 'error' ? <FiAlertCircle size={18} /> : <FiCheckCircle size={18} />}
            {t.message}
          </ToastItem>
        ))}
      </ToastContainer>

      <Header>
        <div>
          <Title>Gestion des Images</Title>
          <PageSubtitle>Gérez l'illustration des catégories et des produits de votre catalogue</PageSubtitle>
        </div>
        <BackButton onClick={() => window.history.back()}>
          <FiArrowLeft size={16} /> Retour
        </BackButton>
      </Header>

      <Tabs>
        <Tab $active={activeTab === 'home'} onClick={() => setActiveTab('home')}>
          <FiHome size={18} /> Page d'accueil
        </Tab>
        <Tab $active={activeTab === 'products'} onClick={() => setActiveTab('products')}>
          <FiPackage size={18} /> Produits ({products.length})
        </Tab>
      </Tabs>

      {/* TAB 1: Page d'accueil */}
      {activeTab === 'home' && (
        <Card>
          <SectionHeader>
            <SectionTitle>
              <FiImage /> Images des catégories (Page d'accueil)
            </SectionTitle>
          </SectionHeader>

          <HomeGrid>
            {homeFields.map(f => (
              <CategoryBox key={f.key}>
                <CategoryLabel>
                  <FiImage /> {f.label}
                </CategoryLabel>
                <DropZone
                  currentUrl={homeValues[f.key]}
                  onUrlChange={(url) => setHomeValues(prev => ({ ...prev, [f.key]: url }))}
                  onError={(msg) => addToast(msg, 'error')}
                />
              </CategoryBox>
            ))}
          </HomeGrid>

          <SaveBar>
            <SaveBtn onClick={saveHomeImages} disabled={savingHome}>
              <FiSave size={18} />
              {savingHome ? 'Enregistrement...' : "Enregistrer les images d'accueil"}
            </SaveBtn>
          </SaveBar>
        </Card>
      )}

      {/* TAB 2: Images Produits par Catégorie */}
      {activeTab === 'products' && (
        <Card>
          <SectionHeader>
            <SectionTitle>
              <FiPackage /> Catalogue Produits
            </SectionTitle>
            <SearchInput>
              <FiSearch size={16} color="#6b7c6d" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </SearchInput>
          </SectionHeader>

          {Object.keys(groupedProducts).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7c6d' }}>
              Aucun produit trouvé pour "{searchQuery}".
            </div>
          ) : (
            Object.keys(categoryLabels).map(catKey => {
              const catProducts = groupedProducts[catKey];
              if (!catProducts || catProducts.length === 0) return null;
              const isCollapsed = !!collapsedCategories[catKey];

              return (
                <AccordionSection key={catKey}>
                  <AccordionHeader onClick={() => toggleCategory(catKey)}>
                    <AccordionTitle>
                      {categoryLabels[catKey]}
                      <Badge>{catProducts.length} produit{catProducts.length > 1 ? 's' : ''}</Badge>
                    </AccordionTitle>
                    {isCollapsed ? <FiChevronDown size={20} /> : <FiChevronUp size={20} />}
                  </AccordionHeader>

                  {!isCollapsed && (
                    <AccordionBody>
                      {catProducts.map(p => (
                        <ProductCard key={p.id}>
                          <ProductName>{p.name}</ProductName>
                          <DropZone
                            currentUrl={productImages[p.id] || p.image || ''}
                            onUrlChange={(url) => setProductImages(prev => ({ ...prev, [p.id]: url }))}
                            onError={(msg) => addToast(msg, 'error')}
                          />
                        </ProductCard>
                      ))}
                    </AccordionBody>
                  )}
                </AccordionSection>
              );
            })
          )}

          <SaveBar>
            <SaveBtn onClick={saveAllProductImages} disabled={savingProducts}>
              <FiSave size={18} />
              {savingProducts ? 'Enregistrement...' : 'Enregistrer toutes les images produits'}
            </SaveBtn>
          </SaveBar>
        </Card>
      )}
    </Container>
  );
};

export default ImageManager;
