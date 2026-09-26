import json

with open('apps/client/src/locales/fr/translation.json', 'r', encoding='utf-8') as f:
    fr_data = json.load(f)

if 'products' not in fr_data:
    fr_data['products'] = {}

if 'trust' not in fr_data['products']:
    fr_data['products']['trust'] = {}

fr_data['products']['trust'].update({
    'humidity': 'Humidité garantie < 20%',
    'delivery': 'Livraison à domicile 24-48h',
    'secure_payment': 'Paiement sécurisé',
    'rating': 'Note 4.8/5'
})

if 'footer' not in fr_data:
    fr_data['footer'] = {}

fr_data['footer']['humidity'] = 'Humidité < 20%'

with open('apps/client/src/locales/fr/translation.json', 'w', encoding='utf-8') as f:
    json.dump(fr_data, f, ensure_ascii=False, indent=2)
