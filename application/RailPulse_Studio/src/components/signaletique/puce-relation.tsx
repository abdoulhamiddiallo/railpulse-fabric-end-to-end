import { X } from "lucide-react";
import { PictogrammeLigne } from "@/components/signaletique/pictogramme-ligne";

interface PuceRelationProps {
    relation: string;
    ligne?: string | null;
    onRetirer: () => void;
}

/** Puce de filtre « Relation : X », retirable. */
export function PuceRelation({ relation, ligne, onRetirer }: PuceRelationProps) {
    return (
        <span className="inline-flex h-9 max-w-full items-center gap-2 rounded-full border border-highlight/50 bg-accent pl-1.5 pr-1 text-300 leading-300 text-accent-foreground shadow-2 animate-entree">
            {ligne ? <PictogrammeLigne code={ligne} taille="compact" /> : null}
            <span className="truncate">
                <span className="text-muted-foreground">Relation : </span>
                <span className="font-semibold">{relation}</span>
            </span>
            <button
                type="button"
                onClick={onRetirer}
                aria-label={`Retirer le filtre de relation ${relation}`}
                className="inline-flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-highlight hover:text-highlight-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
                <X className="icon-size-200" aria-hidden="true" />
            </button>
        </span>
    );
}
