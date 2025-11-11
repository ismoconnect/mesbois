import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: #2c5530;
  margin: 0 0 16px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e6eae7;
  padding: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
`;

const Label = styled.label`
  font-weight: 700;
  color: #2c5530;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
`;

const Preview = styled.div`
  height: 120px;
  border: 1px dashed #e0e0e0;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #f8f9fa;
`;

const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 16px;
`;

const Button = styled.button`
  background: #2c5530;
  color: #fff;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
`;

const Secondary = styled(Button)`
  background: #e6eae7;
  color: #2c5530;
`;

const AdminImages = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    bois: '',
    accessoires: '',
    buches_densifiees: '',
    pellets: '',
    poeles: ''
  });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const ref = doc(db, 'settings', 'home');
        const snap = await getDoc(ref);
        if (active) {
          if (snap.exists()) {
            const data = snap.data() || {};
            const ci = data.categoryImages || {};
            setValues({
              bois: ci.bois || '',
              accessoires: ci.accessoires || '',
              buches_densifiees: ci.buches_densifiees || '',
              pellets: ci.pellets || '',
              poeles: ci.poeles || ''
            });
          }
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  const update = (k, v) => setValues(s => ({ ...s, [k]: v }));

  const save = async () => {
    try {
      setSaving(true);
      const ref = doc(db, 'settings', 'home');
      await setDoc(ref, { categoryImages: { ...values }, updatedAt: new Date() }, { merge: true });
      setSaving(false);
      alert('Images enregistrées');
    } catch (e) {
      setSaving(false);
      alert('Erreur lors de la sauvegarde');
    }
  };

  if (loading) return <Container>Chargement…</Container>;

  const fields = [
    { key: 'bois', label: 'Bois de chauffage' },
    { key: 'accessoires', label: 'Accessoires' },
    { key: 'buches_densifiees', label: 'Bûches densifiées' },
    { key: 'pellets', label: 'Pellets' },
    { key: 'poeles', label: 'Poêles' }
  ];

  return (
    <Container>
      <Title>Administration des images</Title>
      <Card>
        <Grid>
          {fields.map(f => (
            <Field key={f.key}>
              <Label>{f.label}</Label>
              <Input
                value={values[f.key]}
                onChange={e => update(f.key, e.target.value)}
                placeholder="URL Cloudinary (secure_url)"
              />
              <Preview>
                {values[f.key] ? (
                  <Img src={values[f.key]} alt={f.label} onError={(e) => { e.currentTarget.src = '/placeholder-wood.jpg'; }} />
                ) : (
                  <span>Aucune image</span>
                )}
              </Preview>
            </Field>
          ))}
        </Grid>
        <Actions>
          <Secondary type="button" onClick={() => window.history.back()}>Annuler</Secondary>
          <Button type="button" onClick={save} disabled={saving}>{saving ? 'Enregistrement…' : 'Enregistrer'}</Button>
        </Actions>
      </Card>
    </Container>
  );
};

export default AdminImages;
