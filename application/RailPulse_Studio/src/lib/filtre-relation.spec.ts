import { describe, expect, it } from "vitest";
import {
    appliquerFiltreRelation,
    contientJetonRelation,
    echapperChaineDax,
    expressionFiltreRelation,
} from "@/lib/filtre-relation";

const SUMMARIZE = `EVALUATE
SUMMARIZECOLUMNS(
    'Mois'[Mois],
    /*FILTRE_RELATION,*/
    "Voyageurs", [Voyageurs]
)`;

const CALCULATE = `EVALUATE
CALCULATETABLE(
    ROW("Voyageurs", [Voyageurs])
    /*,FILTRE_RELATION*/
)`;

describe("echapperChaineDax", () => {
    it("double les guillemets", () => {
        expect(echapperChaineDax('Gare "Centrale"')).toBe('Gare ""Centrale""');
    });
});

describe("expressionFiltreRelation", () => {
    it("construit un TREATAS sur la colonne Relation", () => {
        expect(expressionFiltreRelation("Paris > Lyon")).toBe(
            `TREATAS({"Paris > Lyon"}, 'Relation'[Relation])`,
        );
    });
});

describe("appliquerFiltreRelation", () => {
    it("laisse la requête intacte sans relation", () => {
        expect(appliquerFiltreRelation(SUMMARIZE, null)).toBe(SUMMARIZE);
        expect(appliquerFiltreRelation(SUMMARIZE, undefined)).toBe(SUMMARIZE);
        expect(appliquerFiltreRelation(SUMMARIZE, "   ")).toBe(SUMMARIZE);
    });

    it("insère un argument de filtre dans SUMMARIZECOLUMNS", () => {
        const dax = appliquerFiltreRelation(SUMMARIZE, "Paris > Lyon");
        expect(dax).toContain(`TREATAS({"Paris > Lyon"}, 'Relation'[Relation]),\n    "Voyageurs"`);
        expect(contientJetonRelation(dax)).toBe(false);
    });

    it("ajoute un filtre final dans CALCULATETABLE", () => {
        const dax = appliquerFiltreRelation(CALCULATE, "Bâle > Zurich");
        expect(dax).toContain(`, TREATAS({"Bâle > Zurich"}, 'Relation'[Relation])\n)`);
    });

    it("rejette une requête sans jeton quand une relation est fournie", () => {
        expect(() => appliquerFiltreRelation("EVALUATE ROW(\"a\", 1)", "Paris > Lyon")).toThrow(
            "La requête DAX ne contient aucun jeton de filtre de relation.",
        );
    });
});
