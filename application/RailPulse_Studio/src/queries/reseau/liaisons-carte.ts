import query from "./liaisons-carte.dax?raw";
import { FORMATS } from "@/lib/formatage";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, type DefinitionRequete } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "Relation[Ligne]": { name: "Ligne", displayName: "Ligne" },
    "Relation[Origine]": { name: "Origine", displayName: "Origine" },
    "Relation[Destination]": { name: "Destination", displayName: "Destination" },
    "[Voyageurs ligne]": { name: "VoyageursLigne", displayName: "Voyageurs de la ligne", format: FORMATS.entier },
    "[Lat origine]": { name: "LatOrigine", displayName: "Latitude origine" },
    "[Lon origine]": { name: "LonOrigine", displayName: "Longitude origine" },
    "[Lat destination]": { name: "LatDestination", displayName: "Latitude destination" },
    "[Lon destination]": { name: "LonDestination", displayName: "Longitude destination" },
};

/** Segments des douze lignes, jeu de données « liaisons » de la carte. */
export function liaisonsCarteQuery(): DefinitionRequete {
    return { connection: CONNEXION, query, columnMetadata };
}
