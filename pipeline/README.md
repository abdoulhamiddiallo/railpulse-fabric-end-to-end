# 🔁 Pipeline PL_RailPulse_Master

`PL_RailPulse_Master.json` est la définition complète du pipeline (format `pipeline-content.json` de Fabric). Les identifiants propres à un espace de travail sont remplacés par des repères `<ID_...>`.

![Pipeline PL_RailPulse_Master](../docs/diagrammes/pipeline.png)

| # | Activité | Type | Dépend de | Politique |
|---|---|---|---|---|
| 1 | `NB_Source_Simulator` | Notebook | aucune | 2 nouvelles tentatives, 120 s |
| 2 | `CP_Trips_To_Bronze` | Copier des données | 1 réussi | chemin générique `landing/trips/*.csv` vers `bronze_trips`, schéma écrasé |
| 3 | `DF_Reference` | Dataflow | 1 réussi | en parallèle du Copy |
| 4 | `NB_Bronze_To_Silver` | Notebook | 2 et 3 réussis | 2 nouvelles tentatives, 120 s |
| 5 | `NB_ML_Forecast` | Notebook | 4 réussi | 2 nouvelles tentatives, 120 s |
| 6 | `SP_Load_Gold` | Procédure stockée | 5 réussi | `dbo.usp_Load_Gold`, paramètre `run_id = @pipeline().RunId` |
| 7 | `MAIL_Success` | Outlook | 6 réussi | courriel avec l'identifiant d'exécution |
| 8 | `MAIL_Failure` | Outlook | 6 **en échec ou ignoré** | attrape aussi une panne survenue plus en amont |
| 9 | `FAIL_Pipeline` | Échec | 8 réussi | code `RP-500` : l'exécution reste rouge dans la surveillance |

**La règle qui fait la différence** : une branche d'échec branchée seulement sur « en échec » ne voit pas une panne d'une activité précédente, puisque `SP_Load_Gold` est alors *ignoré*. En branchant `MAIL_Failure` sur *échec* **et** *ignoré*, toute panne de la chaîne déclenche l'alerte. Et l'activité `Échec` finale garantit qu'un pipeline qui a envoyé un courriel d'erreur n'apparaît jamais en vert.

Pour l'importer tel quel : créez un pipeline vide, ouvrez la vue JSON (`{}`), collez le contenu, puis resélectionnez chaque notebook, le lakehouse, l'entrepôt et votre connexion Outlook.
