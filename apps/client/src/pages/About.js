import React from 'react';
import styled from 'styled-components';
import { FiTruck, FiShield, FiUsers, FiAward, FiHeart, FiCheckCircle } from 'react-icons/fi';
import { FaTree, FaLeaf, FaHandshake } from 'react-icons/fa';

const AboutContainer = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  padding: 20px 16px 40px;

  @media (max-width: 768px) {
    padding: 10px 12px 32px;
  }
`;

const HeroSection = styled.section`
  background: linear-gradient(135deg, #1b3b22 0%, #2c5530 100%);
  color: white;
  padding: 36px 20px;
  text-align: center;
  border-radius: 14px;
  margin-bottom: 24px;
  box-shadow: 0 4px 16px rgba(27, 59, 34, 0.12);

  @media (max-width: 768px) {
    padding: 20px 14px;
    border-radius: 10px;
    margin-bottom: 16px;
  }
`;

const HeroBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #a7f3d0;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 8px;

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 2px 8px;
    margin-bottom: 6px;
  }
`;

const HeroTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 8px;
  letter-spacing: -0.3px;

  @media (max-width: 768px) {
    font-size: 19px;
    margin: 0 0 6px;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 14px;
  opacity: 0.9;
  max-width: 580px;
  margin: 0 auto;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 12px;
    line-height: 1.45;
  }
`;

const ContentSection = styled.section`
  margin-bottom: 24px;

  @media (max-width: 768px) {
    margin-bottom: 18px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 14px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 10px;
  }
`;

const StoryCard = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 20px 22px;

  @media (max-width: 768px) {
    padding: 14px 12px;
    border-radius: 10px;
  }
`;

const StoryItem = styled.div`
  &:not(:last-child) {
    padding-bottom: 16px;
    margin-bottom: 16px;
    border-bottom: 1px solid #f1f5f9;

    @media (max-width: 768px) {
      padding-bottom: 12px;
      margin-bottom: 12px;
    }
  }

  h3 {
    font-size: 15px;
    font-weight: 700;
    color: #1b3b22;
    margin: 0 0 6px 0;
    display: flex;
    align-items: center;
    gap: 8px;

    svg {
      color: #16a34a;
      flex-shrink: 0;
      font-size: 15px;
    }

    @media (max-width: 768px) {
      font-size: 13.5px;
      gap: 6px;
      margin-bottom: 4px;

      svg {
        font-size: 14px;
      }
    }
  }

  p {
    font-size: 13px;
    line-height: 1.6;
    color: #475569;
    margin: 0;

    @media (max-width: 768px) {
      font-size: 12px;
      line-height: 1.5;
    }
  }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
`;

const ValueCard = styled.div`
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  padding: 14px 12px;
  text-align: center;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: #cbd5e1;
  }

  @media (max-width: 768px) {
    padding: 10px 8px;
  }
`;

const ValueIcon = styled.div`
  width: 36px;
  height: 36px;
  background: #ecfdf5;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  color: #047857;

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    margin-bottom: 6px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const ValueTitle = styled.h3`
  font-size: 12.5px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 3px 0;

  @media (max-width: 768px) {
    font-size: 11.5px;
    margin-bottom: 2px;
  }
`;

const ValueDescription = styled.p`
  color: #64748b;
  line-height: 1.4;
  font-size: 11.5px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 10.5px;
    line-height: 1.35;
  }
`;

const TeamSection = styled.section`
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 24px 20px;
  text-align: center;

  @media (max-width: 768px) {
    padding: 16px 12px;
    border-radius: 10px;
  }
`;

const TeamTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 4px 0;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

const TeamDescription = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0 auto 16px;
  max-width: 500px;
  line-height: 1.45;

  @media (max-width: 768px) {
    font-size: 11.5px;
    margin-bottom: 12px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
`;

const StatCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 12px 10px;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);

  @media (max-width: 768px) {
    padding: 8px 6px;
  }
`;

const StatNumber = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #16a34a;
  margin-bottom: 2px;

  @media (max-width: 768px) {
    font-size: 17px;
  }
`;

const StatLabel = styled.div`
  color: #475569;
  font-size: 11.5px;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 10.5px;
  }
`;

