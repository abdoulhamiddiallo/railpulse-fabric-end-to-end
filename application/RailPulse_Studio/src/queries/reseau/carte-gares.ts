import query from "./carte-gares.dax?raw";
import spec from "./carte-gares.json";
import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import { projectionCadree, type Emprise } from "@/lib/emprise-carte";
import { FORMATS } from "@/lib/formatage";
import type { JetonsCouleur } from "@/lib/jetons-couleur";
import { CODES_LIGNES } from "@/lib/lignes";
import { definirGamme, ecrireChemin, lireChemin } from "@/lib/spec-vega";
import type { ColumnMetadataMap } from "@/lib/to-data-table";
import { CONNEXION, copierSpec, type DefinitionVisuel } from "../types";

export const columnMetadata: ColumnMetadataMap = {
    "Gare[Code gare]": { name: "CodeGare", displayName: "Code gare" },
    "Gare[Ville]": { name: "Ville", displayName: "Ville" },
    "Gare[Pays]": { name: "Pays", displayName: "Pays" },
    "Gare[Latitude]": { name: "Latitude", displayName: "Latitude" },
    "Gare[Longitude]": { name: "Longitude", displayName: "Longitude" },
    "[Voyageurs]": { name: "Voyageurs", displayName: "Voyageurs au départ", format: FORMATS.entier },
    "[Ponctualité %]": { name: "Ponctualite", displayName: "Ponctualité au départ", format: FORMATS.pourcentage },
};

type Couche = Record<string, unknown> & { name?: string };

/** Retrouve une couche de la spec par son nom. */
function couche(couches: Couche[], nom: string): Couche {
    const trouvee = couches.find((c) => c.name === nom);
    if (!trouvee) throw new Error(`Couche de carte introuvable : ${nom}`);
    return trouvee;
}

/** Étiquettes placées à gauche (ouest) ou à droite (est) du centre du réseau. */
const COUCHES_ETIQUETTES = [
    { nom: "halo-ouest", cote: "ouest", halo: true },
    { nom: "halo-est", cote: "est", halo: true },
    { nom: "etiquettes-ouest", cote: "ouest", halo: false },
    { nom: "etiquettes-est", cote: "est", halo: false },
] as const;

export interface ParametresCarteGares {
    jetons?: JetonsCouleur;
    /** Emprise calculée sur les gares : cadre la projection. */
    emprise?: Emprise;
    /** Fond de carte TopoJSON (world-atlas, objet « countries »). */
    fondDeCarte?: unknown;
}

/**
 * Carte des gares. Les couches lisent les jeux de données nommés « gares » et
 * « liaisons » ; le fond de carte est inséré sous les tracés quand il est disponible.
 */
export function carteGaresQuery(params: ParametresCarteGares = {}): DefinitionVisuel {
    const vegaLiteSpec = copierSpec(spec);
    const { jetons, emprise, fondDeCarte } = params;

    const couches = lireChemin(vegaLiteSpec, ["layer"]) as Couche[];

    if (emprise) {
        ecrireChemin(vegaLiteSpec, ["projection"], projectionCadree(emprise));
        const centre = Number(((emprise.ouest + emprise.est) / 2).toFixed(4));
        for (const { nom, cote } of COUCHES_ETIQUETTES) {
            couche(couches, nom).transform = [
                { filter: cote === "ouest" ? `datum.Longitude < ${centre}` : `datum.Longitude >= ${centre}` },
            ];
        }
    }

    const liaisons = couche(couches, "liaisons");
    ecrireChemin(liaisons, ["encoding", "color", "scale", "domain"], [...CODES_LIGNES]);
    definirGamme(liaisons, ["encoding", "color", "scale"], jetons?.lignes);

    if (jetons) {
        ecrireChemin(couche(couches, "graticule"), ["mark", "stroke"], jetons.carte.graticule);
        const marqueGares = lireChemin(couche(couches, "gares"), ["mark"]) as Record<string, unknown>;
        marqueGares.fill = jetons.carte.halo;
        marqueGares.stroke = jetons.texte;
        for (const { nom, halo } of COUCHES_ETIQUETTES) {
            const marque = lireChemin(couche(couches, nom), ["mark"]) as Record<string, unknown>;
            if (halo) {
                marque.fill = jetons.carte.halo;
                marque.stroke = jetons.carte.halo;
            } else {
                marque.fill = jetons.texte;
            }
        }
    }

    if (fondDeCarte && emprise) {
        const indexGraticule = couches.findIndex((c) => c.name === "graticule");
        couches.splice(indexGraticule + 1, 0, {
            name: "pays",
            data: { values: fondDeCarte, format: { type: "topojson", feature: "countries" } },
            mark: {
                type: "geoshape",
                clip: true,
                strokeWidth: 0.8,
                ...(jetons ? { fill: jetons.carte.terre, stroke: jetons.carte.frontiere } : {}),
            },
        });
    }

    return {
        connection: CONNEXION,
        query,
        columnMetadata,
        vegaLiteSpec: vegaLiteSpec as unknown as VisualizationSpec,
    };
}
