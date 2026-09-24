import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FiTruck, 
  FiShield, 
  FiStar, 
  FiCheckCircle, 
  FiShoppingCart, 
  FiArrowRight, 
  FiCheck 
} from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useCart } from '../contexts/CartContext';
import LocalizedLink from '../components/LocalizedLink/LocalizedLink';
import { products as localCatalogue } from '../data/catalogue';

/* ================= STYLES ================= */

const HomeContainer = styled.div`
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  animation: fadeIn 0.6s ease-in-out;

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

/* HERO SECTION */
const HeroSection = styled.section`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 16px;
  margin-bottom: 36px;
  background: linear-gradient(135deg, rgba(17, 34, 21, 0.94) 0%, rgba(27, 51, 32, 0.90) 50%, rgba(15, 23, 42, 0.85) 100%), 
              url('https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000&auto=format&fit=crop') center/cover no-repeat;
  color: #ffffff;
  padding: 64px 36px 48px;
  box-shadow: 0 20px 40px -15px rgba(20, 38, 24, 0.25);

  @media (max-width: 768px) {
    padding: 36px 20px 30px;
    margin-top: 8px;
    margin-bottom: 24px;
    border-radius: 14px;
  }
`;

const HeroBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(217, 119, 6, 0.2);
  border: 1px solid rgba(217, 119, 6, 0.4);
  color: #fde68a;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 18px;
  backdrop-filter: blur(4px);

  @media (max-width: 768px) {
    font-size: 11.5px;
    padding: 5px 10px;
    margin-bottom: 14px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 42px;
  font-weight: 800;
  line-height: 1.15;
  margin-bottom: 16px;
  color: #ffffff;
  letter-spacing: -0.5px;
  max-width: 850px;

  @media (max-width: 768px) {
    font-size: 26px;
    margin-bottom: 12px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 17px;
  line-height: 1.6;
  color: #e2ece4;
  max-width: 680px;
  margin-bottom: 28px;

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 22px;
  }
`;

const HeroButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 36px;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 26px;
  }
`;

const PrimaryBtn = styled(LocalizedLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  background: #d97706;
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;
  padding: 14px 28px;
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.25s ease;
  box-shadow: 0 4px 15px rgba(217, 119, 6, 0.4);

  &:hover {
    background: #b45309;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(217, 119, 6, 0.5);
    color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 12px 20px;
    font-size: 15px;
  }
`;

const SecondaryBtn = styled(LocalizedLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  font-weight: 600;
  font-size: 16px;
  padding: 14px 24px;
  border-radius: 10px;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(4px);
  transition: all 0.25s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.22);
    transform: translateY(-2px);
    color: #ffffff;
  }

  @media (max-width: 768px) {
    padding: 12px 18px;
    font-size: 14.5px;
  }
`;

const KeyPointsRibbon = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);

  @media (max-width: 768px) {
    gap: 12px;
    padding-top: 18px;
  }
`;

const KeyPointItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #e2ece4;

  svg {
    color: #fbbf24;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

/* TRUST BAR / REASSURANCE */
const TrustBarSection = styled.section`
  margin-bottom: 48px;

  @media (max-width: 768px) {
    margin-bottom: 32px;
  }
`;

const TrustGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const TrustCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 22px 18px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  &:hover {
    border-color: #2c5530;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(44, 85, 48, 0.08);
  }
`;

const TrustIconBox = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: #eef5f0;
  color: #2c5530;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 20px;
`;

const TrustInfo = styled.div`
  h4 {
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px;
  }

  p {
    font-size: 13px;
    line-height: 1.5;
    color: #64748b;
    margin: 0;
  }
`;

/* SECTION COMMONS */
const SectionHeader = styled.div`
  text-align: center;
  margin-bottom: 28px;

  h2 {
    font-size: 28px;
    font-weight: 800;
    color: #1b3b22;
    margin: 0 0 8px;
    letter-spacing: -0.3px;
  }

  p {
    font-size: 15px;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;

    h2 { font-size: 22px; }
    p { font-size: 13.5px; }
  }
`;

/* CATEGORIES */
const CategoriesSection = styled.section`
  margin-bottom: 56px;

  @media (max-width: 768px) {
    margin-bottom: 36px;
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
`;

const CategoryCard = styled(LocalizedLink)`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 220px;
  border-radius: 14px;
  overflow: hidden;
  text-decoration: none;
  padding: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.3) 60%, rgba(15, 23, 42, 0) 100%), var(--bg-img);
    background-size: cover;
    background-position: center;
    transition: transform 0.4s ease;
    z-index: 1;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.16);

    &::before {
      transform: scale(1.06);
    }
  }

  @media (max-width: 768px) {
    height: 170px;
    padding: 12px;
  }
`;

const CategoryMeta = styled.div`
  position: relative;
  z-index: 2;
  color: #ffffff;
`;

const CategoryPriceTag = styled.span`
  display: inline-block;
  background: #d97706;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 6px;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
`;

const CategoryName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin: 0 0 2px;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CategoryDesc = styled.span`
  font-size: 12px;
  color: #cbd5e1;
  display: block;
  opacity: 0.9;
  line-height: 1.3;

  @media (max-width: 768px) {
    display: none;
  }
`;

/* BESTSELLERS SECTION */
const BestsellersSection = styled.section`
  margin-bottom: 56px;

  @media (max-width: 768px) {
    margin-bottom: 36px;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const ProductCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);

  &:hover {
    border-color: #2c5530;
    transform: translateY(-3px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  }
`;

const ProductImageWrap = styled.div`
  position: relative;
  height: 190px;
  overflow: hidden;
  background: #f1f5f9;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }

  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
`;

const StockBadge = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #16a34a;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ProductBody = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #d97706;
  font-weight: 700;
  margin-bottom: 6px;
`;

const ProductTitle = styled.h4`
  font-size: 14.5px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 6px;
  line-height: 1.4;
  height: 40px;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const ProductPriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: auto;
  margin-bottom: 12px;
`;

const CurrentPrice = styled.span`
  font-size: 20px;
  font-weight: 800;
  color: #1b3b22;
`;

const RegularPrice = styled.span`
  font-size: 13px;
  color: #94a3b8;
  text-decoration: line-through;
`;

const ProductActionBtn = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #2c5530;
  color: #ffffff;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #1e3a22;
  }
`;

/* REVIEWS & SOCIAL PROOF */
const ReviewsSection = styled.section`
  margin-bottom: 56px;
  padding: 40px 24px;
  background: #f8fafc;
  border-radius: 18px;
  border: 1px solid #e2e8f0;

  @media (max-width: 768px) {
    padding: 24px 16px;
    margin-bottom: 36px;
    border-radius: 12px;
  }
`;

const ReviewsBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const ReviewsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const ReviewCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

const ReviewStars = styled.div`
  display: flex;
  gap: 2px;
  color: #f59e0b;
  margin-bottom: 10px;
`;

const VerifiedPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: #16a34a;
  background: #dcfce7;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 12px;
  width: fit-content;
`;

const ReviewText = styled.p`
  font-size: 13.5px;
  line-height: 1.6;
  color: #334155;
  margin: 0 0 16px;
  flex: 1;
`;

const ReviewAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2c5530;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
`;

const AuthorDetails = styled.div`
  h5 {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: #1e293b;
  }

  span {
    font-size: 11.5px;
    color: #64748b;
  }
`;

/* NEWSLETTER */
const NewsletterSection = styled.section`
  margin-bottom: 48px;
  background: linear-gradient(135deg, #1b3b22 0%, #2c5530 100%);
  border-radius: 18px;
  padding: 44px 32px;
  color: #ffffff;
  text-align: center;
  box-shadow: 0 16px 36px -10px rgba(27, 59, 34, 0.3);

  @media (max-width: 768px) {
    padding: 30px 18px;
    margin-bottom: 32px;
    border-radius: 12px;
  }
`;

const NewsletterForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  max-width: 520px;
  margin: 22px auto 0;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const NewsletterInput = styled.input`
  flex: 1;
  padding: 13px 18px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: #ffffff;
  font-size: 14.5px;
  outline: none;

  &:focus {
    border-color: #d97706;
  }
`;

const NewsletterSubmit = styled.button`
  background: #d97706;
  color: #ffffff;
  border: none;
  padding: 13px 24px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #b45309;
  }
`;

/* FINAL CTA */
const FinalCTASection = styled.section`
  margin-bottom: 24px;
  padding: 40px 24px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 28px 16px;
  }
`;

/* ================= COMPOSANT ================= */

const Home = () => {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);

  // Images par défaut pour les catégories
  const [categoryImages, setCategoryImages] = useState({
    bois: "https://images.unsplash.com/photo-1520114878144-6123749968dd?q=80&w=1200&auto=format&fit=crop",
    pellets: "https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1200&auto=format&fit=crop",
    buches_densifiees: "https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1200&auto=format&fit=crop",
    accessoires: "https://images.unsplash.com/photo-1543674892-7d64d45df18b?q=80&w=1200&auto=format&fit=crop",
    poeles: "https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1200&auto=format&fit=crop"
  });

  // Charger les images configurées et les produits phares
  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      // 1. Settings d'accueil
      try {
        const homeDoc = await getDoc(doc(db, 'settings', 'home'));
        if (mounted && homeDoc.exists()) {
          const data = homeDoc.data() || {};
          const ci = data.categoryImages || {};
          setCategoryImages(prev => ({
            bois: ci.bois || prev.bois,
            pellets: ci.pellets || prev.pellets,
            buches_densifiees: ci.buches_densifiees || prev.buches_densifiees,
            accessoires: ci.accessoires || prev.accessoires,
            poeles: ci.poeles || prev.poeles,
          }));
        }
      } catch (e) {
        // silencieux
      }

      // 2. Produits phares
      try {
        const snap = await getDocs(collection(db, 'products'));
        if (mounted && !snap.empty) {
          const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setFeaturedProducts(list.slice(0, 4));
          return;
        }
      } catch (e) {
        // fallback catalogue local
      }

      // Fallback: 4 produits du catalogue local
      if (mounted) {
        setFeaturedProducts(localCatalogue.slice(0, 4).map((p, idx) => ({
          id: p.id || `local-${idx}`,
          name: p.name,
          price: p.price,
          regularPrice: p.regularPrice,
          image: idx === 1 
            ? 'https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=600&auto=format&fit=crop'
            : 'https://images.unsplash.com/photo-1520114878144-6123749968dd?q=80&w=600&auto=format&fit=crop',
          rating: 4.8,
          inStock: true
        })));
      }
    };

    loadData();
    return () => { mounted = false; };
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.success(`${product.name || 'Produit'} ${t('cart.added_to_cart', 'ajouté au panier !')}`);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      toast.success(t('home.newsletter_success', 'Merci pour votre inscription à notre newsletter !'));
      setNewsletterEmail('');
    }
  };

  return (
    <HomeContainer>
      {/* 1. HERO SECTION */}
      <HeroSection>
        <HeroBadge>
          <FaFire /> {t('home.badge', 'Bois 100% sec & Granulés certifiés DINplus / PEFC')}
        </HeroBadge>
        
        <HeroTitle>
          {t('home.welcome_title', 'Bois de Chauffage & Granulés Premium Livrés Chez Vous')}
        </HeroTitle>

        <HeroSubtitle>
          {t('home.welcome_subtitle', "Bûches fendues prêtes à l'emploi (humidité < 20%), pellets de haute performance et livraison soignée à domicile avec chariot tout-terrain.")}
        </HeroSubtitle>

        <HeroButtons>
          <PrimaryBtn routeKey="products">
            <span>{t('home.cta_wood', 'Commander mon bois')}</span>
            <FiArrowRight />
          </PrimaryBtn>
          <SecondaryBtn routeKey="products" search="?main=pellets">
            <span>{t('home.cta_pellets', 'Découvrir les pellets')}</span>
          </SecondaryBtn>
        </HeroButtons>

        <KeyPointsRibbon>
          <KeyPointItem>
            <FiCheck /> {t('home.key_points.dry', "Taux d'humidité < 20% garanti")}
          </KeyPointItem>
          <KeyPointItem>
            <FiTruck /> {t('home.key_points.delivery', "Livraison tout-terrain incluse")}
          </KeyPointItem>
          <KeyPointItem>
            <FiShield /> {t('home.key_points.safe_pay', "Paiement sécurisé par virement")}
          </KeyPointItem>
        </KeyPointsRibbon>
      </HeroSection>

      {/* 2. TRUST BAR / ENGAGEMENTS */}
      <TrustBarSection>
        <TrustGrid>
          <TrustCard>
            <TrustIconBox><FiTruck /></TrustIconBox>
            <TrustInfo>
              <h4>{t('home.trust_bar.item1_title', 'Livraison Tout-Terrain')}</h4>
              <p>{t('home.trust_bar.item1_desc', 'Camion avec hayon et transpalette tout-terrain pour déposer vos palettes sous votre abri.')}</p>
            </TrustInfo>
          </TrustCard>

          <TrustCard>
            <TrustIconBox><FaFire /></TrustIconBox>
            <TrustInfo>
              <h4>{t('home.trust_bar.item2_title', 'Humidité Garantie < 20%')}</h4>
              <p>{t('home.trust_bar.item2_desc', 'Bois fendu, séché naturellement ou en séchoir pour un pouvoir calorifique maximal.')}</p>
            </TrustInfo>
          </TrustCard>

          <TrustCard>
            <TrustIconBox><FiShield /></TrustIconBox>
            <TrustInfo>
              <h4>{t('home.trust_bar.item3_title', 'Virement 100% Sécurisé')}</h4>
              <p>{t('home.trust_bar.item3_desc', 'Virement bancaire européen (SEPA / Vorkasse) avec facture officielle et validation rapide.')}</p>
            </TrustInfo>
          </TrustCard>

          <TrustCard>
            <TrustIconBox><FiCheckCircle /></TrustIconBox>
            <TrustInfo>
              <h4>{t('home.trust_bar.item4_title', 'Forêts Durables Certifiées')}</h4>
              <p>{t('home.trust_bar.item4_desc', '100% essences nobles (Chêne, Hêtre, Charme) issues de forêts gérées durablement.')}</p>
            </TrustInfo>
          </TrustCard>
        </TrustGrid>
      </TrustBarSection>

      {/* 3. CATÉGORIES PRINCIPALES */}
      <CategoriesSection>
        <SectionHeader>
          <h2>{t('home.categories_title', 'Nos Combustibles de Chauffage')}</h2>
          <p>{t('home.categories_subtitle', 'Sélectionnez votre type de combustible pour un rendement énergétique optimal')}</p>
        </SectionHeader>

        <CategoriesGrid>
          <CategoryCard routeKey="products" search="?main=bois" style={{ '--bg-img': `url('${categoryImages.bois}')` }}>
            <CategoryMeta>
              <CategoryPriceTag>{t('home.from_price', 'Dès')} 80.90€</CategoryPriceTag>
              <CategoryName>{t('home.cat_wood', 'Bois de chauffage')}</CategoryName>
              <CategoryDesc>{t('home.cat_wood_desc', 'Bûches 25, 33, 50cm')}</CategoryDesc>
            </CategoryMeta>
          </CategoryCard>

          <CategoryCard routeKey="products" search="?main=pellets" style={{ '--bg-img': `url('${categoryImages.pellets}')` }}>
            <CategoryMeta>
              <CategoryPriceTag>{t('home.from_price', 'Dès')} 299€</CategoryPriceTag>
              <CategoryName>{t('home.cat_pellets', 'Pellets & Granulés')}</CategoryName>
              <CategoryDesc>{t('home.cat_pellets_desc', 'DINplus / ENplus A1')}</CategoryDesc>
            </CategoryMeta>
          </CategoryCard>

          <CategoryCard routeKey="products" search="?main=buches-densifiees" style={{ '--bg-img': `url('${categoryImages.buches_densifiees}')` }}>
            <CategoryMeta>
              <CategoryPriceTag>{t('home.from_price', 'Dès')} 119€</CategoryPriceTag>
              <CategoryName>{t('home.cat_briquettes', 'Bûches densifiées')}</CategoryName>
              <CategoryDesc>{t('home.cat_briquettes_desc', 'Haute chaleur jour & nuit')}</CategoryDesc>
            </CategoryMeta>
          </CategoryCard>

          <CategoryCard routeKey="products" search="?main=accessoires" style={{ '--bg-img': `url('${categoryImages.accessoires}')` }}>
            <CategoryMeta>
              <CategoryPriceTag>{t('home.from_price', 'Dès')} 14.90€</CategoryPriceTag>
              <CategoryName>{t('home.cat_accessories', 'Accessoires')}</CategoryName>
              <CategoryDesc>{t('home.cat_accessories_desc', 'Allumage et petit bois')}</CategoryDesc>
            </CategoryMeta>
          </CategoryCard>

          <CategoryCard routeKey="products" search="?main=poeles" style={{ '--bg-img': `url('${categoryImages.poeles}')` }}>
            <CategoryMeta>
              <CategoryPriceTag>{t('home.from_price', 'Dès')} 450€</CategoryPriceTag>
              <CategoryName>{t('home.cat_stoves', 'Poêles & Foyers')}</CategoryName>
              <CategoryDesc>{t('home.cat_stoves_desc', 'Équipements performants')}</CategoryDesc>
            </CategoryMeta>
          </CategoryCard>
        </CategoriesGrid>
      </CategoriesSection>

      {/* 4. PRODUITS VEDETTES (BESTSELLERS) */}
      {featuredProducts.length > 0 && (
        <BestsellersSection>
          <SectionHeader>
            <h2>{t('home.bestsellers_title', 'Nos Meilleures Ventes')}</h2>
            <p>{t('home.bestsellers_subtitle', 'Les combustibles les plus plébiscités par nos clients pour cet hiver')}</p>
          </SectionHeader>

          <ProductsGrid>
            {featuredProducts.map((p) => (
              <ProductCard key={p.id}>
                <ProductImageWrap>
                  <img 
                    src={p.image || 'https://images.unsplash.com/photo-1520114878144-6123749968dd?q=80&w=600&auto=format&fit=crop'} 
                    alt={p.name} 
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1520114878144-6123749968dd?q=80&w=600&auto=format&fit=crop'; }}
                  />
                  <StockBadge>
                    <FiCheck size={12} /> {t('home.in_stock', 'En stock')}
                  </StockBadge>
                </ProductImageWrap>

                <ProductBody>
                  <ProductRating>
                    <FiStar fill="#d97706" size={13} />
                    <span>4.9 / 5</span>
                  </ProductRating>

                  <ProductTitle title={p.name}>
                    {p.name}
                  </ProductTitle>

                  <ProductPriceRow>
                    <CurrentPrice>{Number(p.price || 0).toFixed(2)}€</CurrentPrice>
                    {p.regularPrice && p.regularPrice > p.price && (
                      <RegularPrice>{Number(p.regularPrice).toFixed(2)}€</RegularPrice>
                    )}
                  </ProductPriceRow>

                  <ProductActionBtn onClick={() => handleAddToCart(p)}>
                    <FiShoppingCart size={15} />
                    <span>{t('home.add_to_cart', 'Ajouter au panier')}</span>
                  </ProductActionBtn>
                </ProductBody>
              </ProductCard>
            ))}
          </ProductsGrid>
        </BestsellersSection>
      )}

      {/* 5. AVIS CLIENTS & SOCIAL PROOF */}
      <ReviewsSection>
        <div style={{ textAlign: 'center' }}>
          <ReviewsBadge>
            <FiStar fill="#d97706" /> {t('home.reviews_badge', 'Note 4.9/5 basée sur plus de 1 850 avis clients vérifiés')}
          </ReviewsBadge>
          <SectionHeader style={{ marginBottom: 0 }}>
            <h2>{t('home.reviews_title', 'Ce Que Disent Nos Clients')}</h2>
            <p>{t('home.reviews_subtitle', 'Des retours authentiques sur notre qualité de bois et nos livraisons')}</p>
          </SectionHeader>
        </div>

        <ReviewsGrid>
          <ReviewCard>
            <ReviewStars>
              {[...Array(5)].map((_, i) => <FiStar key={i} fill="#f59e0b" size={16} />)}
            </ReviewStars>
            <VerifiedPill>
              <FiCheck size={11} /> {t('home.verified_purchase', 'Achat vérifié')}
            </VerifiedPill>
            <ReviewText>
              "{t('home.review1_text', "Qualité de chêne remarquable, les bûches sont parfaitement sèches et prêtes au feu. Le livreur a été formidable avec son chariot pour déposer la palette directement dans mon garage.")}"
            </ReviewText>
            <ReviewAuthor>
              <Avatar>{t('home.review1_author', 'MD').slice(0, 2)}</Avatar>
              <AuthorDetails>
                <h5>{t('home.review1_author', 'Marc D.')} • {t('home.review1_location', 'Strasbourg')}</h5>
                <span>{t('home.review1_product', 'Palette 2 stères Chêne 33cm')}</span>
              </AuthorDetails>
            </ReviewAuthor>
          </ReviewCard>

          <ReviewCard>
            <ReviewStars>
              {[...Array(5)].map((_, i) => <FiStar key={i} fill="#f59e0b" size={16} />)}
            </ReviewStars>
            <VerifiedPill>
              <FiCheck size={11} /> {t('home.verified_purchase', 'Achat vérifié')}
            </VerifiedPill>
            <ReviewText>
              "{t('home.review2_text', "Pellets Woodstock livrés rapidement. Très peu de poussière, combustion très propre dans mon poêle. Le virement bancaire a été validé très vite avec un suivi clair.")}"
            </ReviewText>
            <ReviewAuthor>
              <Avatar>{t('home.review2_author', 'TB').slice(0, 2)}</Avatar>
              <AuthorDetails>
                <h5>{t('home.review2_author', 'Thomas B.')} • {t('home.review2_location', 'Metz')}</h5>
                <span>{t('home.review2_product', 'Palette 66 sacs Pellets DINplus')}</span>
              </AuthorDetails>
            </ReviewAuthor>
          </ReviewCard>

          <ReviewCard>
            <ReviewStars>
              {[...Array(5)].map((_, i) => <FiStar key={i} fill="#f59e0b" size={16} />)}
            </ReviewStars>
            <VerifiedPill>
              <FiCheck size={11} /> {t('home.verified_purchase', 'Achat vérifié')}
            </VerifiedPill>
            <ReviewText>
              "{t('home.review3_text', "Client régulier depuis 3 ans. Rien à redire sur la qualité ni sur le service client qui est très réactif au téléphone. Bois fendu impeccable sans surprise.")}"
            </ReviewText>
            <ReviewAuthor>
              <Avatar>{t('home.review3_author', 'HV').slice(0, 2)}</Avatar>
              <AuthorDetails>
                <h5>{t('home.review3_author', 'Hélène V.')} • {t('home.review3_location', 'Colmar')}</h5>
                <span>{t('home.review3_product', 'Bûches densifiées Nuit & Jour')}</span>
              </AuthorDetails>
            </ReviewAuthor>
          </ReviewCard>
        </ReviewsGrid>
      </ReviewsSection>

      {/* 6. NEWSLETTER OFFRES SAISONNIÈRES */}
      <NewsletterSection>
        <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 10px' }}>
          {t('home.newsletter_title', 'Restez Informé de nos Offres Saisonnières')}
        </h2>
        <p style={{ fontSize: '15px', color: '#d1fae5', margin: 0, opacity: 0.95 }}>
          {t('home.newsletter_desc', 'Inscrivez-vous pour recevoir nos alertes stocks et profiter des meilleurs tarifs avant la saison hivernale.')}
        </p>
        <NewsletterForm onSubmit={handleNewsletterSubmit}>
          <NewsletterInput
            type="email"
            placeholder={t('home.newsletter_placeholder', 'Votre adresse email...')}
            value={newsletterEmail}
            onChange={(e) => setNewsletterEmail(e.target.value)}
            required
          />
          <NewsletterSubmit type="submit">
            {t('home.newsletter_btn', 'Recevoir les offres')}
          </NewsletterSubmit>
        </NewsletterForm>
      </NewsletterSection>

      {/* 7. FINAL CALL TO ACTION */}
      <FinalCTASection>
        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#1b3b22', margin: '0 0 10px' }}>
          {t('home.ready_title', 'Besoin de Conseils pour Votre Commande ?')}
        </h3>
        <p style={{ fontSize: '15px', color: '#64748b', maxWidth: '640px', margin: '0 auto 24px', lineHeight: 1.6 }}>
          {t('home.ready_desc', 'Nos experts en bois de chauffage sont à votre disposition pour calculer le cubage nécessaire et répondre à vos questions.')}
        </p>
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <PrimaryBtn routeKey="products">
            <span>{t('home.view_catalog', 'Consulter tout le catalogue')}</span>
            <FiArrowRight />
          </PrimaryBtn>
          <SecondaryBtn routeKey="contact" style={{ background: '#f1f5f9', color: '#1e293b', borderColor: '#cbd5e1' }}>
            <span>{t('home.contact_us', 'Nous contacter')}</span>
          </SecondaryBtn>
        </div>
      </FinalCTASection>
    </HomeContainer>
  );
};

export default Home;
