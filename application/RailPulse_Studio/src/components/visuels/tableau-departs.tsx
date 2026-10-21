import { DataGrid, type GridColumnDef } from "@microsoft/fabric-datagrid";
import type { InteractionEvent, VisualTheme } from "@microsoft/fabric-visuals-core";
import { CloudRain, Sun } from "lucide-react";
import { useMemo } from "react";
import { EtatErreur, EtatVide, Squelette } from "@/components/signaletique/etats";
import { BadgeSignal } from "@/components/signaletique/pastille-signal";
import { PictogrammeLigne } from "@/components/signaletique/pictogramme-ligne";
import { useThemeContext } from "@/hooks/theme.context";
import { useTableModele } from "@/hooks/use-table-modele";
import { libelleRisque, signalRisque } from "@/lib/affichage";
import { FORMATS, formaterDepart, formaterValeur } from "@/lib/formatage";
import { cn } from "@/lib/utils";
import type { DefinitionRequete } from "@/queries";

const COULEUR_RISQUE = {
    critique: "text-signal-critique",
    vigilance: "text-signal-vigilance",
    conforme: "text-signal-conforme",
} as const;

/** Colonnes du tableau des départs, rendues façon afficheur de gare. */
const COLONNES: GridColumnDef[] = [
    {
        id: "Depart",
        header: "Départ prévu",
        width: 132,
        cellRenderer: (valeur) => (
            <span className="font-numeric font-semibold tracking-wide text-board-foreground">{formaterDepart(valeur)}</span>
        ),
    },
    {
        id: "Relation",
        header: "Relation",
        minWidth: 200,
        width: 250,
        cellRenderer: (valeur, ligne) => (
            <span className="flex min-w-0 items-center gap-2">
                <PictogrammeLigne code={typeof ligne.Ligne === "string" ? ligne.Ligne : undefined} taille="compact" />
                <span className="truncate font-medium">{String(valeur ?? "")}</span>
            </span>
        ),
    },
    {
        id: "Rame",
        header: "Rame",
        width: 90,
        cellRenderer: (valeur) => <span className="font-numeric">{String(valeur ?? "")}</span>,
    },
    {
        id: "SeveriteMeteo",
        header: "Sévérité météo",
        width: 140,
        cellRenderer: (valeur) => {
            const n = typeof valeur === "number" ? valeur : 0;
            const Icone = n > 0 ? CloudRain : Sun;
            return (
                <span className={cn("inline-flex items-center gap-1.5 font-numeric", n > 0 ? "text-signal-vigilance" : "text-board-label")}>
                    <Icone className="icon-size-200" aria-hidden="true" />
                    {formaterValeur(valeur, "0")}
                </span>
            );
        },
    },
    {
        id: "RemplissagePrevu",
        header: "Remplissage prévu",
        width: 170,
        cellRenderer: (valeur) => {
            const n = typeof valeur === "number" ? Math.max(0, Math.min(valeur, 1)) : 0;
            return (
                <span className="flex items-center gap-2">
                    <span className="h-1.5 w-full rounded-full bg-board-cell">
                        <span className="block h-1.5 rounded-full bg-highlight" style={{ width: `${n * 100}%` }} />
                    </span>
                    <span className="w-10 shrink-0 text-right font-numeric text-200">{formaterValeur(valeur, "0 %")}</span>
                </span>
            );
        },
    },
    {
        id: "RetardPrevu",
        header: "Retard prévu",
        width: 130,
        numericStyling: true,
        cellRenderer: (valeur) => (
            <span className="font-numeric font-semibold text-board-foreground">{formaterValeur(valeur, FORMATS.minutes)}</span>
        ),
    },
    {
        id: "Risque",
        header: "Niveau de risque",
        width: 150,
        cellRenderer: (valeur) => {
            const statut = signalRisque(valeur);
            return (
                <span className={statut ? COULEUR_RISQUE[statut] : undefined}>
                    <BadgeSignal statut={statut} libelle={libelleRisque(valeur)} />
                </span>
            );
        },
    },
];

interface TableauDepartsProps {
    definition: DefinitionRequete;
    titre: string;
    sousTitre?: string;
    className?: string;
    onInteraction?: (evenements: InteractionEvent[]) => void;
}

/** Tableau des départs prévus, sur fond d'afficheur de gare. */
export function TableauDeparts({ definition, titre, sousTitre, className, onInteraction }: TableauDepartsProps) {
    const { theme } = useThemeContext();
    const { table, isLoading, error } = useTableModele(definition);

    // Thème d'afficheur : les valeurs renvoient aux jetons de global.css.
    const themeAfficheur = useMemo<VisualTheme>(
        () => ({
            ...theme,
            foreground: "var(--color-board-foreground)",
            foregroundSecondary: "var(--color-board-label)",
            background: "var(--color-board)",
            backgroundSecondary: "var(--color-board-cell)",
            backgroundHover: "var(--color-board-cell)",
            stroke: "var(--color-board-split)",
            border: { ...theme.border, gridlines: "horizontal" },
        }),
        [theme],
    );

    return (
        <div className={cn("flex min-w-0 flex-col animate-entree", className)}>
            {error ? (
                <EtatErreur titre={`${titre} : chargement impossible`} erreur={error} className="h-full" />
            ) : isLoading || !table ? (
                <div className="flex h-full flex-col gap-2 rounded-xl border border-border bg-card p-4 shadow-4">
                    <Squelette className="h-4 w-1/3" />
                    {Array.from({ length: 8 }, (_, i) => (
                        <Squelette key={i} className="h-8 bg-board/80" />
                    ))}
                </div>
            ) : table.rows.length === 0 ? (
                <EtatVide message="Aucun départ prévu pour cette sélection." className="bg-card" />
            ) : (
                <DataGrid
                    data={table}
                    columns={COLONNES}
                    theme={themeAfficheur}
                    rowHeight={40}
                    header={{ title: titre, subtitle: sousTitre }}
                    onInteraction={onInteraction}
                    capabilities={{ disableColumnReorder: true }}
                    containerClassName="h-full min-h-0 flex-1 rounded-xl border border-border bg-card shadow-4"
                />
            )}
        </div>
    );
}
