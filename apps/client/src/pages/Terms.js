import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
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
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px 18px;
  margin: 14px 0 20px;
  font-size: 13.5px;
  color: #334155;
  line-height: 1.6;
`;

const Terms = () => {
  const { t, i18n } = useTranslation();
  const isDe = i18n.language && i18n.language.startsWith('de');

  return (
    <Container>
      <SEO 
        title={isDe ? 'Allgemeine Geschäftsbedingungen (AGB)' : 'Conditions Générales de Vente (CGV)'} 
        description={isDe ? 'Allgemeine Geschäftsbedingungen (AGB) für den Kauf von Kaminholz, Holzpellets und Holzbriketts im Online-Shop brennholzkaufen.' : 'Conditions Générales de Vente régissant les achats de bois de chauffage et pellets sur brennholzkaufen.'}
        path="/agb"
      />

      {isDe ? (
        <>
          <Title>Allgemeine Geschäftsbedingungen (AGB)</Title>
          <Subtitle>Gültig für alle Bestellungen über den Online-Shop brennholzkaufen</Subtitle>

          <SectionTitle>§ 1 Geltungsbereich und Vertragspartner</SectionTitle>
          <Text>
            (1) Diese Allgemeinen Geschäftsbedingungen gelten für alle Verträge über die Lieferung von Waren 
            (insbesondere Kaminholz, Holzpellets, Holzbriketts und Zubehör), die zwischen Verbrauchern oder Unternehmern 
            und dem Betreiber von brennholzkaufen geschlossen werden.
          </Text>
          <Text>
            (2) Abweichende Bedingungen des Kunden werden nicht anerkannt, es sei denn, der Verkäufer stimmt ihrer 
            Geltung ausdrücklich schriftlich zu.
          </Text>

          <SectionTitle>§ 2 Angebot und Vertragsschluss</SectionTitle>
          <Text>
            (1) Die Darstellung der Produkte im Online-Shop stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung 
            zur Abgabe einer Bestellung dar.
          </Text>
          <Text>
            (2) Durch das Absenden der Bestellung über den Button „Bestellung bestätigen“ gibt der Kunde eine verbindliche 
            Bestellung der im Warenkorb enthaltenen Waren ab. Der Vertrag kommt mit Zusendung unserer Auftragsbestätigung per E-Mail zustande.
          </Text>

          <SectionTitle>§ 3 Preise und Zahlungsbedingungen</SectionTitle>
          <List>
            <li>Alle angegebenen Preise verstehen sich in Euro (€) inklusive der jeweils gültigen gesetzlichen Mehrwertsteuer.</li>
            <li>Versand- und Anlieferungskosten werden im Bestellprozess gesondert ausgewiesen.</li>
            <li>Die Zahlung erfolgt per Vorkasse / SEPA-Banküberweisung auf das in der Bestellbestätigung angegebene Geschäftskonto.</li>
            <li>Die Ware wird nach vollständigem Zahlungseingang kommissioniert und für den Speditionsversand freigegeben.</li>
          </List>

          <SectionTitle>§ 4 Lieferung und Anlieferungsbedingungen</SectionTitle>
          <Text>
            (1) Die Auslieferung erfolgt an die vom Kunden angegebene Lieferadresse.
          </Text>
          <Text>
            (2) <strong>Besonderheit Speditionsanlieferung :</strong> Die Anlieferung von Palettenware (Kaminholz, Pellets) erfolgt mit LKW 
            und geländegängigem Mitnahmestapler. Der Kunde gewährleistet, dass die Zufahrt für schwere LKW befahrbar ist. Die Entladung 
            erfolgt frei Bordsteinkante oder nach Möglichkeit und Ermessen des Fahrers bis zum gewünschten Abstellort (Carport, Hof).
          </Text>
          <Text>
            (3) Der Liefertermin wird vorab telefonisch oder per E-Mail avisisiert.
          </Text>

          <SectionTitle>§ 5 Eigentumsvorbehalt</SectionTitle>
          <Text>
            Die gelieferte Ware bleibt bis zur vollständigen Bezahlung aller Forderungen aus dem Kaufvertrag im Eigentum des Verkäufers.
          </Text>

          <SectionTitle>§ 6 Gewährleistung und Holzqualität</SectionTitle>
          <Text>
            (1) Es gelten die gesetzlichen Mängelhaftungsrechte nach BGB.
          </Text>
          <Text>
            (2) <strong>Holzqualität :</strong> Holz ist ein natürlicher Rohstoff. Geringfügige natürliche Schwankungen in Farbe, 
            Maserung, Rindeneinschlüssen oder Feuchtigkeit stellen keinen Mangel dar. Unser ofenfertiges Kaminholz wird kammergetrocknet 
            mit einer garantierten Restfeuchte von unter 20 % geliefert.
          </Text>

          <SectionTitle>§ 7 Schlussbestimmungen</SectionTitle>
          <Text>
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts (CISG), soweit dem keine zwingenden 
            Verbraucherschutzvorschriften entgegenstehen.
          </Text>
        </>
      ) : (
        <>
          <Title>Conditions Générales de Vente (CGV)</Title>
          <Subtitle>Régissant les ventes en ligne de combustibles de bois sur brennholzkaufen</Subtitle>

          <SectionTitle>1. Objet et champ d'application</SectionTitle>
          <Text>
            Les présentes Conditions Générales de Vente s'appliquent à toutes les commandes passées sur le site 
            pour l'achat de bois de chauffage, granulés de bois (pellets), bûches compressées et accessoires associés.
          </Text>

          <SectionTitle>2. Commandes et conclusion du contrat</SectionTitle>
          <Text>
            La validation définitive du panier et la confirmation de la commande emportent acceptation pleine et 
            entière des présentes CGV. Un courrier électronique récapitulatif est adressé au client dès validation.
          </Text>

          <SectionTitle>3. Tarifs et modalités de règlement</SectionTitle>
          <List>
            <li>Les tarifs sont indiqués en Euros TTC. Les frais de livraison sont calculés selon le panier.</li>
            <li>Le règlement s'effectue par virement bancaire sécurisé (SEPA).</li>
            <li>L’expédition de la commande intervient dès réception et validation du virement bancaire.</li>
          </List>

          <SectionTitle>4. Modalités de livraison</SectionTitle>
          <Text>
            La livraison des palettes est effectuée par transporteur spécialisé avec camion porteur équipé d’un 
            chariot élévateur tout-terrain. Le déchargement est réalisé sous abri ou à l'emplacement convenu avec le client, 
            sous réserve de la praticabilité des accès.
          </Text>

          <SectionTitle>5. Réserve de propriété</SectionTitle>
          <Text>
            Les produits livrés demeurent la propriété du vendeur jusqu’au complet encaissement du prix convenu.
          </Text>

          <SectionTitle>6. Garanties légales et qualité du bois</SectionTitle>
          <Text>
            Nos bûches font l'objet d'un séchage contrôlé garantissant un taux d'humidité inférieur à 20 %, et nos 
            granulés sont certifiés conformes aux normes européennes DINplus / ENplus A1. Les produits bénéficient 
            de la garantie légale de conformité et des vices cachés.
          </Text>

          <SectionTitle>7. Droit applicable</SectionTitle>
          <Text>
            Les présentes conditions générales sont soumises à la législation européenne applicable en matière 
            de commerce électronique.
          </Text>
        </>
      )}
    </Container>
  );
};

export default Terms;
