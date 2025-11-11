import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Page = styled.div`
  display: grid;
  gap: 16px;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 16px;
`;

const Title = styled.h1`
  margin: 0;
  color: #2c5530;
`;

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const Field = styled.div`
  display: grid; gap: 6px;
  label { font-weight: 700; color: #2c5530; font-size: 13px; }
  input { border: 2px solid #e0e0e0; border-radius: 8px; padding: 10px 12px; }
`;

const Actions = styled.div`
  margin-top: 12px; display: flex; gap: 10px;
`;

const Button = styled.button`
  background: #2c5530; color: #fff; border: none; padding: 10px 14px; border-radius: 8px; font-weight: 800; cursor: pointer;
`;

const UserDetail = () => {
  const { uid } = useParams();
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        setData(snap.exists() ? { id: uid, ...(snap.data()||{}) } : { id: uid });
      } finally { setLoading(false); }
    };
    run();
  }, [uid]);

  const updateField = (k, v) => setData(s => ({ ...s, [k]: v }));

  const save = async () => {
    try {
      setSaving(true);
      const ref = doc(db, 'users', uid);
      const payload = {
        displayName: data?.displayName || '',
        phone: data?.phone || '',
        address: data?.address || '',
        city: data?.city || '',
        postalCode: data?.postalCode || '',
        country: data?.country || 'France'
      };
      await setDoc(ref, payload, { merge: true });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Page>Chargement…</Page>;
  if (!data) return <Page>Utilisateur introuvable</Page>;

  return (
    <Page>
      <Title>Utilisateur: {data.email || uid}</Title>
      <Card>
        <Grid2>
          <Field>
            <label>Nom complet</label>
            <input value={data.displayName||''} onChange={e=>updateField('displayName', e.target.value)} />
          </Field>
          <Field>
            <label>Téléphone</label>
            <input value={data.phone||''} onChange={e=>updateField('phone', e.target.value)} />
          </Field>
          <Field>
            <label>Adresse</label>
            <input value={data.address||''} onChange={e=>updateField('address', e.target.value)} />
          </Field>
          <Field>
            <label>Ville</label>
            <input value={data.city||''} onChange={e=>updateField('city', e.target.value)} />
          </Field>
          <Field>
            <label>Code postal</label>
            <input value={data.postalCode||''} onChange={e=>updateField('postalCode', e.target.value)} />
          </Field>
          <Field>
            <label>Pays</label>
            <input value={data.country||'France'} onChange={e=>updateField('country', e.target.value)} />
          </Field>
        </Grid2>
        <Actions>
          <Button onClick={save} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </Actions>
      </Card>
    </Page>
  );
};

export default UserDetail;
