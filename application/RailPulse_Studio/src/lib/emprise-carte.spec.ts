import { describe, expect, it } from "vitest";
import { calculerEmprise, ordonneeMercator, projectionCadree } from "@/lib/emprise-carte";

// Coordonnées réelles de gares du modèle (Paris, Amsterdam, Milan).
const GARES = [
    { longitude: 2.3592, latitude: 48.8768 },
    { longitude: 4.9003, latitude: 52.3791 },
    { longitude: 9.2048, latitude: 45.4864 },
];

describe("calculerEmprise", () => {
    it("englobe toutes les gares avec une marge", () => {
        const emprise = calculerEmprise(GARES, 0.1)!;
        expect(emprise.ouest).toBeCloseTo(2.3592 - 0.68456, 4);
        expect(emprise.est).toBeCloseTo(9.2048 + 0.68456, 4);
        expect(emprise.sud).toBeCloseTo(45.4864 - 0.68927, 4);
        expect(emprise.nord).toBeCloseTo(52.3791 + 0.68927, 4);
    });

    it("impose une emprise minimale autour d'une gare isolée", () => {
        const emprise = calculerEmprise([{ longitude: 6.1772, latitude: 49.1097 }], 0.5)!;
        expect(emprise.est - emprise.ouest).toBeCloseTo(2, 6);
        expect(emprise.nord - emprise.sud).toBeCloseTo(2, 6);
    });

    it("ignore les coordonnées absentes et renvoie undefined sans point", () => {
        expect(calculerEmprise([{ longitude: Number.NaN, latitude: 48 }])).toBeUndefined();
        expect(calculerEmprise([])).toBeUndefined();
    });
});

describe("projectionCadree", () => {
    it("centre la projection et dimensionne l'échelle sur l'emprise", () => {
        const projection = projectionCadree({ ouest: 2, est: 10, sud: 45, nord: 53 });
        expect(projection.type).toBe("mercator");
        expect(projection.center[0]).toBeCloseTo(6, 6);
        // Le centre Mercator est plus au nord que la moyenne arithmétique des latitudes.
        expect(projection.center[1]).toBeGreaterThan(49);
        expect(projection.center[1]).toBeLessThan(49.3);

        const amplitudeX = (8 * Math.PI) / 180;
        const amplitudeY = ordonneeMercator(53) - ordonneeMercator(45);
        expect(projection.scale.expr).toBe(
            `min(width / ${Number(amplitudeX.toFixed(6))}, height / ${Number(amplitudeY.toFixed(6))})`,
        );
        expect(projection.translate.expr).toBe("[width / 2, height / 2]");
    });

    it("ordonneeMercator vaut zéro à l'équateur", () => {
        expect(ordonneeMercator(0)).toBeCloseTo(0, 10);
    });
});
