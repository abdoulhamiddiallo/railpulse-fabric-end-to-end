# 📊 Rapport RPT_RailPulse

Rapport Power BI construit sur `SM_RailPulse` : six pages visibles, une page d'extraction et une page d'info-bulle. La version PDF est dans [`docs/RPT_RailPulse.pdf`](../docs/RPT_RailPulse.pdf).

| Page | Question à laquelle elle répond |
|---|---|
| Réseau | Combien de trains, de voyageurs, de recettes, et où ? Carte des 12 lignes, tendance mensuelle face à l'objectif. |
| Ponctualité | Quelles relations, quelles heures, quels jours tiennent la promesse de l'heure ? |
| Revenus | D'où vient chaque euro : relation, classe, canal, anticipation d'achat ? |
| Climat | Combien de CO₂ le train a évité face à l'avion, mois par mois et relation par relation ? |
| Prévisions | Quels départs des 14 prochains jours sont à risque, selon le modèle de machine learning ? |
| Direct | Ce qui se passe maintenant, et l'accès à la salle de contrôle temps réel. |

## Ce qui fait sa qualité

- Une **phrase calculée** par page (mesures du dossier *06 Récit*) commente les chiffres sans intervention humaine.
- La **carte du réseau** est une image de fond générée à partir des coordonnées réelles des gares, sur laquelle un nuage de points positionne chaque gare par sa latitude et sa longitude.
- Le **code couleur** est le même partout : vert objectif atteint, ambre à moins de 3 points, rouge au-delà.
- Une **page d'extraction** *Fiche relation* s'ouvre d'un clic droit sur n'importe quelle relation, et une **info-bulle de page** résume une relation au survol.
- Une barre de navigation par onglets relie les six pages, et chaque visuel porte un titre et un sous-titre qui disent comment le lire.

## Le dossier `RPT_RailPulse.Report/`

C'est la définition **PBIR** du rapport, au format du contrôle de code source de Fabric : une page, un dossier ; un visuel, un fichier `visual.json`. Le fichier `definition.pbir` pointe vers le modèle du dépôt (`../../modele-semantique/SM_RailPulse.SemanticModel`).
