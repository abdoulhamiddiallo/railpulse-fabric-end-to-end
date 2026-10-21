import { VegaVisual, type VegaVisualCapabilities } from "@microsoft/fabric-visuals";
import type { InteractionEvent } from "@microsoft/fabric-visuals-core";
import { EtatErreur, EtatVide, Squelette } from "@/components/signaletique/etats";
import { useThemeContext } from "@/hooks/theme.context";
import { useTableModele } from "@/hooks/use-table-modele";
import { cn } from "@/lib/utils";
import type { DefinitionVisuel } from "@/queries";

interface VisuelModeleProps {
    definition: DefinitionVisuel;
    titre: string;
    sousTitre?: string;
    /** Classes de mise en page de la cellule (placement dans la grille, hauteur). */
    className?: string;
    capabilities?: VegaVisualCapabilities;
    onInteraction?: (evenements: InteractionEvent[]) => void;
    messageVide?: string;
}

/**
 * Visuel Vega-Lite alimenté par une requête du modèle : chargement, vide, erreur,
 * puis rendu dans le cadre VisualContainer du composant.
 */
export function VisuelModele({
    definition,
    titre,
    sousTitre,
    className,
    capabilities,
    onInteraction,
    messageVide = "Aucune donnée pour cette sélection.",
}: VisuelModeleProps) {
    const { theme } = useThemeContext();
    const { table, isLoading, error } = useTableModele(definition);

    return (
        <div className={cn("min-w-0 animate-entree", className)}>
            {error ? (
                <EtatErreur titre={`${titre} : chargement impossible`} erreur={error} className="h-full" />
            ) : isLoading || !table ? (
                <div className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-4">
                    <Squelette className="h-4 w-1/3" />
                    <Squelette className="flex-1" />
                </div>
            ) : table.rows.length === 0 ? (
                <EtatVide message={messageVide} className="bg-card" />
            ) : (
                <VegaVisual
                    spec={definition.vegaLiteSpec}
                    data={table}
                    theme={theme}
                    header={{ title: titre, subtitle: sousTitre }}
                    capabilities={capabilities}
                    onInteraction={onInteraction}
                    containerClassName="h-full rounded-xl border border-border bg-card shadow-4"
                />
            )}
        </div>
    );
}
