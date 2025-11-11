import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FiTruck, FiShield, FiStar, FiHeart } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  animation: fadeIn 0.8s ease-in-out;
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CategoriesNav = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin-top: 6px;
  order: 2;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const CategoryCard = styled(Link)`
  position: relative;
  display: block;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  background: #eef3ee;
  text-decoration: none;
  border: 2px solid #e0e0e0;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;

  &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,.08); border-color: #2c5530; }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,.45)), var(--bg-img);
    background-size: cover;
    background-position: center;
  }

  span {
    position: absolute;
    left: 12px;
    bottom: 12px;
    color: #fff;
    font-weight: 800;
    letter-spacing: .2px;
    text-shadow: 0 2px 6px rgba(0,0,0,.4);
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #58ad71 0%, #3a7a4b 100%);
  color: #ffffff;
  padding: 56px 0;
  text-align: center;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 0 0 48px;
    margin-top: 0;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    padding: 0 0 40px;
    margin-top: 0;
    margin-bottom: 20px;
  }
  
  @media (max-width: 375px) {
    padding: 0 0 36px;
    margin-top: 0;
    margin-bottom: 16px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 44px;
  font-weight: 800;
  margin-bottom: 12px;
  color: #ffffff;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 32px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  margin-bottom: 28px;
  margin-top: 8px;
  opacity: 0.95;
  line-height: 1.6;
  max-width: 720px;
  margin-left: auto;
  margin-right: auto;
  color: #eef5f0;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 24px;
  }
`;

const HeroButton = styled(Link)`
  display: inline-block;
  background: #2c5530;
  color: white;
  padding: 14px 28px;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 700;
  font-size: 16px;
  transition: background-color 0.25s ease, transform 0.15s ease;
  position: relative;
  z-index: 1;
  animation: buttonSlideIn 1.2s cubic-bezier(0.68, -0.55, 0.265, 1.55) 0.9s both;
  overflow: hidden;
  margin: 0 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 0 0 0 rgba(255, 255, 255, 0.5);
  
  @media (max-width: 768px) {
    padding: 14px 32px;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px 28px;
    font-size: 15px;
    margin: 0 5px;
  }
  
  @media (max-width: 375px) {
    padding: 10px 24px;
    font-size: 14px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #27ae60, #2c5530);
    transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(44, 85, 48, 0.3), transparent);
    transition: left 0.7s ease;
  }
  
  span {
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.8);
    color: white;
    
    &::before {
      width: 400px;
      height: 400px;
    }
    
    &::after {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(-2px) scale(1.02);
  }
  
  @keyframes buttonSlideIn {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const HeroDecoration = styled.div`
  display: none;
`;

const FloatingParticle = styled.div`
  position: absolute;
  width: ${props => props.size || '4px'};
  height: ${props => props.size || '4px'};
  background: rgba(255, 255, 255, 0.6);
  border-radius: 50%;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  animation: floatParticle ${props => props.duration || '8s'} ease-in-out infinite;
  animation-delay: ${props => props.delay || '0s'};
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  
  @keyframes floatParticle {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    50% {
      transform: translate(${props => props.moveX || '30px'}, ${props => props.moveY || '-50px'}) scale(1.2);
      opacity: 0.8;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translate(0, 0) scale(1);
      opacity: 0;
    }
  }
`;

const FloatingIcon = styled.div`
  position: absolute;
  top: ${props => props.top || '50%'};
  left: ${props => props.left || '50%'};
  font-size: ${props => props.size || '30px'};
  animation: floatIcon ${props => props.duration || '20s'} linear infinite;
  animation-delay: ${props => props.delay || '0s'};
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.8)) brightness(1.1);
  pointer-events: none;
  
  &::before {
    content: '${props => props.icon || '🌳'}';
    display: block;
  }
  
  @keyframes floatIcon {
    0% {
      transform: translate(0, 0) rotate(0deg);
      opacity: 0.6;
    }
    25% {
      opacity: 0.9;
    }
    50% {
      transform: translate(${props => props.moveX || '50px'}, ${props => props.moveY || '50px'}) rotate(${props => props.rotate || '180deg'});
      opacity: 0.8;
    }
    75% {
      opacity: 0.9;
    }
    100% {
      transform: translate(0, 0) rotate(${props => props.rotateEnd || '360deg'});
      opacity: 0.6;
    }
  }
