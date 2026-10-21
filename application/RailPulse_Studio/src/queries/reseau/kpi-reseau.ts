import query from "./kpi-reseau.dax?raw";
import { FORMATS } from "@/lib/formatage";
import { appliquerFiltreRelation } from "@/lib/filtre-relation";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, type DefinitionRequete, type ParametresRelation } from "../types";

/** Métadonnées du tableau d'affichage réseau, clés = colonnes DAX exactes. */
export const columnMetadata: ColumnMetadataMap = {
    "[Trains assurés]": { name: "TrainsAssures", displayName: "Trains assurés", format: FORMATS.entier },
    "[Voyageurs]": { name: "Voyageurs", displayName: "Voyageurs", format: FORMATS.entier },
    "[Chiffre d'affaires (M€)]": { name: "ChiffreAffairesM", displayName: "Chiffre d'affaires", format: FORMATS.millionsEuros },
    "[Ponctualité %]": { name: "Ponctualite", displayName: "Ponctualité", format: FORMATS.pourcentage },
    "[Taux de remplissage %]": { name: "Remplissage", displayName: "Taux de remplissage", format: FORMATS.pourcentage },
    "[CO2 évité (t)]": { name: "Co2Evite", displayName: "CO2 évité", format: FORMATS.tonnes },
    "[Objectif ponctualité %]": { name: "Objectif", displayName: "Objectif de ponctualité", format: FORMATS.pourcentage },
};

/** Indicateurs clés du réseau, restreints à la relation sélectionnée le cas échéant. */
export function kpiReseauQuery(params: ParametresRelation = {}): DefinitionRequete {
    return {
        connection: CONNEXION,
        query: appliquerFiltreRelation(query, params.relation),
        columnMetadata,
    };
}
