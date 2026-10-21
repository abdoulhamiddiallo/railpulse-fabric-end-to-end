import { jetonsPictogramme, numeroLigne } from "@/lib/lignes";
import { cn } from "@/lib/utils";

interface PictogrammeLigneProps {
    code: string | null | undefined;
    taille?: "standard" | "compact";
    className?: string;
}

/** Pictogramme de ligne aux couleurs du réseau (carré arrondi, numéro en gras). */
export function PictogrammeLigne({ code, taille = "standard", className }: PictogrammeLigneProps) {
    const { fond, texte } = jetonsPictogramme(code);
    const numero = numeroLigne(code);
    return (
        <span
            className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-md font-heading font-bold tabular-nums tracking-tight",
                taille === "standard" ? "h-7 min-w-9 px-1.5 text-300 leading-300" : "h-5 min-w-7 px-1 text-200 leading-200",
                className,
            )}
            style={{ backgroundColor: fond, color: texte }}
            title={code ? `Ligne ${code}` : undefined}
        >
            <span className="sr-only">Ligne </span>
            {numero ? `L${numero}` : (code ?? "?")}
        </span>
    );
}
