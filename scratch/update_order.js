const fs = require('fs');

let content = fs.readFileSync('apps/client/src/pages/OrderDetail.js', 'utf8');

if (!content.includes('useTranslation')) {
  content = content.replace("import { useParams, useNavigate } from 'react-router-dom';", "import { useParams, useNavigate } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';");
}

if (!content.includes('const { t } = useTranslation();')) {
  content = content.replace('const OrderDetail = () => {', 'const OrderDetail = () => {\n  const { t } = useTranslation();');
}

if (!content.includes('const getStatusText = (status, t) => {')) {
  content = content.replace('const getStatusText = (status) => {', 'const getStatusText = (status, t) => {');
  content = content.replace(/getStatusText\(order\.status\)/g, 'getStatusText(order.status, t)');
}

content = content.replace(/'Warten auf Bearbeitung'/g, "t('orderDetail.status_pending', 'En attente')");
content = content.replace(/'In Bearbeitung'/g, "t('orderDetail.status_processing', 'En cours de traitement')");
content = content.replace(/'Versandt'/g, "t('orderDetail.status_shipped', 'Expédiée')");
content = content.replace(/'Geliefert'/g, "t('orderDetail.status_delivered', 'Livrée')");
content = content.replace(/'Storniert'/g, "t('orderDetail.status_cancelled', 'Annulée')");
content = content.replace(/'Unbekannter Status'/g, "t('orderDetail.status_unknown', 'Statut inconnu')");

const replacements = {
  "'Fehler beim Laden der Bestellung'": 't("orderDetail.error_loading", "Erreur lors du chargement de la commande")',
  "'Stornierung durch Kunden'": 't("orderDetail.cancel_by_customer", "Annulation par le client")',
  "'Bestellung storniert'": 't("orderDetail.order_cancelled_title", "Commande annulée")',
  "'Ihre Bestellung wurde erfolgreich storniert.'": 't("orderDetail.order_cancelled_msg", "Votre commande a été annulée avec succès.")',
  "'Fehler beim Stornieren'": 't("orderDetail.cancel_error_title", "Erreur lors de l\'annulation")',
  "'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'": 't("orderDetail.error_try_again", "Une erreur s\'est produite. Veuillez réessayer.")',
  '>Lade Bestellung...<': '>{t("orderDetail.loading", "Chargement de la commande...")}<',
  '>Fehler<': '>{t("orderDetail.error_title", "Erreur")}<',
  '>Bestellung nicht gefunden<': '>{t("orderDetail.not_found_title", "Commande introuvable")}<',
  '>Diese Bestellung existiert nicht oder Sie haben keinen Zugriff.<': '>{t("orderDetail.not_found_desc", "Cette commande n\'existe pas ou vous n\'y avez pas accès.")}<',
  'Bestellung #': '{t("orderDetail.order_number", "Commande #")}',
  '>Bestelldatum<': '>{t("orderDetail.order_date", "Date de commande")}<',
  '>Bestellnummer<': '>{t("orderDetail.order_number_title", "Numéro de commande")}<',
  '>Versandart<': '>{t("orderDetail.shipping_method", "Mode de livraison")}<',
  "'Express-Lieferung'": 't("orderDetail.express_delivery", "Livraison Express")',
  "'Standard-Lieferung'": 't("orderDetail.standard_delivery", "Livraison Standard")',
  'Menge: ': '{t("orderDetail.quantity", "Quantité : ")}',
  '€ / Einheit': '{t("orderDetail.unit_price", "€ / unité")}',
  '>Zwischensumme<': '>{t("orderDetail.subtotal", "Sous-total")}<',
  '>Versand<': '>{t("orderDetail.shipping_cost", "Frais de port")}<',
  '>Gesamt<': '>{t("orderDetail.total", "Total")}<',
  '>Empfänger<': '>{t("orderDetail.recipient", "Destinataire")}<',
  '>Adresse<': '>{t("orderDetail.address", "Adresse")}<',
  '>E-Mail<': '>{t("orderDetail.email", "E-mail")}<',
  "'Nicht angegeben'": 't("orderDetail.not_provided", "Non renseigné")',
  '>Telefon<': '>{t("orderDetail.phone", "Téléphone")}<',
  '>Zahlung<': '>{t("orderDetail.payment", "Paiement")}<',
  "'Kreditkarte'": 't("orderDetail.credit_card", "Carte bancaire")',
  "'PayPal'": 't("orderDetail.paypal", "PayPal")',
  "'Stornierung...'": 't("orderDetail.cancelling", "Annulation...")',
  "'Bestellung stornieren'": 't("orderDetail.cancel_order", "Annuler la commande")',
  '>Stornierung bestätigen<': '>{t("orderDetail.confirm_cancel", "Confirmer l\'annulation")}<',
  '>Sind Sie sicher, dass Sie diese Bestellung stornieren möchten?<': '>{t("orderDetail.confirm_cancel_desc", "Êtes-vous sûr de vouloir annuler cette commande ?")}<',
  "'OK'": 't("orderDetail.ok", "OK")'
};

for (const [k, v] of Object.entries(replacements)) {
  content = content.replace(new RegExp(k.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&'), 'g'), v);
}

content = content.replace(/>\s*Bestellte Artikel\s*</g, '>{t("orderDetail.ordered_items", "Articles commandés")}<');
content = content.replace(/>\s*Zusammenfassung\s*</g, '>{t("orderDetail.summary", "Résumé")}<');
content = content.replace(/>\s*Lieferung\s*</g, '>{t("orderDetail.delivery", "Livraison")}<');
content = content.replace(/>\s*Lieferinformationen\s*</g, '>{t("orderDetail.delivery_info", "Informations de livraison")}<');
content = content.replace(/>\s*Lieferadresse\s*</g, '>{t("orderDetail.delivery_address", "Adresse de livraison")}<');
content = content.replace(/>\s*Kontakt\s*</g, '>{t("orderDetail.contact", "Contact")}<');
content = content.replace(/>\s*Zahlungsmethode\s*</g, '>{t("orderDetail.payment_method", "Moyen de paiement")}<');
content = content.replace(/>\s*Anmerkungen\s*</g, '>{t("orderDetail.notes", "Remarques")}<');
content = content.replace(/>\s*Abbrechen\s*</g, '>{t("orderDetail.cancel", "Annuler")}<');
content = content.replace(/>\s*Zurück\s*</g, '>{t("orderDetail.back", "Retour")}<');
content = content.replace(/>\s*Zurück zu Bestellungen\s*</g, '>{t("orderDetail.back_to_orders", "Retour aux commandes")}<');
content = content.replace(/>\s*Bestellung bezahlen\s*</g, '>{t("orderDetail.pay_order", "Payer la commande")}<');

fs.writeFileSync('apps/client/src/pages/OrderDetail.js', content, 'utf8');
console.log('Done Node');
