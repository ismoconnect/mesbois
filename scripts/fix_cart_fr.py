import json

with open('apps/client/src/locales/fr/translation.json', 'r', encoding='utf-8') as f:
    fr_data = json.load(f)

if 'cart' not in fr_data:
    fr_data['cart'] = {}

fr_data['cart'].update({
    'drawer_title': 'Panier',
    'empty_message': 'Il vous manque %amount% € pour bénéficier de la livraison gratuite !',
    'delete': 'Supprimer',
    'continue': 'Continuer mes achats',
    'view': 'Voir le panier'
})

with open('apps/client/src/locales/fr/translation.json', 'w', encoding='utf-8') as f:
    json.dump(fr_data, f, ensure_ascii=False, indent=2)
