import json

path = r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\locales\de\translation.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'bank_transfer' not in data:
    data['bank_transfer'] = {}
data['bank_transfer'].update({
    "delivery_address": "Lieferadresse:",
    "delivery_mode": "Liefermethode:",
    "forklift_included": "Geländestapler inklusive",
    "recipient": "Empfänger:",
    "email_conf": "Bestätigungs-E-Mail:",
    "total_to_pay": "Gesamtbetrag:",
    "forklift_to_shelter": "Geländestapler bis zum Unterstand",
    "wood_certified": "Zertifiziertes Holz (< 20%)",
    "support_whatsapp": "Support & WhatsApp 24/7",
    "continue_shopping": "Weiter einkaufen",
    "back_home": "Zurück zur Startseite",
    "email_sent": "Eine Bestätigungs-E-Mail mit diesen Informationen wurde ebenfalls gesendet.",
    "copied_exclam": "Kopiert!",
    "copied": "Kopiert"
})

if 'checkout' not in data:
    data['checkout'] = {}
data['checkout'].update({
    "create_account": "Konto erstellen, um meine Bestellungen zu verfolgen",
    "payment_mode": "Zahlungsmethode",
    "bank_sepa": "Banküberweisung (SEPA)",
    "secure_100": "100% Sicher",
    "safe_desc": "Einfach und sicher: Sie überweisen direkt aus Ihrer Banking-App, ohne jemals Ihre Bankdaten im Internet preiszugeben.",
    "safe_desc2": "Unsere offiziellen Bankdaten (IBAN, BIC und Kontoinhaber) sowie Ihre Bestellnummer werden direkt nach der Bestätigung auf der nächsten Seite angezeigt.",
    "items_reserved": "Ihre Artikel sind sofort für Ihre Lieferung reserviert.",
    "ssl": "SSL 256-bit Verschlüsselung",
    "no_extra_fee": "Keine zusätzlichen Gebühren",
    "wood_certified": "100% ofenfertiges Holz & zertifizierte DINplus Pellets"
})

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Success DE')
