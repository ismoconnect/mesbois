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

const Returns = () => {
  const { t, i18n } = useTranslation();
  const isDe = i18n.language && i18n.language.startsWith('de');

  return (
    <Container>
      <SEO 
        title={isDe ? 'Widerrufsbelehrung & Rückgabe' : 'Retours & Droit de Rétractation'} 
        description={isDe ? 'Gesetzliche Widerrufsbelehrung und Rückgaberecht für Brennholz- und Pellet-Bestellungen bei brennholzkaufen.' : 'Modalités relatives au droit de rétractation et au retour des produits commandés.'}
        path="/rueckgabe"
      />

      {isDe ? (
        <>
          <Title>Widerrufsbelehrung & Rückgaberecht</Title>
          <Subtitle>Gesetzliches Widerrufsrecht für Verbraucher beim Kauf von Brennholz und Pellets</Subtitle>

          <SectionTitle>Widerrufsbelehrung</SectionTitle>
          <Text>
            Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
          </Text>
          <Text>
            Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, 
            der nicht der Beförderer ist, die letzte Ware in Besitz genommen haben bzw. hat.
          </Text>
          <Text>
            Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z. B. ein mit der Post 
            versandter Brief oder eine E-Mail an{' '}
            <a href="mailto:kontakt@brennholzkaufen.online" style={{ color: '#16a34a' }}>kontakt@brennholzkaufen.online</a>) 
            über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.
          </Text>

          <SectionTitle>Folgen des Widerrufs</SectionTitle>
          <Text>
            Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, 
            einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass Sie eine andere 
            Art der Lieferung als die von uns angebotene, günstigste Standardlieferung gewählt haben), unverzüglich und spätestens 
            binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
          </Text>
          <Text>
            Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben, 
            es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart.
          </Text>

          <SectionTitle>Rückholung von Speditionsware (Palettenware)</SectionTitle>
          <Text>
            Wir holen die Waren (Kaminholz- und Pellet-Paletten) ab. Sie tragen die unmittelbaren Kosten der Rücksendung der Waren. 
            Die Kosten für den Speditionsrücktransport einer Palette werden auf höchstens etwa 90 bis 120 EUR pro Palette geschätzt.
          </Text>
          <Text>
            Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen zur Prüfung der 
            Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang mit ihnen zurückzuführen ist (z. B. 
            unsachgemäße, feuchte Lagerung nach Anlieferung).
          </Text>

          <SectionTitle>Muster-Widerrufsformular</SectionTitle>
          <InfoBox>
            (Wenn Sie den Vertrag widerrufen wollen, senden Sie bitte folgende Angaben per E-Mail) :<br /><br />
            – An : brennholzkaufen Kundenservice, E-Mail : kontakt@brennholzkaufen.online<br />
            – Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)<br />
            – Bestellt am (*) / erhalten am (*)<br />
            – Name des/der Verbraucher(s)<br />
            – Anschrift des/der Verbraucher(s)<br />
            – Datum<br />
            (*) Unzutreffendes streichen.
          </InfoBox>
        </>
      ) : (
        <>
          <Title>Retours & Droit de Rétractation</Title>
          <Subtitle>Modalités applicables au droit de rétractation et à la reprise des combustibles livrés</Subtitle>

          <SectionTitle>1. Droit légal de rétractation</SectionTitle>
          <Text>
            Conformément aux dispositions légales en vigueur, vous disposez d’un délai de quatorze (14) jours calendaires 
            à compter de la réception de vos marchandises pour exercer votre droit de rétractation sans avoir à motiver votre décision.
          </Text>
          <Text>
            Pour exercer ce droit, il vous suffit de notifier votre décision par e-mail à :{' '}
            <a href="mailto:kontakt@brennholzkaufen.online" style={{ color: '#16a34a' }}>kontakt@brennholzkaufen.online</a>.
          </Text>

          <SectionTitle>2. Conditions de reprise de la marchandise</SectionTitle>
          <List>
            <li>Les palettes et sacs de granulés doivent être intègres et conservés à l’abri de l’humidité.</li>
            <li>En raison du poids et du volume des combustibles (palettes de 1 à 2 tonnes), la reprise s'effectue par camion porteur avec chariot embarqué.</li>
            <li>Les frais directs de réexpédition sont à la charge du client, sauf en cas d'erreur de livraison imputable à notre service.</li>
          </List>

          <SectionTitle>3. Délais de remboursement</SectionTitle>
          <Text>
            Dès réception et contrôle des produits repris, le remboursement intégral des sommes versées est opéré 
            dans un délai maximal de 14 jours par virement bancaire sur votre compte.
          </Text>

          <SectionTitle>4. Formulaire type de rétractation</SectionTitle>
          <InfoBox>
            À l'attention de brennholzkaufen (kontakt@brennholzkaufen.online) :<br /><br />
            Je vous notifie par la présente ma rétractation du contrat portant sur la vente ci-dessous :<br />
            – Numéro de commande :<br />
            – Date de commande / Date de réception :<br />
            – Nom et prénom du client :<br />
            – Adresse de livraison :<br />
            – Date :
          </InfoBox>
        </>
      )}
    </Container>
  );
};

export default Returns;
