import React from 'react';
import styled from 'styled-components';

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

const Privacy = () => {
  return (
    <Container>
      <Title>Politique de confidentialité</Title>
      <Text>
        La protection de vos données personnelles est essentielle. Cette politique explique quelles informations
        nous collectons, pour quelles finalités et comment nous les sécurisons.
      </Text>

      <SectionTitle>Données collectées</SectionTitle>
      <List>
        <li>Informations de compte : nom, prénom, adresse email, numéro de téléphone.</li>
        <li>Informations de livraison : adresse postale, compléments d’adresse.</li>
        <li>Informations de commande : produits commandés, montants, historique des achats.</li>
        <li>Données de connexion et de navigation : pages consultées, identifiants techniques, temps de connexion.</li>
      </List>

      <SectionTitle>Bases légales du traitement</SectionTitle>
      <List>
        <li>Exécution du contrat : gestion des commandes, livraison, facturation.</li>
        <li>Respect d’obligations légales : comptabilité, lutte contre la fraude, conservation de certaines données.</li>
        <li>Intérêt légitime : amélioration de l’expérience utilisateur, sécurité du site.</li>
        <li>Consentement : envoi éventuel de communications commerciales, utilisation de certains cookies.</li>
      </List>

      <SectionTitle>Finalités d’utilisation</SectionTitle>
      <List>
        <li>Création et gestion de votre compte client.</li>
        <li>Traitement et suivi de vos commandes (préparation, livraison, service après-vente).</li>
        <li>Gestion de la relation client (support, réclamations, avis).</li>
        <li>Amélioration de la qualité de nos services et sécurisation du site.</li>
      </List>

      <SectionTitle>Destinataires des données</SectionTitle>
      <Text>
        Vos données sont destinées aux services internes habilités et à certains prestataires intervenant pour
        notre compte (transporteurs, prestataires informatiques, prestataires de paiement, etc.), uniquement dans
        la mesure nécessaire à leurs missions.
      </Text>

      <SectionTitle>Sécurité des données</SectionTitle>
      <Text>
        Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles adaptées pour protéger vos
        données contre toute perte, destruction, altération ou accès non autorisé. L’accès aux données est limité
        aux seules personnes qui en ont besoin dans le cadre de leurs fonctions.
      </Text>

      <SectionTitle>Cookies et traceurs</SectionTitle>
      <Text>
        Le site peut utiliser des cookies et technologies similaires pour améliorer la navigation, mesurer
        l’audience ou personnaliser le contenu. Certains cookies sont nécessaires au fonctionnement du site, d’autres
        nécessitent votre consentement. Vous pouvez gérer vos préférences via les paramètres de votre navigateur.
      </Text>

      <SectionTitle>Durée de conservation</SectionTitle>
      <Text>
        Vos données sont conservées pendant la durée nécessaire aux finalités pour lesquelles elles sont collectées
        et, le cas échéant, pendant les durées de prescription légale applicables. Au-delà, elles sont supprimées ou
        archivées de manière anonymisée.
      </Text>

      <SectionTitle>Vos droits</SectionTitle>
      <Text>
        Dans les conditions prévues par la réglementation applicable, vous disposez d’un droit d’accès, de
        rectification, d’effacement, de limitation du traitement, de portabilité de vos données et d’opposition.
        Vous pouvez également définir des directives relatives au sort de vos données après votre décès.
      </Text>
      <Text>
        Pour exercer vos droits, vous pouvez contacter notre service client via la page Contact. Vous disposez
        également du droit d’introduire une réclamation auprès de l’autorité de contrôle compétente.
      </Text>
    </Container>
  );
};

export default Privacy;
