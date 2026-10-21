import type { StatutPonctualite } from "@/lib/affichage";
import { cn } from "@/lib/utils";

const FOND: Record<StatutPonctualite, string> = {
    conforme: "bg-signal-conforme",
    vigilance: "bg-signal-vigilance",
    critique: "bg-signal-critique",
};

/** Feu de signalisation miniature (pastille lumineuse). */
export function PastilleSignal({ statut, className }: { statut: StatutPonctualite | undefined; className?: string }) {
    return (
        <span
            aria-hidden="true"
            className={cn(
                "inline-block size-2 shrink-0 rounded-full",
                statut ? FOND[statut] : "bg-muted-foreground",
                className,
            )}
        />
    );
}

/** Badge de niveau (risque ou statut), sobre pour les contextes denses. */
export function BadgeSignal({ statut, libelle }: { statut: StatutPonctualite | undefined; libelle: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-sm border border-current/20 px-1.5 py-0.5 font-heading text-200 font-semibold uppercase leading-200 tracking-wider">
            <PastilleSignal statut={statut} />
            {libelle}
        </span>
    );
}
