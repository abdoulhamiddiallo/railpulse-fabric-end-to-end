import query from "./retard-jour-heure.dax?raw";
import spec from "./retard-jour-heure.json";
import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import { FORMATS } from "@/lib/formatage";
import { appliquerFiltreRelation } from "@/lib/filtre-relation";
import type { JetonsCouleur } from "@/lib/jetons-couleur";
import { definirGamme } from "@/lib/spec-vega";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, copierSpec, type DefinitionVisuel, type ParametresRelation } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "Date[N° jour]": { name: "NumeroJour", displayName: "N° jour" },
    "Date[Jour]": { name: "Jour", displayName: "Jour" },
    "Circulation[Heure de départ]": { name: "Heure", displayName: "Heure de départ" },
    "[Retard moyen (min)]": { name: "RetardMoyen", displayName: "Retard moyen", format: FORMATS.minutes },
    "[Trains]": { name: "Trains", displayName: "Trains", format: FORMATS.entier },
};

export interface ParametresRetardJourHeure extends ParametresRelation {
    jetons?: JetonsCouleur;
}

/** Carte de chaleur du retard moyen par jour et heure de départ. */
export function retardJourHeureQuery(params: ParametresRetardJourHeure = {}): DefinitionVisuel {
    const vegaLiteSpec = copierSpec(spec);
    definirGamme(vegaLiteSpec, ["encoding", "color", "scale"], params.jetons?.chaleur);
    return {
        connection: CONNEXION,
        query: appliquerFiltreRelation(query, params.relation),
        columnMetadata,
        vegaLiteSpec: vegaLiteSpec as unknown as VisualizationSpec,
    };
}
