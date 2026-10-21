/**
 * Filtre de relation partagé par toute l'application.
 *
 * Les fichiers .dax contiennent des jetons commentés, inertes tant qu'aucune
 * relation n'est sélectionnée :
 *   - `/*FILTRE_RELATION,*\/` : argument de filtre de SUMMARIZECOLUMNS (suivi d'une virgule) ;
 *   - `/*,FILTRE_RELATION*\/` : argument de filtre final de CALCULATETABLE (précédé d'une virgule).
 * Quand une relation est choisie, chaque jeton devient un TREATAS sur 'Relation'[Relation].
 */

export const JETON_FILTRE_ARGUMENT = "/*FILTRE_RELATION,*/";
export const JETON_FILTRE_FINAL = "/*,FILTRE_RELATION*/";

/** Échappe une chaîne pour un littéral DAX entre guillemets doubles. */
export function echapperChaineDax(valeur: string): string {
    return valeur.replace(/"/g, '""');
}

/** Construit l'expression TREATAS qui restreint le modèle à une relation. */
export function expressionFiltreRelation(relation: string): string {
    return `TREATAS({"${echapperChaineDax(relation)}"}, 'Relation'[Relation])`;
}

/** Indique si une requête DAX porte au moins un jeton de filtre de relation. */
export function contientJetonRelation(dax: string): boolean {
    return dax.includes(JETON_FILTRE_ARGUMENT) || dax.includes(JETON_FILTRE_FINAL);
}

/**
 * Applique (ou non) le filtre de relation à une requête DAX.
 * Sans relation, la requête est renvoyée telle quelle (les jetons restent des commentaires).
 * Avec une relation, une requête dépourvue de jeton est une erreur de conception.
 */
export function appliquerFiltreRelation(dax: string, relation?: string | null): string {
    const valeur = relation?.trim();
    if (!valeur) return dax;
    if (!contientJetonRelation(dax)) {
        throw new Error("La requête DAX ne contient aucun jeton de filtre de relation.");
    }
    const filtre = expressionFiltreRelation(valeur);
    return dax
        .split(JETON_FILTRE_ARGUMENT).join(`${filtre},`)
        .split(JETON_FILTRE_FINAL).join(`, ${filtre}`);
}
