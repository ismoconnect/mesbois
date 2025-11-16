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

const Terms = () => {
  return (
    <Container>
      <Title>Conditions générales de vente</Title>
      <Text>
        Les présentes conditions générales de vente (CGV) ont pour objet de définir les droits et obligations des
        parties dans le cadre de la vente en ligne de bois de chauffage et produits associés.
      </Text>

      <SectionTitle>1. Champ d’application</SectionTitle>
      <Text>
        Les CGV s’appliquent sans restriction ni réserve à l’ensemble des commandes passées sur le site par des
        clients particuliers pour une livraison en France métropolitaine, sauf conditions particulières convenues par
        écrit.
      </Text>

      <SectionTitle>2. Commandes</SectionTitle>
      <List>
        <li>La validation de la commande par le client vaut acceptation pleine et entière des présentes CGV.</li>
        <li>Le client s’engage à fournir des informations exactes et complètes (identité, adresse, coordonnées).</li>
        <li>L’éditeur se réserve le droit d’annuler ou de refuser toute commande en cas de litige existant.</li>
      </List>

      <SectionTitle>3. Prix et paiement</SectionTitle>
      <List>
        <li>Les prix sont indiqués en euros toutes taxes comprises (TTC), hors frais de livraison.</li>
        <li>Les frais de livraison sont précisés avant la validation définitive de la commande.</li>
        <li>Le paiement s’effectue selon les moyens proposés sur le site (par exemple virement bancaire).</li>
        <li>La commande n’est préparée et expédiée qu’après validation effective du paiement.</li>
      </List>

      <SectionTitle>4. Livraison</SectionTitle>
      <Text>
        Les modalités de livraison (zones desservies, délais indicatifs, transfert des risques, réserves à la
        réception, cas d’impossibilité de livrer) sont détaillées dans la Politique de livraison. En cas d’adresse
        incomplète, erronée ou d’accès impraticable, des frais supplémentaires peuvent être facturés.
      </Text>

      <SectionTitle>5. Droit de rétractation, retours et remboursements</SectionTitle>
      <Text>
        Les conditions de rétractation, de retour des produits et de remboursement sont précisées dans la politique
        Retours et remboursements, dans le respect de la réglementation applicable.
      </Text>

      <SectionTitle>6. Garanties</SectionTitle>
      <Text>
        Les produits bénéficient des garanties légales éventuellement applicables. En cas de non-conformité ou de
        défaut constaté, le client est invité à contacter le service client dans les meilleurs délais en fournissant
        toute information utile (photos, description détaillée, numéro de commande).
      </Text>

      <SectionTitle>7. Responsabilité</SectionTitle>
      <Text>
        L’éditeur ne saurait être tenu responsable des dommages résultant d’une utilisation non conforme des
        produits ou d’un stockage inadapté du bois de chauffage. Sa responsabilité ne peut être engagée en cas de
        force majeure ou de faits imputables au client ou à un tiers.
      </Text>

      <SectionTitle>8. Données personnelles</SectionTitle>
      <Text>
        Les traitements de données à caractère personnel réalisés dans le cadre des commandes sont décrits dans la
        Politique de confidentialité. Celle-ci précise notamment les finalités, bases légales, durées de conservation,
        destinataires et droits des personnes concernées.
      </Text>

      <SectionTitle>9. Modifications des CGV</SectionTitle>
      <Text>
        L’éditeur se réserve la possibilité de modifier les présentes CGV à tout moment. Les CGV applicables sont
        celles en vigueur au jour de la validation de la commande par le client.
      </Text>

      <SectionTitle>10. Loi applicable et règlement des litiges</SectionTitle>
      <Text>
        Les présentes CGV sont soumises au droit applicable sur le territoire de livraison des produits. En cas de
        litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux compétents pourront être
        saisis.
      </Text>
    </Container>
  );
};

export default Terms;
