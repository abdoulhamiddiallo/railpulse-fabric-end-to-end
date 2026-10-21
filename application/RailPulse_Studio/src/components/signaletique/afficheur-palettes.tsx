import { cn } from "@/lib/utils";

interface AfficheurPalettesProps {
    /** Texte à afficher, un caractère par palette. */
    texte: string;
    /** Taille des palettes : grande pour les KPI, compacte pour les rangées denses. */
    taille?: "grande" | "compacte";
    className?: string;
}

const ESPACES = new Set([" ", "\u00a0", "\u202f"]);

/**
 * Afficheur à palettes façon tableau des départs : chaque caractère occupe une
 * tuile sombre coupée d'une fine ligne horizontale et bascule à l'apparition.
 */
export function AfficheurPalettes({ texte, taille = "grande", className }: AfficheurPalettesProps) {
    const caracteres = Array.from(texte);
    return (
        <span className={cn("inline-flex flex-wrap items-stretch gap-0.5", className)}>
            <span className="sr-only">{texte}</span>
            {caracteres.map((caractere, index) =>
                ESPACES.has(caractere) ? (
                    <span key={index} aria-hidden="true" className={taille === "grande" ? "w-1.5" : "w-1"} />
                ) : (
                    <span
                        key={`${index}-${caractere}`}
                        aria-hidden="true"
                        className={cn(
                            "cellule-palette inline-flex items-center justify-center rounded-sm font-numeric font-bold text-board-foreground animate-palette",
                            taille === "grande"
                                ? "h-8 min-w-5 px-px text-500 leading-500 sm:h-9 sm:min-w-6 sm:text-600"
                                : "h-6 min-w-4 px-px text-300 leading-300",
                        )}
                        style={{ animationDelay: `${index * 45}ms` }}
                    >
                        {caractere}
                    </span>
                ),
            )}
        </span>
    );
}
