import os
import re

# Header.js
file_path = r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\components\Layout\Header.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'>\s*Supprimer\s*<', '>{t("cart.delete", "Supprimer")}<', content)
content = re.sub(r'>\s*Vider le panier\s*<', '>{t("cart.empty", "Vider le panier")}<', content)
content = re.sub(r'>\s*Continuer mes achats\s*<', '>{t("cart.continue", "Continuer mes achats")}<', content)
content = re.sub(r'>\s*Voir le panier\s*<', '>{t("cart.view", "Voir le panier")}<', content)
content = re.sub(r'>\s*Commander\s*<', '>{t("cart.checkout", "Commander")}<', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

# BankTransfer.js
file_path = r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\pages\BankTransfer.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<strong>Titulaire</strong>', '<strong>{t("bank_transfer.account_holder", "Titulaire")}</strong>', content)
content = re.sub(r'<strong>Banque</strong>', '<strong>{t("bank_transfer.bank", "Banque")}</strong>', content)
content = re.sub(r'<strong>IBAN \(Compte de paiement\)</strong>', '<strong>{t("bank_transfer.iban", "IBAN (Compte de paiement)")}</strong>', content)
content = re.sub(r'<strong>Référence \(Obligatoire\)</strong>', '<strong>{t("bank_transfer.reference", "Référence (Obligatoire)")}</strong>', content)

content = content.replace("'Copier l\\'IBAN'", "t('bank_transfer.copy_iban', \"Copier l'IBAN\")")
content = content.replace("'Copier'", "t('bank_transfer.copy', 'Copier')")
content = content.replace("'Copié !'", "t('bank_transfer.copied_exclam', 'Copié !')")
content = content.replace("'Copié'", "t('bank_transfer.copied', 'Copié')")

content = re.sub(r'>\s*Adresse de livraison\s*:\s*<', '>{t("bank_transfer.delivery_address", "Adresse de livraison :")}<', content)
content = re.sub(r'>\s*Mode de livraison\s*:\s*<', '>{t("bank_transfer.delivery_mode", "Mode de livraison :")}<', content)
content = re.sub(r'>\s*Chariot tout-terrain inclus\s*<', '>{t("bank_transfer.forklift_included", "Chariot tout-terrain inclus")}<', content)
content = re.sub(r'>\s*Destinataire\s*:\s*<', '>{t("bank_transfer.recipient", "Destinataire :")}<', content)
content = re.sub(r'>\s*Email de confirmation\s*:\s*<', '>{t("bank_transfer.email_conf", "Email de confirmation :")}<', content)
content = re.sub(r'>\s*Total TTC à régler\s*:\s*<', '>{t("bank_transfer.total_to_pay", "Total TTC à régler :")}<', content)

content = content.replace(">Chariot tout-terrain jusqu'à l'abri<", ">{t(\"bank_transfer.forklift_to_shelter\", \"Chariot tout-terrain jusqu'à l'abri\")}<")
content = content.replace(">Bois 100% sec certifié (< 20%)<", ">{t(\"bank_transfer.wood_certified\", \"Bois 100% sec certifié (< 20%)\")}<")
content = content.replace(">Support & WhatsApp 7j/7<", ">{t(\"bank_transfer.support_whatsapp\", \"Support & WhatsApp 7j/7\")}<")
content = content.replace(">Continuer mes achats sur la boutique<", ">{t(\"bank_transfer.continue_shopping\", \"Continuer mes achats sur la boutique\")}<")
content = content.replace(">Retour à l'accueil<", ">{t(\"bank_transfer.back_home\", \"Retour à l'accueil\")}<")
content = content.replace("Un e-mail de confirmation reprenant ces informations vous a également été envoyé.", "{t(\"bank_transfer.email_sent\", \"Un e-mail de confirmation reprenant ces informations vous a également été envoyé.\")}")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)


# Checkout.js
file_path = r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\pages\Checkout.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(">* Prénom<", ">*{t(\"checkout.firstname\", \"Prénom\")}<")
content = content.replace(">* Nom<", ">*{t(\"checkout.lastname\", \"Nom\")}<")
content = content.replace(">* Adresse email<", ">*{t(\"checkout.email\", \"Adresse email\")}<")
content = content.replace(">* Téléphone<", ">*{t(\"checkout.phone\", \"Téléphone\")}<")
content = content.replace(">* Adresse de livraison complète<", ">*{t(\"checkout.address\", \"Adresse de livraison complète\")}<")
content = content.replace(">* Code postal<", ">*{t(\"checkout.zip\", \"Code postal\")}<")
content = content.replace(">* Ville<", ">*{t(\"checkout.city\", \"Ville\")}<")
content = content.replace(">* Pays<", ">*{t(\"checkout.country\", \"Pays\")}<")

content = content.replace(">Créer un compte pour suivre mes commandes<", ">{t(\"checkout.create_account\", \"Créer un compte pour suivre mes commandes\")}<")
content = content.replace(">Mode de paiement<", ">{t(\"checkout.payment_mode\", \"Mode de paiement\")}<")
content = content.replace(">Virement bancaire (SEPA)<", ">{t(\"checkout.bank_sepa\", \"Virement bancaire (SEPA)\")}<")
content = content.replace(">100% Sécurisé<", ">{t(\"checkout.secure_100\", \"100% Sécurisé\")}<")

content = content.replace("Simple et sans risque : Vous effectuerez le virement depuis votre application bancaire sans jamais transmettre vos identifiants bancaires sur Internet.", "{t(\"checkout.safe_desc\", \"Simple et sans risque : Vous effectuerez le virement depuis votre application bancaire sans jamais transmettre vos identifiants bancaires sur Internet.\")}")
content = content.replace("Nos coordonnées officielles (IBAN, BIC et Titulaire) ainsi que votre numéro de commande s'afficheront sur la page suivante immédiatement après confirmation.", "{t(\"checkout.safe_desc2\", \"Nos coordonnées officielles (IBAN, BIC et Titulaire) ainsi que votre numéro de commande s'afficheront sur la page suivante immédiatement après confirmation.\")}")

content = content.replace(">Vos articles sont immédiatement réservés pour votre livraison.<", ">{t(\"checkout.items_reserved\", \"Vos articles sont immédiatement réservés pour votre livraison.\")}<")
content = content.replace(">Chiffrement SSL 256-bit<", ">{t(\"checkout.ssl\", \"Chiffrement SSL 256-bit\")}<")
content = content.replace(">Aucun frais additionnel<", ">{t(\"checkout.no_extra_fee\", \"Aucun frais additionnel\")}<")
content = content.replace(">Bois 100% fendu prêt à l'emploi & granulés certifiés DINplus<", ">{t(\"checkout.wood_certified\", \"Bois 100% fendu prêt à l'emploi & granulés certifiés DINplus\")}<")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done with source files")
