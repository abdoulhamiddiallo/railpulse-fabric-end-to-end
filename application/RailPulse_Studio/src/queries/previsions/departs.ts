import requeteRetard from "./departs-a-surveiller.dax?raw";
import requeteChronologique from "./departs-prochains.dax?raw";
import { FORMATS } from "@/lib/formatage";
import { appliquerFiltreRelation } from "@/lib/filtre-relation";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, type DefinitionRequete, type ParametresRelation } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "[Départ prévu]": { name: "Depart", displayName: "Départ prévu" },
    "[Relation]": { name: "Relation", displayName: "Relation" },
    "[Ligne]": { name: "Ligne", displayName: "Ligne" },
    "[Rame]": { name: "Rame", displayName: "Rame" },
    "[Sévérité météo]": { name: "SeveriteMeteo", displayName: "Sévérité météo", format: "0" },
    "[Remplissage prévu]": { name: "RemplissagePrevu", displayName: "Remplissage prévu", format: "0 %" },
    "[Retard prévu (min)]": { name: "RetardPrevu", displayName: "Retard prévu", format: FORMATS.minutes },
    "[Niveau de risque]": { name: "Risque", displayName: "Niveau de risque" },
};

/** Ordre du tableau des départs : retard prévu décroissant ou chronologique. */
export type OrdreDeparts = "retard" | "chronologique";

export interface ParametresDeparts extends ParametresRelation {
    ordre?: OrdreDeparts;
}

/** Les 50 départs prévus à surveiller (par retard) ou à venir (par heure). */
export function departsQuery(params: ParametresDeparts = {}): DefinitionRequete {
    const base = params.ordre === "chronologique" ? requeteChronologique : requeteRetard;
    return {
        connection: CONNEXION,
        query: appliquerFiltreRelation(base, params.relation),
        columnMetadata,
    };
}
