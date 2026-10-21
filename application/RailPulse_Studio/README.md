# RailPulse · Studio d'exploitation

Application Microsoft Fabric (Fabric Apps, moteur Rayfin) qui met entre les mains de la direction de l'exploitation un poste de pilotage du réseau ferroviaire grande vitesse RailPulse : 12 lignes, 24 relations, 12 gares dans 6 pays.

Toutes les données sont lues en direct dans le modèle sémantique **SM_RailPulse** (Direct Lake) par des requêtes DAX. Aucune donnée n'est stockée dans l'application.

## Les quatre voies du studio

| Voie | Contenu |
|---|---|
| 1 · Réseau | Tableau d'affichage (trains assurés, voyageurs, chiffre d'affaires, ponctualité, remplissage, CO2 évité), récit automatique, voyageurs et ponctualité mois par mois face à l'objectif de 77 %, voyageurs par ligne, carte de l'Europe avec les gares et le tracé des lignes |
| 2 · Ponctualité | Classement des 24 relations coloré selon l'objectif, carte de chaleur jour × heure de départ, retard par heure, récit des priorités |
| 3 · Prévisions | Risques des 14 prochains jours estimés par le modèle ML_RailPulse_Delay, tableau des départs à surveiller façon quai de gare |
| 4 · Fiche relation | Titre, rang et synthèse dynamiques d'une relation, indicateurs, historique mensuel, heures sensibles, prochains départs |

Un clic sur une relation (classement ou tableau des départs) filtre tout le studio ; le filtre s'affiche dans l'en-tête et se retire d'un clic. Mode clair et mode sombre.

## Architecture

```
Modèle sémantique SM_RailPulse (Direct Lake sur l'entrepôt WH_RailPulse_Gold)
        │  DAX (SUMMARIZECOLUMNS, TREATAS pour le filtre de relation)
        ▼
@microsoft/fabric-app-data  →  useSemanticModelQuery  →  toDataTable
        ▼
VegaVisual (Vega-Lite) · DataGrid · composants de signalétique (React 19, Tailwind 4)
        ▼
Hébergement statique Fabric Apps (Rayfin), authentification Fabric
```

- `src/queries/<voie>/` : une requête par visuel (`.dax`, spécification Vega-Lite `.json`, fabrique `.ts` et ses tests).
- `src/components/signaletique/` : tableau d'affichage à volets, pictogrammes de lignes, bandeau d'information.
- `src/lib/formatage.ts` : formats français (espace pour les milliers, virgule décimale, « % » précédé d'une espace).
- `fabric.yaml` : connexion `railpulse` vers le modèle (espace RailPulse_Fabric).

## Déployer dans Fabric

Prérequis : Node.js 20 ou plus, un compte avec le rôle Contributeur sur l'espace RailPulse_Fabric, les paramètres de tenant « Enable Fabric App Items (preview) » et « Semantic Model Execute Queries REST API » activés.

```powershell
npm install
npx rayfin login
npx rayfin up --workspace-id <ID_ESPACE_DE_TRAVAIL> --item-name RailPulse_Studio --yes
```

L'élément **RailPulse_Studio** apparaît ensuite dans l'espace de travail ; il s'ouvre depuis le portail Fabric.

## Développer

```powershell
npm test          # tests unitaires (Vitest)
npm run lint      # ESLint
npm run build     # compilation de production
npx rayfin dev    # application locale reliée à Fabric
```
