import json

path = r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\locales\de\translation.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'cart' not in data:
    data['cart'] = {}
data['cart'].update({
    "drawer_title": "Warenkorb",
    "empty_message": "Ihr Warenkorb ist leer.",
    "delete": "Löschen",
    "subtotal": "Zwischensumme",
    "empty": "Warenkorb leeren",
    "continue": "Weiter einkaufen",
    "view": "Warenkorb ansehen",
    "checkout": "Bestellen"
})

if 'footer' not in data:
    data['footer'] = {}
data['footer']['humidity'] = "Feuchtigkeit < 20%"

data['checkout'].update({
    "title_finalize": "Bestellung abschließen",
    "guest_buy": "Schnellkauf als Gast.",
    "already_client": "Bereits Kunde?",
    "login": "Anmelden",
    "step1_title": "Kontaktdaten & Lieferadresse",
    "firstname": "Vorname",
    "lastname": "Nachname",
    "email": "E-Mail-Adresse",
    "phone": "Telefon",
    "address": "Vollständige Lieferadresse",
    "street_ph": "Hausnummer und Straßenname",
    "address_comp": "Adresszusatz",
    "zip": "Postleitzahl",
    "city": "Stadt",
    "country": "Land",
    "driver_instruction": "Zusätzliche Anweisung für den Fahrer (optional)",
    "client_account": "Kundenkonto",
    "summary_title": "Bestellübersicht",
    "promo_code": "RABATTCODE",
    "apply": "Anwenden",
    "subtotal_items": "Zwischensumme Artikel",
    "delivery_offroad": "Geländelieferung unter Unterstand",
    "total_tax": "Gesamtbetrag inkl. MwSt.",
    "accept": "Ich akzeptiere die ",
    "terms": "Allgemeinen Geschäftsbedingungen",
    "and": " und die ",
    "privacy": "Datenschutzerklärung",
    "confirm_order": "Bestellung bestätigen (",
    "delivery_desc": "Direkte Lieferung unter den Unterstand per LKW mit Stapler",
    "bank_secure": "Sichere Banküberweisung ohne Übermittlung von Bankdaten",
    "france": "Frankreich",
    "germany": "Deutschland",
    "belgium": "Belgien",
    "luxembourg": "Luxemburg",
    "switzerland": "Schweiz",
    "austria": "Österreich"
})

if 'bank_transfer' not in data:
    data['bank_transfer'] = {}
data['bank_transfer'].update({
    "success_title": "Bestellung erfolgreich registriert",
    "success_desc": "Ihre Reservierung für Brennholz wurde in unserem System bestätigt.",
    "order_ref": "Bestell-Nr.: ",
    "bank_details": "Bankdaten für Ihre Überweisung",
    "order_transfer": "Bitte beauftragen Sie Ihre Überweisung für den Versand",
    "pro_account": "Geschäftskonto Verifiziert",
    "tip1": "Schneller Tipp: Bevorzugen Sie eine ",
    "tip_bold": "Echtzeitüberweisung",
    "tip2": " für eine sofortige Vorbereitung im Lager.",
    "account_holder": "KONTOINHABER",
    "copy": "Kopieren",
    "copy_iban": "IBAN kopieren",
    "bank": "BANK",
    "iban": "IBAN (ZAHLUNGSKONTO)",
    "bic": "BIC / SWIFT",
    "reference": "VERWENDUNGSZWECK (PFLICHTFELD)",
    "transfer_done": "Überweisung getätigt?",
    "whatsapp_desc": "Senden Sie uns Ihren Beleg über WhatsApp Pro, um die priorisierte Vorbereitung auszulösen.",
    "send_whatsapp": "Auf WhatsApp senden",
    "order_summary": "Bestellübersicht"
})

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Success')
