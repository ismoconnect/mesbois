import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
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

const Legal = () => {
  const { t, i18n } = useTranslation();
  const { settings, loaded } = useSiteSettings();

  const isDe = i18n.language && i18n.language.startsWith('de');

  const companyName = (loaded && settings?.legalCompanyName) || 'brennholzkaufen';
  const legalAddress = (loaded && settings?.legalAddress) || '3 Rue des Anges, 67000 Strasbourg';
  const legalSiteUrl = (loaded && settings?.legalSiteUrl) || 'https://www.brennholzkaufen.online';
  const legalContactEmail = (loaded && settings?.legalContactEmail) || 'kontakt@brennholzkaufen.online';
  const legalDpoEmail = (loaded && settings?.legalDpoEmail) || legalContactEmail;
  const legalDirector = (loaded && settings?.legalDirector) || 'Direction de la publication';
  const legalCompanyForm = (loaded && settings?.legalCompanyForm) || 'Société par Actions Simplifiée (SAS)';
  const legalSiren = (loaded && settings?.legalSiren) || '921 445 120';
  const legalSiret = (loaded && settings?.legalSiret) || '921 445 120 00018';
  const legalRcs = (loaded && settings?.legalRcs) || 'Strasbourg B 921 445 120';
  const legalVatNumber = (loaded && settings?.legalVatNumber) || 'FR 45 921445120';
  const hostName = (loaded && settings?.hostName) || 'Vercel Inc. / Hostinger International';
  const hostAddress = (loaded && settings?.hostAddress) || '440 N Barranca Ave #4133, Covina, CA 91723, USA';

  return (
    <Container>
      <SEO 
        title={isDe ? 'Impressum | Gesetzliche Anbieterkennzeichnung' : 'Mentions Légales'} 
        description={isDe ? 'Gesetzliche Anbieterkennzeichnung und rechtliche Informationen der brennholzkaufen Online-Plattform gemäß § 5 TMG.' : 'Mentions légales et informations relatives à l’éditeur du site brennholzkaufen.'}
        path="/impressum"
      />

      {isDe ? (
        <>
          <Title>Impressum</Title>
          <Subtitle>Gesetzliche Anbieterkennzeichnung nach § 5 TMG / Digitale-Dienste-Gesetz (DDG) und Art. 14 Abs. 1 ODR-VO</Subtitle>

          <SectionTitle>1. Angaben gemäß § 5 TMG</SectionTitle>
          <InfoBox>
            <strong>{companyName}</strong><br />
            Rechtsform : {legalCompanyForm}<br />
            Anschrift : {legalAddress}<br />
            {legalSiren && <>Handelsregister / SIREN : {legalSiren}<br /></>}
            {legalSiret && <>Betriebsnummer / SIRET : {legalSiret}<br /></>}
            {legalRcs && <>Registergericht : {legalRcs}<br /></>}
            {legalVatNumber && <>Umsatzsteuer-Identifikationsnummer (USt-IdNr.) : {legalVatNumber}<br /></>}
          </InfoBox>

          <SectionTitle>2. Vertreten durch & Kontakt</SectionTitle>
          <Text>
            Vertreten durch die Geschäftsführung : <strong>{legalDirector}</strong><br />
            E-Mail : <a href={`mailto:${legalContactEmail}`} style={{ color: '#16a34a' }}>{legalContactEmail}</a><br />
            Webseite : <a href={legalSiteUrl} target="_blank" rel="noreferrer" style={{ color: '#16a34a' }}>{legalSiteUrl}</a><br />
            Datenschutzbeauftragter (DPO) : {legalDpoEmail}
          </Text>

          <SectionTitle>3. Hosting & Technische Bereitstellung</SectionTitle>
          <Text>
            Diese Plattform wird gehostet und technisch betrieben durch :<br />
            <strong>{hostName}</strong><br />
            {hostAddress}
          </Text>

          <SectionTitle>4. Gegenstand der Webseite</SectionTitle>
          <Text>
            Online-Verkauf und bundesweite Auslieferung von ofenfertigem Kaminholz (Eiche, Buche, Hainbuche), 
            DINplus zertifizierten Holzpellets, Hartholzbriketts und entsprechendem Heizzubehör für private Haushalte 
            und gewerbliche Abnehmer.
          </Text>

          <SectionTitle>5. Haftung für Inhalte</SectionTitle>
          <Text>
            Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen 
            Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, 
            übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf 
            eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen 
            nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          </Text>

          <SectionTitle>6. Haftung für Links</SectionTitle>
          <Text>
            Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. 
            Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten 
            Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </Text>

          <SectionTitle>7. Urheberrecht</SectionTitle>
          <Text>
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem Urheberrecht. 
            Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des 
            Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </Text>

          <SectionTitle>8. Verbraucherstreitbeilegung & EU-Streitschlichtung</SectionTitle>
          <Text>
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" style={{ color: '#16a34a' }}>
              https://ec.europa.eu/consumers/odr
            </a>{' '}
            finden. Wir sind weder verpflichtet noch bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </Text>
        </>
      ) : (
        <>
          <Title>Mentions Légales</Title>
          <Subtitle>Informations relatives à l’éditeur du site et aux obligations légales de transparence</Subtitle>

          <SectionTitle>1. Informations générales et éditeur du site</SectionTitle>
          <Text>
            Le présent site internet accessible à l’adresse {legalSiteUrl} (ci-après « le Site ») est édité et exploité par :
          </Text>
          <InfoBox>
            <strong>{companyName}</strong><br />
            Forme juridique : {legalCompanyForm}<br />
            Siège social : {legalAddress}<br />
            {legalSiren && <>Numéro SIREN : {legalSiren}<br /></>}
            {legalSiret && <>Numéro SIRET : {legalSiret}<br /></>}
            {legalRcs && <>R.C.S. : {legalRcs}<br /></>}
            {legalVatNumber && <>TVA intracommunautaire : {legalVatNumber}<br /></>}
          </InfoBox>

          <SectionTitle>2. Représentation légale & Contact</SectionTitle>
          <Text>
            Directeur de la publication : <strong>{legalDirector}</strong><br />
            Courriel de contact : <a href={`mailto:${legalContactEmail}`} style={{ color: '#16a34a' }}>{legalContactEmail}</a><br />
            Délégué à la Protection des Données (DPO) : {legalDpoEmail}
          </Text>

          <SectionTitle>3. Hébergement du site</SectionTitle>
          <Text>
            Le site est hébergé par :<br />
            <strong>{hostName}</strong><br />
            {hostAddress}
          </Text>

          <SectionTitle>4. Objet du site</SectionTitle>
          <Text>
            Le Site a pour vocation la commercialisation et la livraison à domicile de combustibles de bois 
            haute performance : stères de bois dur fendu (chêne, hêtre), granulés de bois certifiés DINplus / ENplus A1, 
            bûches densifiées haute chaleur et accessoires de chauffage au bois.
          </Text>

          <SectionTitle>5. Propriété intellectuelle</SectionTitle>
          <Text>
            L’ensemble des éléments figurant sur le Site (marques, photographies, textes, logos, chartes graphiques) sont 
            la propriété exclusive de {companyName} ou font l’objet d’une autorisation légale d’utilisation. 
            Toute reproduction, totale ou partielle, sans accord exprès et préalable est strictement interdite.
          </Text>

          <SectionTitle>6. Règlement en ligne des litiges (RLL)</SectionTitle>
          <Text>
            Conformément à l’article 14 du Règlement (UE) n°524/2013, la Commission Européenne met à disposition une 
            plateforme de Règlement en Ligne des Litiges :{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noreferrer" style={{ color: '#16a34a' }}>
              https://ec.europa.eu/consumers/odr
            </a>.
          </Text>

          <SectionTitle>7. Droit applicable</SectionTitle>
          <Text>
            Les présentes mentions légales sont soumises au droit applicable dans l’Union Européenne. Tout litige relatif 
            à l’utilisation du Site relèvera de la compétence des tribunaux compétents.
          </Text>
        </>
      )}
    </Container>
  );
};

export default Legal;
