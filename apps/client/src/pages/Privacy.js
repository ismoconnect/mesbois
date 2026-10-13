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

const Privacy = () => {
  const { t, i18n } = useTranslation();
  const isDe = i18n.language && i18n.language.startsWith('de');

  return (
    <Container>
      <SEO 
        title={isDe ? 'Datenschutzerklärung | DSGVO' : 'Politique de Confidentialité | RGPD'} 
        description={isDe ? 'Informationen zur Verarbeitung personenbezogener Daten auf der brennholzkaufen Plattform gemäß Datenschutz-Grundverordnung (DSGVO).' : 'Informations sur le traitement et la protection de vos données personnelles conformément au RGPD.'}
        path="/datenschutz"
      />

      {isDe ? (
        <>
          <Title>Datenschutzerklärung</Title>
          <Subtitle>Informationen zur Verarbeitung Ihrer personenbezogenen Daten gemäß der EU-Datenschutz-Grundverordnung (DSGVO / GDPR)</Subtitle>

          <SectionTitle>1. Datenschutz auf einen Blick</SectionTitle>
          <Text>
            Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges Anliegen. Wir behandeln Ihre personenbezogenen 
            Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
          </Text>
          <InfoBox>
            <strong>Verantwortliche Stelle für die Datenverarbeitung :</strong><br />
            brennholzkaufen Kundenservice & Datenschutz<br />
            E-Mail : <a href="mailto:kontakt@brennholzkaufen.online" style={{ color: '#16a34a' }}>kontakt@brennholzkaufen.online</a>
          </InfoBox>

          <SectionTitle>2. Erhebung und Speicherung personenbezogener Daten</SectionTitle>
          <Text>
            Wenn Sie unsere Webseite besuchen oder bei uns Kaminholz, Pellets oder Briketts bestellen, erheben wir folgende Daten :
          </Text>
          <List>
            <li><strong>Kontaktdaten :</strong> Vor- und Nachname, Liefer- und Rechnungsanschrift, E-Mail-Adresse, Telefonnummer.</li>
            <li><strong>Bestelldaten :</strong> Ausgewählte Holz- und Brennstoffprodukte, Bestellmengen, Zahlungsart, Rechnungsbetrag.</li>
            <li><strong>Lieferangaben :</strong> Zufahrtsbesonderheiten, Platzierungsanweisungen für den Mitnahmestapler.</li>
            <li><strong>Technische Zugriffsdaten :</strong> IP-Adresse, Browsertyp, Betriebssystem, Referrer URL, Zugriffszeitpunkte.</li>
          </List>

          <SectionTitle>3. Zwecke und Rechtsgrundlagen der Verarbeitung</SectionTitle>
          <Text>
            Die Verarbeitung Ihrer personenbezogenen Daten erfolgt auf folgenden Rechtsgrundlagen :
          </Text>
          <List>
            <li><strong>Vertragserfüllung (Art. 6 Abs. 1 lit. b DSGVO) :</strong> Zur Bearbeitung, Kommissionierung, Transportkoordination und Auslieferung Ihrer Brennholzbestellung sowie Abwicklung der Zahlung.</li>
            <li><strong>Gesetzliche Verpflichtungen (Art. 6 Abs. 1 lit. c DSGVO) :</strong> Zur Einhaltung handels- und steuerrechtlicher Aufbewahrungsfristen.</li>
            <li><strong>Berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO) :</strong> Zur Sicherstellung der Systemsicherheit, Verhinderung von Betrug und stetigen Optimierung unseres Online-Shops.</li>
            <li><strong>Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) :</strong> Für freiwillige Angaben (z.B. Newsletter, bestimmte Tracking-Cookies).</li>
          </List>

          <SectionTitle>4. Weitergabe von Daten an Dritte (Spedition & Zahlungsdienstleister)</SectionTitle>
          <Text>
            Eine Übermittlung Ihrer Daten an Dritte findet nur im erforderlichen Rahmen statt :
          </Text>
          <List>
            <li><strong>Spedition und Transportunternehmen :</strong> Ihre Lieferanschrift und Telefonnummer werden an den ausführenden Logistikpartner übermittelt, um die telefonische Avisierung und termingerechte Entladung per Mitnahmestapler zu gewährleisten.</li>
            <li><strong>Banken und Zahlungsdienstleister :</strong> Zur Abwicklung der Banküberweisung / SEPA werden die notwendigen Transaktionsdaten verarbeitet.</li>
          </List>

          <SectionTitle>5. Speicherdauer</SectionTitle>
          <Text>
            Ihre personenbezogenen Daten werden gelöscht, sobald sie für die Erreichung des Zweckes ihrer Erhebung nicht mehr 
            erforderlich sind und keine gesetzlichen Aufbewahrungspflichten (z.B. 10 Jahre nach Handels- und Steuerrecht) entgegenstehen.
          </Text>

          <SectionTitle>6. Ihre Rechte als betroffene Person</SectionTitle>
          <Text>
            Sie haben nach der DSGVO jederzeit folgende Rechte :
          </Text>
          <List>
            <li><strong>Auskunftsrecht (Art. 15 DSGVO) :</strong> Auskunft über die bei uns gespeicherten personenbezogenen Daten.</li>
            <li><strong>Berichtigungsrecht (Art. 16 DSGVO) :</strong> Berichtigung unrichtiger Daten.</li>
            <li><strong>Löschungsrecht (Art. 17 DSGVO) :</strong> Löschung Ihrer Daten, sofern keine gesetzlichen Pflichten entgegenstehen.</li>
            <li><strong>Recht auf Datenübertragbarkeit (Art. 20 DSGVO) :</strong> Erhalt Ihrer Daten in einem strukturierten, gängigen Format.</li>
            <li><strong>Widerspruchsrecht (Art. 21 DSGVO) :</strong> Widerspruch gegen die Verarbeitung Ihrer Daten.</li>
          </List>
          <Text>
            Wenden Sie sich zur Ausübung Ihrer Rechte jederzeit per E-Mail an :{' '}
            <a href="mailto:kontakt@brennholzkaufen.online" style={{ color: '#16a34a' }}>kontakt@brennholzkaufen.online</a>.
          </Text>

          <SectionTitle>7. SSL-/TLS-Verschlüsselung</SectionTitle>
          <Text>
            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine 256-Bit SSL-/TLS-Verschlüsselung. 
            Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://“ auf „https://“ wechselt.
          </Text>
        </>
      ) : (
        <>
          <Title>Politique de Confidentialité</Title>
          <Subtitle>Protection des données personnelles conformément au Règlement Général sur la Protection des Données (RGPD)</Subtitle>

          <SectionTitle>1. Introduction et responsable du traitement</SectionTitle>
          <Text>
            La protection de vos données personnelles est au cœur de nos priorités. Cette politique détaille les données 
            que nous collectons, la façon dont nous les utilisons et les mesures mises en place pour assurer leur sécurité.
          </Text>
          <InfoBox>
            <strong>Responsable du traitement :</strong><br />
            brennholzkaufen – Service Protection des Données<br />
            Courriel : <a href="mailto:kontakt@brennholzkaufen.online" style={{ color: '#16a34a' }}>kontakt@brennholzkaufen.online</a>
          </InfoBox>

          <SectionTitle>2. Données personnelles collectées</SectionTitle>
          <Text>
            Dans le cadre de votre commande de bois de chauffage ou de granulés, nous collectons les informations suivantes :
          </Text>
          <List>
            <li><strong>Informations d'identité :</strong> nom, prénom, adresse e-mail, numéro de téléphone portable ou fixe.</li>
            <li><strong>Informations d'expédition :</strong> adresse postale complète, code postal, ville, instructions spécifiques d'accès pour le camion.</li>
            <li><strong>Détails des commandes :</strong> articles commandés, quantités (stères, palettes de sacs), mode de règlement, historique.</li>
            <li><strong>Données techniques de navigation :</strong> adresse IP, date et heure des connexions, navigateur utilisé.</li>
          </List>

          <SectionTitle>3. Finalités et bases légales</SectionTitle>
          <Text>
            Vos données sont traitées sur les bases légales suivantes :
          </Text>
          <List>
            <li><strong>Exécution du contrat (art. 6.1.b RGPD) :</strong> enregistrement et expédition de votre commande, planification de la livraison par camion hayon et chariot embarqué, émission de la facture.</li>
            <li><strong>Obligations légales et comptables (art. 6.1.c RGPD) :</strong> conservation des factures et pièces comptables.</li>
            <li><strong>Intérêt légitime (art. 6.1.f RGPD) :</strong> prévention de la fraude et sécurisation technique de notre boutique en ligne.</li>
          </List>

          <SectionTitle>4. Destinataires des données</SectionTitle>
          <Text>
            Vos données ne font l’objet d’aucune vente ni cession commerciale. Elles sont communiquées exclusivement à :
          </Text>
          <List>
            <li><strong>Nos transporteurs partenaires :</strong> pour l'acheminement, la prise de rendez-vous téléphonique et le déchargement de vos palettes.</li>
            <li><strong>Nos prestataires bancaires :</strong> pour la vérification des règlements par virement SEPA.</li>
          </List>

          <SectionTitle>5. Durée de conservation des données</SectionTitle>
          <Text>
            Les données relatives à votre compte client sont conservées pendant toute la durée de la relation commerciale. 
            Les données de facturation sont conservées pendant la durée légale requise (10 ans selon le Code de commerce).
          </Text>

          <SectionTitle>6. Vos droits</SectionTitle>
          <Text>
            Conformément à la réglementation européenne, vous disposez d’un droit d’accès, de rectification, d’effacement, 
            de limitation et de portabilité de vos données. Vous pouvez exercer ces droits en écrivant à :{' '}
            <a href="mailto:kontakt@brennholzkaufen.online" style={{ color: '#16a34a' }}>kontakt@brennholzkaufen.online</a>.
          </Text>

          <SectionTitle>7. Sécurité et chiffrement</SectionTitle>
          <Text>
            Toutes les pages du site bénéficient d’un certificat SSL avec chiffrement fort 256 bits, garantissant 
            l’intégrité et la confidentialité des échanges entre votre terminal et nos serveurs.
          </Text>
        </>
      )}
    </Container>
  );
};

export default Privacy;
