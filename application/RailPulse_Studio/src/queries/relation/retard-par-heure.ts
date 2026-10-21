import query from "./retard-par-heure.dax?raw";
import spec from "./retard-par-heure.json";
import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import { FORMATS } from "@/lib/formatage";
import { appliquerFiltreRelation } from "@/lib/filtre-relation";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, copierSpec, type DefinitionVisuel, type ParametresRelation } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "Circulation[Heure de départ]": { name: "Heure", displayName: "Heure de départ" },
    "[Retard moyen (min)]": { name: "RetardMoyen", displayName: "Retard moyen", format: FORMATS.minutes },
    "[Ponctualité %]": { name: "Ponctualite", displayName: "Ponctualité", format: FORMATS.pourcentage },
    "[Trains]": { name: "Trains", displayName: "Trains", format: FORMATS.entier },
};

/** Retard moyen par heure de départ, réseau ou relation choisie. */
export function retardParHeureQuery(params: ParametresRelation = {}): DefinitionVisuel {
    return {
        connection: CONNEXION,
        query: appliquerFiltreRelation(query, params.relation),
        columnMetadata,
        vegaLiteSpec: copierSpec(spec) as unknown as VisualizationSpec,
    };
}
