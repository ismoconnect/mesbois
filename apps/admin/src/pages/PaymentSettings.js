import React, { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Field = ({ label, value, onChange, type = 'text', textarea }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ fontWeight: 700, color: '#2c5530', marginBottom: 6 }}>{label}</div>
    {textarea ? (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', minHeight: 100, padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: 10, border: '1px solid #e5e7eb', borderRadius: 8 }}
      />
    )}
  </div>
);

export default function PaymentSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [rib, setRib] = useState({ holder: '', iban: '', bic: '', bank: '' });
  const [pp, setPp] = useState({ email: '', instructions: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    (async () => {
      const useDirect = (process.env.NODE_ENV === 'development') || (String(process.env.REACT_APP_USE_DIRECT_FIRESTORE || '').trim() === 'true');
      try {
        if (useDirect) {
          const [ribSnap, ppSnap] = await Promise.all([
            getDoc(doc(db, 'rib', 'default')),
            getDoc(doc(db, 'paypal', 'default')),
          ]);
          if (ribSnap.exists()) {
            const d = ribSnap.data() || {};
            setRib({ holder: d.holder || '', iban: d.iban || '', bic: d.bic || '', bank: d.bank || '' });
          }
          if (ppSnap.exists()) {
            const d = ppSnap.data() || {};
            setPp({ email: d.email || '', instructions: d.instructions || '' });
          }
        } else {
          const res = await fetch('/api/settings-payments', {
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_ADMIN_API_TOKEN || ''}`,
            }
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data = await res.json();
          const r = data.rib || {};
          const p = data.paypal || {};
          setRib({ holder: r.holder || '', iban: r.iban || '', bic: r.bic || '', bank: r.bank || '' });
          setPp({ email: p.email || '', instructions: p.instructions || '' });
        }
      } catch (e) {
        setMessage(`Erreur de chargement: ${e?.message || e}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setMessage('');
    try {
      const useDirect = (process.env.NODE_ENV === 'development') || (String(process.env.REACT_APP_USE_DIRECT_FIRESTORE || '').trim() === 'true');
      if (useDirect) {
        await Promise.all([
          setDoc(doc(db, 'rib', 'default'), rib, { merge: true }),
          setDoc(doc(db, 'paypal', 'default'), pp, { merge: true }),
        ]);
        setMessage('Enregistré.');
      } else {
        const res = await fetch('/api/settings-payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_ADMIN_API_TOKEN || ''}`,
          },
          body: JSON.stringify({ rib, paypal: pp })
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setMessage('Enregistré.');
      }
    } catch (e) {
      setMessage(`Échec de l\'enregistrement: ${e?.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Chargement…</div>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ margin: 0, color: '#2c5530' }}>Moyens de paiement</h1>
      <p style={{ color: '#6b7280' }}>Modifiez ici les coordonnées RIB et PayPal affichées côté client.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 12, boxShadow: '0 6px 24px rgba(0,0,0,0.05)', padding: 16 }}>
          <h2 style={{ marginTop: 0, color: '#2c5530' }}>RIB</h2>
          <Field label="Titulaire" value={rib.holder} onChange={(v)=> setRib({ ...rib, holder: v })} />
          <Field label="Banque" value={rib.bank} onChange={(v)=> setRib({ ...rib, bank: v })} />
          <Field label="IBAN" value={rib.iban} onChange={(v)=> setRib({ ...rib, iban: v })} />
          <Field label="BIC" value={rib.bic} onChange={(v)=> setRib({ ...rib, bic: v })} />
        </div>
        <div style={{ background: '#fff', border: '1px solid #eef2f7', borderRadius: 12, boxShadow: '0 6px 24px rgba(0,0,0,0.05)', padding: 16 }}>
          <h2 style={{ marginTop: 0, color: '#2c5530' }}>PayPal</h2>
          <Field label="Email PayPal" value={pp.email} onChange={(v)=> setPp({ ...pp, email: v })} />
          <Field label="Instructions" value={pp.instructions} onChange={(v)=> setPp({ ...pp, instructions: v })} textarea />
        </div>
      </div>

      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={save} disabled={saving} style={{ background:'#2c5530', color:'#fff', border:'none', borderRadius:8, padding:'10px 14px', fontWeight:800, cursor:'pointer' }}>
          {saving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
        {message && <span style={{ color: message.startsWith('Échec') ? '#b91c1c' : '#14532d', fontWeight: 700 }}>{message}</span>}
      </div>
    </div>
  );
}
