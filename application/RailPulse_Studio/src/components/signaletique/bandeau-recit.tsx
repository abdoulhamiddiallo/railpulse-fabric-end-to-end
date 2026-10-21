import { Megaphone } from "lucide-react";
import { Squelette } from "@/components/signaletique/etats";
import { cn } from "@/lib/utils";

interface BandeauRecitProps {
    surtitre: string;
    texte: string | null | undefined;
    chargement: boolean;
    erreur?: Error;
    className?: string;
}

/** Bandeau « Information voyageurs » portant le récit calculé par le modèle. */
export function BandeauRecit({ surtitre, texte, chargement, erreur, className }: BandeauRecitProps) {
    return (
        <aside
            aria-live="polite"
            className={cn(
                "relative flex items-start gap-3 overflow-hidden rounded-xl border border-highlight/30 bg-accent px-4 py-3 shadow-2",
                className,
            )}
        >
            <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1 bg-highlight" />
            <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-highlight text-highlight-foreground">
                <Megaphone className="icon-size-200" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
                <p className="font-heading text-200 font-semibold uppercase leading-200 tracking-widest text-muted-foreground">
                    {surtitre}
                </p>
                {chargement ? (
                    <Squelette className="mt-2 h-4 w-3/4" />
                ) : erreur ? (
                    <p role="alert" className="mt-1 text-300 leading-300 text-destructive">
                        Récit indisponible : {erreur.message}
                    </p>
                ) : (
                    <p className="mt-1 text-400 font-medium leading-400 text-accent-foreground text-pretty">
                        {texte || "Aucun récit n'est disponible pour cette sélection."}
                    </p>
                )}
            </div>
        </aside>
    );
}