`;

const HeroWave = styled.div`
  display: none;
`;

const FeaturesSection = styled.section`
  padding: 36px 0;
  background: white;
  
  @media (max-width: 768px) {
    padding: 28px 0;
  }
  
  @media (max-width: 480px) {
    padding: 24px 0;
  }
  
  @media (max-width: 375px) {
    padding: 20px 0;
  }
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 42px;
  font-weight: 800;
  margin-bottom: 24px;
  color: #2c5530;
  position: relative;
  padding-bottom: 20px;
  white-space: nowrap;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 5px;
    background: linear-gradient(90deg, #2c5530 0%, #27ae60 50%, #2c5530 100%);
    border-radius: 3px;
    animation: lineExpand 1.5s ease-out both;
  }
  
  @keyframes lineExpand {
    from {
      width: 0;
      opacity: 0;
    }
    to {
      width: 80px;
      opacity: 1;
    }
  }
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 30px;
    padding-bottom: 12px;
    white-space: normal;
    
    &::after {
      width: 50px;
      height: 3px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: 20px;
    padding-bottom: 10px;
    
    &::after {
      width: 40px;
      height: 2px;
    }
  }
  
  @media (max-width: 375px) {
    font-size: 18px;
    margin-bottom: 15px;
    padding-bottom: 8px;
    
    &::after {
      width: 30px;
      height: 2px;
    }
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  margin-bottom: 32px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 24px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 20px;
  }
  
  @media (max-width: 375px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-bottom: 18px;
  }
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 40px 25px;
  border-radius: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #2c5530, #4a7c59, #27ae60);
  }
  
  @media (max-width: 768px) {
    padding: 18px 14px;
    border-radius: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 16px 12px;
  }
`;

const CTAContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-top: 30px;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled(Link)`
  background: #2c5530;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1e3a22;
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  color: #2c5530;
  padding: 15px 30px;
  border: 2px solid #2c5530;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  
  &:hover {
    background: #2c5530;
    color: white;
  }
`;

/* Minimal placeholders for sections and cards used below */
const ProductsSection = styled.section`
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  
  @media (max-width: 768px) {
    padding-top: 8px;
  }
  
  @media (max-width: 480px) {
    padding-top: 6px;
  }
  
  @media (max-width: 375px) {
    padding-top: 4px;
  }
`;

const ProductsHeader = styled.div`
  text-align: center;
  margin-bottom: 6px;
  order: 1;
  
  h2 {
    margin-bottom: 6px;
  }
  
  @media (max-width: 768px) {
    order: 1;
  }
`;

const ProductsSubtitle = styled.p`
  color: #666;
  max-width: 720px;
  margin: 6px auto 0;
`;

 

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    gap: 6px;
    padding-bottom: 0;
    justify-content: space-between;
    align-items: center;
  }
`;

 

 

const StatsSection = styled.section`
  padding: 28px 0;
  
  /* Override StatsGrid layout inside this section for mobile */
  @media (max-width: 768px) {
    ${StatsGrid} {
      display: grid !important;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
  }
  
  @media (max-width: 480px) {
    ${StatsGrid} {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }
  }
`;

const StatCard = styled.div`
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 10px;
  
  @media (max-width: 768px) {
    padding: 12px;
  }
  
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const StatNumber = styled.div`
  font-size: 28px;
  font-weight: 800;
  color: #2c5530;
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const StatLabel = styled.div`
  color: #55625a;
  
  @media (max-width: 768px) {
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
  }
`;

const FeatureIcon = styled.div`
  margin-bottom: 10px;
  
  @media (max-width: 768px) {
    margin-bottom: 8px;
    svg { width: 22px; height: 22px; }
  }
  
  @media (max-width: 480px) {
    svg { width: 20px; height: 20px; }
  }
`;

const FeatureTitle = styled.h4`
  margin: 0 0 8px;
  color: #1e3a22;
  
  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 6px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const FeatureDescription = styled.p`
  color: #55625a;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    font-size: 12.5px;
  }
