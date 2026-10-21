/** Segment de chemin dans une spec JSON : clé d'objet ou index de tableau. */
export type SegmentChemin = string | number;

function estConteneur(valeur: unknown): valeur is Record<string, unknown> | unknown[] {
    return typeof valeur === "object" && valeur !== null;
}

function decrire(chemin: readonly SegmentChemin[]): string {
    return chemin.map(String).join(".");
}

/** Descend dans une spec le long d'un chemin ; lève une erreur si un maillon manque. */
export function lireChemin(spec: unknown, chemin: readonly SegmentChemin[]): unknown {
    let courant: unknown = spec;
    for (const segment of chemin) {
        if (!estConteneur(courant)) {
            throw new Error(`Chemin de spec introuvable : ${decrire(chemin)}`);
        }
        courant = (courant as Record<string, unknown>)[segment as string];
        if (courant === undefined) {
            throw new Error(`Chemin de spec introuvable : ${decrire(chemin)}`);
        }
    }
    return courant;
}

/** Affecte une valeur au bout d'un chemin existant (le parent doit exister). */
export function ecrireChemin(spec: unknown, chemin: readonly SegmentChemin[], valeur: unknown): void {
    if (chemin.length === 0) throw new Error("Chemin de spec vide.");
    const parent = lireChemin(spec, chemin.slice(0, -1));
    if (!estConteneur(parent)) {
        throw new Error(`Chemin de spec introuvable : ${decrire(chemin)}`);
    }
    (parent as Record<string, unknown>)[chemin[chemin.length - 1] as string] = valeur;
}

/** Supprime une clé au bout d'un chemin existant. */
export function supprimerChemin(spec: unknown, chemin: readonly SegmentChemin[]): void {
    if (chemin.length === 0) throw new Error("Chemin de spec vide.");
    const parent = lireChemin(spec, chemin.slice(0, -1));
    if (!estConteneur(parent) || Array.isArray(parent)) {
        throw new Error(`Chemin de spec introuvable : ${decrire(chemin)}`);
    }
    delete (parent as Record<string, unknown>)[chemin[chemin.length - 1] as string];
}

/**
 * Renseigne la gamme d'une échelle de couleur, ou la retire quand aucune gamme
 * n'est fournie (la palette du thème s'applique alors).
 */
export function definirGamme(spec: unknown, cheminEchelle: readonly SegmentChemin[], gamme?: readonly string[]): void {
    const utilisable = gamme && gamme.length > 0 && gamme.every((c) => c.length > 0);
    if (utilisable) {
        ecrireChemin(spec, [...cheminEchelle, "range"], [...gamme]);
    } else {
        supprimerChemin(spec, [...cheminEchelle, "range"]);
    }
}

/** Littéral de chaîne sûr pour une expression Vega. */
export function litteralExpression(valeur: string): string {
    return JSON.stringify(valeur);
}

/**
 * Encodage d'opacité mettant en avant une valeur d'un champ : la valeur choisie
 * reste pleine, les autres sont estompées (opacité 0,35 recommandée).
 */
export function opaciteMiseEnAvant(champ: string, valeur?: string | null): Record<string, unknown> {
    if (!valeur) return { value: 1 };
    return {
        condition: { test: `datum[${litteralExpression(champ)}] === ${litteralExpression(valeur)}`, value: 1 },
        value: 0.35,
    };
}
