import os

file_path = r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\pages\Checkout.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add useTranslation
if 'useTranslation' not in content:
    content = content.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { useTranslation } from 'react-i18next';")
    content = content.replace("const Checkout = () => {", "const Checkout = () => {\n  const { t } = useTranslation();")

reps = {
    ">Finaliser votre commande<": ">{t('checkout.title_finalize', 'Finaliser votre commande')}<",
    "Achat rapide et direct en tant qu'invité.": "{t('checkout.guest_buy', 'Achat rapide et direct en tant qu\\'invité.')}",
    "Déjà client ? ": "{t('checkout.already_client', 'Déjà client ?')} ",
    ">Se connecter<": ">{t('checkout.login', 'Se connecter')}<",
    "Coordonnées & Adresse de livraison": "{t('checkout.step1_title', 'Coordonnées & Adresse de livraison')}",
    ">Prénom<": ">{t('checkout.firstname', 'Prénom')}<",
    ">Nom<": ">{t('checkout.lastname', 'Nom')}<",
    ">Adresse email<": ">{t('checkout.email', 'Adresse email')}<",
    ">Téléphone<": ">{t('checkout.phone', 'Téléphone')}<",
    ">Adresse de livraison complète<": ">{t('checkout.address', 'Adresse de livraison complète')}<",
    'placeholder="Numéro et nom de rue"': 'placeholder={t("checkout.street_ph", "Numéro et nom de rue")}',
    ">Complément d'adresse<": ">{t('checkout.address_comp', 'Complément d\\'adresse')}<",
    ">Code postal<": ">{t('checkout.zip', 'Code postal')}<",
    ">Ville<": ">{t('checkout.city', 'Ville')}<",
    ">Pays<": ">{t('checkout.country', 'Pays')}<",
    "Ajouter une instruction pour le chauffeur (optionnel)": "{t('checkout.driver_instruction', 'Ajouter une instruction pour le chauffeur (optionnel)')}",
    ">Compte client<": ">{t('checkout.client_account', 'Compte client')}<",
    ">Récapitulatif de la commande<": ">{t('checkout.summary_title', 'Récapitulatif de la commande')}<",
    'placeholder="CODE PROMO"': 'placeholder={t("checkout.promo_code", "CODE PROMO")}',
    ">Appliquer<": ">{t('checkout.apply', 'Appliquer')}<",
    ">Sous-total articles<": ">{t('checkout.subtotal_items', 'Sous-total articles')}<",
    ">Livraison tout-terrain sous abri<": ">{t('checkout.delivery_offroad', 'Livraison tout-terrain sous abri')}<",
    ">Total TTC<": ">{t('checkout.total_tax', 'Total TTC')}<",
    "J'accepte les ": "{t('checkout.accept', 'J\\'accepte les ')}",
    "Conditions Générales de Vente": "{t('checkout.terms', 'Conditions Générales de Vente')}",
    " et la ": "{t('checkout.and', ' et la ')}",
    "Politique de Confidentialité": "{t('checkout.privacy', 'Politique de Confidentialité')}",
    "Confirmer la commande (": "{t('checkout.confirm_order', 'Confirmer la commande (')}",
    "Livraison directe sous abri par camion avec chariot": "{t('checkout.delivery_desc', 'Livraison directe sous abri par camion avec chariot')}",
    "Virement bancaire sécurisé sans transmission de données bancaires": "{t('checkout.bank_secure', 'Virement bancaire sécurisé sans transmission de données bancaires')}",
    ">France<": ">{t('checkout.france', 'France')}<",
    ">Allemagne<": ">{t('checkout.germany', 'Allemagne')}<",
    ">Belgique<": ">{t('checkout.belgium', 'Belgique')}<",
    ">Luxembourg<": ">{t('checkout.luxembourg', 'Luxembourg')}<",
    ">Suisse<": ">{t('checkout.switzerland', 'Suisse')}<",
    ">Autriche<": ">{t('checkout.austria', 'Autriche')}<"
}

for old, new in reps.items():
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Checkout translated.")
