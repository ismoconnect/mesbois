import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FiTruck, FiShield, FiClock, FiCheckCircle } from 'react-icons/fi';
import SEO from '../components/SEO/SEO';

const Container = styled.div`
  max-width: 920px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  color: #1f2937;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  color: #1b3b22;
  margin-bottom: 18px;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 28px;
`;

const HighlightsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const HighlightCard = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  svg {
    color: #16a34a;
    width: 24px;
    height: 24px;
  }

  h3 {
    font-size: 14.5px;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  p {
    font-size: 12.5px;
    color: #64748b;
    margin: 0;
    line-height: 1.5;
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  margin-top: 28px;
  margin-bottom: 10px;
  color: #0f172a;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 6px;
`;

const Text = styled.p`
  color: #475569;
  line-height: 1.7;
  font-size: 14px;
  margin-bottom: 12px;
`;

const List = styled.ul`
  margin: 0 0 14px 20px;
  color: #475569;
  line-height: 1.7;
  font-size: 14px;
`;

const InfoBox = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: 16px 18px;
  margin: 14px 0 20px;
  font-size: 13.5px;
  color: #166534;
  line-height: 1.6;
`;

const Delivery = () => {
  const { t, i18n } = useTranslation();
  const isDe = i18n.language && i18n.language.startsWith('de');

  return (
    <Container>
      <SEO 
        title={isDe ? 'Lieferung & Versandinformationen' : 'Politique de Livraison'} 
        description={isDe ? 'Informationen zur deutschlandweiten Anlieferung von Kaminholz und Pellets mit LKW und Mitnahmestapler direkt an Ihren Lagerplatz.' : 'Modalités de livraison de bois de chauffage et pellets avec chariot embarqué tout-terrain.'}
        path="/lieferung"
      />

      {isDe ? (
        <>
          <Title>Lieferung & Versandbedingungen</Title>
          <Subtitle>Zuverlässige Anlieferung von Kaminholz & Pellets direkt an Ihren Wunschort</Subtitle>

          <HighlightsGrid>
            <HighlightCard>
              <FiTruck />
              <h3>Mitnahmestapler-Entladung</h3>
              <p>Unsere LKWs verfügen über geländegängige Gabelstapler, um Paletten direkt unter Ihr Carport oder in Ihre Garage zu fahren.</p>
            </HighlightCard>

            <HighlightCard>
              <FiClock />
              <h3>Telefonische Avisierung</h3>
              <p>Der Spediteur kontaktiert Sie 24 bis 48 Stunden vor Anlieferung, um den Liefertermin verbindlich abzustimmen.</p>
            </HighlightCard>

            <HighlightCard>
              <FiShield />
              <h3>Transportsichere Paletten</h3>
              <p>Alle Holzpaletten und Pelletsäcke sind stabil geschrumpft und wetterfest geschützt.</p>
            </HighlightCard>
          </HighlightsGrid>

          <SectionTitle>1. Liefergebiet</SectionTitle>
          <Text>
            Wir liefern deutschlandweit (Festland) sowie in angrenzende Regionen. Die Anlieferung auf Inseln erfolgt nach 
            gesonderter Absprache.
          </Text>

          <SectionTitle>2. Lieferfristen & Ablauf</SectionTitle>
          <List>
            <li><strong>Auftragsbearbeitung & Bereitstellung :</strong> 24–48 Stunden nach Zahlungseingang.</li>
            <li><strong>Regellaufzeit der Spedition :</strong> 2 bis 5 Werktage ab Übergabe an das Transportunternehmen.</li>
            <li><strong>Terminvereinbarung :</strong> Vor der Zustellung erfolgt eine telefonische Avisierung durch den Fahrer oder die Speditionsdisposition.</li>
          </List>

          <SectionTitle>3. Voraussetzungen für die Anfahrt</SectionTitle>
          <InfoBox>
            <strong>Wichtiger Hinweis zur Zufahrt :</strong><br />
            Die Anlieferung erfolgt mit 40t-Gliederzügen oder schweren LKW. Die Zuwegung muss für solche Fahrzeuge befahrbar sein 
            (Mindestbreite ca. 3,50 m, lichte Durchfahrtshöhe 4 m). Sollte Ihre Straße eng sein, entlädt der Fahrer am Beginn 
            der Straße und fährt die Paletten mit dem kompakten Mitnahmestapler über befestigten Untergrund bis zu Ihrer Hofeinfahrt.
          </InfoBox>

          <SectionTitle>4. Versandkosten</SectionTitle>
          <Text>
            Die Versandkosten werden transparent im Warenkorb und im Kassenbereich vor Abschluss der Bestellung aufgeführt. 
            Bei Erreichen der Aktionsgrenzen profitieren Sie von einer kostenfreien Anlieferung.
          </Text>
        </>
      ) : (
        <>
          <Title>Politique de Livraison</Title>
          <Subtitle>Modalités d'acheminement et de déchargement de votre bois de chauffage et granulés</Subtitle>

          <HighlightsGrid>
            <HighlightCard>
              <FiTruck />
              <h3>Chariot Embarqué Tout-Terrain</h3>
              <p>Livraison soignée jusqu'à votre zone de stockage (abri, garage, cour) grâce à notre chariot élévateur mobile.</p>
            </HighlightCard>

            <HighlightCard>
              <FiClock />
              <h3>Prise de Rendez-vous</h3>
              <p>Le transporteur vous contacte systématiquement par téléphone pour convenir d'un créneau de passage.</p>
            </HighlightCard>

            <HighlightCard>
              <FiShield />
              <h3>Palettes Filmées & Sécurisées</h3>
              <p>Toutes nos palettes de bûches et sacs de pellets sont houssées pour garantir une protection totale contre l'humidité.</p>
            </HighlightCard>
          </HighlightsGrid>

          <SectionTitle>1. Zone de livraison</SectionTitle>
          <Text>
            Nous assurons la livraison sur toute la France métropolitaine, y compris en zone rurale et montagneuse 
            accessible aux véhicules de livraison.
          </Text>

          <SectionTitle>2. Délais indicatifs</SectionTitle>
          <List>
            <li><strong>Préparation de commande :</strong> 24 à 48h ouvrées après confirmation du règlement.</li>
            <li><strong>Délai d’acheminement :</strong> 2 à 5 jours ouvrés selon votre département.</li>
            <li><strong>Avis de passage :</strong> contact téléphonique préalable par le chauffeur.</li>
          </List>

          <SectionTitle>3. Conditions d'accès</SectionTitle>
          <InfoBox>
            <strong>Accessibilité :</strong><br />
            Le camion porteur stationne sur la voie carrossable. Le chauffeur utilise ensuite son chariot élévateur 
            tout-terrain pour déposer vos palettes sous abri, dans votre allée ou votre cour, sans effort de votre part.
          </InfoBox>

          <SectionTitle>4. Frais de port</SectionTitle>
          <Text>
            Les frais de transport sont automatiquement calculés et présentés en toute transparence lors de la validation 
            de votre panier.
          </Text>
        </>
      )}
    </Container>
  );
};

export default Delivery;
