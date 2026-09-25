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

  const [rib, setRib] = useState({ 
    holder: '', 
    iban: '', 
    bic: '', 
    bank: '',
    enabled: true,
    whatsappNumber: '+49 1633637236'
  });
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
            setRib({ 
              holder: d.holder || '', 
              iban: d.iban || '', 
              bic: d.bic || '', 
              bank: d.bank || '',
              enabled: (d.enabled === true || d.enabled === 'true'),
              whatsappNumber: d.whatsappNumber || '+49 1633637236'
            });
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
          setRib({ 
            holder: r.holder || '', 
            iban: r.iban || '', 
            bic: r.bic || '', 
            bank: r.bank || '',
            enabled: (r.enabled === true || r.enabled === 'true'),
            whatsappNumber: r.whatsappNumber || '+49 1633637236'
          });
          setPp({ email: p.email || '', instructions: p.instructions || '' });
        }
      } catch (e) {
        setMessage(`Erreur de chargement: ${e?.message || e}`);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const toggleRib = async () => {
    const nextState = !rib.enabled;
    setRib(prev => ({ ...prev, enabled: nextState }));
    try {
      const useDirect = (process.env.NODE_ENV === 'development') || (String(process.env.REACT_APP_USE_DIRECT_FIRESTORE || '').trim() === 'true');
      if (useDirect) {
        await setDoc(doc(db, 'rib', 'default'), { enabled: nextState }, { merge: true });
      } else {
        await fetch('/api/settings-payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.REACT_APP_ADMIN_API_TOKEN || ''}`,
          },
          body: JSON.stringify({ rib: { ...rib, enabled: nextState }, paypal: pp })
        });
      }
      setMessage(nextState ? '✅ RIB public activé et synchronisé.' : '🟡 Mode WhatsApp Pro activé (RIB masqué sur le site).');
    } catch (err) {
      setMessage(`Erreur de basculement: ${err?.message || err}`);
    }
  };

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
        setMessage('Enregistré avec succès dans Firestore.');
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
        setMessage('Enregistré avec succès.');
      }
    } catch (e) {
      setMessage(`Échec de l'enregistrement: ${e?.message || e}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Chargement…</div>;

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: '0 auto' }}>
      <h1 style={{ margin: '0 0 6px 0', color: '#2c5530', fontSize: 26 }}>Moyens de paiement & WhatsApp Pro</h1>
      <p style={{ color: '#6b7280', marginTop: 0, marginBottom: 24 }}>
        Configurez ici la stratégie d'encaissement, les coordonnées RIB publiques ou le mode WhatsApp Pro pour les commandes clients et invités.
      </p>

      {/* Switch Toggle pour activer/désactiver le RIB public */}
      <div style={{
        background: rib.enabled ? '#f0fdf4' : '#fffbeb',
        border: `2px solid ${rib.enabled ? '#86efac' : '#fcd34d'}`,
        borderRadius: 14,
        padding: '18px 22px',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>{rib.enabled ? '🟢' : '🟡'}</span>
            <span style={{ fontWeight: 800, fontSize: 17, color: rib.enabled ? '#166534' : '#92400e' }}>
              {rib.enabled ? "RIB Public Activé (Cas 1)" : "Mode WhatsApp Pro Direct - RIB Masqué (Cas 2)"}
            </span>
          </div>
          <p style={{ margin: '8px 0 0 0', fontSize: 13.5, color: '#374151', lineHeight: 1.5 }}>
            {rib.enabled ? (
              <>
                <strong>Cas 1 :</strong> Vos coordonnées bancaires (IBAN, BIC, Titulaire) sont affichées directement aux clients et invités sur la page de confirmation de commande, avec boutons de copie en 1 clic et option WhatsApp Pro.
              </>
            ) : (
              <>
                <strong>Cas 2 (Recommandé) :</strong> Le RIB est masqué sur le site. Les acheteurs (invités et inscrits) sont automatiquement orientés vers votre <strong>WhatsApp Pro</strong> avec le récapitulatif complet de leur commande afin que vous leur transmettiez votre RIB personnellement dans la conversation après validation d'accès.
              </>
            )}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleRib}
          style={{
            background: rib.enabled ? '#15803d' : '#d97706',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '12px 20px',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap'
          }}
        >
          {rib.enabled ? 'Désactiver le RIB (Passer en mode WhatsApp)' : 'Activer le RIB public'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24 }}>
        {/* Paramètres Virement & WhatsApp */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>🏦</span>
            <h2 style={{ margin: 0, color: '#2c5530', fontSize: 18 }}>Coordonnées Bancaires & WhatsApp Pro</h2>
          </div>

          <Field 
            label="Numéro WhatsApp Pro (format international avec +, ex: +49 1633637236)" 
            value={rib.whatsappNumber} 
            onChange={(v)=> setRib({ ...rib, whatsappNumber: v })} 
          />
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: -8, marginBottom: 16 }}>
            Ce numéro recevra les commandes préremplies de vos clients lorsque le RIB est masqué ou pour l'assistance.
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f3f4f6', margin: '18px 0' }} />

          <Field label="Titulaire du compte" value={rib.holder} onChange={(v)=> setRib({ ...rib, holder: v })} />
          <Field label="Banque" value={rib.bank} onChange={(v)=> setRib({ ...rib, bank: v })} />
          <Field label="IBAN" value={rib.iban} onChange={(v)=> setRib({ ...rib, iban: v })} />
          <Field label="BIC / SWIFT" value={rib.bic} onChange={(v)=> setRib({ ...rib, bic: v })} />
        </div>

        {/* Paramètres PayPal */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 14, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', padding: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{ fontSize: 20 }}>💳</span>
            <h2 style={{ margin: 0, color: '#2c5530', fontSize: 18 }}>Paiement PayPal</h2>
          </div>
          <Field label="Email du compte PayPal" value={pp.email} onChange={(v)=> setPp({ ...pp, email: v })} />
          <Field label="Instructions à afficher aux clients" value={pp.instructions} onChange={(v)=> setPp({ ...pp, instructions: v })} textarea />
        </div>
      </div>

      <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <button 
          onClick={save} 
          disabled={saving} 
          style={{ 
            background:'#2c5530', 
            color:'#fff', 
            border:'none', 
            borderRadius:10, 
            padding:'13px 28px', 
            fontSize: 15,
            fontWeight:800, 
            cursor:'pointer',
            boxShadow: '0 4px 12px rgba(44,85,48,0.25)'
          }}
        >
          {saving ? 'Enregistrement en cours…' : 'Enregistrer les modifications'}
        </button>
        {message && (
          <span style={{ 
            color: message.startsWith('Échec') ? '#b91c1c' : '#15803d', 
            fontWeight: 700,
            fontSize: 14,
            padding: '8px 14px',
            background: message.startsWith('Échec') ? '#fef2f2' : '#f0fdf4',
            borderRadius: 8,
            border: `1px solid ${message.startsWith('Échec') ? '#fecaca' : '#bbf7d0'}`
          }}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
}

