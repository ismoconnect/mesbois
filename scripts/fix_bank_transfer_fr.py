import json

with open('apps/client/src/locales/fr/translation.json', 'r', encoding='utf-8') as f:
    fr_data = json.load(f)

if 'bank_transfer' not in fr_data:
    fr_data['bank_transfer'] = {}

fr_data['bank_transfer'].update({
    'success_title': 'Commande enregistrée avec succès',
    'success_desc': 'Votre réservation de bois de chauffage a été validée dans notre système.',
    'order_ref': 'Réf. commande : ',
    'bank_details': 'Coordonnées bancaires pour votre virement',
    'order_transfer': 'Merci d\'effectuer votre virement pour valider l\'expédition',
    'pro_account': 'Compte professionnel vérifié',
    'tip1': 'Conseil rapide : Privilégiez un ',
    'tip_bold': 'Virement instantané',
    'tip2': ' pour une préparation immédiate de votre commande.',
    'account_holder': 'TITULAIRE DU COMPTE',
    'copy': 'Copier',
    'copy_iban': 'Copier l\'IBAN',
    'bank': 'BANQUE',
    'iban': 'IBAN (COMPTE DE PAIEMENT)',
    'bic': 'BIC / SWIFT',
    'reference': 'MOTIF DE PAIEMENT (OBLIGATOIRE)',
    'transfer_done': 'Virement effectué ?',
    'whatsapp_desc': 'Envoyez-nous votre preuve de virement via WhatsApp pour un traitement prioritaire.',
    'send_whatsapp': 'Envoyer sur WhatsApp',
    'order_summary': 'Résumé de la commande',
    'delivery_address': 'Adresse de livraison :',
    'delivery_mode': 'Mode de livraison :',
    'forklift_included': 'Chariot tout-terrain inclus',
    'recipient': 'Destinataire :',
    'email_conf': 'Email de confirmation :',
    'total_to_pay': 'Montant total :',
    'continue_shopping': 'Continuer mes achats',
    'back_home': 'Retour à l\'accueil',
    'email_sent': 'Un e-mail de confirmation contenant ces informations vous a été envoyé.',
    'copied_exclam': 'Copié !',
    'copied': 'Copié'
})

with open('apps/client/src/locales/fr/translation.json', 'w', encoding='utf-8') as f:
    json.dump(fr_data, f, ensure_ascii=False, indent=2)
