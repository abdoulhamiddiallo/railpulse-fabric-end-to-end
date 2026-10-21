import query from "./voyageurs-mensuels.dax?raw";
import spec from "./voyageurs-mensuels.json";
import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import { FORMATS } from "@/lib/formatage";
import { appliquerFiltreRelation } from "@/lib/filtre-relation";
import type { JetonsCouleur } from "@/lib/jetons-couleur";
import { ecrireChemin } from "@/lib/spec-vega";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, copierSpec, type DefinitionVisuel, type ParametresRelation } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "Mois[Ordre]": { name: "Ordre", displayName: "Ordre" },
    "Mois[Mois]": { name: "Mois", displayName: "Mois" },
    "[Voyageurs]": { name: "Voyageurs", displayName: "Voyageurs", format: FORMATS.entier },
    "[Ponctualité %]": { name: "Ponctualite", displayName: "Ponctualité", format: FORMATS.pourcentage },
    "[Objectif ponctualité %]": { name: "Objectif", displayName: "Objectif de ponctualité", format: FORMATS.pourcentage },
};

/** Chemin de la marque « règle d'objectif » dans la spec. */
export const CHEMIN_REGLE_OBJECTIF = ["layer", 1, "layer", 1, "mark"] as const;

/** Chemin de la marque « courbe de ponctualité » dans la spec. */
export const CHEMIN_COURBE_PONCTUALITE = ["layer", 1, "layer", 0, "mark"] as const;

export interface ParametresVoyageursMensuels extends ParametresRelation {
    jetons?: JetonsCouleur;
}

/** Voyageurs et ponctualité mensuels, avec la règle d'objectif aux couleurs du signal de vigilance. */
export function voyageursMensuelsQuery(params: ParametresVoyageursMensuels = {}): DefinitionVisuel {
    const vegaLiteSpec = copierSpec(spec);
    const couleur = params.jetons?.signal.vigilance;
    if (couleur) {
        ecrireChemin(vegaLiteSpec, [...CHEMIN_REGLE_OBJECTIF, "color"], couleur);
    }
    // La courbe de ponctualité prend la couleur du signal « conforme » pour se détacher des barres.
    const couleurCourbe = params.jetons?.signal.conforme;
    if (couleurCourbe) {
        ecrireChemin(vegaLiteSpec, [...CHEMIN_COURBE_PONCTUALITE, "color"], couleurCourbe);
    }
    return {
        connection: CONNEXION,
        query: appliquerFiltreRelation(query, params.relation),
        columnMetadata,
        vegaLiteSpec: vegaLiteSpec as unknown as VisualizationSpec,
    };
}
