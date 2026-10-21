import query from "./kpi-fiche-relation.dax?raw";
import { FORMATS } from "@/lib/formatage";
import { appliquerFiltreRelation } from "@/lib/filtre-relation";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, type DefinitionRequete } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "[Titre fiche relation]": { name: "Titre", displayName: "Titre" },
    "[Sous-titre fiche relation]": { name: "SousTitre", displayName: "Sous-titre" },
    "[Récit fiche relation]": { name: "Recit", displayName: "Récit" },
    "[Ligne]": { name: "Ligne", displayName: "Ligne" },
    "[Voyageurs]": { name: "Voyageurs", displayName: "Voyageurs", format: FORMATS.entier },
    "[Chiffre d'affaires (M€)]": { name: "ChiffreAffairesM", displayName: "Chiffre d'affaires", format: FORMATS.millionsEuros },
    "[Ponctualité %]": { name: "Ponctualite", displayName: "Ponctualité", format: FORMATS.pourcentage },
    "[Objectif ponctualité %]": { name: "Objectif", displayName: "Objectif de ponctualité", format: FORMATS.pourcentage },
    "[Taux de remplissage %]": { name: "Remplissage", displayName: "Taux de remplissage", format: FORMATS.pourcentage },
    "[Recette par voyageur]": { name: "RecetteParVoyageur", displayName: "Recette par voyageur", format: FORMATS.euros },
    "[Retard moyen (min)]": { name: "RetardMoyen", displayName: "Retard moyen", format: FORMATS.minutes },
    "[Trains prévus]": { name: "TrainsPrevus", displayName: "Trains prévus (14 j)", format: FORMATS.entier },
    "[Trains à risque élevé]": { name: "TrainsRisqueEleve", displayName: "Trains à risque élevé", format: FORMATS.entier },
};

/** Fiche d'une relation : la relation est obligatoire. */
export function kpiFicheRelationQuery(params: { relation: string }): DefinitionRequete {
    if (!params.relation?.trim()) {
        throw new Error("La fiche relation exige une relation.");
    }
    return {
        connection: CONNEXION,
        query: appliquerFiltreRelation(query, params.relation),
        columnMetadata,
    };
}
