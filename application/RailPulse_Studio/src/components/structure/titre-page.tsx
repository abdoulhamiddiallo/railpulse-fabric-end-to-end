import type { ReactNode } from "react";

interface TitrePageProps {
    voie: string;
    titre: string;
    sousTitre: ReactNode;
    actions?: ReactNode;
}

/** Titre de page façon panneau de quai : numéro de voie, titre, sous-titre. */
export function TitrePage({ voie, titre, sousTitre, actions }: TitrePageProps) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex min-w-0 items-start gap-4">
                <span
                    aria-hidden="true"
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary font-numeric text-hero-700 font-bold leading-hero-700 text-primary-foreground shadow-8"
                >
                    {voie}
                </span>
                <div className="min-w-0">
                    <h1 className="font-page-title text-page-title font-bold leading-hero-700 tracking-tight text-foreground">{titre}</h1>
                    <p className="mt-1 font-page-subtitle text-page-subtitle leading-300 text-muted-foreground">{sousTitre}</p>
                </div>
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}
