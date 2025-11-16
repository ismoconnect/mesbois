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

const Returns = () => {
  return (
    <Container>
      <Title>Retours et remboursements</Title>
      <Text>
        La présente politique précise les modalités de retours, réclamations et remboursements concernant vos
        commandes.
      </Text>

      <SectionTitle>Droit de rétractation</SectionTitle>
      <Text>
        Conformément à la réglementation en vigueur, vous disposez en principe d’un délai de quatorze (14) jours à
        compter de la réception de votre commande pour exercer votre droit de rétractation, lorsque ce droit
        s’applique. Certaines catégories de produits peuvent être exclues du droit de rétractation, notamment lorsque
        les produits ont été détériorés ou altérés du fait de conditions de stockage inadaptées.
      </Text>

      <SectionTitle>Conditions de reprise des produits</SectionTitle>
      <List>
        <li>Les produits doivent être retournés dans un état permettant une revente raisonnable.</li>
        <li>Les palettes largement consommées ou fortement dégradées ne peuvent généralement pas être reprises.</li>
        <li>Les risques liés au transport retour restent à la charge du client, sauf accord spécifique contraire.</li>
      </List>

      <SectionTitle>Réclamations à la livraison</SectionTitle>
      <Text>
        Si vous constatez un problème lors de la livraison (palette endommagée, produit manquant, colis ouvert ou
        humide, etc.), il est important de suivre la procédure suivante :
      </Text>
      <List>
        <li>Formulez des réserves claires et détaillées sur le bon de livraison du transporteur.</li>
        <li>Conservez des preuves (photos, vidéos) de l’état des produits et des palettes.</li>
        <li>Contactez notre service client dans les plus brefs délais en indiquant votre numéro de commande.</li>
      </List>

      <SectionTitle>Procédure de retour</SectionTitle>
      <List>
        <li>Contactez notre service client via la page Contact ou depuis votre espace client.</li>
        <li>Précisez le motif du retour ou de la réclamation et joignez, si possible, des photos.</li>
        <li>Nous vous indiquerons les modalités pratiques de reprise ou de renvoi des produits le cas échéant.</li>
      </List>

      <SectionTitle>Remboursements et avoirs</SectionTitle>
      <Text>
        Après étude de votre demande et, le cas échéant, réception des produits retournés, nous pourrons proposer :
      </Text>
      <List>
        <li>un remplacement du produit ou l’envoi de la quantité manquante ;</li>
        <li>un avoir utilisable sur une prochaine commande ;</li>
        <li>un remboursement partiel ou total, selon la situation et les textes applicables.</li>
      </List>
    </Container>
  );
};

export default Returns;
