import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams, Link } from 'react-router-dom';
import { getPaypalInfo } from '../firebase/paypal';
import toast from 'react-hot-toast';
import { formatTransferRef } from '../utils/ref';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px 80px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  padding: 24px;
`;

const Title = styled.h1`
  color: #2c5530;
  font-size: 28px;
  margin: 0 0 8px 0;
`;

const Subtitle = styled.p`
  color: #666;
  margin: 0 0 16px 0;
`;

const RGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const Field = styled.div`
  border: 1px dashed #e6eae7;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
  strong { color: #2c5530; display:block; font-size: 13px; }
  div { font-weight: 700; }
`;

const CTA = styled(Link)`
  display: inline-block; margin-top: 20px; background:#2c5530; color:#fff; padding:14px 18px; border-radius:10px; font-weight:800; text-decoration:none; text-align:center;
  &:hover{ background:#1e3a22; }
`;

export default function PayPalPayment() {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [info, setInfo] = useState({ email: '', instructions: '' });
  const [loading, setLoading] = useState(true);
  const ref = formatTransferRef(orderId || '');

  useEffect(() => {
    (async () => {
      const res = await getPaypalInfo();
      if (res.success) {
        setInfo(res.data);
      } else {
        toast.error(res.error || 'Impossible de charger les informations PayPal');
        setInfo({ email: process.env.REACT_APP_PAYPAL_EMAIL || '', instructions: process.env.REACT_APP_PAYPAL_INSTRUCTIONS || '' });
      }
      setLoading(false);
    })();
  }, []);

  return (
    <Container>
      <Card>
        <Title>Paiement PayPal</Title>
        <Subtitle>Veuillez effectuer le paiement sur le compte PayPal ci-dessous en indiquant la référence.</Subtitle>

        {loading && <p>Chargement…</p>}

        <RGrid>
          <Field>
            <strong>Email PayPal</strong>
            <div>{info.email}</div>
          </Field>
          <Field>
            <strong>Référence à indiquer</strong>
            <div>{ref}</div>
          </Field>
          {info.instructions ? (
            <Field>
              <strong>Instructions</strong>
              <div style={{ whiteSpace: 'pre-wrap', fontWeight: 600 }}>{info.instructions}</div>
            </Field>
          ) : null}
        </RGrid>

        <p style={{ marginTop: 16, color:'#666' }}>
          Un email de confirmation vous a été envoyé. Votre commande sera validée dès réception du paiement PayPal.
        </p>
        <CTA to="/dashboard">Aller sur mon espace client</CTA>
      </Card>
    </Container>
  );
}
