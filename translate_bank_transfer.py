import os

file_path = r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\pages\BankTransfer.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

reps = {
    ">Commande enregistrée avec succès<": ">{t('bank_transfer.success_title', 'Commande enregistrée avec succès')}<",
    "Votre réservation de bois de chauffage a été validée dans notre système.": "{t('bank_transfer.success_desc', 'Votre réservation de bois de chauffage a été validée dans notre système.')}",
    "Réf. commande : ": "{t('bank_transfer.order_ref', 'Réf. commande : ')}",
    ">Coordonnées bancaires pour votre virement<": ">{t('bank_transfer.bank_details', 'Coordonnées bancaires pour votre virement')}<",
    "Veuillez ordonner votre virement pour expédition": "{t('bank_transfer.order_transfer', 'Veuillez ordonner votre virement pour expédition')}",
    "Compte Professionnel Validé": "{t('bank_transfer.pro_account', 'Compte Professionnel Validé')}",
    "Conseil rapide : Privilégiez un ": "{t('bank_transfer.tip1', 'Conseil rapide : Privilégiez un ')}",
    "virement instantané": "{t('bank_transfer.tip_bold', 'virement instantané')}",
    " pour une préparation immédiate en entrepôt.": "{t('bank_transfer.tip2', ' pour une préparation immédiate en entrepôt.')}",
    ">TITULAIRE<": ">{t('bank_transfer.account_holder', 'TITULAIRE')}<",
    ">Copier<": ">{t('bank_transfer.copy', 'Copier')}<",
    ">Copier l'IBAN<": ">{t('bank_transfer.copy_iban', 'Copier l\\'IBAN')}<",
    ">BANQUE<": ">{t('bank_transfer.bank', 'BANQUE')}<",
    ">IBAN (COMPTE DE PAIEMENT)<": ">{t('bank_transfer.iban', 'IBAN (COMPTE DE PAIEMENT)')}<",
    ">BIC / SWIFT<": ">{t('bank_transfer.bic', 'BIC / SWIFT')}<",
    ">RÉFÉRENCE (OBLIGATOIRE)<": ">{t('bank_transfer.reference', 'RÉFÉRENCE (OBLIGATOIRE)')}<",
    ">Virement effectué ?<": ">{t('bank_transfer.transfer_done', 'Virement effectué ?')}<",
    " Transmettez votre justificatif sur WhatsApp Pro pour enclencher la préparation prioritaire.": " {t('bank_transfer.whatsapp_desc', 'Transmettez votre justificatif sur WhatsApp Pro pour enclencher la préparation prioritaire.')}",
    ">Envoyer sur WhatsApp<": ">{t('bank_transfer.send_whatsapp', 'Envoyer sur WhatsApp')}<",
    ">Récapitulatif de votre commande<": ">{t('bank_transfer.order_summary', 'Récapitulatif de votre commande')}<"
}

for old, new in reps.items():
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("BankTransfer translated.")
