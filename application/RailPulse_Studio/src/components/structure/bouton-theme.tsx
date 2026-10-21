import { Moon, Sun } from "lucide-react";
import { useThemeContext } from "@/hooks/theme.context";

/** Bascule clair / sombre. */
export function BoutonTheme() {
    const { isDark, toggleTheme } = useThemeContext();
    const libelle = isDark ? "Passer en thème clair" : "Passer en thème sombre";
    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={libelle}
            title={libelle}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-2 transition-colors hover:border-highlight hover:text-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
            {isDark ? <Sun className="icon-size-200" aria-hidden="true" /> : <Moon className="icon-size-200" aria-hidden="true" />}
        </button>
    );
}
