import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams, Link } from 'react-router-dom';
import { getRIB } from '../firebase/rib';
import toast from 'react-hot-toast';
import { FiCreditCard, FiArrowLeft } from 'react-icons/fi';
import { auth } from '../firebase/config';
import { signInAnonymously } from 'firebase/auth';
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

const RIBGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 12px;
  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

const RIBField = styled.div`
  border: 1px dashed #e6eae7;
  border-radius: 8px;
  padding: 12px;
  background: #fafafa;
  strong { color: #2c5530; display:block; font-size: 13px; }
  div { font-weight: 700; }
`;

const Back = styled(Link)`
  display: inline-flex; align-items:center; gap:8px; color:#2c5530; text-decoration:none; font-weight:700; margin-bottom:12px;
`;

const CTA = styled(Link)`
  display: inline-block; margin-top: 20px; background:#2c5530; color:#fff; padding:14px 18px; border-radius:10px; font-weight:800; text-decoration:none; text-align:center;
  &:hover{ background:#1e3a22; }
`;

const BankTransfer = () => {
  const [params] = useSearchParams();
  const orderId = params.get('orderId');
  const [rib, setRib] = useState({ holder: '', iban: '', bic: '', bank: '' });
  const [loading, setLoading] = useState(true);
  const ref = formatTransferRef(orderId || '');

  useEffect(() => {
    const load = async () => {
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch (e) {
        // Pas bloquant, on tentera quand même la lecture
      }
      const res = await getRIB();
      if (res.success) {
        setRib(res.data);
      } else {
        toast.error(res.error || "Impossible de charger le RIB");
        // Fallback éventuel sur ENV pour éviter l'affichage vide
        setRib({
          holder: process.env.REACT_APP_RIB_HOLDER || '',
          iban: process.env.REACT_APP_RIB_IBAN || '',
          bic: process.env.REACT_APP_RIB_BIC || '',
          bank: process.env.REACT_APP_RIB_BANK || ''
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <Container>
      <Back to="/dashboard">
        ← Retour sur mon espace client
      </Back>
      <Card>
        <Title>Virement bancaire</Title>
        <p>Veuillez effectuer un virement en utilisant les informations suivantes :</p>
        {loading && <p>Chargement…</p>}
        <RIBGrid>
          <RIBField>
            <strong>Titulaire du compte</strong>
            <div>{rib.holder}</div>
          </RIBField>
          <RIBField>
            <strong>Banque</strong>
            <div>{rib.bank}</div>
          </RIBField>
          <RIBField>
            <strong>IBAN</strong>
            <div>{rib.iban}</div>
          </RIBField>
          <RIBField>
            <strong>BIC</strong>
            <div>{rib.bic}</div>
          </RIBField>
          <RIBField style={{ gridColumn: '1 / -1' }}>
            <strong>Référence du virement</strong>
            <div>{ref}</div>
          </RIBField>
        </RIBGrid>
        <p style={{ marginTop: 16, color:'#666' }}>
          Un email de confirmation vous a été envoyé. Conservez bien la référence de virement.
        </p>
        <CTA to="/dashboard">Aller sur mon espace client</CTA>
      </Card>
    </Container>
  );
}
;

export default BankTransfer;
