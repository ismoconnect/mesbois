import json
import os

path = r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\locales\de\translation.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

data['about'] = {
    "badge": "Europäischer Holzspezialist",
    "title": "Über uns",
    "subtitle": "Ihr zuverlässiger Partner für leistungsstarkes Brennholz und zertifizierte Pellets.",
    "story_title": "Unsere Geschichte",
    "story_text": "Seit unserer Gründung haben wir uns verpflichtet, Brennholz von höchster Qualität anzubieten. Unsere Leidenschaft für den Wald und unser Respekt für die Umwelt treiben uns an, ausschließlich Harthölzer (Eiche, Buche, Esche) aus nachhaltig bewirtschafteten Wäldern auszuwählen.",
    "mission_title": "Unsere Mission",
    "mission_text": "Holzheizung leistungsstark, wirtschaftlich und umweltfreundlich zu machen. Jedes angebotene Produkt entspricht strengen Trocknungsstandards (Feuchtigkeitsgehalt unter 20%), um eine maximale Heizleistung und eine saubere Verbrennung zu gewährleisten.",
    "engagement_title": "Unser Kundenversprechen",
    "engagement_text": "Ihre absolute Zufriedenheit ist unsere oberste Priorität. Wir bieten kompetente Beratung, transparente Preise ohne Zwischenhändler und direkte Lieferung unter Ihren Unterstand dank unserer mit geländegängigen Staplern ausgestatteten LKWs.",
    "values_title": "Unsere Grundwerte",
    "val1_title": "Umwelt",
    "val1_desc": "100% umweltbewusstes Holz, PEFC / FSC zertifiziert aus nachhaltigen Wäldern.",
    "val2_title": "Zertifizierte Qualität",
    "val2_desc": "Strenge Feuchtigkeitskontrollen (< 20%) und DINplus / ENplus Standards.",
    "val3_title": "Staplerlieferung",
    "val3_desc": "Genaue Abstellung unter Ihrem Unterstand, Garage oder Hof durch Geländestapler.",
    "val4_title": "Kundennähe",
    "val4_desc": "Ein menschliches und verfügbares Team, das Sie 6 Tage die Woche berät.",
    "val5_title": "Exzellenz",
    "val5_desc": "Optimale Wärmeleistung zum Schutz Ihrer Geräte.",
    "val6_title": "Transparenz",
    "val6_desc": "Nettopreise, verifizierte reale Raummetervolumen und klare Rückverfolgbarkeit.",
    "stats_title": "Unser Engagement in Zahlen",
    "stats_subtitle": "Anerkannte Expertise im Dienst von Privat- und Geschäftskunden.",
    "stat1": "Jahre Erfahrung",
    "stat2": "Zufriedene Kunden",
    "stat3": "Feuchtigkeitsgehalt",
    "stat4": "Zertifiziertes Holz"
}

data['contact'] = {
    "success": "Nachricht erfolgreich gesendet! Unser Team wird Ihnen innerhalb von 2 Stunden antworten.",
    "error": "Fehler beim Senden der Nachricht",
    "badge": "Kundenservice & Kostenloses Angebot",
    "title": "Kontaktieren Sie unser Team",
    "subtitle": "Eine Frage zu einem Produkt, Ihrer Lieferung oder einem individuellen Angebot? Wir antworten schnell.",
    "info_title": "Unsere direkten Kontaktdaten",
    "phone": "Direktwahl",
    "email": "Support-Email",
    "address": "Lager & Hauptsitz",
    "hours": "Öffnungszeiten",
    "hours_week": "Mo – Fr: 8:30 – 18:30 Uhr",
    "hours_weekend": "Samstag: 9:00 – 17:00 Uhr (Sonntag geschlossen)",
    "guarantee": "Garantierte Antwort innerhalb von 2 Geschäftsstunden durch unsere Berater.",
    "form_title": "Senden Sie uns eine Nachricht",
    "form_firstname": "Vorname *",
    "form_firstname_placeholder": "Ihr Vorname",
    "form_lastname": "Nachname *",
    "form_lastname_placeholder": "Ihr Nachname",
    "form_email": "Email *",
    "form_email_placeholder": "name@beispiel.de",
    "form_phone": "Telefon",
    "form_phone_placeholder": "0170 12 34 567",
    "form_subject": "Betreff *",
    "form_subject_placeholder": "Z.B.: Lieferanfrage, Angebot für Raumraum...",
    "form_message": "Ihre Nachricht *",
    "form_message_placeholder": "Detaillieren Sie Ihre Anfrage oder geben Sie Ihre Lieferpostleitzahl an...",
    "sending": "Wird gesendet...",
    "send": "Meine Nachricht senden",
    "delivery_title": "Zone für direkte Unterstands-Lieferung",
    "delivery_desc": "LKW mit Geländestapler, um Ihre Paletten genau dort abzustellen, wo Sie möchten.",
    "delivery_badge1": "Geländestapler",
    "delivery_badge2": "100% garantiert"
}

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Success')
