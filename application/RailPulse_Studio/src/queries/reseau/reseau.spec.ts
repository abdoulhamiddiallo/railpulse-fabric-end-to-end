import { describe, expect, it } from "vitest";
import { jetonsDeTest } from "../test-jetons";
import {
    carteGaresQuery,
    kpiReseauQuery,
    liaisonsCarteQuery,
    recitReseauQuery,
    voyageursMensuelsQuery,
    voyageursParLigneQuery,
} from "./index";
import { CODES_LIGNES } from "@/lib/lignes";

const TREATAS_LYON = `TREATAS({"Paris > Lyon"}, 'Relation'[Relation])`;
type Json = Record<string, never> & Record<string, unknown>;
const json = (v: unknown) => v as Json & { layer: Json[] };

describe("kpiReseauQuery", () => {
    it("interroge le réseau entier sans relation", () => {
        const def = kpiReseauQuery();
        expect(def.connection).toBe("railpulse");
        expect(def.query).toContain("CALCULATETABLE(");
        expect(def.query).not.toContain("TREATAS");
    });

    it("filtre la relation en argument final de CALCULATETABLE", () => {
        expect(kpiReseauQuery({ relation: "Paris > Lyon" }).query).toContain(`, ${TREATAS_LYON}\n)`);
    });

    it("déclare les colonnes exactes renvoyées par le modèle", () => {
        expect(Object.keys(kpiReseauQuery().columnMetadata)).toEqual([
            "[Trains assurés]", "[Voyageurs]", "[Chiffre d'affaires (M€)]", "[Ponctualité %]",
            "[Taux de remplissage %]", "[CO2 évité (t)]", "[Objectif ponctualité %]",
        ]);
        expect(kpiReseauQuery().columnMetadata["[Chiffre d'affaires (M€)]"]).toMatchObject({ name: "ChiffreAffairesM", format: '#,0.0 "M€"' });
    });
});

describe("recitReseauQuery", () => {
    it("n'est jamais filtrée par relation", () => {
        const def = recitReseauQuery();
        expect(def.query).not.toContain("FILTRE_RELATION");
        expect(Object.values(def.columnMetadata).map((c) => c.name)).toEqual(["Periode", "Recit"]);
    });
});

describe("voyageursMensuelsQuery", () => {
    it("insère le TREATAS dans SUMMARIZECOLUMNS et trie par ordre fiscal", () => {
        const def = voyageursMensuelsQuery({ relation: "Paris > Lyon" });
        expect(def.query).toContain(`${TREATAS_LYON},\n    "Voyageurs"`);
        expect(def.query).toContain("ORDER BY 'Mois'[Ordre]");
        expect(def.columnMetadata["Mois[Ordre]"].name).toBe("Ordre");
    });

    it("colore la règle d'objectif avec le signal de vigilance", () => {
        const spec = json(voyageursMensuelsQuery({ jetons: jetonsDeTest() }).vegaLiteSpec);
        const regle = (spec.layer[1].layer as Json[])[1].mark as Json;
        expect(regle.color).toBe("--color-signal-vigilance");
    });

    it("ne modifie pas la spec importée d'un appel à l'autre", () => {
        voyageursMensuelsQuery({ jetons: jetonsDeTest() });
        const spec = json(voyageursMensuelsQuery().vegaLiteSpec);
        expect(((spec.layer[1].layer as Json[])[1].mark as Json).color).toBeUndefined();
    });
});

describe("voyageursParLigneQuery", () => {
    it("associe les douze lignes à leurs couleurs de pictogramme", () => {
        const spec = json(voyageursParLigneQuery({ jetons: jetonsDeTest() }).vegaLiteSpec);
        const couleur = (spec.layer[0].encoding as Json).color as { scale: { domain: string[]; range: string[] } };
        expect(couleur.scale.domain).toEqual([...CODES_LIGNES]);
        expect(couleur.scale.range[0]).toBe("--color-ligne-01");
        expect(couleur.scale.range).toHaveLength(12);
    });

    it("retire la gamme sans jetons et met en avant la ligne choisie", () => {
        const spec = json(voyageursParLigneQuery({ ligneMiseEnAvant: "L11" }).vegaLiteSpec);
        const encodage = spec.layer[0].encoding as Json;
        expect((encodage.color as { scale: Json }).scale).not.toHaveProperty("range");
        expect(encodage.opacity).toEqual({ condition: { test: 'datum["Ligne"] === "L11"', value: 1 }, value: 0.35 });
    });

    it("trie les barres par un agrégat compatible avec l'union des couches", () => {
        const spec = json(voyageursParLigneQuery().vegaLiteSpec);
        expect(((spec.encoding as Json).y as Json).sort).toEqual({ field: "Voyageurs", op: "max", order: "descending" });
    });
});

describe("carteGaresQuery", () => {
    const emprise = { ouest: 1, est: 10, sud: 44, nord: 53 };

    it("garde une projection Mercator auto-ajustée sans emprise ni fond", () => {
        const spec = json(carteGaresQuery().vegaLiteSpec);
        expect(spec.projection).toEqual({ type: "mercator" });
        expect(spec.layer.map((c) => c.name)).not.toContain("pays");
    });

    it("cadre la projection, place les étiquettes et insère le fond sous les tracés", () => {
        const fond = { type: "Topology", objects: { countries: {} } };
        const spec = json(carteGaresQuery({ jetons: jetonsDeTest(), emprise, fondDeCarte: fond }).vegaLiteSpec);
        expect((spec.projection as Json).scale).toBeDefined();
        expect(spec.layer.map((c) => c.name)).toEqual([
            "graticule", "pays", "liaisons", "gares", "halo-ouest", "halo-est", "etiquettes-ouest", "etiquettes-est",
        ]);
        const pays = spec.layer[1] as Json & { data: Json; mark: Json };
        expect(pays.data).toEqual({ values: fond, format: { type: "topojson", feature: "countries" } });
        expect(pays.mark).toMatchObject({ fill: "--color-carte-terre", stroke: "--color-carte-frontiere", clip: true });
        expect(spec.layer[4].transform).toEqual([{ filter: "datum.Longitude < 5.5" }]);
        expect(spec.layer[7].transform).toEqual([{ filter: "datum.Longitude >= 5.5" }]);
        expect(spec.layer[6].mark).toMatchObject({ fill: "--color-foreground" });
    });

    it("n'insère pas le fond sans emprise (il imposerait le monde entier)", () => {
        const spec = json(carteGaresQuery({ fondDeCarte: { type: "Topology" } }).vegaLiteSpec);
        expect(spec.layer.map((c) => c.name)).not.toContain("pays");
    });

    it("déclare les colonnes des gares et des liaisons", () => {
        expect(carteGaresQuery().columnMetadata["Gare[Latitude]"].name).toBe("Latitude");
        expect(Object.keys(liaisonsCarteQuery().columnMetadata)).toContain("[Voyageurs ligne]");
    });
});
