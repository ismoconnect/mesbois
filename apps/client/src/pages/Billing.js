import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { getUserOrders } from '../firebase/orders';
import { getRIB } from '../firebase/rib';
import { auth } from '../firebase/config';
import { signInAnonymously } from 'firebase/auth';
import toast from 'react-hot-toast';
import { formatTransferRef } from '../utils/ref';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 24px 0;
  @media (max-width: 600px) { padding: 0 12px 16px 12px; }
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 16px;
`;

const Info = styled.p`
  color: #666;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 20px;
  margin-bottom: 16px;
  @media (max-width: 600px) { padding: 14px; }
`;

const AlertBanner = styled.div`
  margin-bottom: 16px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fee2e2;
  border: 1px solid #ef4444;
  color: #7f1d1d;
  font-size: 14px;
  font-weight: 600;
`;

const RIBGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 8px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const RIBField = styled.div`
  border: 1px dashed #d9e2da;
  border-radius: 10px;
  padding: 12px;
  background: #fafafa;
  strong { color: #2c5530; display:block; font-size: 13px; }
  div { font-weight: 700; }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff8e1;
  color: #8a6d3b;
  border: 1px solid #ffe7a3;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
`;

const Billing = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [rib, setRib] = useState({ holder: '', iban: '', bic: '', bank: '' });

  const showCenterAlert = (message) => {
    toast.dismiss('billing-alert');
    toast.custom((t) => (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 20000
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '18px 20px 16px',
            maxWidth: '90vw',
            width: 340,
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            textAlign: 'center',
            marginTop: '22vh',
            border: '1px solid #fca5a5'
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 12,
              color: '#b91c1c'
            }}
          >
            {message}
          </div>
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: 'none',
              background: '#2c5530',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        </div>
      </div>
    ), {
      id: 'billing-alert',
      duration: 2500,
      position: 'top-center'
    });
  };

  const copy = async (text) => {
    try { await navigator.clipboard.writeText(text || ''); } catch {}
  };

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      // s'assurer d'avoir une session (si règles Firestore exigent auth)
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch {}

      const [ordersRes, ribRes] = await Promise.all([
        getUserOrders(user.uid),
        getRIB()
      ]);
      if (ordersRes.success) {
        const pendingBank = ordersRes.data.filter(o => (o.payment?.method === 'bank') && (o.status !== 'paid' && o.status !== 'delivered'));
        setOrders(pendingBank);
      }
      if (ribRes.success) {
        setRib(ribRes.data);
      } else {
        showCenterAlert(ribRes.error || 'Impossible de charger le RIB');
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
  }, [user]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <Container>
        <Title>Facturation</Title>

        <AlertBanner>
          Pour un traitement plus rapide de votre commande, privilégiez un <strong>virement instantané</strong>.
          Les virements bancaires instantanés sont crédités en quelques minutes, alors qu'un virement SEPA classique
          peut mettre jusqu'à 24 à 72 heures ouvrées avant d'être pris en compte.
        </AlertBanner>

        <Info>Effectuez le virement sur le RIB ci-dessous en indiquant la référence. À réception, votre commande passe en préparation puis en livraison vers votre adresse.</Info>

        <Card>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 10,
            padding: '6px 10px',
            borderRadius: 999,
            background: '#fef3c7',
            border: '1px solid #f59e0b',
            color: '#92400e',
            fontWeight: 800,
            fontSize: 14
          }}>
            <span style={{ fontSize: 18 }}>!</span>
            <span>Étapes importantes pour finaliser votre commande</span>
          </div>
          <ol style={{ paddingLeft: 18, margin: 0, color: '#111827', fontSize: 14, lineHeight: 1.7 }}>
            <li style={{ marginBottom: 6 }}>
              Effectuez un virement bancaire en utilisant les coordonnées ci-dessous (titulaire, banque, IBAN, BIC).
            </li>
            <li style={{ marginBottom: 6 }}>
              Indiquez <strong>la référence du virement</strong> fournie pour votre commande afin que nous puissions l’identifier rapidement.
            </li>
            <li style={{ marginBottom: 6 }}>
              Dès réception du virement, votre commande est validée et passe en <strong>préparation</strong> dans notre entrepôt.
            </li>
            <li style={{ marginBottom: 6 }}>
              Une fois préparée, votre commande est <strong>expédiée à l’adresse de livraison</strong> indiquée lors de votre achat.
            </li>
            <li>
              Vous pouvez suivre l’avancement (en attente de virement, préparée, expédiée, livrée) depuis la page <strong>Suivi</strong> de votre espace client.
            </li>
          </ol>
        </Card>

        <Card>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:10, flexWrap:'wrap' }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ color:'#6b7280', fontWeight:600 }}>
                Votre commande sera traitée dès que vous effectuerez le virement sur le RIB ci-dessous. Le traitement se fera dans un bref délai et la livraison suivra. Vous pouvez suivre vos commandes depuis la page Suivi.
              </span>
            </div>
            <Link to="/suivi" style={{ textDecoration:'none', background:'#2c5530', color:'#fff', padding:'8px 12px', borderRadius:8, fontWeight:800 }}>
              Suivre ma commande
            </Link>
          </div>
        </Card>

        {loading && <Card>Chargement…</Card>}

        {!loading && orders.length === 0 && (
          <Card>Aucune facture en attente de virement.</Card>
        )}

        {!loading && orders.length > 0 && (
          <Card>
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Coordonnées bancaires</div>
            <RIBGrid>
              <RIBField>
                <strong>Titulaire du compte</strong>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                  <span>{rib.holder}</span>
                  <button onClick={() => copy(rib.holder)} style={{ border:'1px solid #e0e0e0', background:'#f9fafb', borderRadius:8, padding:'6px 8px', cursor:'pointer' }}>Copier</button>
                </div>
              </RIBField>
              <RIBField>
                <strong>Banque</strong>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                  <span>{rib.bank}</span>
                  <button onClick={() => copy(rib.bank)} style={{ border:'1px solid #e0e0e0', background:'#f9fafb', borderRadius:8, padding:'6px 8px', cursor:'pointer' }}>Copier</button>
                </div>
              </RIBField>
              <RIBField>
                <strong>IBAN</strong>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                  <span>{rib.iban}</span>
                  <button onClick={() => copy(rib.iban)} style={{ border:'1px solid #e0e0e0', background:'#f9fafb', borderRadius:8, padding:'6px 8px', cursor:'pointer' }}>Copier</button>
                </div>
              </RIBField>
              <RIBField>
                <strong>BIC</strong>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                  <span>{rib.bic}</span>
                  <button onClick={() => copy(rib.bic)} style={{ border:'1px solid #e0e0e0', background:'#f9fafb', borderRadius:8, padding:'6px 8px', cursor:'pointer' }}>Copier</button>
                </div>
              </RIBField>
            </RIBGrid>
          </Card>
        )}

        {orders.map((order) => {
          const ref = formatTransferRef(order.id);
          return (
            <Card key={order.id}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap: 10, flexWrap:'wrap' }}>
                <div style={{ fontWeight: 800 }}>Commande #{order.id.slice(-8)}</div>
                <Badge>En attente de virement</Badge>
              </div>
              <RIBGrid>
                <RIBField style={{ gridColumn: '1 / -1' }}>
                  <strong>Référence du virement</strong>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                    <span>{ref}</span>
                    <button onClick={() => copy(ref)} style={{ border:'1px solid #e0e0e0', background:'#f9fafb', borderRadius:8, padding:'6px 8px', cursor:'pointer' }}>Copier</button>
                  </div>
                </RIBField>
              </RIBGrid>
            </Card>
          );
        })}
      </Container>
    </DashboardLayout>
  );
};

export default Billing;
