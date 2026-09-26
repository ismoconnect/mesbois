import re

with open('apps/client/src/pages/OrderDetail.js', 'r', encoding='utf-8') as f:
    content = f.read()

if 'useTranslation' not in content:
    content = content.replace("import { useParams, useNavigate } from 'react-router-dom';", "import { useParams, useNavigate } from 'react-router-dom';\nimport { useTranslation } from 'react-i18next';")

if 'const { t } = useTranslation();' not in content:
    content = content.replace('const OrderDetail = () => {', 'const OrderDetail = () => {\n  const { t } = useTranslation();')

if 'const getStatusText = (status, t) => {' not in content:
    content = content.replace('const getStatusText = (status) => {', 'const getStatusText = (status, t) => {')
    content = content.replace('getStatusText(order.status)', 'getStatusText(order.status, t)')

content = content.replace("'Warten auf Bearbeitung'", "t('orderDetail.status_pending', 'En attente')")
content = content.replace("'In Bearbeitung'", "t('orderDetail.status_processing', 'En cours de traitement')")
content = content.replace("'Versandt'", "t('orderDetail.status_shipped', 'Expédiée')")
content = content.replace("'Geliefert'", "t('orderDetail.status_delivered', 'Livrée')")
content = content.replace("'Storniert'", "t('orderDetail.status_cancelled', 'Annulée')")
content = content.replace("'Unbekannter Status'", "t('orderDetail.status_unknown', 'Statut inconnu')")

replacements = {
    "'Fehler beim Laden der Bestellung'": 't("orderDetail.error_loading", "Erreur lors du chargement de la commande")',
    "'Stornierung durch Kunden'": 't("orderDetail.cancel_by_customer", "Annulation par le client")',
    "'Bestellung storniert'": 't("orderDetail.order_cancelled_title", "Commande annulée")',
    "'Ihre Bestellung wurde erfolgreich storniert.'": 't("orderDetail.order_cancelled_msg", "Votre commande a été annulée avec succès.")',
    "'Fehler beim Stornieren'": 't("orderDetail.cancel_error_title", "Erreur lors de l\\'annulation")',
    "'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'": 't("orderDetail.error_try_again", "Une erreur s\\'est produite. Veuillez réessayer.")',
    '>Lade Bestellung...<': '>{t("orderDetail.loading", "Chargement de la commande...")}<',
    '>Fehler<': '>{t("orderDetail.error_title", "Erreur")}<',
    '>Bestellung nicht gefunden<': '>{t("orderDetail.not_found_title", "Commande introuvable")}<',
    '>Diese Bestellung existiert nicht oder Sie haben keinen Zugriff.<': '>{t("orderDetail.not_found_desc", "Cette commande n\\'existe pas ou vous n\\'y avez pas accès.")}<',
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
    '>Stornierung bestätigen<': '>{t("orderDetail.confirm_cancel", "Confirmer l\\'annulation")}<',
    '>Sind Sie sicher, dass Sie diese Bestellung stornieren möchten?<': '>{t("orderDetail.confirm_cancel_desc", "Êtes-vous sûr de vouloir annuler cette commande ?")}<',
    "'OK'": 't("orderDetail.ok", "OK")'
}

for k, v in replacements.items():
    content = content.replace(k, v)

content = re.sub(r'>\s*Bestellte Artikel\s*<', '>{t("orderDetail.ordered_items", "Articles commandés")}<', content)
content = re.sub(r'>\s*Zusammenfassung\s*<', '>{t("orderDetail.summary", "Résumé")}<', content)
content = re.sub(r'>\s*Lieferung\s*<', '>{t("orderDetail.delivery", "Livraison")}<', content)
content = re.sub(r'>\s*Lieferinformationen\s*<', '>{t("orderDetail.delivery_info", "Informations de livraison")}<', content)
content = re.sub(r'>\s*Lieferadresse\s*<', '>{t("orderDetail.delivery_address", "Adresse de livraison")}<', content)
content = re.sub(r'>\s*Kontakt\s*<', '>{t("orderDetail.contact", "Contact")}<', content)
content = re.sub(r'>\s*Zahlungsmethode\s*<', '>{t("orderDetail.payment_method", "Moyen de paiement")}<', content)
content = re.sub(r'>\s*Anmerkungen\s*<', '>{t("orderDetail.notes", "Remarques")}<', content)
content = re.sub(r'>\s*Abbrechen\s*<', '>{t("orderDetail.cancel", "Annuler")}<', content)
content = re.sub(r'>\s*Zurück\s*<', '>{t("orderDetail.back", "Retour")}<', content)
content = re.sub(r'>\s*Zurück zu Bestellungen\s*<', '>{t("orderDetail.back_to_orders", "Retour aux commandes")}<', content)
content = re.sub(r'>\s*Bestellung bezahlen\s*<', '>{t("orderDetail.pay_order", "Payer la commande")}<', content)

with open('apps/client/src/pages/OrderDetail.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
