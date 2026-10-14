const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // CORS & method check
  if (req.method !== 'POST') {
    return res.status(200).json({ ok: false, warning: 'Method Not Allowed' });
  }

  try {
    const { orderId, total, items, customer, newUser, lang } = req.body || {};
    if (!customer || !customer.email) {
      return res.status(200).json({ ok: false, warning: 'Missing customer email' });
    }

    const host = (process.env.SMTP_HOST || '').trim();
    const port = Number((process.env.SMTP_PORT || '587').toString().trim());
    const secure = Boolean(
      String(process.env.SMTP_SECURE).trim() === 'true' ||
      process.env.SMTP_SECURE === true ||
      String(process.env.SMTP_PORT || '').trim() === '465' ||
      port === 465
    );
    const smtpUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').trim();

    // Si les clés SMTP ne sont pas encore configurées dans Vercel, on ne crash pas en 500
    if (!host || !smtpUser || !smtpPass) {
      console.warn('⚠️ SMTP non configuré dans les variables d\'environnement Vercel (SMTP_HOST, SMTP_USER, SMTP_PASS). Envoi ignoré en toute sécurité.');
      return res.status(200).json({
        ok: true,
        sent: false,
        warning: 'SMTP environment variables missing. Email notification skipped safely.'
      });
    }

    let transporter;
    try {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: { user: smtpUser, pass: smtpPass },
        tls: { servername: host, rejectUnauthorized: false }
      });
      await transporter.verify();
    } catch (err) {
      console.warn('⚠️ Échec de vérification SMTP:', err && err.message);
      return res.status(200).json({
        ok: true,
        sent: false,
        warning: `SMTP connection failed: ${err && err.message}`
      });
    }

    const isDe = lang === 'de' || (customer.country && customer.country.toLowerCase().includes('allemagne')) || (customer.country && customer.country.toLowerCase().includes('deutschland'));
    const toName = [customer.firstName, customer.lastName].filter(Boolean).join(' ').trim() || (isDe ? 'Kunde' : 'Client');
    const brand = (process.env.FROM_NAME || 'brennholzkaufen').trim();
    const shortId = (orderId || '').toString().replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8);

    const subject = isDe
      ? `${brand} — Bestellbestätigung ${shortId ? `#${shortId}` : ''}`
      : `${brand} — Confirmation de commande ${shortId ? `#${shortId}` : ''}`;

    const itemLines = Array.isArray(items)
      ? items.map((it) => `- ${it.name || (isDe ? 'Artikel' : 'Article')} x${it.quantity || 1} — ${(Number(it.price) || 0).toFixed(2)}€`).join('\n')
      : '';

    const addrParts = [customer.address, customer.postalCode, customer.city, customer.country].filter(Boolean);
    const phone = customer.phone ? `${isDe ? 'Telefon' : 'Téléphone'}: ${customer.phone}` : '';

    const intro = isDe
      ? (newUser ? `Vielen Dank für Ihre Bestellung und herzlich willkommen bei ${brand}.` : `Vielen Dank für Ihre Bestellung und Ihr Vertrauen.`)
      : (newUser ? `Merci pour votre commande et bienvenue chez ${brand}.` : `Merci pour votre commande et votre fidélité.`);

    const deliveryNote = isDe
      ? `Wir informieren Sie per E-Mail, sobald Ihre Ware versandbereit ist. Die Anlieferung erfolgt mit LKW und geländegängigem Mitnahmestapler direkt an Ihren Wunschort. Für Rückfragen antworten Sie einfach auf diese E-Mail.`
      : `Nous vous informerons par e-mail dès l'expédition. Délais de livraison estimés : 2 à 5 jours ouvrés. Livraison sous abri avec chariot élévateur tout-terrain. Pour toute question, répondez à cet e-mail.`;

    const text = [
      `${isDe ? 'Hallo' : 'Bonjour'} ${toName},`,
      '',
      intro,
      shortId ? `${isDe ? 'Bestellnummer' : 'Numéro de commande'}: #${shortId}` : '',
      '',
      itemLines ? `${isDe ? 'Bestelldetails' : 'Détails de votre commande'} :` : '',
      itemLines,
      '',
      `${isDe ? 'Gesamtbetrag inkl. MwSt.' : 'Total TTC'}: ${(Number(total) || 0).toFixed(2)}€`,
      addrParts.length ? `${isDe ? 'Lieferadresse' : 'Adresse de livraison'} :` : '',
      addrParts.length ? addrParts.join(', ') : '',
      phone,
      '',
      deliveryNote,
      '',
      isDe ? 'Mit freundlichen Grüßen,' : 'Cordialement,',
      `${brand} Kundenservice`
    ].filter(Boolean).join('\n');

    const rowsHtml = Array.isArray(items)
      ? items.map((it) => {
          const q = Number(it.quantity) || 1;
          const p = Number(it.price) || 0;
          return `
            <tr>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;font-weight:600;">${(it.name || (isDe ? 'Artikel' : 'Article'))}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:center;">${q}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee;text-align:right;font-weight:700;">${p.toFixed(2)}€</td>
            </tr>`;
        }).join('')
      : '';

    const html = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;background:#f8fafc;padding:32px 16px;">
        <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;box-shadow:0 6px 24px rgba(0,0,0,0.06);border:1px solid #e2e8f0;overflow:hidden;">
          <div style="padding:28px 24px 20px;background:#142618;color:#ffffff;text-align:center;">
            <div style="font-size:22px;font-weight:800;letter-spacing:0.5px;">${brand}</div>
            <h1 style="margin:10px 0 4px;font-size:18px;font-weight:700;color:#f1f5f9;">${subject}</h1>
            <p style="margin:0;color:#cbd5e1;font-size:13.5px;">${intro}</p>
          </div>
          <div style="padding:24px;">
            <h2 style="margin:0 0 14px;font-size:15px;color:#142618;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">
              ${isDe ? 'Ihre Bestellübersicht' : 'Détails de votre commande'}
            </h2>
            <table cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;font-size:13.5px;margin-bottom:20px;">
              <thead>
                <tr style="background:#f8fafc;">
                  <th align="left" style="padding:8px 12px;border-bottom:2px solid #e2e8f0;color:#64748b;font-size:12px;text-transform:uppercase;">${isDe ? 'Artikel' : 'Article'}</th>
                  <th align="center" style="padding:8px 12px;border-bottom:2px solid #e2e8f0;color:#64748b;font-size:12px;text-transform:uppercase;">${isDe ? 'Menge' : 'Qté'}</th>
                  <th align="right" style="padding:8px 12px;border-bottom:2px solid #e2e8f0;color:#64748b;font-size:12px;text-transform:uppercase;">${isDe ? 'Preis' : 'Prix'}</th>
                </tr>
              </thead>
              <tbody>
                ${rowsHtml}
                <tr style="background:#f0fdf4;">
                  <td colspan="2" style="padding:14px 12px;text-align:right;font-weight:800;color:#166534;font-size:15px;">${isDe ? 'Gesamtbetrag inkl. MwSt.' : 'Total TTC'}</td>
                  <td style="padding:14px 12px;text-align:right;font-weight:800;color:#166534;font-size:16px;">${(Number(total) || 0).toFixed(2)}€</td>
                </tr>
              </tbody>
            </table>

            ${(addrParts.length || phone) ? `
              <div style="margin-top:16px;padding:14px;border:1px solid #e2e8f0;border-radius:10px;background:#f8fafc;">
                <div style="font-size:13px;color:#142618;font-weight:700;margin-bottom:4px;text-transform:uppercase;">
                  ${isDe ? 'Lieferanschrift' : 'Adresse de livraison'}
                </div>
                <div style="font-size:13.5px;color:#334155;">${addrParts.join(', ')}</div>
                ${phone ? `<div style="font-size:13px;color:#64748b;margin-top:4px;">${phone}</div>` : ''}
              </div>` : ''}

            <p style="font-size:13.5px;color:#475569;line-height:1.6;margin:22px 0 0;">
              ${deliveryNote}
            </p>
          </div>
          <div style="padding:16px 24px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:12px;color:#64748b;text-align:center;">
            © ${new Date().getFullYear()} ${brand} — ${isDe ? 'Kundenservice & Support' : 'Service Client'}
          </div>
        </div>
      </div>`;

    await transporter.sendMail({
      from: `${brand} <${process.env.FROM_EMAIL || process.env.SMTP_USER}>`,
      to: customer.email,
      bcc: process.env.NOTIFY_EMAIL || undefined,
      subject,
      text,
      html,
    });

    return res.status(200).json({ ok: true, sent: true });
  } catch (e) {
    console.warn('⚠️ order-confirmation safe catch:', e && e.message);
    return res.status(200).json({ ok: true, sent: false, warning: e && e.message });
  }
};
