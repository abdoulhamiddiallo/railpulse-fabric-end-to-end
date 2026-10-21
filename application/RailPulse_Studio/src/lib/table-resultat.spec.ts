import { describe, expect, it } from "vitest";
import type { DataTable } from "@microsoft/fabric-visuals-core";
import { formatColonne, lireSelection, ligneEnObjet, valeursColonne } from "@/lib/table-resultat";

// Forme réelle du résultat « ponctualité par relation » après toDataTable.
const TABLE: DataTable = {
    columns: [
        { name: "Relation", displayName: "Relation" },
        { name: "Ligne", displayName: "Ligne" },
        { name: "Ponctualite", displayName: "Ponctualité", format: "0.0 %" },
    ],
    rows: [
        ["Francfort > Cologne", "L06", 0.8073213934264909],
        ["Bruxelles > Paris", "L03", 0.7121805203776191],
    ],
};

describe("ligneEnObjet", () => {
    it("indexe la ligne par alias", () => {
        expect(ligneEnObjet(TABLE, 1)).toEqual({
            Relation: "Bruxelles > Paris",
            Ligne: "L03",
            Ponctualite: 0.7121805203776191,
        });
    });

    it("renvoie undefined hors limites", () => {
        expect(ligneEnObjet(TABLE, 5)).toBeUndefined();
    });
});

describe("valeursColonne / formatColonne", () => {
    it("extrait une colonne et son format", () => {
        expect(valeursColonne(TABLE, "Ligne")).toEqual(["L06", "L03"]);
        expect(valeursColonne(TABLE, "Inconnue")).toEqual([]);
        expect(formatColonne(TABLE, "Ponctualite")).toBe("0.0 %");
    });
});

describe("lireSelection", () => {
    it("lit la relation cliquée parmi les prédicats", () => {
        expect(
            lireSelection(
                [{
                    action: "select",
                    selections: [{
                        predicates: [
                            { type: "set", name: "Ligne", values: ["L03"] },
                            { type: "set", name: "Relation", values: ["Bruxelles > Paris"] },
                        ],
                    }],
                }],
                "Relation",
            ),
        ).toEqual({ type: "selection", valeur: "Bruxelles > Paris" });
    });

    it("traduit un effacement", () => {
        expect(lireSelection([{ action: "clear" }], "Relation")).toEqual({ type: "effacement" });
    });

    it("ignore les sélections sans le champ attendu", () => {
        expect(
            lireSelection(
                [{ action: "select", selections: [{ predicates: [{ type: "range", name: "Relation", min: 0 }] }] }],
                "Relation",
            ),
        ).toBeUndefined();
        expect(lireSelection([], "Relation")).toBeUndefined();
    });
});
