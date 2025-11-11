import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const Page = styled.div`display: grid; gap: 16px;`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h1`margin: 0; color: #2c5530;`;
const Filters = styled.div`display: flex; gap: 8px;`;
const Select = styled.select`border: 2px solid #e0e0e0; border-radius: 10px; padding: 8px 10px;`;
const Table = styled.table`
  width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e6eae7; border-radius: 12px; overflow: hidden;
  th, td { padding: 12px; text-align: left; }
  thead { background: #f5f7f6; }
  tbody tr + tr td { border-top: 1px dashed #e6eae7; }
  a { color: #2c5530; font-weight: 700; text-decoration: none; }
`;
const Badge = styled.span`
  display: inline-block; padding: 4px 8px; border-radius: 999px; font-size: 12px; font-weight: 700; color: #fff;
  background: ${p => p.type === 'shipped' ? '#27ae60' : p.type === 'pending' ? '#f39c12' : '#2c5530'};
`;

const Orders = () => {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const run = async () => {
    setLoading(true);
    try {
      const col = collection(db, 'orders');
      let qr = query(col, orderBy('createdAt', 'desc'), limit(100));
      const snap = await getDocs(qr);
      let list = snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
      if (status) list = list.filter(x => (x.status||'').toLowerCase() === status);
      setRows(list);
    } finally { setLoading(false); }
  };

  useEffect(() => { run(); // eslint-disable-next-line
  }, []);

  useEffect(() => { run(); // refresh when status changed
    // eslint-disable-next-line
  }, [status]);

  return (
    <Page>
      <Header>
        <Title>Commandes</Title>
        <Filters>
          <Select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="shipped">Expédiée</option>
            <option value="canceled">Annulée</option>
          </Select>
        </Filters>
      </Header>
      <Table>
        <thead>
          <tr>
            <th>Commande</th>
            <th>Client</th>
            <th>Total</th>
            <th>Statut</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan="6">Chargement…</td></tr> : rows.length === 0 ? (
            <tr><td colSpan="6">Aucune commande</td></tr>
          ) : rows.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.userId || '-'}</td>
              <td>{typeof o.total === 'number' ? o.total.toFixed(2) : o.total} €</td>
              <td><Badge type={(o.status||'').toLowerCase()}>{o.status || '—'}</Badge></td>
              <td>{o.createdAt?.toDate ? o.createdAt.toDate().toLocaleString() : (o.createdAt || '-')}</td>
              <td><Link to={`/orders/${o.id}`}>Ouvrir</Link></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Page>
  );
};

export default Orders;
