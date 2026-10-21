import { describe, expect, it } from "vitest";
import { jetonsDeTest } from "../test-jetons";
import { kpiPonctualiteQuery, ponctualiteParRelationQuery, retardJourHeureQuery } from "./index";

type Json = Record<string, unknown>;

describe("ponctualiteParRelationQuery", () => {
    it("n'est pas filtrée : la sélection est mise en avant, pas retirée", () => {
        const def = ponctualiteParRelationQuery({ relationSelectionnee: "Paris > Lyon" });
        expect(def.query).not.toContain("TREATAS");
        const couches = (def.vegaLiteSpec as unknown as { layer: Json[] }).layer;
        expect((couches[0].encoding as Json).opacity).toEqual({
            condition: { test: 'datum["Relation"] === "Paris > Lyon"', value: 1 },
            value: 0.35,
        });
    });

    it("colore les statuts conforme, vigilance et critique", () => {
        const def = ponctualiteParRelationQuery({ jetons: jetonsDeTest() });
        const couches = (def.vegaLiteSpec as unknown as { layer: Json[] }).layer;
        const echelle = ((couches[0].encoding as Json).color as { scale: Json }).scale;
        expect(echelle).toEqual({
            domain: ["Conforme", "Vigilance", "Critique"],
            range: ["--color-signal-conforme", "--color-signal-vigilance", "--color-signal-critique"],
        });
        expect((couches[2].mark as Json).color).toBe("--color-foreground");
    });

    it("garde les clés de colonnes exactes", () => {
        expect(ponctualiteParRelationQuery().columnMetadata["Relation[Relation]"].name).toBe("Relation");
        expect(ponctualiteParRelationQuery().columnMetadata["[Objectif ponctualité %]"].name).toBe("Objectif");
    });
});

describe("retardJourHeureQuery", () => {
    it("filtre la relation et applique la rampe de chaleur", () => {
        const def = retardJourHeureQuery({ relation: "Bâle > Zurich", jetons: jetonsDeTest() });
        expect(def.query).toContain(`TREATAS({"Bâle > Zurich"}, 'Relation'[Relation]),`);
        const couleur = (def.vegaLiteSpec as unknown as { encoding: { color: { scale: Json } } }).encoding.color;
        expect(couleur.scale.range).toEqual([
            "--color-chaleur-0", "--color-chaleur-1", "--color-chaleur-2", "--color-chaleur-3", "--color-chaleur-4",
        ]);
        expect(def.columnMetadata["Date[N° jour]"].name).toBe("NumeroJour");
    });
});

describe("kpiPonctualiteQuery", () => {
    it("échappe les guillemets d'une relation", () => {
        expect(kpiPonctualiteQuery({ relation: 'Gare "A" > B' }).query).toContain(`TREATAS({"Gare ""A"" > B"}`);
    });

    it("formate l'écart en points signés", () => {
        expect(kpiPonctualiteQuery().columnMetadata["[Écart à l'objectif (pts)]"].format).toBe('+0.0 "pts";-0.0 "pts";0.0 "pts"');
    });
});
