# 🏛️ Entrepôt WH_RailPulse_Gold

`WH_RailPulse_Gold.sql` contient trois scripts à exécuter dans l'ordre, dans l'éditeur SQL de l'entrepôt.

| Script | Contenu |
|---|---|
| 1 · Tables de contrôle | `cfg_emission_factor` (6 g de CO₂ par voyageur-km en train, 180 g en avion), `etl_run_log`, et `mesures`, table d'une ligne qui ancre les mesures DAX |
| 2 · Procédure `usp_Load_Gold` | reconstruit le schéma en étoile à chaque exécution, en lisant **directement** les tables du lakehouse Silver par des requêtes inter-bases (`LH_RailPulse_Silver.dbo.silver_trips`), sans aucune copie |
| 3 · Vues de lecture | `vw_headline` (les cinq chiffres clés) et `vw_line_scorecard` (bulletin par ligne) |

## Le schéma en étoile produit

| Table | Lignes | Grain |
|---|---|---|
| `dim_date` | 457 | un jour, du 01/10/2025 au 31/12/2026, généré sans boucle par une table de nombres |
| `dim_station` | 12 | une gare |
| `dim_route` | 24 | une relation orientée (Paris > Lyon et Lyon > Paris sont deux relations) |
| `dim_trainset` | 40 | une rame |
| `fact_trip` | 98 485 | un train, avec voyageurs, recette, voyageurs-km et CO₂ évité |
| `fact_booking` | 780 586 | un train x une classe x un canal |
| `fact_delay_forecast` | 3 780 | un départ des 14 prochains jours, avec son retard prévu et son niveau de risque |

Le facteur d'émission vit dans une table, pas dans le code : le modifier recalcule tout le CO₂ au chargement suivant. Chaque exécution écrit son `run_id` et ses volumes dans `etl_run_log`.
