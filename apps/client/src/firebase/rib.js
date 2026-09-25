import { doc, getDoc } from 'firebase/firestore';
import { db } from './config';

// Returns { holder, iban, bic, bank } from collection 'rib' doc 'default'.
export async function getRIB() {
  const defaultWhatsApp = process.env.REACT_APP_WHATSAPP_NUMBER || '+49 1633637236';
  try {
    const ref = doc(db, 'rib', 'default');
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      return { 
        success: true, 
        data: {
          holder: process.env.REACT_APP_RIB_HOLDER || '',
          iban: process.env.REACT_APP_RIB_IBAN || '',
          bic: process.env.REACT_APP_RIB_BIC || '',
          bank: process.env.REACT_APP_RIB_BANK || '',
          enabled: true,
          whatsappNumber: defaultWhatsApp
        } 
      };
    }
    const data = snap.data() || {};
    const isRibEnabled = data.enabled === true || data.enabled === 'true';
    return {
      success: true,
      data: {
        holder: data.holder || process.env.REACT_APP_RIB_HOLDER || '',
        iban: data.iban || process.env.REACT_APP_RIB_IBAN || '',
        bic: data.bic || process.env.REACT_APP_RIB_BIC || '',
        bank: data.bank || process.env.REACT_APP_RIB_BANK || '',
        enabled: isRibEnabled,
        whatsappNumber: data.whatsappNumber || defaultWhatsApp
      }
    };
  } catch (e) {
    return { 
      success: true, 
      data: {
        holder: process.env.REACT_APP_RIB_HOLDER || '',
        iban: process.env.REACT_APP_RIB_IBAN || '',
        bic: process.env.REACT_APP_RIB_BIC || '',
        bank: process.env.REACT_APP_RIB_BANK || '',
        enabled: false,
        whatsappNumber: defaultWhatsApp
      },
      error: e?.message 
    };
  }
}
