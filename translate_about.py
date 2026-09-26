import re

with open(r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\pages\About.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
if 'useTranslation' not in content:
    content = content.replace("import React from 'react';", "import React from 'react';\nimport { useTranslation } from 'react-i18next';")

# Add useTranslation to component
content = content.replace("const About = () => {\n  return (", "const About = () => {\n  const { t } = useTranslation();\n  return (")

content = content.replace("Spécialiste européen du bois", "{t('about.badge', 'Spécialiste européen du bois')}")
content = content.replace("À propos de nous", "{t('about.title', 'À propos de nous')}")
content = content.replace("Votre partenaire de confiance pour le bois de chauffage haute performance et les granulés certifiés.", "{t('about.subtitle', 'Votre partenaire de confiance pour le bois de chauffage haute performance et les granulés certifiés.')}")

content = content.replace("Notre histoire", "{t('about.story_title', 'Notre histoire')}")

old_story = """Depuis notre création, nous nous sommes engagés à fournir du bois de chauffage 
              de la plus haute qualité. Notre passion pour la forêt et le respect de 
              l'environnement nous poussent à sélectionner exclusivement des essences dures 
              (chêne, hêtre, frêne) issues de forêts gérées durablement."""
content = content.replace(old_story, "{t('about.story_text', 'Depuis notre création, nous nous sommes engagés à fournir du bois de chauffage de la plus haute qualité. Notre passion pour la forêt et le respect de l\\'environnement nous poussent à sélectionner exclusivement des essences dures (chêne, hêtre, frêne) issues de forêts gérées durablement.')}")

content = content.replace("Notre mission", "{t('about.mission_title', 'Notre mission')}")

old_mission = """Rendre le chauffage au bois performant, économique et respectueux de notre planète. 
              Chaque produit proposé respecte des normes strictes de séchage (taux d'humidité inférieur à 20%) 
              pour garantir un rendement calorifique maximal et une combustion propre."""
content = content.replace(old_mission, "{t('about.mission_text', 'Rendre le chauffage au bois performant, économique et respectueux de notre planète. Chaque produit proposé respecte des normes strictes de séchage (taux d\\'humidité inférieur à 20%) pour garantir un rendement calorifique maximal et une combustion propre.')}")

content = content.replace("Notre engagement client", "{t('about.engagement_title', 'Notre engagement client')}")

old_eng = """Votre satisfaction totale est notre priorité absolue. Nous assurons un conseil expert, 
              des tarifs transparents sans intermédiaires et une livraison directe sous votre abri 
              grâce à nos camions équipés de chariots tout-terrain."""
content = content.replace(old_eng, "{t('about.engagement_text', 'Votre satisfaction totale est notre priorité absolue. Nous assurons un conseil expert, des tarifs transparents sans intermédiaires et une livraison directe sous votre abri grâce à nos camions équipés de chariots tout-terrain.')}")


content = content.replace("Nos valeurs fondamentales", "{t('about.values_title', 'Nos valeurs fondamentales')}")

content = content.replace(">Environnement<", ">{t('about.val1_title', 'Environnement')}<")
content = content.replace("Bois 100% éco-responsable certifié PEFC / FSC issu de forêts durables.", "{t('about.val1_desc', 'Bois 100% éco-responsable certifié PEFC / FSC issu de forêts durables.')}")

content = content.replace(">Qualité certifiée<", ">{t('about.val2_title', 'Qualité certifiée')}<")
content = content.replace("Contrôles rigoureux de l'humidité (&lt; 20%) et normes DINplus / ENplus.", "{t('about.val2_desc', 'Contrôles rigoureux de l\\'humidité (< 20%) et normes DINplus / ENplus.')}")

content = content.replace(">Livraison chariot<", ">{t('about.val3_title', 'Livraison chariot')}<")
content = content.replace("Dépose exacte sous votre abri, garage ou cour par chariot tout-terrain.", "{t('about.val3_desc', 'Dépose exacte sous votre abri, garage ou cour par chariot tout-terrain.')}")

content = content.replace(">Proximité<", ">{t('about.val4_title', 'Proximité')}<")
content = content.replace("Une équipe humaine et disponible pour vous conseiller 6j/7.", "{t('about.val4_desc', 'Une équipe humaine et disponible pour vous conseiller 6j/7.')}")

content = content.replace(">Excellence<", ">{t('about.val5_title', 'Excellence')}<")
content = content.replace("Des rendements thermiques optimaux pour préserver vos appareils.", "{t('about.val5_desc', 'Des rendements thermiques optimaux pour préserver vos appareils.')}")

content = content.replace(">Transparence<", ">{t('about.val6_title', 'Transparence')}<")
content = content.replace("Tarifs nets, volumes en stères réels vérifiés et traçabilité claire.", "{t('about.val6_desc', 'Tarifs nets, volumes en stères réels vérifiés et traçabilité claire.')}")

content = content.replace("Notre engagement en chiffres", "{t('about.stats_title', 'Notre engagement en chiffres')}")
content = content.replace("Une expertise reconnue au service des particuliers et professionnels.", "{t('about.stats_subtitle', 'Une expertise reconnue au service des particuliers et professionnels.')}")

content = content.replace("Années d'expérience", "{t('about.stat1', 'Années d\\'expérience')}")
content = content.replace("Clients satisfaits", "{t('about.stat2', 'Clients satisfaits')}")
content = content.replace("Taux d'humidité", "{t('about.stat3', 'Taux d\\'humidité')}")
content = content.replace("Bois certifié", "{t('about.stat4', 'Bois certifié')}")

with open(r'C:\Users\myspa\Documents\Ecom bois\apps\client\src\pages\About.js', 'w', encoding='utf-8') as f:
    f.write(content)

print('Success')
