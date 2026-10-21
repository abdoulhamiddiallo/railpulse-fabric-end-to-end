import type { ReactNode } from "react";
import { AfficheurPalettes } from "@/components/signaletique/afficheur-palettes";
import { EtatErreur, Squelette } from "@/components/signaletique/etats";
import { PastilleSignal } from "@/components/signaletique/pastille-signal";
import { separerUnite, type StatutPonctualite } from "@/lib/affichage";
import { cn } from "@/lib/utils";

/** Une tuile du tableau d'affichage. */
export interface TuileKpi {
    cle: string;
    libelle: string;
    /** Valeur déjà mise en forme en fr-FR (« 1 049,8 M€ »). */
    valeur: string;
    /** Ligne secondaire facultative (objectif, rang, contexte). */
    note?: ReactNode;
    statut?: StatutPonctualite;
}

interface TableauKpiProps {
    titre: string;
    /** Contexte affiché à droite du bandeau (relation filtrée, horizon...). */
    contexte?: ReactNode;
    tuiles: TuileKpi[];
    chargement: boolean;
    erreur?: Error;
    /** Nombre de tuiles attendues, pour dimensionner le squelette. */
    nombreAttendu: number;
    className?: string;
    colonnes?: string;
}

/**
 * Tableau d'affichage des indicateurs : bandeau sombre façon quai, valeurs en
 * afficheur à palettes, unité en étiquette, pastille de signal facultative.
 */
export function TableauKpi({
    titre,
    contexte,
    tuiles,
    chargement,
    erreur,
    nombreAttendu,
    className,
    colonnes = "grid-cols-2 md:grid-cols-3 2xl:grid-cols-6",
}: TableauKpiProps) {
    return (
        <section
            aria-label={titre}
            className={cn("overflow-hidden rounded-2xl bg-board text-board-foreground shadow-16", className)}
        >
            <header className="flex flex-wrap items-center justify-between gap-2 border-b border-board-split px-4 py-2.5">
                <h2 className="flex items-center gap-2 font-heading text-200 font-semibold uppercase leading-200 tracking-widest text-board-label">
                    <span aria-hidden="true" className="inline-block size-1.5 animate-pulse rounded-full bg-board-foreground" />
                    {titre}
                </h2>
                {contexte && (
                    <div className="font-numeric text-200 uppercase leading-200 tracking-wider text-board-label">{contexte}</div>
                )}
            </header>

            {erreur ? (
                <div className="p-4">
                    <EtatErreur titre="Impossible de charger les indicateurs" erreur={erreur} className="bg-card" />
                </div>
            ) : (
                <ul className={cn("grid gap-px bg-board-split", colonnes)}>
                    {chargement
                        ? Array.from({ length: nombreAttendu }, (_, i) => (
                              <li key={i} className="bg-board p-4">
                                  <Squelette className="h-3 w-24 bg-board-cell" />
                                  <Squelette className="mt-3 h-9 w-36 bg-board-cell" />
                              </li>
                          ))
                        : tuiles.map((tuile) => {
                              const { chiffres, unite } = separerUnite(tuile.valeur);
                              return (
                                  <li key={tuile.cle} className="flex min-w-0 flex-col gap-2 bg-board p-4">
                                      <p className="flex items-center gap-2 text-200 font-medium uppercase leading-200 tracking-wider text-board-label">
                                          {tuile.statut && <PastilleSignal statut={tuile.statut} />}
                                          <span className="truncate">{tuile.libelle}</span>
                                      </p>
                                      <p className="flex flex-wrap items-end gap-x-1.5 gap-y-1">
                                          <AfficheurPalettes key={tuile.valeur} texte={chiffres} />
                                          {unite && (
                                              <span className="pb-0.5 font-heading text-300 font-semibold leading-300 text-board-label">
                                                  {unite}
                                              </span>
                                          )}
                                      </p>
                                      {tuile.note && (
                                          <p className="text-200 leading-200 text-board-label">{tuile.note}</p>
                                      )}
                                  </li>
                              );
                          })}
                </ul>
            )}
        </section>
    );
}
