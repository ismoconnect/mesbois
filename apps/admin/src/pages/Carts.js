import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { db } from '../firebase/config';

const Page = styled.div`display: grid; gap: 16px;`;
const Header = styled.div`display: flex; align-items: center; justify-content: space-between;`;
const Title = styled.h1`margin: 0; color: #2c5530;`;
const Table = styled.table`
  width: 100%; border-collapse: collapse; background: #fff; border: 1px solid #e6eae7; border-radius: 12px; overflow: hidden;
  th, td { padding: 12px; text-align: left; }
  thead { background: #f5f7f6; }
  tbody tr + tr td { border-top: 1px dashed #e6eae7; }
  a { color: #2c5530; font-weight: 700; text-decoration: none; }
`;

const Carts = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const col = collection(db, 'carts');
        const qr = query(col, orderBy('updatedAt','desc'), limit(100));
        const snap = await getDocs(qr);
        setRows(snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) })));
      } finally { setLoading(false); }
    };
    run();
  }, []);

  return (
    <Page>
      <Header>
        <Title>Paniers</Title>
      </Header>
      <Table>
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Articles</th>
            <th>Modifié</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {loading ? <tr><td colSpan="4">Chargement…</td></tr> : rows.length === 0 ? (
            <tr><td colSpan="4">Aucun panier</td></tr>
          ) : rows.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{(c.items||[]).length}</td>
              <td>{c.updatedAt?.toDate ? c.updatedAt.toDate().toLocaleString() : (c.updatedAt || '-')}</td>
              <td><Link to={`/carts/${c.id}`}>Ouvrir</Link></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Page>
  );
};

export default Carts;
