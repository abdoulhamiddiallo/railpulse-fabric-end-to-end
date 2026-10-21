import query from "./recit-reseau.dax?raw";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, type DefinitionRequete } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "[Période analysée]": { name: "Periode", displayName: "Période analysée" },
    "[Récit réseau]": { name: "Recit", displayName: "Récit réseau" },
};

/** Période de l'exercice et récit du réseau entier. */
export function recitReseauQuery(): DefinitionRequete {
    return { connection: CONNEXION, query, columnMetadata };
}
