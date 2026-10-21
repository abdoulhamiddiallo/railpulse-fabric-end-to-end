import { describe, expect, it } from "vitest";
import {
    FORMATS,
    VALEUR_ABSENTE,
    decomposerDate,
    formaterDepart,
    formaterHeure,
    formaterJour,
    formaterValeur,
} from "@/lib/formatage";

/** Normalise les espaces insécables produits par la locale fr-FR. */
const espaces = (s: string) => s.replace(/[\u00a0\u202f]/g, " ");

describe("formaterValeur", () => {
    it("formate les entiers avec des espaces de milliers", () => {
        expect(espaces(formaterValeur(26273478, FORMATS.entier))).toBe("26 273 478");
    });

    it("formate les pourcentages avec une virgule et une espace", () => {
        expect(espaces(formaterValeur(0.7556045796692915, FORMATS.pourcentage))).toBe("75,6 %");
    });

    it("formate les millions d'euros", () => {
        expect(espaces(formaterValeur(1049.7835, FORMATS.millionsEuros))).toBe("1 049,8 M€");
    });

    it("signe les écarts en points", () => {
        expect(espaces(formaterValeur(2.338191845578097, FORMATS.points))).toBe("+2,3 pts");
        expect(espaces(formaterValeur(-1.4395420330708508, FORMATS.points))).toBe("-1,4 pts");
    });

    it("affiche un libellé neutre pour les valeurs absentes", () => {
        expect(formaterValeur(null, FORMATS.entier)).toBe(VALEUR_ABSENTE);
        expect(formaterValeur(undefined, FORMATS.entier)).toBe(VALEUR_ABSENTE);
        expect(formaterValeur(Number.NaN, FORMATS.entier)).toBe(VALEUR_ABSENTE);
    });
});

describe("dates de départ", () => {
    it("décompose une chaîne ISO sans conversion de fuseau", () => {
        expect(decomposerDate("2026-10-30T08:30:00")).toEqual({
            annee: 2026, mois: 10, jour: 30, heures: 8, minutes: 30,
        });
    });

    it("formate un départ prévu en jj/MM HH:mm", () => {
        expect(formaterDepart("2026-10-31T18:15:00")).toBe("31/10 18:15");
        expect(formaterHeure("2026-10-21T06:00:00")).toBe("06:00");
        expect(formaterJour("2026-10-21T06:00:00")).toBe("21/10");
    });

    it("accepte un objet Date", () => {
        expect(formaterDepart(new Date(2026, 9, 21, 7, 5))).toBe("21/10 07:05");
    });

    it("renvoie le libellé neutre pour une valeur illisible", () => {
        expect(formaterDepart("pas une date")).toBe(VALEUR_ABSENTE);
        expect(formaterDepart(null)).toBe(VALEUR_ABSENTE);
    });
});
