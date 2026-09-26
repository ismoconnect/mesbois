import os

file_path = r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\components\Layout\Header.js'
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

reps = {
    "Panier d'achat": "{t('cart.drawer_title', 'Panier d\\'achat')}",
    "Votre panier est vide.": "{t('cart.empty_message', 'Votre panier est vide.')}",
    ">Supprimer<": ">{t('cart.delete', 'Supprimer')}<",
    ">Sous-total<": ">{t('cart.subtotal', 'Sous-total')}<",
    ">Vider le panier<": ">{t('cart.empty', 'Vider le panier')}<",
    ">Continuer mes achats<": ">{t('cart.continue', 'Continuer mes achats')}<",
    ">Voir le panier<": ">{t('cart.view', 'Voir le panier')}<",
    ">Commander<": ">{t('cart.checkout', 'Commander')}<"
}

for old, new in reps.items():
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Header cart drawer translated.")
