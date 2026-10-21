import query from "./voyageurs-par-ligne.dax?raw";
import spec from "./voyageurs-par-ligne.json";
import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import { FORMATS } from "@/lib/formatage";
import type { JetonsCouleur } from "@/lib/jetons-couleur";
import { CODES_LIGNES } from "@/lib/lignes";
import { definirGamme, ecrireChemin, opaciteMiseEnAvant } from "@/lib/spec-vega";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, copierSpec, type DefinitionVisuel } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "Relation[Ligne]": { name: "Ligne", displayName: "Ligne" },
    "[Voyageurs]": { name: "Voyageurs", displayName: "Voyageurs", format: FORMATS.entier },
    "[Ponctualité %]": { name: "Ponctualite", displayName: "Ponctualité", format: FORMATS.pourcentage },
};

const CHEMIN_COULEUR = ["layer", 0, "encoding", "color"] as const;

export interface ParametresVoyageursParLigne {
    jetons?: JetonsCouleur;
    /** Ligne de la relation sélectionnée, mise en avant. */
    ligneMiseEnAvant?: string | null;
}

/** Voyageurs par ligne, couleurs de pictogramme et mise en avant éventuelle. */
export function voyageursParLigneQuery(params: ParametresVoyageursParLigne = {}): DefinitionVisuel {
    const vegaLiteSpec = copierSpec(spec);
    ecrireChemin(vegaLiteSpec, [...CHEMIN_COULEUR, "scale", "domain"], [...CODES_LIGNES]);
    definirGamme(vegaLiteSpec, [...CHEMIN_COULEUR, "scale"], params.jetons?.lignes);
    ecrireChemin(vegaLiteSpec, ["layer", 0, "encoding", "opacity"], opaciteMiseEnAvant("Ligne", params.ligneMiseEnAvant));
    return {
        connection: CONNEXION,
        query,
        columnMetadata,
        vegaLiteSpec: vegaLiteSpec as unknown as VisualizationSpec,
    };
}
