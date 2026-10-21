import { describe, expect, it } from "vitest";
import { jetonsDeTest } from "../test-jetons";
import { departsQuery, kpiPrevisionsQuery, trainsPrevusParJourQuery } from "./index";

type Json = Record<string, unknown>;

describe("departsQuery", () => {
    it("classe par retard prévu par défaut", () => {
        const def = departsQuery();
        expect(def.query).toContain("[Retard prévu (min)], DESC");
        expect(def.query).toContain("ORDER BY [Retard prévu (min)] DESC");
    });

    it("propose l'ordre chronologique pour les prochains départs", () => {
        const def = departsQuery({ ordre: "chronologique", relation: "Paris > Lyon" });
        expect(def.query).toContain("[Départ prévu], ASC");
        expect(def.query).toContain(`, TREATAS({"Paris > Lyon"}, 'Relation'[Relation])\n)`);
    });

    it("expose des alias sans crochets pour le tableau", () => {
        const noms = Object.values(departsQuery().columnMetadata).map((c) => c.name);
        expect(noms).toEqual(["Depart", "Relation", "Ligne", "Rame", "SeveriteMeteo", "RemplissagePrevu", "RetardPrevu", "Risque"]);
        expect(noms.every((n) => !/[[\].]/.test(n))).toBe(true);
    });
});

describe("trainsPrevusParJourQuery", () => {
    it("associe élevé, moyen et faible au rouge, à l'ambre et au vert", () => {
        const spec = trainsPrevusParJourQuery({ jetons: jetonsDeTest() }).vegaLiteSpec as unknown as { encoding: { color: { scale: Json } } };
        expect(spec.encoding.color.scale).toEqual({
            domain: ["ÉLEVÉ", "MOYEN", "FAIBLE"],
            range: ["--color-signal-critique", "--color-signal-vigilance", "--color-signal-conforme"],
        });
    });

    it("filtre la relation", () => {
        expect(trainsPrevusParJourQuery({ relation: "Paris > Lyon" }).query).toContain(`'Relation'[Relation]),\n    "Trains prévus"`);
    });
});

describe("kpiPrevisionsQuery", () => {
    it("déclare les colonnes du modèle", () => {
        expect(Object.keys(kpiPrevisionsQuery().columnMetadata)).toEqual([
            "[Trains prévus]", "[Retard prévu moyen (min)]", "[Trains à risque élevé]", "[Part à risque élevé %]", "[Récit prévisions]",
        ]);
    });
});
