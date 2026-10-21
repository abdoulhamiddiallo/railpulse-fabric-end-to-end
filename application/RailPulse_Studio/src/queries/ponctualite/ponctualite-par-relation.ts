import query from "./ponctualite-par-relation.dax?raw";
import spec from "./ponctualite-par-relation.json";
import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import { FORMATS } from "@/lib/formatage";
import type { JetonsCouleur } from "@/lib/jetons-couleur";
import { definirGamme, ecrireChemin, opaciteMiseEnAvant } from "@/lib/spec-vega";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, copierSpec, type DefinitionVisuel } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "Relation[Relation]": { name: "Relation", displayName: "Relation" },
    "Relation[Ligne]": { name: "Ligne", displayName: "Ligne" },
    "[Ponctualité %]": { name: "Ponctualite", displayName: "Ponctualité", format: FORMATS.pourcentage },
    "[Retard moyen (min)]": { name: "RetardMoyen", displayName: "Retard moyen", format: FORMATS.minutes },
    "[Trains assurés]": { name: "TrainsAssures", displayName: "Trains assurés", format: FORMATS.entier },
    "[Objectif ponctualité %]": { name: "Objectif", displayName: "Objectif de ponctualité", format: FORMATS.pourcentage },
};

/** Champ porté par les sélections émises au clic sur une barre. */
export const CHAMP_SELECTION_RELATION = "Relation";

export interface ParametresPonctualiteParRelation {
    jetons?: JetonsCouleur;
    /** Relation sélectionnée, mise en avant (les autres sont estompées). */
    relationSelectionnee?: string | null;
}

/** Classement des relations par ponctualité, coloré par seuil autour de l'objectif. */
export function ponctualiteParRelationQuery(params: ParametresPonctualiteParRelation = {}): DefinitionVisuel {
    const vegaLiteSpec = copierSpec(spec);
    const { jetons, relationSelectionnee } = params;
    definirGamme(
        vegaLiteSpec,
        ["layer", 0, "encoding", "color", "scale"],
        jetons ? [jetons.signal.conforme, jetons.signal.vigilance, jetons.signal.critique] : undefined,
    );
    ecrireChemin(vegaLiteSpec, ["layer", 0, "encoding", "opacity"], opaciteMiseEnAvant("Relation", relationSelectionnee));
    if (jetons) {
        ecrireChemin(vegaLiteSpec, ["layer", 2, "mark", "color"], jetons.texte);
    }
    return {
        connection: CONNEXION,
        query,
        columnMetadata,
        vegaLiteSpec: vegaLiteSpec as unknown as VisualizationSpec,
    };
}
