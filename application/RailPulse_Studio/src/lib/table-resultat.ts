import type { DataTable, InteractionEvent } from "@microsoft/fabric-visuals-core";

/** Renvoie la ligne `index` d'une DataTable sous forme d'objet indexé par alias de colonne. */
export function ligneEnObjet(table: DataTable, index = 0): Record<string, unknown> | undefined {
    const ligne = table.rows[index];
    if (!ligne) return undefined;
    const objet: Record<string, unknown> = {};
    table.columns.forEach((colonne, i) => {
        objet[colonne.name] = ligne[i] ?? null;
    });
    return objet;
}

/** Renvoie les valeurs d'une colonne identifiée par son alias. */
export function valeursColonne(table: DataTable, nom: string): unknown[] {
    const i = table.columns.findIndex((c) => c.name === nom);
    if (i < 0) return [];
    return table.rows.map((ligne) => ligne[i] ?? null);
}

/** Format VBA déclaré pour une colonne, s'il existe. */
export function formatColonne(table: DataTable, nom: string): string | undefined {
    return table.columns.find((c) => c.name === nom)?.format;
}

/** Résultat d'une interaction sur un visuel portant un champ de relation. */
export type ActionSelection =
    | { type: "selection"; valeur: string }
    | { type: "effacement" };

/**
 * Traduit les événements d'interaction d'un visuel en action de sélection.
 * Seul le dernier événement compte ; un événement sans prédicat exploitable est ignoré.
 */
export function lireSelection(
    evenements: readonly InteractionEvent[],
    champ: string,
): ActionSelection | undefined {
    const dernier = evenements[evenements.length - 1];
    if (!dernier) return undefined;
    if (dernier.action === "clear") return { type: "effacement" };

    for (const selection of dernier.selections) {
        for (const predicat of selection.predicates) {
            if (predicat.type === "set" && predicat.name === champ) {
                const valeur = predicat.values.find((v) => typeof v === "string" && v.length > 0);
                if (typeof valeur === "string") return { type: "selection", valeur };
            }
        }
    }
    return undefined;
}
