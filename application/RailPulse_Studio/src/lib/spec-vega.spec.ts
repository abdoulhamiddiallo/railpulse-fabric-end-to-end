import { describe, expect, it } from "vitest";
import {
    definirGamme,
    ecrireChemin,
    lireChemin,
    litteralExpression,
    opaciteMiseEnAvant,
    supprimerChemin,
} from "@/lib/spec-vega";

const specExemple = () => ({
    layer: [
        { mark: { type: "bar" }, encoding: { color: { field: "Ligne", scale: { domain: [], range: [] } } } },
    ],
});

describe("lireChemin / ecrireChemin / supprimerChemin", () => {
    it("lit et écrit le long d'un chemin", () => {
        const spec = specExemple();
        ecrireChemin(spec, ["layer", 0, "mark", "color"], "#000000");
        expect(lireChemin(spec, ["layer", 0, "mark", "color"])).toBe("#000000");
    });

    it("supprime une clé", () => {
        const spec = specExemple();
        supprimerChemin(spec, ["layer", 0, "encoding", "color", "scale", "range"]);
        expect(spec.layer[0].encoding.color.scale).toEqual({ domain: [] });
    });

    it("signale un chemin inexistant", () => {
        expect(() => lireChemin(specExemple(), ["layer", 3, "mark"])).toThrow("Chemin de spec introuvable : layer.3.mark");
        expect(() => ecrireChemin(specExemple(), ["encoding", "x"], 1)).toThrow("Chemin de spec introuvable");
    });
});

describe("definirGamme", () => {
    const chemin = ["layer", 0, "encoding", "color", "scale"];

    it("renseigne la gamme fournie", () => {
        const spec = specExemple();
        definirGamme(spec, chemin, ["#111111", "#222222"]);
        expect(spec.layer[0].encoding.color.scale.range).toEqual(["#111111", "#222222"]);
    });

    it("retire la gamme absente ou incomplète", () => {
        const spec = specExemple();
        definirGamme(spec, chemin, ["#111111", ""]);
        expect(spec.layer[0].encoding.color.scale).not.toHaveProperty("range");
    });
});

describe("expressions", () => {
    it("échappe les littéraux", () => {
        expect(litteralExpression("Bâle > Zurich")).toBe('"Bâle > Zurich"');
        expect(litteralExpression('a"b')).toBe('"a\\"b"');
    });

    it("construit l'opacité de mise en avant", () => {
        expect(opaciteMiseEnAvant("Relation", null)).toEqual({ value: 1 });
        expect(opaciteMiseEnAvant("Relation", "Paris > Lyon")).toEqual({
            condition: { test: 'datum["Relation"] === "Paris > Lyon"', value: 1 },
            value: 0.35,
        });
    });
});
