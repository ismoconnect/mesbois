import os
import json

base_dir = r"c:\Users\myspa\Documents\Ecom bois\apps\client\src\pages"

def replace_in_file(filename, old_str, new_str):
    with open(os.path.join(base_dir, filename), "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace(old_str, new_str)
    with open(os.path.join(base_dir, filename), "w", encoding="utf-8") as f:
        f.write(content)

replace_in_file("ProductDetail.js", 
    "({view.reviewCount || 0} avis)",
    "({view.reviewCount || 0} {t('product.reviews', 'avis')})"
)

locales_dir = r"c:\Users\myspa\Documents\Ecom bois\apps\client\src\locales"
fr_path = os.path.join(locales_dir, 'fr', 'temp_public1.json')
de_path = os.path.join(locales_dir, 'de', 'temp_public1.json')

with open(fr_path, 'r', encoding='utf-8') as f:
    fr_dict = json.load(f)
with open(de_path, 'r', encoding='utf-8') as f:
    de_dict = json.load(f)

fr_dict['product']['reviews'] = 'avis'
de_dict['product']['reviews'] = 'Bewertungen'

with open(fr_path, 'w', encoding='utf-8') as f:
    json.dump(fr_dict, f, ensure_ascii=False, indent=2)
with open(de_path, 'w', encoding='utf-8') as f:
    json.dump(de_dict, f, ensure_ascii=False, indent=2)

print("Done avis")
