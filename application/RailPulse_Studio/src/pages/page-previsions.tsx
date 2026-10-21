import { useCallback, useMemo } from "react";
import type { InteractionEvent } from "@microsoft/fabric-visuals-core";
import { BandeauRecit } from "@/components/signaletique/bandeau-recit";
import { TableauKpi, type TuileKpi } from "@/components/signaletique/tableau-kpi";
import { TitrePage } from "@/components/structure/titre-page";
import { TableauDeparts } from "@/components/visuels/tableau-departs";
import { VisuelModele } from "@/components/visuels/visuel-modele";
import { useJetonsCouleur } from "@/hooks/use-jetons-couleur";
import { useRelation } from "@/hooks/relation.context";
import { useTableModele } from "@/hooks/use-table-modele";
import { formaterValeur } from "@/lib/formatage";
import { formatColonne, ligneEnObjet, lireSelection } from "@/lib/table-resultat";
import { departsQuery, kpiPrevisionsQuery, trainsPrevusParJourQuery } from "@/queries";

export function PagePrevisions() {
    const { relation, choisirRelation } = useRelation();
    const jetons = useJetonsCouleur();

    const definitionKpi = useMemo(() => kpiPrevisionsQuery({ relation }), [relation]);
    const kpi = useTableModele(definitionKpi);
    const definitionJours = useMemo(() => trainsPrevusParJourQuery({ relation, jetons }), [relation, jetons]);
    const definitionDeparts = useMemo(() => departsQuery({ relation, ordre: "retard" }), [relation]);

    // Clic sur une ligne du tableau : sa relation devient le filtre du studio.
    const surInteraction = useCallback(
        (evenements: InteractionEvent[]) => {
            const action = lireSelection(evenements, "Relation");
            if (action?.type === "selection") choisirRelation(action.valeur);
        },
        [choisirRelation],
    );

    const valeurs = kpi.table ? ligneEnObjet(kpi.table) : undefined;
    const tuiles = useMemo<TuileKpi[]>(() => {
        if (!kpi.table || !valeurs) return [];
        const f = (nom: string) => formaterValeur(valeurs[nom], formatColonne(kpi.table!, nom));
        return [
            { cle: "prevus", libelle: "Trains prévus", valeur: f("TrainsPrevus"), note: "Horizon de 14 jours" },
            { cle: "retard", libelle: "Retard prévu moyen", valeur: f("RetardPrevuMoyen") },
            { cle: "risque", libelle: "Trains à risque élevé", valeur: f("TrainsRisqueEleve"), statut: "critique" },
            { cle: "part", libelle: "Part à risque élevé", valeur: f("PartRisqueEleve") },
        ];
    }, [kpi.table, valeurs]);

    return (
        <div className="flex flex-col gap-grid">
            <TitrePage
                voie="3"
                titre="Prévisions à 14 jours"
                sousTitre="Retards et niveaux de risque estimés par le modèle de prévision, départ par départ."
            />

            <TableauKpi
                titre="Tableau d'affichage · prévisions"
                contexte={relation ?? "Toutes relations"}
                tuiles={tuiles}
                chargement={kpi.isLoading || !kpi.table}
                erreur={kpi.error}
                nombreAttendu={4}
                colonnes="grid-cols-2 xl:grid-cols-4"
            />

            <BandeauRecit
                surtitre={relation ? `Information exploitation · ${relation}` : "Information exploitation · réseau entier"}
                texte={typeof valeurs?.Recit === "string" ? valeurs.Recit : null}
                chargement={kpi.isLoading}
                erreur={kpi.error}
            />

            <div className="grid grid-cols-1 gap-grid">
                <VisuelModele
                    definition={definitionJours}
                    titre="Trains prévus par jour et niveau de risque"
                    sousTitre="Rouge : élevé · ambre : moyen · vert : faible"
                    className="h-96"
                    capabilities={{ disableSelfHighlight: true }}
                />
                <TableauDeparts
                    definition={definitionDeparts}
                    titre="Tableau des départs à surveiller"
                    sousTitre="Les 50 départs au retard prévu le plus élevé · cliquez un départ pour filtrer sur sa relation"
                    className="h-160"
                    onInteraction={surInteraction}
                />
            </div>
        </div>
    );
}
