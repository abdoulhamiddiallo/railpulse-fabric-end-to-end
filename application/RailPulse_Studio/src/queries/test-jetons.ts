import { lireJetonsCouleur, type JetonsCouleur } from "@/lib/jetons-couleur";

/** Jetons de test : chaque variable CSS vaut son propre nom, ce qui rend les injections traçables. */
export function jetonsDeTest(): JetonsCouleur {
    return lireJetonsCouleur((nom) => nom);
}
