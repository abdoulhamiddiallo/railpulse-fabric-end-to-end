# 🧠 Modèle sémantique SM_RailPulse

Modèle **Direct Lake** posé sur l'entrepôt `WH_RailPulse_Gold` : les visuels lisent directement les fichiers Delta de OneLake, sans importation et sans actualisation planifiée.

![Schéma en étoile](../docs/diagrammes/modele_semantique.png)

## Deux façons de l'obtenir

| Fichier | Pour qui | Contenu |
|---|---|---|
| `SM_RailPulse_Mesures.dax` | celui qui suit le guide | les **32 mesures essentielles** en une seule requête DAX : collez-la dans la vue *Requête DAX* du modèle, exécutez, puis **Mettre à jour le modèle avec les modifications**. La requête affiche aussi les chiffres de contrôle. |
| `SM_RailPulse.SemanticModel/` | celui qui veut le modèle complet | la définition **TMDL** du modèle déployé : 9 tables, 10 relations, **50 mesures** (les 32 du guide, plus 18 mesures de narration et de mise en forme utilisées par le rapport et l'application). Remplacez les repères `<ID_...>` de `expressions.tmdl` par l'espace de travail et l'entrepôt cibles. |

## Tables

| Table du modèle | Source | Rôle |
|---|---|---|
| `Circulation` | `fact_trip` | fait : un train |
| `Réservation` | `fact_booking` | fait : train x classe x canal |
| `Prévision` | `fact_delay_forecast` | fait : un départ des 14 prochains jours |
| `Date` | `dim_date` | table de dates marquée, 457 jours |
| `Relation` | `dim_route` | 24 relations orientées |
| `Gare` | `dim_station` | 12 gares, latitude et longitude |
| `Rame` | `dim_trainset` | 40 rames |
| `Mois` | table calculée | mois de l'exercice, triés d'octobre à septembre |
| `_Mesures` | table de rangement | toutes les mesures, aucune donnée |

Les colonnes techniques (clés, montants bruts) sont **masquées** : l'utilisateur ne voit que des noms métier en français et des mesures. `discourageImplicitMeasures` interdit les agrégations implicites.

## Les mesures, rangées en dossiers

| Dossier | Mesures | Exemples |
|---|---|---|
| 01 Volumes | 11 | Trains, Voyageurs, Taux de remplissage %, Évolution voyageurs % |
| 02 Qualité de service | 9 | Ponctualité %, Objectif ponctualité %, Écart à l'objectif (pts), Rang ponctualité |
| 03 Finance | 9 | Chiffre d'affaires (M€), Recette par voyageur-km, Part 1re classe % |
| 04 Climat | 3 | CO2 évité (t), Tours de la Terre en voiture évités |
| 05 Prévisions | 4 | Trains à risque élevé, Part à risque élevé % |
| 06 Récit | 9 | Récit réseau, Récit ponctualité : une phrase calculée qui commente la page |
| 99 Mise en forme | 5 | Couleur ponctualité, Couleur risque |

```dax
Ponctualité % = DIVIDE ( [Trains à l'heure], [Trains assurés] )

Évolution voyageurs % =
    VAR _prec = [Voyageurs mois précédent]
    RETURN IF ( NOT ISBLANK ( _prec ), DIVIDE ( [Voyageurs] - _prec, _prec ) )

Couleur ponctualité =
    VAR _p = [Ponctualité %]
    RETURN SWITCH ( TRUE (), ISBLANK ( _p ), "#C9D3E0", _p >= 0.77, "#1F9D74", _p >= 0.74, "#E8A33D", "#D64545" )
```

## Chiffres de contrôle

| Mesure | Valeur attendue |
|---|---|
| Voyageurs | 26 273 478 |
| Chiffre d'affaires (M€) | 1 049,78 |
| Ponctualité % | 75,56 % |
| CO2 évité (t) | 1 164 305 |
| Trains prévus | 3 780 |