const About = () => {
  return (
    <AboutContainer>
      <HeroSection>
        <HeroBadge>
          <FaTree size={11} /> Spécialiste européen du bois
        </HeroBadge>
        <HeroTitle>À propos de nous</HeroTitle>
        <HeroSubtitle>
          Votre partenaire de confiance pour le bois de chauffage haute performance et les granulés certifiés.
        </HeroSubtitle>
      </HeroSection>

      <ContentSection>
        <StoryCard>
          <StoryItem>
            <h3>
              <FaTree /> Notre histoire
            </h3>
            <p>
              Depuis notre création, nous nous sommes engagés à fournir du bois de chauffage 
              de la plus haute qualité. Notre passion pour la forêt et le respect de 
              l'environnement nous poussent à sélectionner exclusivement des essences dures 
              (chêne, hêtre, frêne) issues de forêts gérées durablement.
            </p>
          </StoryItem>
          
          <StoryItem>
            <h3>
              <FaLeaf /> Notre mission
            </h3>
            <p>
              Rendre le chauffage au bois performant, économique et respectueux de notre planète. 
              Chaque produit proposé respecte des normes strictes de séchage (taux d'humidité inférieur à 20%) 
              pour garantir un rendement calorifique maximal et une combustion propre.
            </p>
          </StoryItem>
          
          <StoryItem>
            <h3>
              <FaHandshake /> Notre engagement client
            </h3>
            <p>
              Votre satisfaction totale est notre priorité absolue. Nous assurons un conseil expert, 
              des tarifs transparents sans intermédiaires et une livraison directe sous votre abri 
              grâce à nos camions équipés de chariots tout-terrain.
            </p>
          </StoryItem>
        </StoryCard>
      </ContentSection>

      <ContentSection>
        <SectionTitle>Nos valeurs fondamentales</SectionTitle>
        <ValuesGrid>
          <ValueCard>
            <ValueIcon>
              <FiHeart size={18} />
            </ValueIcon>
            <ValueTitle>Environnement</ValueTitle>
            <ValueDescription>
              Bois 100% éco-responsable certifié PEFC / FSC issu de forêts durables.
            </ValueDescription>
          </ValueCard>
          
          <ValueCard>
            <ValueIcon>
              <FiShield size={18} />
            </ValueIcon>
            <ValueTitle>Qualité certifiée</ValueTitle>
            <ValueDescription>
              Contrôles rigoureux de l'humidité (&lt; 20%) et normes DINplus / ENplus.
            </ValueDescription>
          </ValueCard>
          
          <ValueCard>
            <ValueIcon>
              <FiTruck size={18} />
            </ValueIcon>
            <ValueTitle>Livraison chariot</ValueTitle>
            <ValueDescription>
              Dépose exacte sous votre abri, garage ou cour par chariot tout-terrain.
            </ValueDescription>
          </ValueCard>
          
          <ValueCard>
            <ValueIcon>
              <FiUsers size={18} />
            </ValueIcon>
            <ValueTitle>Proximité</ValueTitle>
            <ValueDescription>
              Une équipe humaine et disponible pour vous conseiller 6j/7.
            </ValueDescription>
          </ValueCard>
          
          <ValueCard>
            <ValueIcon>
              <FiAward size={18} />
            </ValueIcon>
            <ValueTitle>Excellence</ValueTitle>
            <ValueDescription>
              Des rendements thermiques optimaux pour préserver vos appareils.
            </ValueDescription>
          </ValueCard>
          
          <ValueCard>
            <ValueIcon>
              <FiCheckCircle size={18} />
            </ValueIcon>
            <ValueTitle>Transparence</ValueTitle>
            <ValueDescription>
              Tarifs nets, volumes en stères réels vérifiés et traçabilité claire.
            </ValueDescription>
          </ValueCard>
        </ValuesGrid>
      </ContentSection>

      <TeamSection>
        <TeamTitle>Notre engagement en chiffres</TeamTitle>
        <TeamDescription>
          Une expertise reconnue au service des particuliers et professionnels.
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
            <StatNumber>&lt; 20%</StatNumber>
            <StatLabel>Taux d'humidité</StatLabel>
          </StatCard>
          
          <StatCard>
            <StatNumber>100%</StatNumber>
            <StatLabel>Bois certifié</StatLabel>
          </StatCard>
        </StatsGrid>
      </TeamSection>
    </AboutContainer>
  );
};

export default About;
