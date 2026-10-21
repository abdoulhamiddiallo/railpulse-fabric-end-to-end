import { ArrowRight } from "lucide-react";
import { useCallback, useMemo } from "react";
import type { InteractionEvent } from "@microsoft/fabric-visuals-core";
import { BandeauRecit } from "@/components/signaletique/bandeau-recit";
import { TableauKpi, type TuileKpi } from "@/components/signaletique/tableau-kpi";
import { TitrePage } from "@/components/structure/titre-page";
import { VisuelModele } from "@/components/visuels/visuel-modele";
import { useJetonsCouleur } from "@/hooks/use-jetons-couleur";
import { useRelation } from "@/hooks/relation.context";
import { useTableModele } from "@/hooks/use-table-modele";
import { statutPonctualite } from "@/lib/affichage";
import { formaterValeur } from "@/lib/formatage";
import { formatColonne, ligneEnObjet, lireSelection } from "@/lib/table-resultat";
import {
    CHAMP_SELECTION_RELATION,
    kpiPonctualiteQuery,
    ponctualiteParRelationQuery,
    retardJourHeureQuery,
    retardParHeureQuery,
} from "@/queries";

export function PagePonctualite({ onOuvrirFiche }: { onOuvrirFiche: () => void }) {
    const { relation, choisirRelation } = useRelation();
    const jetons = useJetonsCouleur();

    const definitionKpi = useMemo(() => kpiPonctualiteQuery({ relation }), [relation]);
    const kpi = useTableModele(definitionKpi);
    const definitionClassement = useMemo(
        () => ponctualiteParRelationQuery({ jetons, relationSelectionnee: relation }),
        [jetons, relation],
    );
    const definitionChaleur = useMemo(() => retardJourHeureQuery({ relation, jetons }), [relation, jetons]);
    const definitionHeures = useMemo(() => retardParHeureQuery({ relation }), [relation]);

    // Clic sur une barre : la relation devient le filtre de toute l'application.
    const surInteraction = useCallback(
        (evenements: InteractionEvent[]) => {
            const action = lireSelection(evenements, CHAMP_SELECTION_RELATION);
            if (action?.type === "selection") choisirRelation(action.valeur);
            else if (action?.type === "effacement") choisirRelation(null);
        },
        [choisirRelation],
    );

    const valeurs = kpi.table ? ligneEnObjet(kpi.table) : undefined;
    const tuiles = useMemo<TuileKpi[]>(() => {
        if (!kpi.table || !valeurs) return [];
        const f = (nom: string) => formaterValeur(valeurs[nom], formatColonne(kpi.table!, nom));
        const rang = typeof valeurs.Rang === "string" ? valeurs.Rang : null;
        return [
            {
                cle: "ponctualite",
                libelle: "Ponctualité",
                valeur: f("Ponctualite"),
                statut: statutPonctualite(valeurs.Ponctualite, valeurs.Objectif),
                note: rang ? `Rang ${rang}` : `Objectif ${f("Objectif")}`,
            },
            { cle: "ecart", libelle: "Écart à l'objectif", valeur: f("EcartObjectif"), note: `Objectif ${f("Objectif")}` },
            { cle: "retard", libelle: "Retard moyen", valeur: f("RetardMoyen"), note: "À l'arrivée, par train" },
            { cle: "retard15", libelle: "Trains > 15 min", valeur: f("TrainsRetard15"), note: "Retard à l'arrivée" },
            { cle: "annulation", libelle: "Taux d'annulation", valeur: f("TauxAnnulation") },
        ];
    }, [kpi.table, valeurs]);

    return (
        <div className="flex flex-col gap-grid">
            <TitrePage
                voie="2"
                titre="Ponctualité"
                sousTitre="Cliquez une relation dans le classement pour filtrer tout le studio ; recliquez pour revenir au réseau."
                actions={
                    relation ? (
                        <button
                            type="button"
                            onClick={onOuvrirFiche}
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-primary px-3 text-300 font-semibold text-primary-foreground shadow-4 transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            Ouvrir la fiche relation
                            <ArrowRight className="icon-size-200" aria-hidden="true" />
                        </button>
                    ) : undefined
                }
            />

            <TableauKpi
                titre="Tableau d'affichage · ponctualité"
                contexte={relation ?? "Toutes relations"}
                tuiles={tuiles}
                chargement={kpi.isLoading || !kpi.table}
                erreur={kpi.error}
                nombreAttendu={5}
                colonnes="grid-cols-2 md:grid-cols-3 xl:grid-cols-5 [&>li:last-child]:col-span-2 xl:[&>li:last-child]:col-span-1"
            />

            <BandeauRecit
                surtitre={relation ? `Information exploitation · ${relation}` : "Information exploitation · réseau entier"}
                texte={typeof valeurs?.Recit === "string" ? valeurs.Recit : null}
                chargement={kpi.isLoading}
                erreur={kpi.error}
            />

            <div className="grid grid-cols-1 gap-grid xl:grid-cols-12">
                <VisuelModele
                    definition={definitionClassement}
                    titre="Classement des 24 relations"
                    sousTitre="Vert : objectif atteint · ambre : moins de 3 points sous l'objectif · rouge : au-delà · pointillés : objectif"
                    className="h-176 xl:col-span-5 xl:row-span-2"
                    capabilities={{ disableSelfHighlight: true, disableCategoricalScroll: true }}
                    onInteraction={surInteraction}
                />
                <VisuelModele
                    definition={definitionChaleur}
                    titre="Heures sensibles de la semaine"
                    sousTitre={`Retard moyen par jour et heure de départ${relation ? ` · ${relation}` : " · réseau entier"}`}
                    className="h-96 xl:col-span-7"
                />
                <VisuelModele
                    definition={definitionHeures}
                    titre="Retard moyen par heure de départ"
                    sousTitre="Toutes journées confondues"
                    className="h-76 xl:col-span-7"
                />
            </div>
        </div>
    );
}
