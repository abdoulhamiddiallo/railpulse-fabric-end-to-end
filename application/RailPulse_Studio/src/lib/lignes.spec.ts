import { describe, expect, it } from "vitest";
import { CODES_LIGNES, jetonsPictogramme, numeroLigne } from "@/lib/lignes";

describe("numeroLigne", () => {
    it("extrait le numéro sur deux chiffres", () => {
        expect(numeroLigne("L05")).toBe("05");
        expect(numeroLigne("L11")).toBe("11");
        expect(numeroLigne("7")).toBe("07");
    });

    it("rejette les codes hors réseau", () => {
        expect(numeroLigne("L13")).toBeUndefined();
        expect(numeroLigne("L00")).toBeUndefined();
        expect(numeroLigne("TGV")).toBeUndefined();
        expect(numeroLigne(null)).toBeUndefined();
    });
});

describe("jetonsPictogramme", () => {
    it("renvoie les variables CSS de la ligne", () => {
        expect(jetonsPictogramme("L02")).toEqual({
            fond: "var(--color-ligne-02)",
            texte: "var(--color-ligne-02-texte)",
        });
    });

    it("se replie sur les jetons neutres", () => {
        expect(jetonsPictogramme(undefined)).toEqual({
            fond: "var(--color-muted)",
            texte: "var(--color-muted-foreground)",
        });
    });

    it("couvre les douze lignes", () => {
        expect(CODES_LIGNES).toHaveLength(12);
        expect(CODES_LIGNES.every((c) => numeroLigne(c) !== undefined)).toBe(true);
    });
});
