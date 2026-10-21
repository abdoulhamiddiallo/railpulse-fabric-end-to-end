import * as Tabs from "@radix-ui/react-tabs";
import { useMemo, useState } from "react";
import { PuceRelation } from "@/components/signaletique/puce-relation";
import { BoutonTheme } from "@/components/structure/bouton-theme";
import { Horloge } from "@/components/structure/horloge";
import { Marque } from "@/components/structure/marque";
import { RailNavigation } from "@/components/structure/rail-navigation";
import { SECTIONS, type IdSection } from "@/components/structure/sections";
import { RelationContext } from "@/hooks/relation.context";
import { useRelations } from "@/hooks/use-relations";
import { PageFicheRelation } from "@/pages/page-fiche-relation";
import { PagePonctualite } from "@/pages/page-ponctualite";
import { PagePrevisions } from "@/pages/page-previsions";
import { PageReseau } from "@/pages/page-reseau";

/** Bandeau supérieur : section courante, filtre de relation, horloge et thème. */
function BandeauSuperieur({ section, relation, onRetirer }: { section: IdSection; relation: string | null; onRetirer: () => void }) {
    const { relations } = useRelations();
    const courante = SECTIONS.find((s) => s.id === section)!;
    const ligne = relations.find((r) => r.relation === relation)?.ligne;

    return (
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
            <div className="mx-auto flex w-full max-w-screen-2xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 lg:px-8">
                <p className="flex items-center gap-2 font-heading text-200 font-semibold uppercase leading-200 tracking-widest text-muted-foreground">
                    <span className="inline-flex h-6 items-center rounded-sm bg-primary px-1.5 font-numeric text-primary-foreground">
                        Voie {courante.voie}
                    </span>
                    {courante.libelle}
                </p>
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    {relation && <PuceRelation relation={relation} ligne={ligne} onRetirer={onRetirer} />}
                    <Horloge className="inline-flex h-9 items-center rounded-lg bg-board px-3 font-numeric text-400 font-bold tracking-widest text-board-foreground shadow-2" />
                    <BoutonTheme />
                </div>
            </div>
        </header>
    );
}

function App() {
    const [section, setSection] = useState<IdSection>("reseau");
    const [relation, setRelation] = useState<string | null>(null);
    const contexteRelation = useMemo(() => ({ relation, choisirRelation: setRelation }), [relation]);

    return (
        <RelationContext.Provider value={contexteRelation}>
            <Tabs.Root
                value={section}
                onValueChange={(valeur) => setSection(valeur as IdSection)}
                orientation="vertical"
                className="flex min-h-full flex-col bg-background lg:flex-row"
            >
                <div className="shrink-0 bg-rail lg:w-72">
                <aside className="z-40 flex shrink-0 flex-col bg-rail text-rail-foreground lg:sticky lg:top-0 lg:h-screen lg:w-72">
                    <div className="px-4 pb-3 pt-4 lg:px-5 lg:pb-6 lg:pt-6">
                        <Marque />
                    </div>
                    <RailNavigation />
                    <div className="mt-auto hidden px-5 pb-6 lg:block">
                        <div className="rounded-xl border border-rail-muted/30 p-3">
                            <p className="text-200 font-semibold uppercase leading-200 tracking-widest text-rail-muted">Lignes du réseau</p>
                            <p className="mt-1 text-200 leading-200 text-rail-foreground/80">
                                Les pictogrammes colorés identifient les douze lignes dans tous les visuels.
                            </p>
                        </div>
                    </div>
                </aside>
                </div>

                <div className="flex min-w-0 flex-1 flex-col trame-quai">
                    <BandeauSuperieur section={section} relation={relation} onRetirer={() => setRelation(null)} />

                    <main className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-6 lg:px-8">
                        <Tabs.Content value="reseau" className="focus-visible:outline-none">
                            <PageReseau />
                        </Tabs.Content>
                        <Tabs.Content value="ponctualite" className="focus-visible:outline-none">
                            <PagePonctualite onOuvrirFiche={() => setSection("relation")} />
                        </Tabs.Content>
                        <Tabs.Content value="previsions" className="focus-visible:outline-none">
                            <PagePrevisions />
                        </Tabs.Content>
                        <Tabs.Content value="relation" className="focus-visible:outline-none">
                            <PageFicheRelation />
                        </Tabs.Content>
                    </main>

                    <footer className="border-t border-border">
                        <p className="mx-auto w-full max-w-screen-2xl px-4 py-4 text-200 leading-200 text-muted-foreground lg:px-8">
                            Données : modèle sémantique SM_RailPulse (Direct Lake) · Microsoft Fabric
                        </p>
                    </footer>
                </div>
            </Tabs.Root>
        </RelationContext.Provider>
    );
}

export default App;
