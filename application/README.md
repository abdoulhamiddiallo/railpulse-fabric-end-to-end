# 📱 Application Fabric Apps : RailPulse Studio

**RailPulse_Studio** est une application web hébergée **dans** l'espace de travail Fabric (élément Fabric Apps). Elle lit le modèle sémantique `SM_RailPulse` en direct par des requêtes DAX : aucune donnée n'est copiée, la sécurité et les droits restent ceux de Fabric.

| Voie 1 · Réseau | Voie 2 · Ponctualité |
|---|---|
| ![RailPulse Studio, voie Réseau](../docs/images/application/voie1_reseau.png) | ![RailPulse Studio, voie Ponctualité](../docs/images/application/voie2_ponctualite.png) |
| **Voie 3 · Prévisions** | **Voie 4 · Fiche relation** |
| ![RailPulse Studio, voie Prévisions](../docs/images/application/voie3_previsions.png) | ![RailPulse Studio, voie Fiche relation](../docs/images/application/voie4_fiche_relation.png) |

## Les visuels, un par un

Onze visuels Vega-Lite et tableaux de l'application, tous alimentés en direct par des requêtes DAX sur `SM_RailPulse`.

| | |
|---|---|
| **Voie 1 · Réseau · Voyageurs par ligne** | **Le réseau en carte** |
| ![Voyageurs par ligne](../docs/images/application/visuels/01_voyageurs_par_ligne.png) | ![Le réseau en carte](../docs/images/application/visuels/02_carte_du_reseau.png) |
| **Voie 1 · Réseau · Voyageurs et ponctualité, mois par mois** | **Voie 2 · Ponctualité : classement des 24 relations** |
| ![Voyageurs et ponctualité, mois par mois](../docs/images/application/visuels/03_voyageurs_et_ponctualite_par_mois.png) | ![Voie 2 · Ponctualité : classement des 24 relations](../docs/images/application/visuels/04_classement_des_24_relations.png) |
| **Voie 2 · Ponctualité · Heures sensibles de la semaine** | **Retard moyen par heure de départ** |
| ![Heures sensibles de la semaine](../docs/images/application/visuels/05_heures_sensibles.png) | ![Retard moyen par heure de départ](../docs/images/application/visuels/06_retard_par_heure_de_depart.png) |
| **Voie 3 · Prévisions · Trains prévus par jour et niveau de risque** | **Tableau des départs à surveiller** |
| ![Trains prévus par jour et niveau de risque](../docs/images/application/visuels/07_trains_prevus_par_jour_et_risque.png) | ![Tableau des départs à surveiller](../docs/images/application/visuels/08_departs_a_surveiller.png) |
| **Voie 4 · Fiche relation (Paris > Lyon) · Voyageurs et ponctualité, mois par mois** | **Retard moyen par heure de départ** |
| ![Voyageurs et ponctualité, mois par mois](../docs/images/application/visuels/09_fiche_voyageurs_et_ponctualite.png) | ![Retard moyen par heure de départ](../docs/images/application/visuels/10_fiche_retard_par_heure.png) |
| **Voie 4 · Fiche relation · Prochains départs prévus** | |
| ![Prochains départs prévus](../docs/images/application/visuels/11_fiche_prochains_departs.png) | |

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
