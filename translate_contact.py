import re

with open(r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\pages\Contact.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'useTranslation' not in content:
    content = content.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport { useTranslation } from 'react-i18next';")
    if 'import React from' in content and 'useState' not in content:
        content = content.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from 'react-i18next';")

# Add useTranslation to component
content = content.replace("const Contact = () => {\n", "const Contact = () => {\n  const { t } = useTranslation();\n")

# Translate texts
replacements = {
    "Message envoyé avec succès ! Notre équipe vous répondra sous 2h.": "{t('contact.success', 'Message envoyé avec succès ! Notre équipe vous répondra sous 2h.')}",
    "Erreur lors de l\\'envoi du message": "{t('contact.error', 'Erreur lors de l\\'envoi du message')}",
    "Service Client & Devis Gratuit": "{t('contact.badge', 'Service Client & Devis Gratuit')}",
    "Contactez notre équipe": "{t('contact.title', 'Contactez notre équipe')}",
    "Une question sur un produit, votre livraison ou un devis personnalisé ? Nous vous répondons rapidement.": "{t('contact.subtitle', 'Une question sur un produit, votre livraison ou un devis personnalisé ? Nous vous répondons rapidement.')}",
    "Nos coordonnées directes": "{t('contact.info_title', 'Nos coordonnées directes')}",
    "Téléphone direct": "{t('contact.phone', 'Téléphone direct')}",
    "Email du support": "{t('contact.email', 'Email du support')}",
    "Dépôt & Siège": "{t('contact.address', 'Dépôt & Siège')}",
    "Horaires d'ouverture": "{t('contact.hours', 'Horaires d\\'ouverture')}",
    "Lun – Ven : 8h30 – 18h30<br />": "{t('contact.hours_week', 'Lun – Ven : 8h30 – 18h30')}<br />",
    "Samedi : 9h00 – 17h00 (Dimanche fermé)": "{t('contact.hours_weekend', 'Samedi : 9h00 – 17h00 (Dimanche fermé)')}",
    "Réponse garantie sous 2h ouvrées par nos conseillers.": "{t('contact.guarantee', 'Réponse garantie sous 2h ouvrées par nos conseillers.')}",
    "Envoyez-nous un message": "{t('contact.form_title', 'Envoyez-nous un message')}",
    "Prénom *": "{t('contact.form_firstname', 'Prénom *')}",
    'placeholder="Votre prénom"': 'placeholder={t("contact.form_firstname_placeholder", "Votre prénom")}',
    "Nom *": "{t('contact.form_lastname', 'Nom *')}",
    'placeholder="Votre nom"': 'placeholder={t("contact.form_lastname_placeholder", "Votre nom")}',
    "Email *": "{t('contact.form_email', 'Email *')}",
    'placeholder="nom@exemple.com"': 'placeholder={t("contact.form_email_placeholder", "nom@exemple.com")}',
    "Téléphone": "{t('contact.form_phone', 'Téléphone')}",
    'placeholder="06 12 34 56 78"': 'placeholder={t("contact.form_phone_placeholder", "06 12 34 56 78")}',
    "Sujet *": "{t('contact.form_subject', 'Sujet *')}",
    'placeholder="Ex: Demande de livraison, Devis stères..."': 'placeholder={t("contact.form_subject_placeholder", "Ex: Demande de livraison, Devis stères...")}',
    "Votre message *": "{t('contact.form_message', 'Votre message *')}",
    'placeholder="Détaillez votre demande ou votre code postal de livraison..."': 'placeholder={t("contact.form_message_placeholder", "Détaillez votre demande ou votre code postal de livraison...")}',
    "'Envoi en cours...' : 'Envoyer mon message'": "t('contact.sending', 'Envoi en cours...') : t('contact.send', 'Envoyer mon message')",
    "Zone de livraison directe sous abri": "{t('contact.delivery_title', 'Zone de livraison directe sous abri')}",
    "Camion équipé d'un chariot tout-terrain pour déposer vos palettes exactement où vous le souhaitez.": "{t('contact.delivery_desc', 'Camion équipé d\\'un chariot tout-terrain pour déposer vos palettes exactement où vous le souhaitez.')}",
    "Chariot tout-terrain": "{t('contact.delivery_badge1', 'Chariot tout-terrain')}",
    "100% garanti": "{t('contact.delivery_badge2', '100% garanti')}"
}

# The success/error messages in toast are strings, need to just wrap them in t() but we replaced them completely in dict.
# Actually we need to make sure t() is called without curly braces inside the toast.
content = content.replace("toast.success('Message envoyé avec succès ! Notre équipe vous répondra sous 2h.');", "toast.success(t('contact.success', 'Message envoyé avec succès ! Notre équipe vous répondra sous 2h.'));")
content = content.replace("toast.error('Erreur lors de l\\'envoi du message');", "toast.error(t('contact.error', 'Erreur lors de l\\'envoi du message'));")
del replacements["Message envoyé avec succès ! Notre équipe vous répondra sous 2h."]
del replacements["Erreur lors de l\\'envoi du message"]

for old, new in replacements.items():
    content = content.replace(old, new)

with open(r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\pages\Contact.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
