import { describe, expect, it } from "vitest";
import { libelleRisque, separerUnite, signalRisque, statutPonctualite } from "@/lib/affichage";

describe("separerUnite", () => {
    it("sépare chiffres et unité", () => {
        expect(separerUnite("1\u202f049,8 M€")).toEqual({ chiffres: "1\u202f049,8", unite: "M€" });
        expect(separerUnite("75,6\u00a0%")).toEqual({ chiffres: "75,6", unite: "%" });
        expect(separerUnite("+2,3 pts")).toEqual({ chiffres: "+2,3", unite: "pts" });
        expect(separerUnite("-1,4 pts")).toEqual({ chiffres: "-1,4", unite: "pts" });
    });

    it("garde un nombre sans unité", () => {
        expect(separerUnite("26 273 478")).toEqual({ chiffres: "26 273 478", unite: "" });
    });

    it("rend un texte non numérique tel quel", () => {
        expect(separerUnite("n. d.")).toEqual({ chiffres: "n. d.", unite: "" });
        expect(separerUnite("4e sur 24")).toEqual({ chiffres: "4", unite: "e sur 24" });
    });
});

describe("statutPonctualite", () => {
    it("classe selon l'objectif et la tolérance de 3 points", () => {
        expect(statutPonctualite(0.793381918455781, 0.77)).toBe("conforme");
        expect(statutPonctualite(0.77, 0.77)).toBe("conforme");
        expect(statutPonctualite(0.7556045796692915, 0.77)).toBe("vigilance");
        expect(statutPonctualite(0.74, 0.77)).toBe("vigilance");
        expect(statutPonctualite(0.7121805203776191, 0.77)).toBe("critique");
    });

    it("ignore les valeurs absentes", () => {
        expect(statutPonctualite(null, 0.77)).toBeUndefined();
        expect(statutPonctualite(0.8, undefined)).toBeUndefined();
    });
});

describe("niveaux de risque", () => {
    it("associe un signal à chaque niveau", () => {
        expect(signalRisque("ÉLEVÉ")).toBe("critique");
        expect(signalRisque("MOYEN")).toBe("vigilance");
        expect(signalRisque("FAIBLE")).toBe("conforme");
        expect(signalRisque("INCONNU")).toBeUndefined();
    });

    it("met le libellé en casse de phrase", () => {
        expect(libelleRisque("ÉLEVÉ")).toBe("Élevé");
        expect(libelleRisque("FAIBLE")).toBe("Faible");
        expect(libelleRisque(null)).toBe("");
    });
});
