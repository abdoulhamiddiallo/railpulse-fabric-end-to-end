import { useMemo } from "react";
import { BandeauRecit } from "@/components/signaletique/bandeau-recit";
import { TableauKpi, type TuileKpi } from "@/components/signaletique/tableau-kpi";
import { TitrePage } from "@/components/structure/titre-page";
import { CarteReseau } from "@/components/visuels/carte-reseau";
import { VisuelModele } from "@/components/visuels/visuel-modele";
import { useJetonsCouleur } from "@/hooks/use-jetons-couleur";
import { useRelation } from "@/hooks/relation.context";
import { useRelations } from "@/hooks/use-relations";
import { useTableModele } from "@/hooks/use-table-modele";
import { statutPonctualite } from "@/lib/affichage";
import { formaterCompact, formaterValeur } from "@/lib/formatage";
import { formatColonne, ligneEnObjet } from "@/lib/table-resultat";
import { kpiReseauQuery, recitReseauQuery, voyageursMensuelsQuery, voyageursParLigneQuery } from "@/queries";

const definitionRecit = recitReseauQuery();

export function PageReseau() {
    const { relation } = useRelation();
    const jetons = useJetonsCouleur();
    const { relations } = useRelations();

    const definitionKpi = useMemo(() => kpiReseauQuery({ relation }), [relation]);
    const kpi = useTableModele(definitionKpi);
    const recit = useTableModele(definitionRecit);

    const ligneSelectionnee = relations.find((r) => r.relation === relation)?.ligne ?? null;
    const definitionMensuelle = useMemo(() => voyageursMensuelsQuery({ relation, jetons }), [relation, jetons]);
    const definitionLignes = useMemo(
        () => voyageursParLigneQuery({ jetons, ligneMiseEnAvant: ligneSelectionnee }),
        [jetons, ligneSelectionnee],
    );

    const tuiles = useMemo<TuileKpi[]>(() => {
        if (!kpi.table) return [];
        const v = ligneEnObjet(kpi.table) ?? {};
        const f = (nom: string) => formaterValeur(v[nom], formatColonne(kpi.table!, nom));
        const statut = statutPonctualite(v.Ponctualite, v.Objectif);
        return [
            { cle: "trains", libelle: "Trains assurés", valeur: f("TrainsAssures") },
            { cle: "voyageurs", libelle: "Voyageurs", valeur: formaterCompact(v.Voyageurs, formatColonne(kpi.table!, "Voyageurs")) },
            { cle: "ca", libelle: "Chiffre d'affaires", valeur: f("ChiffreAffairesM") },
            { cle: "ponctualite", libelle: "Ponctualité", valeur: f("Ponctualite"), statut, note: `Objectif ${f("Objectif")}` },
            { cle: "remplissage", libelle: "Remplissage", valeur: f("Remplissage") },
            { cle: "co2", libelle: "CO2 évité", valeur: f("Co2Evite"), note: "Sur l'exercice" },
        ];
    }, [kpi.table]);

    const periode = recit.table ? ligneEnObjet(recit.table)?.Periode : undefined;
    const texteRecit = recit.table ? ligneEnObjet(recit.table)?.Recit : undefined;

    return (
        <div className="flex flex-col gap-grid">
            <TitrePage
                voie="1"
                titre="Le réseau en un coup d'œil"
                sousTitre={typeof periode === "string" ? periode : "Exercice d'exploitation en cours"}
            />

            <TableauKpi
                titre="Tableau d'affichage · réseau"
                contexte={relation ?? "Toutes relations"}
                tuiles={tuiles}
                chargement={kpi.isLoading || !kpi.table}
                erreur={kpi.error}
                nombreAttendu={6}
            />

            <BandeauRecit
                surtitre="Information exploitation · réseau entier"
                texte={typeof texteRecit === "string" ? texteRecit : null}
                chargement={recit.isLoading}
                erreur={recit.error}
            />

            <div className="grid grid-cols-1 gap-grid xl:grid-cols-12">
                <VisuelModele
                    definition={definitionMensuelle}
                    titre="Voyageurs et ponctualité, mois par mois"
                    sousTitre={`Barres : voyageurs · courbe : ponctualité · pointillés : objectif${relation ? ` · ${relation}` : ""}`}
                    className="h-96 xl:col-span-7"
                    capabilities={{ disableLineChartCrosshairTooltip: true }}
                />
                <VisuelModele
                    definition={definitionLignes}
                    titre="Voyageurs par ligne"
                    sousTitre={ligneSelectionnee ? `Ligne ${ligneSelectionnee} mise en avant` : "Deux sens confondus, sur l'exercice"}
                    className="h-96 xl:col-span-5"
                    capabilities={{ disableSelfHighlight: true }}
                />
                <CarteReseau className="h-136 xl:col-span-12" />
            </div>
        </div>
    );
}
