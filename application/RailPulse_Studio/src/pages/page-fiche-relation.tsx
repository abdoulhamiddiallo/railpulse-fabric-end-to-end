import { useMemo } from "react";
import { BandeauRecit } from "@/components/signaletique/bandeau-recit";
import { EtatErreur, Squelette } from "@/components/signaletique/etats";
import { PictogrammeLigne } from "@/components/signaletique/pictogramme-ligne";
import { SelecteurRelation } from "@/components/signaletique/selecteur-relation";
import { TableauKpi, type TuileKpi } from "@/components/signaletique/tableau-kpi";
import { TableauDeparts } from "@/components/visuels/tableau-departs";
import { VisuelModele } from "@/components/visuels/visuel-modele";
import { useJetonsCouleur } from "@/hooks/use-jetons-couleur";
import { useRelation } from "@/hooks/relation.context";
import { useRelations } from "@/hooks/use-relations";
import { useTableModele } from "@/hooks/use-table-modele";
import { statutPonctualite } from "@/lib/affichage";
import { formaterCompact, formaterValeur } from "@/lib/formatage";
import { formatColonne, ligneEnObjet } from "@/lib/table-resultat";
import {
    RELATION_PAR_DEFAUT,
    departsQuery,
    kpiFicheRelationQuery,
    retardParHeureQuery,
    voyageursMensuelsQuery,
} from "@/queries";

/** Fiche d'une relation : choisie dans le sélecteur ou héritée de la sélection du studio. */
export function PageFicheRelation() {
    const { relation, choisirRelation } = useRelation();
    const { relations, isLoading: chargementListe, error: erreurListe } = useRelations();
    const jetons = useJetonsCouleur();
    const courante = relation ?? RELATION_PAR_DEFAUT;

    const definitionFiche = useMemo(() => kpiFicheRelationQuery({ relation: courante }), [courante]);
    const fiche = useTableModele(definitionFiche);
    const definitionMensuelle = useMemo(() => voyageursMensuelsQuery({ relation: courante, jetons }), [courante, jetons]);
    const definitionHeures = useMemo(() => retardParHeureQuery({ relation: courante }), [courante]);
    const definitionDeparts = useMemo(() => departsQuery({ relation: courante, ordre: "chronologique" }), [courante]);

    const valeurs = fiche.table ? ligneEnObjet(fiche.table) : undefined;
    const tuiles = useMemo<TuileKpi[]>(() => {
        if (!fiche.table || !valeurs) return [];
        const f = (nom: string) => formaterValeur(valeurs[nom], formatColonne(fiche.table!, nom));
        return [
            { cle: "voyageurs", libelle: "Voyageurs", valeur: formaterCompact(valeurs.Voyageurs, formatColonne(fiche.table!, "Voyageurs")) },
            { cle: "ca", libelle: "Chiffre d'affaires", valeur: f("ChiffreAffairesM") },
            { cle: "recette", libelle: "Recette par voyageur", valeur: f("RecetteParVoyageur") },
            { cle: "remplissage", libelle: "Remplissage", valeur: f("Remplissage") },
            {
                cle: "ponctualite",
                libelle: "Ponctualité",
                valeur: f("Ponctualite"),
                statut: statutPonctualite(valeurs.Ponctualite, valeurs.Objectif),
                note: `Objectif ${f("Objectif")}`,
            },
            { cle: "retard", libelle: "Retard moyen", valeur: f("RetardMoyen") },
            { cle: "prevus", libelle: "Trains prévus (14 j)", valeur: f("TrainsPrevus") },
            { cle: "risque", libelle: "Trains à risque élevé", valeur: f("TrainsRisqueEleve"), statut: "critique" },
        ];
    }, [fiche.table, valeurs]);

    const titre = typeof valeurs?.Titre === "string" ? valeurs.Titre : `Fiche relation · ${courante}`;
    const sousTitre = typeof valeurs?.SousTitre === "string" ? valeurs.SousTitre : "";
    const ligne = typeof valeurs?.Ligne === "string" ? valeurs.Ligne : relations.find((r) => r.relation === courante)?.ligne;

    return (
        <div className="flex flex-col gap-grid">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex min-w-0 items-start gap-4">
                    <span
                        aria-hidden="true"
                        className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary font-numeric text-hero-700 font-bold leading-hero-700 text-primary-foreground shadow-8"
                    >
                        4
                    </span>
                    <div className="min-w-0">
                        {fiche.isLoading && !valeurs ? (
                            <>
                                <Squelette className="h-8 w-80 max-w-full" />
                                <Squelette className="mt-2 h-4 w-96 max-w-full" />
                            </>
                        ) : (
                            <>
                                <h1 className="flex flex-wrap items-center gap-3 font-page-title text-page-title font-bold leading-hero-700 tracking-tight text-foreground">
                                    <PictogrammeLigne code={ligne} />
                                    <span className="min-w-0">{titre}</span>
                                </h1>
                                <p className="mt-1 font-page-subtitle text-page-subtitle leading-300 text-muted-foreground">{sousTitre}</p>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-200 font-semibold uppercase leading-200 tracking-widest text-muted-foreground">Relation</span>
                    <SelecteurRelation
                        relations={relations}
                        valeur={courante}
                        onChange={choisirRelation}
                        desactive={chargementListe || relations.length === 0}
                    />
                </div>
            </div>

            {erreurListe && <EtatErreur titre="Liste des relations indisponible" erreur={erreurListe} />}

            <TableauKpi
                titre="Tableau d'affichage · relation"
                contexte={courante}
                tuiles={tuiles}
                chargement={fiche.isLoading || !fiche.table}
                erreur={fiche.error}
                nombreAttendu={8}
                colonnes="grid-cols-2 md:grid-cols-4"
            />

            <BandeauRecit
                surtitre={`Information exploitation · ${courante}`}
                texte={typeof valeurs?.Recit === "string" ? valeurs.Recit : null}
                chargement={fiche.isLoading}
                erreur={fiche.error}
            />

            <div className="grid grid-cols-1 gap-grid xl:grid-cols-12">
                <VisuelModele
                    definition={definitionMensuelle}
                    titre="Voyageurs et ponctualité, mois par mois"
                    sousTitre="Barres : voyageurs · courbe : ponctualité · pointillés : objectif"
                    className="h-96 xl:col-span-7"
                    capabilities={{ disableLineChartCrosshairTooltip: true }}
                />
                <VisuelModele
                    definition={definitionHeures}
                    titre="Retard moyen par heure de départ"
                    sousTitre="Sur l'exercice, toutes journées confondues"
                    className="h-96 xl:col-span-5"
                />
                <TableauDeparts
                    definition={definitionDeparts}
                    titre="Prochains départs prévus"
                    sousTitre="Les 50 prochains départs, avec leur risque estimé"
                    className="h-128 xl:col-span-12"
                />
            </div>
        </div>
    );
}
