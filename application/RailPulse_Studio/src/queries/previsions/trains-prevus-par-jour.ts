import query from "./trains-prevus-par-jour.dax?raw";
import spec from "./trains-prevus-par-jour.json";
import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import { FORMATS } from "@/lib/formatage";
import { appliquerFiltreRelation } from "@/lib/filtre-relation";
import type { JetonsCouleur } from "@/lib/jetons-couleur";
import { definirGamme } from "@/lib/spec-vega";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, copierSpec, type DefinitionVisuel, type ParametresRelation } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "Date[Date]": { name: "Date", displayName: "Date" },
    "Date[Jour]": { name: "Jour", displayName: "Jour" },
    "Prévision[Niveau de risque]": { name: "Risque", displayName: "Niveau de risque" },
    "[Trains prévus]": { name: "TrainsPrevus", displayName: "Trains prévus", format: FORMATS.entier },
};

export interface ParametresTrainsPrevusParJour extends ParametresRelation {
    jetons?: JetonsCouleur;
}

/** Trains prévus par jour, empilés par niveau de risque (rouge, ambre, vert). */
export function trainsPrevusParJourQuery(params: ParametresTrainsPrevusParJour = {}): DefinitionVisuel {
    const vegaLiteSpec = copierSpec(spec);
    const { jetons } = params;
    definirGamme(
        vegaLiteSpec,
        ["encoding", "color", "scale"],
        jetons ? [jetons.signal.critique, jetons.signal.vigilance, jetons.signal.conforme] : undefined,
    );
    return {
        connection: CONNEXION,
        query: appliquerFiltreRelation(query, params.relation),
        columnMetadata,
        vegaLiteSpec: vegaLiteSpec as unknown as VisualizationSpec,
    };
}