`;

const TestimonialsSection = styled.section`
  padding: 28px 0;
`;

const TestimonialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const TestimonialCard = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 16px;
  
  @media (max-width: 768px) {
    padding: 14px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const TestimonialText = styled.p`
  color: #33453a;
  
  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.45;
  }
  
  @media (max-width: 480px) {
    font-size: 13.5px;
    line-height: 1.45;
  }
`;

const TestimonialAuthor = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
`;

const AuthorAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #2c5530;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 12px;
  }
  
  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;

const AuthorInfo = styled.div`
  color: #55625a;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
  
  @media (max-width: 480px) {
    font-size: 12.5px;
  }
`;

const NewsletterSection = styled.section`
  background: #2c5530;
  color: #fff;
  padding: 28px 20px;
  border-radius: 12px;
  margin: 24px 0;
`;

const NewsletterContent = styled.div`
  text-align: center;
`;

const NewsletterForm = styled.form`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const NewsletterInput = styled.input`
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  min-width: 260px;
`;

const NewsletterButton = styled.button`
  background: #fff;
  color: #2c5530;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
`;

const CTASection = styled.section`
  padding: 36px 0;
`;

const Home = () => {
  const [email, setEmail] = useState('');
  
  const { addToCart } = useCart();

  // Données de démonstration pour les produits phares
 

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      console.log('Newsletter subscription:', email);
      alert('Merci pour votre inscription à notre newsletter !');
      setEmail('');
    }
  };

  const handleAddToCart = (product) => {
    if (!product) return;
    addToCart(product, 1);
    toast.success('Produit ajouté au panier');
  };

 

  

  return (
    <HomeContainer>
      {/* Section Hero */}
      <HeroSection>
        <HeroDecoration>
          {/* Particules scintillantes */}
          <FloatingParticle size="6px" top="20%" left="10%" duration="10s" delay="0s" moveX="40px" moveY="-80px" />
          <FloatingParticle size="4px" top="30%" left="20%" duration="8s" delay="1s" moveX="-30px" moveY="-60px" />
          <FloatingParticle size="5px" top="40%" left="80%" duration="12s" delay="0.5s" moveX="50px" moveY="-70px" />
          <FloatingParticle size="3px" top="50%" left="90%" duration="9s" delay="2s" moveX="-40px" moveY="-50px" />
          <FloatingParticle size="4px" top="60%" left="15%" duration="11s" delay="1.5s" moveX="35px" moveY="-65px" />
          <FloatingParticle size="6px" top="70%" left="70%" duration="10s" delay="0.8s" moveX="-45px" moveY="-75px" />
          <FloatingParticle size="5px" top="25%" left="50%" duration="13s" delay="2.5s" moveX="25px" moveY="-85px" />
          <FloatingParticle size="4px" top="35%" left="60%" duration="9s" delay="1.2s" moveX="-35px" moveY="-55px" />
          <FloatingParticle size="5px" top="45%" left="30%" duration="11s" delay="0.3s" moveX="45px" moveY="-70px" />
          <FloatingParticle size="3px" top="55%" left="40%" duration="10s" delay="1.8s" moveX="-25px" moveY="-60px" />
          
          {/* Arbres de forêt en rotation */}
          <FloatingIcon icon="🌳" size="35px" top="10%" left="15%" duration="25s" delay="0s" moveX="60px" moveY="80px" rotate="180deg" rotateEnd="360deg" />
          <FloatingIcon icon="🌳" size="32px" top="20%" left="75%" duration="28s" delay="3s" moveX="-70px" moveY="90px" rotate="200deg" rotateEnd="360deg" />
          <FloatingIcon icon="🌳" size="38px" top="50%" left="5%" duration="30s" delay="5s" moveX="80px" moveY="-60px" rotate="170deg" rotateEnd="360deg" />
          <FloatingIcon icon="🌳" size="33px" top="70%" left="85%" duration="26s" delay="8s" moveX="-65px" moveY="-75px" rotate="190deg" rotateEnd="360deg" />
          
          {/* Camions de livraison */}
          <FloatingIcon icon="🚚" size="36px" top="15%" left="50%" duration="32s" delay="2s" moveX="70px" moveY="70px" rotate="160deg" rotateEnd="360deg" />
          <FloatingIcon icon="🚚" size="34px" top="45%" left="80%" duration="29s" delay="6s" moveX="-75px" moveY="85px" rotate="185deg" rotateEnd="360deg" />
          <FloatingIcon icon="🚚" size="37px" top="65%" left="25%" duration="31s" delay="10s" moveX="65px" moveY="-70px" rotate="175deg" rotateEnd="360deg" />
          
          {/* Bûches de bois */}
          <FloatingIcon icon="🪵" size="30px" top="8%" left="65%" duration="27s" delay="1s" moveX="-60px" moveY="75px" rotate="195deg" rotateEnd="360deg" />
          <FloatingIcon icon="🪵" size="32px" top="35%" left="35%" duration="24s" delay="4s" moveX="55px" moveY="-80px" rotate="165deg" rotateEnd="360deg" />
          <FloatingIcon icon="🪵" size="31px" top="55%" left="60%" duration="26s" delay="7s" moveX="-70px" moveY="65px" rotate="180deg" rotateEnd="360deg" />
          <FloatingIcon icon="🪵" size="33px" top="75%" left="45%" duration="28s" delay="9s" moveX="60px" moveY="-85px" rotate="170deg" rotateEnd="360deg" />
        </HeroDecoration>
        
        <HeroTitle>Bois de Chauffage de Qualité</HeroTitle>
        <HeroSubtitle>
          Découvrez notre large gamme de bois de chauffage pour tous vos besoins. 
          Livraison rapide et service client exceptionnel.
        </HeroSubtitle>
        <HeroButton to="/products">
          <span>Découvrir nos produits</span>
        </HeroButton>
        
        <HeroWave />
      </HeroSection>

      {/* Catégories uniquement */}
      <ProductsSection>
        <ProductsHeader>
          <SectionTitle>Catégories</SectionTitle>
          <ProductsSubtitle>
            Choisissez une catégorie pour afficher les produits correspondants
          </ProductsSubtitle>
        </ProductsHeader>
        <CategoriesNav>
          <CategoryCard to="/products?main=bois" style={{ '--bg-img': "url('https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop')" }}>
            <span>Bois de chauffage</span>
          </CategoryCard>
          <CategoryCard to="/products?main=accessoires" style={{ '--bg-img': "url('https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop')" }}>
            <span>Accessoires</span>
          </CategoryCard>
          <CategoryCard to="/products?main=buches-densifiees" style={{ '--bg-img': "url('https://images.unsplash.com/photo-1527061011665-3652c757a4d7?q=80&w=1600&auto=format&fit=crop')" }}>
            <span>Bûches densifiées</span>
          </CategoryCard>
          <CategoryCard to="/products?main=pellets" style={{ '--bg-img': "url('https://images.unsplash.com/photo-1615485737594-3b42cfaa6a8a?q=80&w=1600&auto=format&fit=crop')" }}>
            <span>Pellets de bois</span>
          </CategoryCard>
          <CategoryCard to="/products?main=poeles" style={{ '--bg-img': "url('https://images.unsplash.com/photo-1556911261-6bd341186b66?q=80&w=1600&auto=format&fit=crop')" }}>
            <span>Poêles</span>
          </CategoryCard>
        </CategoriesNav>
      </ProductsSection>

      

      {/* Statistiques */}
      <StatsSection>
        <SectionTitle>Nos chiffres parlent d'eux-mêmes</SectionTitle>
        <StatsGrid>
          <StatCard delay="0.1s">
            <StatNumber>5000+</StatNumber>
            <StatLabel>Clients satisfaits</StatLabel>
          </StatCard>
          <StatCard delay="0.2s">
            <StatNumber>10+</StatNumber>
            <StatLabel>Années d'expérience</StatLabel>
          </StatCard>
          <StatCard delay="0.3s">
            <StatNumber>50+</StatNumber>
            <StatLabel>Produits disponibles</StatLabel>
          </StatCard>
          <StatCard delay="0.4s">
            <StatNumber>24/7</StatNumber>
            <StatLabel>Support client</StatLabel>
          </StatCard>
        </StatsGrid>
      </StatsSection>

      {/* Pourquoi nous choisir */}
      <FeaturesSection>
        <SectionTitle>Pourquoi nous choisir ?</SectionTitle>
        <FeaturesGrid>
          <FeatureCard>
            <FeatureIcon>
              <FiTruck size={32} />
            </FeatureIcon>
            <FeatureTitle>Livraison rapide</FeatureTitle>
            <FeatureDescription>
              Livraison à domicile dans toute la France en 24-48h. 
              Service express disponible.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FiShield size={32} />
            </FeatureIcon>
            <FeatureTitle>Qualité garantie</FeatureTitle>
            <FeatureDescription>
              Tous nos produits sont certifiés et de qualité premium. 
              Garantie satisfaction.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FiStar size={32} />
            </FeatureIcon>
            <FeatureTitle>Service client</FeatureTitle>
            <FeatureDescription>
              Support client disponible 7j/7 pour vous accompagner 
              dans vos choix.
            </FeatureDescription>
          </FeatureCard>
          
          <FeatureCard>
            <FeatureIcon>
              <FiHeart size={32} />
            </FeatureIcon>
            <FeatureTitle>Écologique</FeatureTitle>
            <FeatureDescription>
              Bois issu de forêts gérées durablement. 
              Respect de l'environnement.
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      {/* Témoignages */}
      <TestimonialsSection>
        <SectionTitle>Ce que disent nos clients</SectionTitle>
        <TestimonialsGrid>
          <TestimonialCard>
            <TestimonialText>
              Excellent service ! Le bois de chêne est de très bonne qualité 
              et la livraison a été rapide. Je recommande vivement.
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>MD</AuthorAvatar>
              <AuthorInfo>
                <h4>Marie Dubois</h4>
                <p>Cliente depuis 2 ans</p>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialText>
              Service client exceptionnel et produits de qualité. 
              Le chauffage au bois n'a jamais été aussi facile !
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>JM</AuthorAvatar>
              <AuthorInfo>
                <h4>Jean Martin</h4>
                <p>Cliente depuis 1 an</p>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>

          <TestimonialCard>
            <TestimonialText>
              Livraison ponctuelle et bois parfaitement sec. 
              Un service professionnel que je recommande.
            </TestimonialText>
            <TestimonialAuthor>
              <AuthorAvatar>SL</AuthorAvatar>
              <AuthorInfo>
                <h4>Sophie Leroy</h4>
                <p>Cliente depuis 3 ans</p>
              </AuthorInfo>
            </TestimonialAuthor>
          </TestimonialCard>
        </TestimonialsGrid>
      </TestimonialsSection>

      {/* Newsletter */}
      <NewsletterSection>
        <NewsletterContent>
          <SectionTitle style={{ color: 'white', marginBottom: '20px' }}>
            Restez informé de nos offres
          </SectionTitle>
          <p style={{ fontSize: '18px', opacity: '0.9', marginBottom: '20px' }}>
            Inscrivez-vous à notre newsletter et recevez nos meilleures offres 
            et nouveautés directement dans votre boîte mail.
          </p>
          <NewsletterForm onSubmit={handleNewsletterSubmit}>
            <NewsletterInput
              type="email"
              placeholder="Votre adresse email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <NewsletterButton type="submit">
              <span>S'abonner</span>
            </NewsletterButton>
          </NewsletterForm>
        </NewsletterContent>
      </NewsletterSection>

      {/* Call to Action */}
      <CTASection>
        <CTAContent>
          <SectionTitle>Prêt à commencer ?</SectionTitle>
          <p style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
            Découvrez notre catalogue complet et trouvez le bois de chauffage 
            parfait pour vos besoins.
          </p>
          <CTAButtons>
            <PrimaryButton to="/products">
              Voir le catalogue
            </PrimaryButton>
            <SecondaryButton to="/contact">
              Nous contacter
            </SecondaryButton>
          </CTAButtons>
        </CTAContent>
      </CTASection>
    </HomeContainer>
  );
};

export default Home;


