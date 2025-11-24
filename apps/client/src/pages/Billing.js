import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { getUserOrders } from '../firebase/orders';
import { getRIB } from '../firebase/rib';
import { getPaypalInfo } from '../firebase/paypal';
import { auth } from '../firebase/config';
import { signInAnonymously } from 'firebase/auth';
import toast from 'react-hot-toast';
import { formatTransferRef } from '../utils/ref';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 0 24px 0;
  word-break: break-word;
  overflow-wrap: break-word;
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
  min-width: 0;
  overflow: hidden;
  @media (max-width: 600px) { 
    padding: 14px;
    min-width: 0;
  }
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
  const [paypalInfo, setPaypalInfo] = useState({ email: '', instructions: '' });

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
    try { await navigator.clipboard.writeText(text || ''); } catch { }
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
      } catch { }

      const [ordersRes, ribRes, paypalRes] = await Promise.all([
        getUserOrders(user.uid),
        getRIB(),
        getPaypalInfo()
      ]);
      if (ordersRes.success) {
        const pending = ordersRes.data.filter(o =>
          (o.payment?.method === 'bank' || o.payment?.method === 'paypal') &&
          (o.status !== 'paid' && o.status !== 'delivered' && o.status !== 'cancelled')
        );
        setOrders(pending);
      }
      if (ribRes.success) {
        setRib(ribRes.data);
      } else {
        // Fallback RIB
        setRib({
          holder: process.env.REACT_APP_RIB_HOLDER || '',
          iban: process.env.REACT_APP_RIB_IBAN || '',
          bic: process.env.REACT_APP_RIB_BIC || '',
          bank: process.env.REACT_APP_RIB_BANK || ''
        });
      }
      if (paypalRes.success) {
        setPaypalInfo(paypalRes.data);
      } else {
        setPaypalInfo({
          email: process.env.REACT_APP_PAYPAL_EMAIL || '',
          instructions: process.env.REACT_APP_PAYPAL_INSTRUCTIONS || ''
        });
      }
      setLoading(false);
    };
    load();
  }, [user]);

  if (!user) return null;

  const hasBankOrders = orders.some(o => o.payment?.method === 'bank');
  const hasPaypalOrders = orders.some(o => o.payment?.method === 'paypal');

  return (
    <DashboardLayout>
      <Container>
        <Title>Facturation & Paiement</Title>

        <AlertBanner>
          Pour un traitement rapide, effectuez le règlement dès que possible.
          Votre commande sera validée et expédiée dès réception de votre paiement.
        </AlertBanner>

        <Info>Retrouvez ci-dessous les informations nécessaires pour régler vos commandes en attente.</Info>

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
              Effectuez le paiement en utilisant les coordonnées affichées ci-dessous (Virement ou PayPal).
            </li>
            <li style={{ marginBottom: 6 }}>
              Indiquez <strong>la référence de commande</strong> fournie afin que nous puissions l’identifier rapidement.
            </li>
            <li style={{ marginBottom: 6 }}>
              Dès réception du paiement, votre commande est validée et passe en <strong>préparation</strong>.
            </li>
            <li>
              Vous pouvez suivre l’avancement depuis la page <strong>Suivi</strong> de votre espace client.
            </li>
          </ol>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ color: '#6b7280', fontWeight: 600 }}>
                Votre commande sera traitée dès réception du paiement. Le traitement se fera dans un bref délai et la livraison suivra.
              </span>
            </div>
            <Link to="/suivi" style={{ textDecoration: 'none', background: '#2c5530', color: '#fff', padding: '8px 12px', borderRadius: 8, fontWeight: 800 }}>
              Suivre ma commande
            </Link>
          </div>
        </Card>

        {loading && <Card>Chargement…</Card>}

        {!loading && orders.length === 0 && (
          <Card>Aucune commande en attente de paiement.</Card>
        )}

        {orders.map((order) => {
          const ref = formatTransferRef(order.id);
          const isPaypal = order.payment?.method === 'paypal';
          const statusText = isPaypal ? 'En attente de paiement PayPal' : 'En attente de virement';

          return (
            <Card key={order.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>Commande #{order.id.slice(-8)}</div>
                <Badge>{statusText}</Badge>
              </div>

              {isPaypal ? (
                <>
                  <div style={{ fontWeight: 700, marginBottom: 8, color: '#2c5530' }}>Coordonnées PayPal à utiliser :</div>
                  <RIBGrid>
                    <RIBField>
                      <strong>Email PayPal</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span>{paypalInfo.email}</span>
                        <button onClick={() => copy(paypalInfo.email)} style={{ border: '1px solid #e0e0e0', background: '#f9fafb', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>Copier</button>
                      </div>
                    </RIBField>
                    {paypalInfo.instructions && (
                      <RIBField style={{ gridColumn: '1 / -1' }}>
                        <strong>Instructions</strong>
                        <div style={{ whiteSpace: 'pre-wrap' }}>{paypalInfo.instructions}</div>
                      </RIBField>
                    )}
                    <RIBField style={{ gridColumn: '1 / -1' }}>
                      <strong>Référence à indiquer</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span>{ref}</span>
                        <button onClick={() => copy(ref)} style={{ border: '1px solid #e0e0e0', background: '#f9fafb', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>Copier</button>
                      </div>
                    </RIBField>
                  </RIBGrid>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, marginBottom: 8, color: '#2c5530' }}>Coordonnées bancaires à utiliser :</div>
                  <RIBGrid>
                    <RIBField>
                      <strong>Titulaire</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span>{rib.holder}</span>
                        <button onClick={() => copy(rib.holder)} style={{ border: '1px solid #e0e0e0', background: '#f9fafb', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>Copier</button>
                      </div>
                    </RIBField>
                    <RIBField>
                      <strong>Banque</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span>{rib.bank}</span>
                        <button onClick={() => copy(rib.bank)} style={{ border: '1px solid #e0e0e0', background: '#f9fafb', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>Copier</button>
                      </div>
                    </RIBField>
                    <RIBField>
                      <strong>IBAN</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span>{rib.iban}</span>
                        <button onClick={() => copy(rib.iban)} style={{ border: '1px solid #e0e0e0', background: '#f9fafb', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>Copier</button>
                      </div>
                    </RIBField>
                    <RIBField>
                      <strong>BIC</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span>{rib.bic}</span>
                        <button onClick={() => copy(rib.bic)} style={{ border: '1px solid #e0e0e0', background: '#f9fafb', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>Copier</button>
                      </div>
                    </RIBField>
                    <RIBField style={{ gridColumn: '1 / -1' }}>
                      <strong>Référence à indiquer</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                        <span>{ref}</span>
                        <button onClick={() => copy(ref)} style={{ border: '1px solid #e0e0e0', background: '#f9fafb', borderRadius: 8, padding: '6px 8px', cursor: 'pointer' }}>Copier</button>
                      </div>
                    </RIBField>
                  </RIBGrid>
                </>
              )}
            </Card>
          );
        })}
      </Container>
    </DashboardLayout>
  );
};

export default Billing;
