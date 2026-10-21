import { describe, expect, it } from "vitest";
import { kpiFicheRelationQuery, listeRelationsQuery, RELATION_PAR_DEFAUT, retardParHeureQuery } from "./index";

describe("kpiFicheRelationQuery", () => {
    it("exige une relation", () => {
        expect(() => kpiFicheRelationQuery({ relation: " " })).toThrow("La fiche relation exige une relation.");
    });

    it("filtre la fiche sur la relation demandée", () => {
        const def = kpiFicheRelationQuery({ relation: RELATION_PAR_DEFAUT });
        expect(def.query).toContain(`, TREATAS({"Paris > Lyon"}, 'Relation'[Relation])\n)`);
        expect(def.columnMetadata["[Titre fiche relation]"].name).toBe("Titre");
        expect(def.columnMetadata["[Recette par voyageur]"].format).toBe('#,0.00 "€"');
    });
});

describe("listeRelationsQuery", () => {
    it("liste les relations avec leur ligne", () => {
        const def = listeRelationsQuery();
        expect(def.query).toContain("ORDER BY 'Relation'[Ligne], 'Relation'[Relation]");
        expect(def.columnMetadata["Relation[Transfrontalière]"].name).toBe("Transfrontaliere");
    });
});

describe("retardParHeureQuery", () => {
    it("filtre la relation et garde la spec en colonnes étiquetées", () => {
        const def = retardParHeureQuery({ relation: "Paris > Lyon" });
        expect(def.query).toContain(`TREATAS({"Paris > Lyon"}, 'Relation'[Relation]),`);
        const couches = (def.vegaLiteSpec as unknown as { layer: { mark: { type: string; style?: string } }[] }).layer;
        expect(couches.map((c) => c.mark.type)).toEqual(["bar", "text"]);
        expect(couches[1].mark.style).toBe("labelVertical");
    });
});
