import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { TableauKpi } from "@/components/signaletique/tableau-kpi";

// Valeurs réelles du modèle, mises en forme en fr-FR.
const TUILES = [
    { cle: "voyageurs", libelle: "Voyageurs", valeur: "26 273 478" },
    { cle: "ca", libelle: "Chiffre d'affaires", valeur: "1 049,8 M€" },
    { cle: "ponctualite", libelle: "Ponctualité", valeur: "75,6 %", statut: "vigilance" as const, note: "Objectif 77,0 %" },
];

describe("TableauKpi", () => {
    it("affiche chaque valeur en palettes avec son unité séparée", () => {
        render(<TableauKpi titre="Tableau d'affichage · réseau" tuiles={TUILES} chargement={false} nombreAttendu={3} />);
        const tableau = screen.getByRole("region", { name: "Tableau d'affichage · réseau" });
        const tuileCa = within(tableau).getByText("Chiffre d'affaires").closest("li")!;
        expect(within(tuileCa).getByText((_, el) => el?.className === "sr-only" && el.textContent === "1\u202f049,8")).toHaveClass("sr-only");
        expect(within(tuileCa).getByText("M€")).toBeInTheDocument();
        expect(within(tableau).getByText("Objectif 77,0 %")).toBeInTheDocument();
    });

    it("affiche des squelettes pendant le chargement", () => {
        const { container } = render(<TableauKpi titre="Tableau" tuiles={[]} chargement nombreAttendu={4} />);
        expect(container.querySelectorAll("li")).toHaveLength(4);
        expect(screen.queryByText("Voyageurs")).not.toBeInTheDocument();
    });

    it("affiche un bandeau d'erreur", () => {
        render(<TableauKpi titre="Tableau" tuiles={[]} chargement={false} erreur={new Error("401 Unauthorized")} nombreAttendu={4} />);
        expect(screen.getByRole("alert")).toHaveTextContent("Impossible de charger les indicateurs");
        expect(screen.getByRole("alert")).toHaveTextContent("401 Unauthorized");
    });
});
