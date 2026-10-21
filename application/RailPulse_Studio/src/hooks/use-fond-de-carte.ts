import { useEffect, useState } from "react";
import urlFondLocal from "world-atlas/countries-50m.json?url";

/** Fond de carte public (world-atlas, Natural Earth 1:50m), en secours du fichier embarqué. */
export const URL_FOND_PUBLIC = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json";

export type StatutFond = "chargement" | "disponible" | "indisponible";

let promesseFond: Promise<unknown> | undefined;

async function telecharger(url: string): Promise<unknown> {
    const reponse = await fetch(url);
    if (!reponse.ok) throw new Error(`Fond de carte indisponible (${reponse.status}).`);
    const topo = (await reponse.json()) as { type?: string; objects?: Record<string, unknown> };
    if (topo?.type !== "Topology" || !topo.objects?.countries) {
        throw new Error("Fond de carte TopoJSON invalide.");
    }
    return topo;
}

/** Charge le fond de carte une seule fois : fichier servi avec l'application, puis CDN public. */
function chargerFond(): Promise<unknown> {
    promesseFond ??= telecharger(urlFondLocal).catch(() => telecharger(URL_FOND_PUBLIC));
    return promesseFond;
}

/**
 * Fond de carte des pays (TopoJSON). En cas d'échec, la carte reste lisible
 * avec le seul graticule : le statut « indisponible » le signale.
 */
export function useFondDeCarte(): { fond: unknown; statut: StatutFond } {
    const [etat, setEtat] = useState<{ fond: unknown; statut: StatutFond }>({ fond: undefined, statut: "chargement" });

    useEffect(() => {
        let actif = true;
        chargerFond()
            .then((fond) => actif && setEtat({ fond, statut: "disponible" }))
            .catch(() => {
                promesseFond = undefined;
                if (actif) setEtat({ fond: undefined, statut: "indisponible" });
            });
        return () => {
            actif = false;
        };
    }, []);

    return etat;
}
