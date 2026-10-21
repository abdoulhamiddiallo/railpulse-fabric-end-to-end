/** Valeur d'afficheur scindée en partie chiffrée (palettes) et unité (étiquette). */
export interface ValeurAfficheur {
    chiffres: string;
    unite: string;
}

const MOTIF_VALEUR = /^([+-]?[\d\s\u00a0\u202f.,]*\d)\s*(.*)$/u;

/**
 * Sépare « 1 049,8 M€ » en { chiffres: "1 049,8", unite: "M€" }.
 * Un texte sans chiffre en tête est rendu tel quel, sans unité.
 */
export function separerUnite(texte: string): ValeurAfficheur {
    const propre = texte.trim();
    const m = MOTIF_VALEUR.exec(propre);
    if (!m) return { chiffres: propre, unite: "" };
    return { chiffres: m[1], unite: m[2].trim() };
}

/** Statut d'exploitation au regard de l'objectif de ponctualité. */
export type StatutPonctualite = "conforme" | "vigilance" | "critique";

/** Tolérance de vigilance sous l'objectif (3 points : 77 % conforme, 74 à 77 % vigilance). */
export const TOLERANCE_VIGILANCE = 0.03;

export function statutPonctualite(ponctualite: unknown, objectif: unknown): StatutPonctualite | undefined {
    if (typeof ponctualite !== "number" || typeof objectif !== "number") return undefined;
    if (!Number.isFinite(ponctualite) || !Number.isFinite(objectif)) return undefined;
    if (ponctualite >= objectif) return "conforme";
    if (ponctualite >= objectif - TOLERANCE_VIGILANCE) return "vigilance";
    return "critique";
}

export const LIBELLES_STATUT: Record<StatutPonctualite, string> = {
    conforme: "Conforme à l'objectif",
    vigilance: "Sous vigilance",
    critique: "Critique",
};

/** Niveau de risque de prévision, tel que libellé dans le modèle. */
export type NiveauRisque = "ÉLEVÉ" | "MOYEN" | "FAIBLE";

/** Correspondance entre niveau de risque et signal d'exploitation. */
export function signalRisque(niveau: unknown): StatutPonctualite | undefined {
    switch (niveau) {
        case "ÉLEVÉ":
            return "critique";
        case "MOYEN":
            return "vigilance";
        case "FAIBLE":
            return "conforme";
        default:
            return undefined;
    }
}

/** Libellé lisible d'un niveau de risque (« ÉLEVÉ » devient « Élevé »). */
export function libelleRisque(niveau: unknown): string {
    if (typeof niveau !== "string" || niveau.length === 0) return "";
    const minuscule = niveau.toLocaleLowerCase("fr-FR");
    return minuscule.charAt(0).toLocaleUpperCase("fr-FR") + minuscule.slice(1);
}
