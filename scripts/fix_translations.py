import re
import os
import json

base_dir = r"c:\Users\myspa\Documents\Ecom bois\apps\client\src\pages"

def replace_in_file(filename, old_str, new_str):
    with open(os.path.join(base_dir, filename), "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace(old_str, new_str)
    with open(os.path.join(base_dir, filename), "w", encoding="utf-8") as f:
        f.write(content)

# Products.js
replace_in_file("Products.js", 
    "toast.custom((t) => (",
    "toast.custom((tToast) => ("
)
replace_in_file("Products.js", 
    "toast.dismiss(t.id)",
    "toast.dismiss(tToast.id)"
)
replace_in_file("Products.js", 
    "Le produit a été ajouté avec succès à votre panier.",
    "{t('cart.added_success', 'Le produit a été ajouté avec succès à votre panier.')}"
)
replace_in_file("Products.js", 
    "Que souhaitez-vous faire ?",
    "{t('cart.what_next', 'Que souhaitez-vous faire ?')}"
)
replace_in_file("Products.js", 
    "Poursuivre les achats",
    "{t('cart.continue_shopping', 'Poursuivre les achats')}"
)
replace_in_file("Products.js", 
    "Voir le panier",
    "{t('cart.view_cart', 'Voir le panier')}"
)

# ProductDetail.js is already partially done, but let's check fixedCategories in Products.js
replace_in_file("Products.js", 
    "{ value: 'bûches', label: 'Bois de chauffage' }",
    "{ value: 'bûches', label: t('category.wood', 'Bois de chauffage') }"
)
replace_in_file("Products.js", 
    "{ value: 'accessoires', label: 'Accessoires' }",
    "{ value: 'accessoires', label: t('category.accessories', 'Accessoires') }"
)
replace_in_file("Products.js", 
    "{ value: 'bûches densifiées', label: 'Bûches densifiées' }",
    "{ value: 'bûches densifiées', label: t('category.briquettes', 'Bûches densifiées') }"
)
replace_in_file("Products.js", 
    "{ value: 'pellets', label: 'Pellets' }",
    "{ value: 'pellets', label: t('category.pellets', 'Pellets') }"
)
replace_in_file("Products.js", 
    "{ value: 'poêles', label: 'Poêles' }",
    "{ value: 'poêles', label: t('category.stoves', 'Poêles') }"
)

# Also let's create the JSON files
locales_dir = r"c:\Users\myspa\Documents\Ecom bois\apps\client\src\locales"
os.makedirs(os.path.join(locales_dir, 'fr'), exist_ok=True)
os.makedirs(os.path.join(locales_dir, 'de'), exist_ok=True)

fr_dict = {
  "cart": {
    "added_success": "Le produit a été ajouté avec succès à votre panier.",
    "what_next": "Que souhaitez-vous faire ?",
    "continue_shopping": "Poursuivre les achats",
    "view_cart": "Voir le panier"
  },
  "category": {
    "wood": "Bois de chauffage",
    "accessories": "Accessoires",
    "briquettes": "Bûches densifiées",
    "pellets": "Pellets",
    "stoves": "Poêles"
  },
  "product": {
    "decrease_quantity": "Diminuer la quantité",
    "increase_quantity": "Augmenter la quantité",
    "fast_delivery_title": "Livraison rapide",
    "fast_delivery_desc": "Livraison en 24-48h",
    "quality_guarantee_title": "Qualité garantie",
    "quality_guarantee_desc": "Produit 100% certifié"
  }
}

de_dict = {
  "cart": {
    "added_success": "Das Produkt wurde erfolgreich zu Ihrem Warenkorb hinzugefügt.",
    "what_next": "Was möchten Sie tun?",
    "continue_shopping": "Weiter einkaufen",
    "view_cart": "Warenkorb ansehen"
  },
  "category": {
    "wood": "Brennholz",
    "accessories": "Zubehör",
    "briquettes": "Holzbriketts",
    "pellets": "Pellets",
    "stoves": "Öfen"
  },
  "product": {
    "decrease_quantity": "Menge verringern",
    "increase_quantity": "Menge erhöhen",
    "fast_delivery_title": "Schnelle Lieferung",
    "fast_delivery_desc": "Lieferung in 24-48h",
    "quality_guarantee_title": "Qualitätsgarantie",
    "quality_guarantee_desc": "100% zertifiziertes Produkt"
  }
}

with open(os.path.join(locales_dir, 'fr', 'temp_public1.json'), 'w', encoding='utf-8') as f:
    json.dump(fr_dict, f, ensure_ascii=False, indent=2)

with open(os.path.join(locales_dir, 'de', 'temp_public1.json'), 'w', encoding='utf-8') as f:
    json.dump(de_dict, f, ensure_ascii=False, indent=2)

print("Done")
