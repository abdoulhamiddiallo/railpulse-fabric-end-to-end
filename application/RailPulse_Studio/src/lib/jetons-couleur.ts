import { CODES_LIGNES, numeroLigne } from "@/lib/lignes";

/**
 * Couleurs sémantiques lues depuis les jetons de global.css et injectées dans les
 * specs Vega-Lite. Aucune couleur brute n'est écrite en dehors de global.css :
 * les specs reçoivent ces valeurs résolues, ce qui suit aussi le mode sombre.
 */
export interface JetonsCouleur {
    signal: { conforme: string; vigilance: string; critique: string };
    /** Couleurs des lignes L01 à L12, dans l'ordre de CODES_LIGNES. */
    lignes: string[];
    /** Rampe séquentielle de la carte de chaleur, du plus faible au plus fort. */
    chaleur: string[];
    carte: { terre: string; frontiere: string; graticule: string; halo: string };
    texte: string;
    texteSecondaire: string;
    marque: string;
}

/** Lecture d'une variable CSS ; renvoie une chaîne vide si elle est absente. */
export type LecteurVariable = (nom: string) => string;

/** Construit les jetons à partir d'un lecteur de variables CSS. */
export function lireJetonsCouleur(lire: LecteurVariable): JetonsCouleur {
    const v = (nom: string) => lire(nom).trim();
    return {
        signal: {
            conforme: v("--color-signal-conforme"),
            vigilance: v("--color-signal-vigilance"),
            critique: v("--color-signal-critique"),
        },
        lignes: CODES_LIGNES.map((code) => v(`--color-ligne-${numeroLigne(code)}`)),
        chaleur: [0, 1, 2, 3, 4].map((i) => v(`--color-chaleur-${i}`)),
        carte: {
            terre: v("--color-carte-terre"),
            frontiere: v("--color-carte-frontiere"),
            graticule: v("--color-carte-graticule"),
            halo: v("--color-carte-halo"),
        },
        texte: v("--color-foreground"),
        texteSecondaire: v("--color-muted-foreground"),
        marque: v("--color-brand"),
    };
}

/** Lit les jetons sur un élément du document (par défaut la racine). */
export function lireJetonsDocument(element: Element = document.documentElement): JetonsCouleur {
    const style = getComputedStyle(element);
    return lireJetonsCouleur((nom) => style.getPropertyValue(nom));
}
