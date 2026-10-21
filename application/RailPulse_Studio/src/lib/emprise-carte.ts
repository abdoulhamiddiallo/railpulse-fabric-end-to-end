/** Point géographique en degrés décimaux. */
export interface PointGeo {
    longitude: number;
    latitude: number;
}

/** Emprise rectangulaire en degrés. */
export interface Emprise {
    ouest: number;
    est: number;
    sud: number;
    nord: number;
}

/** Paramètres d'une projection Mercator cadrée sur une emprise. */
export interface ProjectionCadree {
    type: "mercator";
    center: [number, number];
    scale: { expr: string };
    translate: { expr: string };
}

/**
 * Calcule l'emprise de la carte à partir des gares, élargie d'une marge relative.
 * Une emprise minimale d'un degré garde une gare isolée lisible.
 */
export function calculerEmprise(points: readonly PointGeo[], marge = 0.18): Emprise | undefined {
    const valides = points.filter(
        (p) => Number.isFinite(p.longitude) && Number.isFinite(p.latitude),
    );
    if (valides.length === 0) return undefined;

    const lons = valides.map((p) => p.longitude);
    const lats = valides.map((p) => p.latitude);
    const ouest = Math.min(...lons);
    const est = Math.max(...lons);
    const sud = Math.min(...lats);
    const nord = Math.max(...lats);
    const largeur = Math.max(est - ouest, 1);
    const hauteur = Math.max(nord - sud, 1);
    const milieuLon = (ouest + est) / 2;
    const milieuLat = (sud + nord) / 2;

    return {
        ouest: milieuLon - (largeur / 2) * (1 + 2 * marge),
        est: milieuLon + (largeur / 2) * (1 + 2 * marge),
        sud: milieuLat - (hauteur / 2) * (1 + 2 * marge),
        nord: milieuLat + (hauteur / 2) * (1 + 2 * marge),
    };
}

const enRadians = (degres: number) => (degres * Math.PI) / 180;

/** Ordonnée Mercator (sans facteur d'échelle) d'une latitude en degrés. */
export function ordonneeMercator(latitude: number): number {
    return Math.log(Math.tan(Math.PI / 4 + enRadians(latitude) / 2));
}

/**
 * Projection Mercator centrée sur l'emprise, dont l'échelle s'adapte à la taille
 * du visuel. Vega-Lite recalcule toujours `fit` à partir de toutes les couches
 * (fond de carte mondial compris) : une échelle et une translation explicites
 * désactivent cet ajustement automatique.
 */
export function projectionCadree(emprise: Emprise): ProjectionCadree {
    const amplitudeX = enRadians(emprise.est - emprise.ouest);
    const amplitudeY = ordonneeMercator(emprise.nord) - ordonneeMercator(emprise.sud);
    const centreLat = (180 / Math.PI) * (2 * Math.atan(Math.exp(
        (ordonneeMercator(emprise.nord) + ordonneeMercator(emprise.sud)) / 2,
    )) - Math.PI / 2);
    const arrondi = (n: number) => Number(n.toFixed(6));

    return {
        type: "mercator",
        center: [arrondi((emprise.ouest + emprise.est) / 2), arrondi(centreLat)],
        scale: { expr: `min(width / ${arrondi(amplitudeX)}, height / ${arrondi(amplitudeY)})` },
        translate: { expr: "[width / 2, height / 2]" },
    };
}
