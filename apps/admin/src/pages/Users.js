import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const Page = styled.div`
  display: grid;
  gap: 16px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  margin: 0;
  color: #2c5530;
`;

const Search = styled.input`
  width: 320px;
  max-width: 60vw;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  padding: 10px 12px;
  outline: none;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  overflow: hidden;
  th, td { padding: 12px; text-align: left; }
  thead { background: #f5f7f6; }
  tbody tr + tr td { border-top: 1px dashed #e6eae7; }
  a { color: #2c5530; font-weight: 700; text-decoration: none; }
`;

const Users = () => {
  const [qstr, setQstr] = useState('');
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  const run = async () => {
    setLoading(true);
    try {
      const col = collection(db, 'users');
      let qr;
      const trimmed = qstr.trim().toLowerCase();
      if (trimmed) {
        // Simple recherche côté client: on récupère un petit set puis on filtre
        qr = query(col, orderBy('email'), limit(100));
      } else {
        qr = query(col, orderBy('email'), limit(100));
      }
      const snap = await getDocs(qr);
      let list = snap.docs.map(d => ({ id: d.id, ...(d.data()||{}) }));
      if (trimmed) {
        list = list.filter(x => (x.email||'').toLowerCase().includes(trimmed));
      }
      setRows(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { run(); // eslint-disable-next-line
  }, []);

  const filtered = useMemo(() => rows, [rows]);

  return (
    <Page>
      <Header>
        <Title>Utilisateurs</Title>
        <Search
          placeholder="Recherche email"
          value={qstr}
          onChange={e => setQstr(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') run(); }}
        />
      </Header>
      <Table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Dernière connexion</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan="3">Chargement…</td></tr>
          ) : filtered.length === 0 ? (
            <tr><td colSpan="3">Aucun utilisateur</td></tr>
          ) : filtered.map(u => (
            <tr key={u.id}>
              <td>{u.email || '-'}</td>
              <td>{u.lastLoginAt?.toDate ? u.lastLoginAt.toDate().toLocaleString() : (u.lastLoginAt || '-')}</td>
              <td><Link to={`/users/${u.id}`}>Ouvrir</Link></td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Page>
  );
};

export default Users;
