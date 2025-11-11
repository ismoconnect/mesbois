import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Page = styled.div`display: grid; gap: 16px;`;
const Title = styled.h1`margin: 0; color: #2c5530;`;
const Card = styled.div`background: #fff; border: 1px solid #e6eae7; border-radius: 12px; padding: 16px;`;
const Row = styled.div`display: grid; grid-template-columns: 1fr 1fr; gap: 12px; @media (max-width: 900px){grid-template-columns:1fr;}`;
const Field = styled.div`display: grid; gap: 6px; label{font-weight:700;color:#2c5530;font-size:13px;}`;
const Select = styled.select`border:2px solid #e0e0e0;border-radius:8px;padding:8px 10px;`;
const Table = styled.table`
  width: 100%; border-collapse: collapse; background:#fff; border:1px solid #e6eae7; border-radius:12px; overflow:hidden;
  th, td { padding: 10px; text-align:left; }
  thead { background:#f5f7f6; }
  tbody tr + tr td { border-top: 1px dashed #e6eae7; }
`;
const Actions = styled.div`display:flex; gap:10px;`;
const Button = styled.button`background:#2c5530;color:#fff;border:none;padding:10px 14px;border-radius:8px;font-weight:800;cursor:pointer;`;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const run = async () => {
      const ref = doc(db, 'orders', id);
      const snap = await getDoc(ref);
      setOrder(snap.exists() ? { id, ...(snap.data()||{}) } : null);
    };
    run();
  }, [id]);

  const updateStatus = async (status) => {
    if (!order) return;
    setSaving(true);
    try {
      await setDoc(doc(db,'orders',id), { status }, { merge: true });
      setOrder(o => ({ ...o, status }));
    } finally { setSaving(false); }
  };

  if (!order) return <Page>Chargement…</Page>;

  return (
    <Page>
      <Title>Commande {id}</Title>
      <Card>
        <Row>
          <Field>
            <label>Client</label>
            <div>{order.userId || '-'}</div>
          </Field>
          <Field>
            <label>Statut</label>
            <Select value={order.status||''} onChange={e=>updateStatus(e.target.value)} disabled={saving}>
              <option value="">—</option>
              <option value="pending">En attente</option>
              <option value="shipped">Expédiée</option>
              <option value="canceled">Annulée</option>
            </Select>
          </Field>
        </Row>
      </Card>
      <Card>
        <Table>
          <thead>
            <tr>
              <th>Article</th>
              <th>Qté</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            {(order.items||[]).length === 0 ? (
              <tr><td colSpan="3">Aucun article</td></tr>
            ) : (order.items||[]).map((it, idx) => (
              <tr key={idx}>
                <td>{it.name || it.productId || '-'}</td>
                <td>{it.quantity || 1}</td>
                <td>{it.price != null ? `${it.price} €` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
      <Actions>
        <Button onClick={()=>navigate('/orders')}>Retour</Button>
      </Actions>
    </Page>
  );
};

export default OrderDetail;
