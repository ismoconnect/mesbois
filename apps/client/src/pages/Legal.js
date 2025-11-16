import React from 'react';
import styled from 'styled-components';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px 80px;
`;

const Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-top: 24px;
  margin-bottom: 8px;
  color: #1f2933;
`;

const Text = styled.p`
  color: #4b5563;
  line-height: 1.7;
  margin-bottom: 8px;
`;

const List = styled.ul`
  margin: 0 0 8px 20px;
  color: #4b5563;
  line-height: 1.7;
`;

const Legal = () => {
  const { settings, loaded } = useSiteSettings();
  const companyName = loaded ? (settings.legalCompanyName || '') : '';
  const legalAddress = loaded ? (settings.legalAddress || '') : '';
  const legalSiteUrl = loaded ? (settings.legalSiteUrl || '') : '';
  const legalContactEmail = loaded ? (settings.legalContactEmail || '') : '';
  const legalDpoEmail = loaded ? (settings.legalDpoEmail || '') : '';
  const legalDirector = loaded ? (settings.legalDirector || '') : '';
  const legalCompanyForm = loaded ? (settings.legalCompanyForm || '') : '';
  const legalSiren = loaded ? (settings.legalSiren || '') : '';
  const legalSiret = loaded ? (settings.legalSiret || '') : '';
  const legalRcs = loaded ? (settings.legalRcs || '') : '';
  const legalVatNumber = loaded ? (settings.legalVatNumber || '') : '';
  const hostName = loaded ? (settings.hostName || '') : '';
  const hostAddress = loaded ? (settings.hostAddress || '') : '';

  return (
    <Container>
      <Title>Mentions légales</Title>

      <SectionTitle>1. Informations générales</SectionTitle>
      <Text>
        Le présent site internet, accessible à l’adresse {legalSiteUrl} (ci-après « le Site »), est édité et
        exploité par {companyName}, société immatriculée en France.
      </Text>
      <Text>
        {companyName}<br />
        {legalCompanyForm}<br />
        {legalSiren && <>SIREN : {legalSiren}<br /></>}
        {legalSiret && <>SIRET : {legalSiret}<br /></>}
        {legalRcs && <>R.C.S. : {legalRcs}<br /></>}
        {legalVatNumber && <>Numéro de TVA intracommunautaire : {legalVatNumber}<br /></>}
        Adresse : {legalAddress}
      </Text>
      <Text>
        Email : {legalContactEmail}<br />
        Site Web : {legalSiteUrl}<br />
        Directeur de la publication : {legalDirector}<br />
        Contact : {legalContactEmail}
      </Text>

      <SectionTitle>2. Hébergeur du site</SectionTitle>
      <Text>
        {hostName}<br />
        {hostAddress}
      </Text>

      <SectionTitle>3. Objet du site</SectionTitle>
      <Text>
        Le Site a pour vocation la vente en ligne de matériels agricoles, de jardinage, électroménagers et
        industriels destinés aux particuliers comme aux professionnels.
      </Text>
      <Text>
        {companyName} s’efforce de fournir des informations fiables et actualisées, mais ne peut être tenue
        responsable des éventuelles erreurs ou indisponibilités temporaires.
      </Text>

      <SectionTitle>4. Responsabilité de l’éditeur</SectionTitle>
      <Text>
        L’utilisateur navigue sur le Site à ses risques et périls. {companyName} décline toute responsabilité en cas de :
      </Text>
      <List>
        <li>contenu erroné ou incomplet ;</li>
        <li>difficultés d’accès au Site ;</li>
        <li>utilisation frauduleuse des données malgré les mesures de sécurité mises en place ;</li>
        <li>présence de liens vers des sites tiers dont le contenu n’est pas sous son contrôle.</li>
      </List>

      <SectionTitle>5. Propriété intellectuelle</SectionTitle>
      <Text>
        L’ensemble des contenus présents sur le Site (textes, images, vidéos, logos, éléments graphiques, etc.) sont
        la propriété exclusive de {companyName} ou de ses partenaires et sont protégés par les lois françaises et
        internationales relatives à la propriété intellectuelle.
      </Text>
      <Text>
        Toute reproduction ou exploitation, totale ou partielle, sans autorisation préalable écrite est strictement
        interdite.
      </Text>

      <SectionTitle>6. Données personnelles et confidentialité</SectionTitle>
      <Text>
        {companyName} s’engage à respecter la vie privée des utilisateurs, conformément au Règlement Général sur la
        Protection des Données (RGPD).
      </Text>
      <Text>
        Données collectées : nom, prénom, adresse postale, email, téléphone, informations de paiement.
      </Text>
      <Text>
        Finalités : traitement des commandes, communication client, marketing (si consentement), obligations
        comptables et fiscales.
      </Text>
      <Text>
        Durée de conservation : limitée au strict nécessaire, selon les obligations légales.
      </Text>
      <Text>
        Destinataires : uniquement les prestataires intervenant dans la gestion des commandes (logistique, paiement,
        emailing).
      </Text>
      <Text>
        Les utilisateurs peuvent exercer leur droit d’accès, de rectification ou de suppression de leurs données à
        tout moment à l’adresse suivante : {legalDpoEmail}.
      </Text>

      <SectionTitle>7. Utilisation des cookies</SectionTitle>
      <Text>
        Le Site utilise des cookies afin d’optimiser l’expérience utilisateur et mesurer l’audience.
      </Text>
      <Text>
        Types de cookies :
      </Text>
      <List>
        <li>cookies strictement nécessaires au fonctionnement ;</li>
        <li>cookies analytiques (ex : Google Analytics) ;</li>
        <li>cookies marketing et publicitaires.</li>
      </List>
      <Text>
        Lors de sa première visite, l’utilisateur est informé via un bandeau et peut gérer ses préférences.
      </Text>

      <SectionTitle>8. Conditions générales de vente</SectionTitle>
      <Text>
        Les transactions réalisées sur le Site sont encadrées par les Conditions Générales de Vente disponibles sur
        une page dédiée. Elles précisent les modalités de commande, de livraison, de paiement, de retour et de
        remboursement.
      </Text>

      <SectionTitle>9. Conformité des produits et garanties</SectionTitle>
      <Text>
        Tous les produits vendus par {companyName} sont conformes aux normes européennes applicables (certification
        CE, normes RoHS, ISO, etc.). Ils bénéficient des garanties légales de conformité et contre les vices cachés,
        conformément au Code de la consommation.
      </Text>

      <SectionTitle>10. Passerelles de paiement et sécurité</SectionTitle>
      <Text>
        Le Site propose des paiements sécurisés via des passerelles conformes à la norme PCI-DSS.
      </Text>
      <Text>
        Moyens de paiement acceptés : carte bancaire (Visa, Mastercard), virement bancaire.
      </Text>

      <SectionTitle>11. Droit applicable et juridiction compétente</SectionTitle>
      <Text>
        Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux compétents
        seront ceux du ressort de Paris, sauf dispositions légales impératives contraires.
      </Text>

      <SectionTitle>12. Mise à jour</SectionTitle>
      <Text>
        {companyName} se réserve le droit de modifier les présentes mentions légales à tout moment. Il est recommandé
        à l’utilisateur de les consulter régulièrement.
      </Text>
    </Container>
  );
};

export default Legal;
