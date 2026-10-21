/** Codes des douze lignes du réseau, dans l'ordre des pictogrammes. */
export const CODES_LIGNES = [
    "L01", "L02", "L03", "L04", "L05", "L06",
    "L07", "L08", "L09", "L10", "L11", "L12",
] as const;

/** Extrait le numéro à deux chiffres d'un code de ligne (« L05 » donne « 05 »). */
export function numeroLigne(code: string | null | undefined): string | undefined {
    const m = /^L?(\d{1,2})$/i.exec((code ?? "").trim());
    if (!m) return undefined;
    const n = Number(m[1]);
    if (n < 1 || n > CODES_LIGNES.length) return undefined;
    return String(n).padStart(2, "0");
}

/** Variables CSS du pictogramme d'une ligne (fond et texte). */
export function jetonsPictogramme(code: string | null | undefined): { fond: string; texte: string } {
    const numero = numeroLigne(code);
    if (!numero) {
        return { fond: "var(--color-muted)", texte: "var(--color-muted-foreground)" };
    }
    return {
        fond: `var(--color-ligne-${numero})`,
        texte: `var(--color-ligne-${numero}-texte)`,
    };
}
