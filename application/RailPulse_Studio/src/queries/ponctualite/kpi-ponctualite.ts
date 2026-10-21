import query from "./kpi-ponctualite.dax?raw";
import { FORMATS } from "@/lib/formatage";
import { appliquerFiltreRelation } from "@/lib/filtre-relation";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, type DefinitionRequete, type ParametresRelation } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "[Ponctualité %]": { name: "Ponctualite", displayName: "Ponctualité", format: FORMATS.pourcentage },
    "[Écart à l'objectif (pts)]": { name: "EcartObjectif", displayName: "Écart à l'objectif", format: FORMATS.points },
    "[Retard moyen (min)]": { name: "RetardMoyen", displayName: "Retard moyen", format: FORMATS.minutes },
    "[Trains en retard > 15 min]": { name: "TrainsRetard15", displayName: "Trains en retard > 15 min", format: FORMATS.entier },
    "[Taux d'annulation %]": { name: "TauxAnnulation", displayName: "Taux d'annulation", format: "0.00 %" },
    "[Rang ponctualité]": { name: "Rang", displayName: "Rang de ponctualité" },
    "[Récit ponctualité]": { name: "Recit", displayName: "Récit ponctualité" },
    "[Objectif ponctualité %]": { name: "Objectif", displayName: "Objectif de ponctualité", format: FORMATS.pourcentage },
};

/** Indicateurs de ponctualité, réseau ou relation choisie. */
export function kpiPonctualiteQuery(params: ParametresRelation = {}): DefinitionRequete {
    return {
        connection: CONNEXION,
        query: appliquerFiltreRelation(query, params.relation),
        columnMetadata,
    };
}
