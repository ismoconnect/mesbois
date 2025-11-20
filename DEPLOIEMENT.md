# Déploiement MesBois

## Aperçu
- Monorepo avec deux apps React (Create React App):
  - `apps/client`
  - `apps/admin`
- Chaque app possède son propre `vercel.json` avec `@vercel/static-build` et `distDir: build`.
- Important: ne pas déployer depuis la racine du repo.

## Projets Vercel
- Client: mummys-projects-67592474/mesbois-client
  - Production: https://mesbois-client-pcv8yhput-mummys-projects-67592474.vercel.app
- Admin: mummys-projects-67592474/mesbois-admin
  - Production: https://mesbois-admin-r5elmtaxu-mummys-projects-67592474.vercel.app

Note: La présence de `builds` dans `vercel.json` désactive les Build & Development Settings du Dashboard pour ces projets.

## Prérequis
- Vercel CLI connecté: `vercel login`
- Chaque sous-dossier lié une fois (créé par `.vercel/` local):
  - `apps/client`: `vercel link --yes --project mesbois-client`
  - `apps/admin`: `vercel link --yes --project mesbois-admin`

## Déployer en production
Exécuter depuis le bon sous-dossier.

- Client
  ```bash
  # CWD: apps/client
  vercel --prod
  ```

- Admin
  ```bash
  # CWD: apps/admin
  vercel --prod
  ```

## Alias et domaines
1) Récupérer l’URL du déploiement de production (CLI affiche l’URL).
2) Associer un domaine/alias:
   ```bash
   vercel alias set <url-de-deploiement> <domaine-ou-sous-domaine>
   ```
3) DNS si domaine externe:
   - Ajouter un CNAME vers `cname.vercel-dns.com` (ou gérer DNS dans Vercel).

Exemples:
- Client → `www.mondomaine.com`
- Admin → `admin.mondomaine.com`

## Bonnes pratiques
- Toujours lancer `vercel --prod` depuis `apps/client` ou `apps/admin`.
- Éviter d’exécuter `vercel` à la racine (le `vercel.json` racine ne contient pas de build).
- Garder `vercel.json` dans chaque app synchronisé avec les scripts CRA (`npm run build`).

## Dépannage
- Le déploiement prend une ancienne version / mauvaise racine:
  - Vérifier le CWD (doit être `apps/client` ou `apps/admin`).
  - Relier le dossier: `vercel link --yes --project <nom-projet>`.
- Changements Dashboard ignorés:
  - Si `vercel.json` contient `builds`, les réglages Build du Dashboard sont ignorés par Vercel (comportement normal).
- Inspecter un déploiement: `vercel inspect <url>`.

## Historique
- 2025-11-19
  - Client déployé en prod → https://mesbois-client-pcv8yhput-mummys-projects-67592474.vercel.app
  - Admin déployé en prod → https://mesbois-admin-r5elmtaxu-mummys-projects-67592474.vercel.app
