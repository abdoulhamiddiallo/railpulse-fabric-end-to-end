# 🗄️ Données RailPulse

Ce dossier contient la **zone d'atterrissage** telle que le notebook `NB_01_Source_Simulator` la dépose dans `LH_RailPulse_Bronze/Files/landing`. Les fichiers sont fournis pour explorer le jeu de données sans ouvrir Fabric : le projet, lui, les régénère à l'identique (graine aléatoire fixe `2026`).

RailPulse est un opérateur ferroviaire **fictif**. Les gares et leurs coordonnées sont réelles, tout le reste est simulé.

## Arborescence

```text
data/landing/
├── reference/
│   ├── stations.csv          12 gares (code, nom, ville, pays, latitude, longitude, hub)
│   ├── trainsets.json        40 rames (série, année de mise en service)
│   └── weather_daily.csv     4 548 relevés météo quotidiens (12 gares x 379 jours)
├── trips/
│   └── trips_AAAA-MM.csv     98 950 circulations brutes, un fichier par mois (12 fichiers)
├── bookings/
│   └── bookings_AAAA-MM.parquet  781 102 lignes de réservation (train x classe x canal)
└── plan/
    └── timetable_next14.csv  3 780 départs programmés sur les 14 prochains jours
```

## Dictionnaire des données

### `trips/trips_AAAA-MM.csv` : une ligne par train

| Colonne | Type | Description |
|---|---|---|
| `trip_id` | texte | Identifiant du train : `AAAAMMJJ-ORIGDEST-HHMM` |
| `service_date` | date | Jour d'exploitation |
| `line_code` | texte | Ligne commerciale, de `L01` à `L12` |
| `origin`, `destination` | texte | Codes gare à trois lettres |
| `scheduled_departure`, `scheduled_arrival` | horodatage | Horaires théoriques |
| `trainset_id` | texte | Rame affectée, de `TS01` à `TS40` |
| `status` | texte | `COMPLETED` ou `CANCELLED` |
| `arrival_delay_min` | entier | Retard à l'arrivée en minutes (vide si annulé) |
| `seats` | entier | Places offertes |
| `distance_km` | entier | Distance de la relation |

### `bookings/bookings_AAAA-MM.parquet` : une ligne par train, classe et canal

| Colonne | Type | Description |
|---|---|---|
| `trip_id` | texte | Train réservé |
| `travel_class` | entier | `1` (première) ou `2` (seconde) |
| `channel` | texte | `App`, `Web`, `Gare` ou `Partenaire` |
| `passengers` | entier | Voyageurs |
| `revenue_eur` | décimal | Recette en euros |
| `avg_lead_days` | décimal | Anticipation moyenne d'achat, en jours |

### `reference/weather_daily.csv` : une ligne par gare et par jour

`weather_date`, `station_code`, `temp_c`, `precip_mm`, `wind_kmh`, `severity` (0 calme, 1 perturbé, 2 dégradé, 3 sévère). Le fichier couvre les 12 mois d'historique **et** les 14 jours à prévoir, car le modèle de machine learning a besoin de la météo annoncée.

### `plan/timetable_next14.csv` : l'horaire à prévoir

`trip_id`, `service_date`, `line_code`, `origin`, `destination`, `scheduled_departure`, `trainset_id`, `seats`, `distance_km`, `load_factor` (remplissage attendu).

## Défauts injectés volontairement

Une plateforme de données se juge à ce qu'elle refuse. Le simulateur glisse donc trois défauts réalistes que la couche Silver doit intercepter :

| Défaut | Volume | Traitement dans `NB_02_Bronze_To_Silver` |
|---|---|---|
| Doublons de transmission | 400 lignes | supprimés par dédoublonnage |
| Capteur défaillant (`arrival_delay_min = -999`) | 40 lignes | `silver_quarantine`, motif `RETARD_IMPOSSIBLE` |
| Gare inconnue (`origin = XXX`) | 25 lignes | `silver_quarantine`, motif `GARE_INCONNUE` |
| Réservations de trains écartés | 516 lignes | rejetées par semi-jointure |

Résultat : **98 485 trains certifiés** et **780 586 lignes de réservation** en Silver.
