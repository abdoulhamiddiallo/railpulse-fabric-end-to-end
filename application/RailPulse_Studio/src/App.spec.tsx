import { describe, it, expect, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { lightThemeColors } from "@microsoft/fabric-visuals-core";
import App from "@/App";
import { ThemeContext } from "@/hooks/theme.context";

// Requêtes en cours de chargement : l'interface affiche ses squelettes sans appeler Fabric.
vi.mock("@/hooks/use-semantic-model-query", () => ({
    useSemanticModelQuery: () => ({ data: undefined, isLoading: true, error: undefined, refetch: vi.fn() }),
}));
vi.mock("@/hooks/use-fond-de-carte", () => ({
    useFondDeCarte: () => ({ fond: undefined, statut: "chargement" }),
}));

function rendre() {
    return render(
        <ThemeContext.Provider value={{ isDark: false, toggleTheme: vi.fn(), theme: lightThemeColors }}>
            <App />
        </ThemeContext.Provider>,
    );
}

describe("App", () => {
    it("affiche les quatre sections et le pied de page", () => {
        rendre();
        for (const libelle of ["Réseau", "Ponctualité", "Prévisions", "Fiche relation"]) {
            expect(screen.getByRole("tab", { name: new RegExp(libelle) })).toBeInTheDocument();
        }
        expect(screen.getByText("Données : modèle sémantique SM_RailPulse (Direct Lake) · Microsoft Fabric")).toBeInTheDocument();
    });

    it("ouvre la section Réseau par défaut", () => {
        rendre();
        expect(screen.getByRole("heading", { level: 1, name: "Le réseau en un coup d'œil" })).toBeInTheDocument();
        expect(screen.getByRole("region", { name: "Tableau d'affichage · réseau" })).toBeInTheDocument();
    });

    it("change de section depuis le rail de navigation", () => {
        rendre();
        const onglet = screen.getByRole("tab", { name: /Prévisions/ });
        fireEvent.mouseDown(onglet, { button: 0 });
        fireEvent.click(onglet);
        expect(screen.getByRole("heading", { level: 1, name: "Prévisions à 14 jours" })).toBeInTheDocument();
    });
});
