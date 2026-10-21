# 📱 Application Fabric Apps : RailPulse Studio

**RailPulse_Studio** est une application web hébergée **dans** l'espace de travail Fabric (élément Fabric Apps). Elle lit le modèle sémantique `SM_RailPulse` en direct par des requêtes DAX : aucune donnée n'est copiée, la sécurité et les droits restent ceux de Fabric.

| Voie 1 · Réseau | Voie 2 · Ponctualité |
|---|---|
| ![Voie 1 Réseau](../docs/images/application/voie1_reseau.png) | ![Voie 2 Ponctualité](../docs/images/application/voie2_ponctualite.png) |

## Les quatre voies

| Voie | Contenu |
|---|---|
| 1 · Réseau | tableau d'affichage à volets façon gare, récit automatique, tendance mensuelle face à l'objectif de 77 %, carte de l'Europe avec les gares et le tracé des 12 lignes |
| 2 · Ponctualité | classement des 24 relations coloré selon l'objectif, carte de chaleur jour x heure de départ, priorités |
| 3 · Prévisions | risques des 14 prochains jours estimés par `ML_RailPulse_Delay`, tableau des départs à surveiller |
| 4 · Fiche relation | une relation en détail : rang, indicateurs, historique, heures sensibles, prochains départs |

Un clic sur une relation filtre tout le studio. Mode clair et mode sombre.

## Pile technique

React 19 · TypeScript · Vite · Tailwind CSS 4 · `@microsoft/fabric-app-data` (requêtes DAX sur le modèle sémantique) · Vega-Lite · DataGrid Fabric · Vitest · hébergement statique et authentification Fabric (Rayfin).

## Déployer

Le code source complet est dans [`RailPulse_Studio/`](RailPulse_Studio/). Son [README](RailPulse_Studio/README.md) détaille l'organisation du code et le déploiement :

```powershell
cd application/RailPulse_Studio
npm install
npx rayfin login
npx rayfin up --workspace-id <ID_ESPACE_DE_TRAVAIL> --item-name RailPulse_Studio --yes
```

Avant le premier déploiement, renseignez l'identifiant de l'espace de travail et celui du modèle sémantique dans `fabric.yaml`.

L'application part du modèle de démarrage Fabric Apps publié par Microsoft sous licence MIT (voir `RailPulse_Studio/LICENSE`).
