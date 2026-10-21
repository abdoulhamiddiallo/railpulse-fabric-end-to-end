import query from "./kpi-previsions.dax?raw";
import { FORMATS } from "@/lib/formatage";
import { appliquerFiltreRelation } from "@/lib/filtre-relation";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, type DefinitionRequete, type ParametresRelation } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "[Trains prévus]": { name: "TrainsPrevus", displayName: "Trains prévus", format: FORMATS.entier },
    "[Retard prévu moyen (min)]": { name: "RetardPrevuMoyen", displayName: "Retard prévu moyen", format: FORMATS.minutes },
    "[Trains à risque élevé]": { name: "TrainsRisqueEleve", displayName: "Trains à risque élevé", format: FORMATS.entier },
    "[Part à risque élevé %]": { name: "PartRisqueEleve", displayName: "Part à risque élevé", format: FORMATS.pourcentage },
    "[Récit prévisions]": { name: "Recit", displayName: "Récit prévisions" },
};

/** Indicateurs des prévisions à 14 jours. */
export function kpiPrevisionsQuery(params: ParametresRelation = {}): DefinitionRequete {
    return {
        connection: CONNEXION,
        query: appliquerFiltreRelation(query, params.relation),
        columnMetadata,
    };
}
