import { useMemo } from "react";
import { useTableModele } from "@/hooks/use-table-modele";
import { listeRelationsQuery } from "@/queries";

/** Relation du réseau telle que listée par le modèle. */
export interface RelationReseau {
    relation: string;
    ligne: string;
    distance: number | null;
    transfrontaliere: boolean | null;
}

const definition = listeRelationsQuery();

/** Liste des 24 relations (pour le sélecteur, les pictogrammes et la mise en avant). */
export function useRelations() {
    const { table, isLoading, error } = useTableModele(definition);

    const relations = useMemo<RelationReseau[]>(() => {
        if (!table) return [];
        const index = (nom: string) => table.columns.findIndex((c) => c.name === nom);
        const iRelation = index("Relation");
        const iLigne = index("Ligne");
        const iDistance = index("Distance");
        const iTrans = index("Transfrontaliere");
        return table.rows
            .filter((ligne) => typeof ligne[iRelation] === "string")
            .map((ligne) => ({
                relation: ligne[iRelation] as string,
                ligne: String(ligne[iLigne] ?? ""),
                distance: typeof ligne[iDistance] === "number" ? (ligne[iDistance] as number) : null,
                transfrontaliere: typeof ligne[iTrans] === "boolean" ? (ligne[iTrans] as boolean) : null,
            }));
    }, [table]);

    return { relations, isLoading, error };
}
