import json

path = r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\locales\de\translation.json'
with open(path, 'r', encoding='utf-8') as f:
    data = json.load(f)

if 'header' not in data:
    data['header'] = {}

data['header']['login'] = "Anmelden"
data['header']['register'] = "Registrieren"

with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Success DE')

path_fr = r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\locales\fr\translation.json'
with open(path_fr, 'r', encoding='utf-8') as f:
    data_fr = json.load(f)

if 'header' not in data_fr:
    data_fr['header'] = {}

data_fr['header']['login'] = "Connexion"
data_fr['header']['register'] = "Inscription"

with open(path_fr, 'w', encoding='utf-8') as f:
    json.dump(data_fr, f, ensure_ascii=False, indent=2)

print('Success FR')
