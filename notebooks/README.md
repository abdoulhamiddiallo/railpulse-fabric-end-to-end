# 📓 Notebooks

Quatre notebooks à importer dans l'espace de travail (**Importer → Notebook → Depuis cet ordinateur**). Chaque fichier est commenté ligne à ligne.

| Notebook | Langage | Lakehouse attaché | Rôle | Ce qu'il affiche à la fin |
|---|---|---|---|---|
| `NB_01_Source_Simulator` | PySpark | `LH_RailPulse_Bronze` (par défaut) | Simule le système source : 12 gares, 12 lignes, 40 rames, météo, 12 mois de circulations et de réservations, horaire des 14 prochains jours. Dépose CSV, Parquet et JSON dans `Files/landing`, et crée `bronze_stations` et `bronze_weather`. | `Circulations déposées 98 950 (dont 400 doublons et 65 lignes défectueuses)` |
| `NB_02_Bronze_To_Silver` | PySpark | Bronze et Silver | Contrôle qualité, quarantaine, `MERGE` Delta idempotent, intégrité référentielle des réservations, compactage `OPTIMIZE ... VORDER`. | `Silver : 98 485` · `orphelines écartées : 516` |
| `NB_03_ML_Delay_Forecast` | PySpark + scikit-learn | `LH_RailPulse_Silver` | Jeu de 9 caractéristiques, entraînement `HistGradientBoostingRegressor` suivi par MLflow, modèle enregistré et versionné, score par lots avec `PREDICT` sur 3 780 départs. | `MAE` proche de 2,6 min contre 3,4 sans modèle |
| `NB_04_Live_Simulator` | Python | aucun | Envoie la position, la vitesse et le retard de chaque train en circulation toutes les 3 secondes vers l'Eventstream, avec un incident simulé sur la ligne L02. | `trains en circulation : … · événements envoyés : …` |

## Points de conception

- **Graine fixe** : tout le monde obtient exactement les mêmes volumes.
- **Garde-fou** : `NB_01` refuse de s'exécuter si le lakehouse par défaut n'est pas `LH_RailPulse_Bronze`.
- **Chemins OneLake complets** dans `NB_02` et noms de tables qualifiés (`LH_RailPulse_Silver.silver_trips`) dans `NB_03` : aucun notebook ne dépend du lakehouse par défaut une fois lancé par le pipeline.
- **Découpage temporel** pour le ML : entraînement jusqu'au 31 juillet 2026, test sur août et septembre. On apprend sur le passé, on mesure sur le futur.
- `NB_04` : collez la chaîne de connexion de la **clé primaire** du point de terminaison personnalisé de l'Eventstream dans `CONNECTION_STRING`. Le simulateur s'arrête seul après 30 minutes.
