import query from "./liste-relations.dax?raw";
import { FORMATS } from "@/lib/formatage";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, type DefinitionRequete } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "Relation[Ligne]": { name: "Ligne", displayName: "Ligne" },
    "Relation[Relation]": { name: "Relation", displayName: "Relation" },
    "Relation[Distance (km)]": { name: "Distance", displayName: "Distance", format: FORMATS.kilometres },
    "Relation[Transfrontalière]": { name: "Transfrontaliere", displayName: "Transfrontalière" },
    "[Voyageurs]": { name: "Voyageurs", displayName: "Voyageurs", format: FORMATS.entier },
};

/** Relation affichée par défaut sur la fiche quand rien n'est sélectionné. */
export const RELATION_PAR_DEFAUT = "Paris > Lyon";

/** Les 24 relations du réseau, pour le sélecteur. */
export function listeRelationsQuery(): DefinitionRequete {
    return { connection: CONNEXION, query, columnMetadata };
}
