import React from 'react';
import styled from 'styled-components';
import { FiTruck, FiShield, FiUsers, FiAward, FiHeart } from 'react-icons/fi';

const AboutContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #2c5530 0%, #4a7c59 100%);
  color: white;
  padding: 80px 0;
  text-align: center;
  border-radius: 12px;
  margin-bottom: 60px;
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  font-weight: 700;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 20px;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const ContentSection = styled.section`
  margin-bottom: 60px;
`;

const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 30px;
  text-align: center;
`;

const TextContent = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin-bottom: 40px;
  
  p {
    font-size: 16px;
    line-height: 1.8;
    color: #666;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 24px;
    font-weight: 600;
    color: #2c5530;
    margin: 30px 0 15px 0;
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const ValueCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ValueIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #2c5530;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: white;
`;

const ValueTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 15px;
`;

const ValueDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const TeamSection = styled.section`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 60px 40px;
  text-align: center;
`;

const TeamTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 20px;
`;

const TeamDescription = styled.p`
  font-size: 18px;
  color: #666;
  margin-bottom: 40px;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 40px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
`;

const StatNumber = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 10px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 16px;
`;

const About = () => {
  return (
    <AboutContainer>
      <HeroSection>
        <HeroTitle>À propos de nous</HeroTitle>
        <HeroSubtitle>
          Votre partenaire de confiance pour le bois de chauffage de qualité
        </HeroSubtitle>
      </HeroSection>

      <ContentSection>
        <TextContent>
          <h3>Notre histoire</h3>
          <p>
            Depuis notre création, nous nous sommes engagés à fournir du bois de chauffage 
            de la plus haute qualité à nos clients. Notre passion pour la nature et notre 
            respect de l'environnement nous poussent à sélectionner uniquement des produits 
            issus de forêts gérées durablement.
          </p>
          
          <h3>Notre mission</h3>
          <p>
            Nous nous efforçons de rendre le chauffage au bois accessible à tous, tout en 
            préservant nos forêts pour les générations futures. Chaque produit que nous 
            proposons est soigneusement sélectionné pour sa qualité, son efficacité et 
            son impact environnemental minimal.
          </p>
          
          <h3>Notre engagement</h3>
          <p>
            La satisfaction de nos clients est au cœur de notre activité. Nous nous 
            engageons à vous fournir un service de qualité, des produits fiables et 
            une livraison rapide et sécurisée. Notre équipe est toujours disponible 
            pour vous conseiller et vous accompagner dans vos choix.
          </p>
        </TextContent>
      </ContentSection>

      <ContentSection>
        <SectionTitle>Nos valeurs</SectionTitle>
        <ValuesGrid>
          <ValueCard>
            <ValueIcon>
              <FiHeart size={32} />
            </ValueIcon>
            <ValueTitle>Respect de l'environnement</ValueTitle>
            <ValueDescription>
              Tous nos produits proviennent de forêts gérées durablement, 
              garantissant la préservation de l'écosystème forestier.
            </ValueDescription>
          </ValueCard>
          
          <ValueCard>
            <ValueIcon>
              <FiShield size={32} />
            </ValueIcon>
            <ValueTitle>Qualité garantie</ValueTitle>
            <ValueDescription>
              Nous sélectionnons rigoureusement nos fournisseurs pour vous 
              garantir des produits de la plus haute qualité.
            </ValueDescription>
          </ValueCard>
          
          <ValueCard>
            <ValueIcon>
              <FiTruck size={32} />
            </ValueIcon>
            <ValueTitle>Service client</ValueTitle>
            <ValueDescription>
              Notre équipe dédiée vous accompagne du choix du produit 
              jusqu'à la livraison à domicile.
            </ValueDescription>
          </ValueCard>
          
          <ValueCard>
            <ValueIcon>
              <FiUsers size={32} />
            </ValueIcon>
            <ValueTitle>Proximité</ValueTitle>
            <ValueDescription>
              Nous privilégions les relations humaines et l'écoute 
              de nos clients pour mieux répondre à leurs besoins.
            </ValueDescription>
          </ValueCard>
          
          <ValueCard>
            <ValueIcon>
              <FiAward size={32} />
            </ValueIcon>
            <ValueTitle>Excellence</ValueTitle>
            <ValueDescription>
              Nous nous efforçons constamment d'améliorer nos services 
              et la qualité de nos produits.
            </ValueDescription>
          </ValueCard>
          
          <ValueCard>
            <ValueIcon>
              <FiHeart size={32} />
            </ValueIcon>
            <ValueTitle>Passion</ValueTitle>
            <ValueDescription>
              Notre passion pour le bois et la nature se reflète 
              dans chaque aspect de notre activité.
            </ValueDescription>
          </ValueCard>
        </ValuesGrid>
      </ContentSection>

      <TeamSection>
        <TeamTitle>Notre équipe</TeamTitle>
        <TeamDescription>
          Une équipe passionnée et expérimentée, dédiée à vous offrir 
          le meilleur service possible.
        </TeamDescription>
        
        <StatsGrid>
          <StatCard>
            <StatNumber>10+</StatNumber>
            <StatLabel>Années d'expérience</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatNumber>5000+</StatNumber>
            <StatLabel>Clients satisfaits</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatNumber>50+</StatNumber>
            <StatLabel>Produits disponibles</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatNumber>24/7</StatNumber>
            <StatLabel>Support client</StatLabel>
          </StatCard>
        </StatsGrid>
      </TeamSection>
    </AboutContainer>
  );
};

export default About;
