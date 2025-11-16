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

const Delivery = () => {
  return (
    <Container>
      <Title>Politique de livraison</Title>
      <Text>
        La présente politique de livraison détaille les modalités d’acheminement de vos commandes de bois de
        chauffage et produits associés.
      </Text>

      <SectionTitle>Zones desservies</SectionTitle>
      <Text>
        Nous livrons principalement en France métropolitaine. Certaines zones reculées ou difficiles d’accès peuvent
        faire l’objet de délais supplémentaires ou de conditions spécifiques.
      </Text>

      <SectionTitle>Délais de livraison</SectionTitle>
      <List>
        <li>Préparation de la commande : en principe sous 24–48h après validation du paiement.</li>
        <li> Acheminement : en général 2 à 5 jours ouvrés selon votre département et le transporteur.</li>
      </List>
      <Text>
        Ces délais sont donnés à titre indicatif. En période de forte activité (hiver, promotions, périodes de
        tension logistique), ils peuvent être allongés. En cas de retard significatif, nous faisons nos meilleurs
        efforts pour vous en informer.
      </Text>

      <SectionTitle>Prise de rendez-vous et accès au lieu de livraison</SectionTitle>
      <Text>
        Selon les cas, le transporteur peut vous contacter pour convenir d’un créneau de passage. Il vous appartient
        de vous assurer que l’accès est possible et sécurisé : largeur de voie, hauteur, portails, portail fermé,
        accès au lieu de dépose, etc.
      </Text>

      <SectionTitle>Réception de la commande et réserves</SectionTitle>
      <List>
        <li>Vérifiez soigneusement l’état des palettes et la quantité livrée lors de la réception.</li>
        <li>En cas d’anomalie (palette abîmée, produit manquant, colis ouvert), formulez des réserves précises sur le bon de livraison.</li>
        <li>Confirmez vos réserves par écrit au transporteur et à notre service client, idéalement avec des photos, dans les délais indiqués par la réglementation applicable.</li>
      </List>

      <SectionTitle>Transfert des risques</SectionTitle>
      <Text>
        Le transfert des risques intervient à la remise des produits au client ou à toute personne mandatée par lui
        au lieu de livraison indiqué lors de la commande, conformément aux conditions générales de vente.
      </Text>

      <SectionTitle>Frais de livraison</SectionTitle>
      <Text>
        Les frais de livraison sont calculés en fonction de la nature des produits, du poids total de la commande et
        de votre adresse de livraison. Le montant exact est affiché avant la validation définitive de votre commande.
      </Text>

      <SectionTitle>Cas particuliers et impossibilité de livrer</SectionTitle>
      <Text>
        En cas d’adresse incomplète, erronée ou si l’accès est impossible ou dangereux pour le transporteur, la
        livraison pourra être reprogrammée et des frais supplémentaires pourront être facturés. Il appartient au
        client de fournir des informations d’accès complètes et exactes.
      </Text>
    </Container>
  );
};

export default Delivery;
