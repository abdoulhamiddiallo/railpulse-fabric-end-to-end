import { VegaVisual } from "@microsoft/fabric-visuals";
import { useMemo } from "react";
import { EtatErreur, EtatVide, Squelette } from "@/components/signaletique/etats";
import { useThemeContext } from "@/hooks/theme.context";
import { useFondDeCarte } from "@/hooks/use-fond-de-carte";
import { useJetonsCouleur } from "@/hooks/use-jetons-couleur";
import { useTableModele } from "@/hooks/use-table-modele";
import { calculerEmprise } from "@/lib/emprise-carte";
import { valeursColonne } from "@/lib/table-resultat";
import { cn } from "@/lib/utils";
import { carteGaresQuery, liaisonsCarteQuery } from "@/queries";

const definitionGares = carteGaresQuery();
const definitionLiaisons = liaisonsCarteQuery();

/**
 * Carte du réseau : gares proportionnelles aux voyageurs au départ, tracés des
 * douze lignes, fond de carte européen cadré sur l'emprise des gares.
 */
export function CarteReseau({ className }: { className?: string }) {
    const { theme } = useThemeContext();
    const jetons = useJetonsCouleur();
    const { fond, statut } = useFondDeCarte();
    const gares = useTableModele(definitionGares);
    const liaisons = useTableModele(definitionLiaisons);

    const emprise = useMemo(() => {
        if (!gares.table) return undefined;
        const lons = valeursColonne(gares.table, "Longitude");
        const lats = valeursColonne(gares.table, "Latitude");
        return calculerEmprise(lons.map((lon, i) => ({ longitude: Number(lon), latitude: Number(lats[i]) })));
    }, [gares.table]);

    const spec = useMemo(
        () => carteGaresQuery({ jetons, emprise, fondDeCarte: statut === "disponible" ? fond : undefined }).vegaLiteSpec,
        [jetons, emprise, fond, statut],
    );

    const erreur = gares.error ?? liaisons.error;
    const chargement = gares.isLoading || liaisons.isLoading || !gares.table || !liaisons.table || statut === "chargement";
    const sousTitre = statut === "indisponible"
        ? "Cercles proportionnels aux voyageurs au départ · fond de carte indisponible, graticule seul"
        : "Cercles proportionnels aux voyageurs au départ · tracés aux couleurs des lignes";

    return (
        <div className={cn("min-w-0 animate-entree", className)}>
            {erreur ? (
                <EtatErreur titre="Carte du réseau : chargement impossible" erreur={erreur} className="h-full" />
            ) : chargement ? (
                <div className="flex h-full flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-4">
                    <Squelette className="h-4 w-1/4" />
                    <Squelette className="flex-1" />
                </div>
            ) : gares.table!.rows.length === 0 ? (
                <EtatVide message="Aucune gare à afficher." className="bg-card" />
            ) : (
                <VegaVisual
                    spec={spec}
                    data={{ gares: gares.table!, liaisons: liaisons.table! }}
                    theme={theme}
                    header={{ title: "Le réseau en carte", subtitle: sousTitre }}
                    containerClassName="h-full rounded-xl border border-border bg-card shadow-4"
                />
            )}
        </div>
    );
}
