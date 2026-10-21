# 🔄 Dataflow Gen2

`DF_RailPulse_Reference.pq` est le code Power Query M du Dataflow Gen2 **DF_RailPulse_Reference**.

| Requête | Source (Bronze) | Transformation | Destination (Silver, mode Remplacer) |
|---|---|---|---|
| `silver_stations` | `bronze_stations` | ajoute `country_name` à partir du code ISO du pays | `silver_stations` |
| `silver_weather` | `bronze_weather` | ajoute `weather_label` : Calme, Perturbé, Dégradé, Sévère | `silver_weather` |

**Pourquoi un Dataflow ici ?** Ce sont de petites tables de référence qu'un analyste doit pouvoir faire évoluer sans écrire de Spark. Le Dataflow tourne en parallèle du Copy, dans le même pipeline.

Pour le reproduire : créez le Dataflow dans l'interface (**Obtenir des données → Lakehouse**), puis ajoutez les deux colonnes personnalisées. Les identifiants `<ID_...>` du fichier sont ceux de votre espace de travail, Fabric les renseigne lui-même.
