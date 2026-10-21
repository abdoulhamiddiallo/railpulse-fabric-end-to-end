import { useEffect, useState } from "react";
import { lireJetonsDocument, type JetonsCouleur } from "@/lib/jetons-couleur";

/**
 * Jetons de couleur résolus depuis global.css, relus à chaque bascule clair/sombre
 * (observation de la classe et de l'attribut d'apparence de <html>).
 */
export function useJetonsCouleur(): JetonsCouleur {
    const [jetons, setJetons] = useState<JetonsCouleur>(() => lireJetonsDocument());

    useEffect(() => {
        const racine = document.documentElement;
        const relire = () => setJetons(lireJetonsDocument());
        relire();
        const observateur = new MutationObserver(relire);
        observateur.observe(racine, { attributes: true, attributeFilter: ["class", "data-appearance"] });
        return () => observateur.disconnect();
    }, []);

    return jetons;
}
