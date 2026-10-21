import { describe, expect, it } from "vitest";
import { lireJetonsCouleur } from "@/lib/jetons-couleur";

describe("lireJetonsCouleur", () => {
    it("lit chaque famille de jetons par son nom de variable", () => {
        const lus: string[] = [];
        const jetons = lireJetonsCouleur((nom) => {
            lus.push(nom);
            return `  ${nom}  `;
        });

        expect(jetons.signal).toEqual({
            conforme: "--color-signal-conforme",
            vigilance: "--color-signal-vigilance",
            critique: "--color-signal-critique",
        });
        expect(jetons.lignes).toHaveLength(12);
        expect(jetons.lignes[0]).toBe("--color-ligne-01");
        expect(jetons.lignes[11]).toBe("--color-ligne-12");
        expect(jetons.chaleur).toEqual([
            "--color-chaleur-0", "--color-chaleur-1", "--color-chaleur-2",
            "--color-chaleur-3", "--color-chaleur-4",
        ]);
        expect(jetons.carte.terre).toBe("--color-carte-terre");
        expect(lus).toContain("--color-brand");
    });
});
