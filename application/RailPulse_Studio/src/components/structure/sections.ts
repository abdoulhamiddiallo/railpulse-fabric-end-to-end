import { CalendarClock, Gauge, Map, TrainFront, type LucideIcon } from "lucide-react";

/** Identifiants des quatre sections de l'application. */
export type IdSection = "reseau" | "ponctualite" | "previsions" | "relation";

export interface Section {
    id: IdSection;
    voie: string;
    libelle: string;
    description: string;
    icone: LucideIcon;
}

/** Les quatre « voies » de l'application, dans l'ordre du rail de navigation. */
export const SECTIONS: readonly Section[] = [
    { id: "reseau", voie: "1", libelle: "Réseau", description: "Trafic, recettes et carte des gares", icone: Map },
    { id: "ponctualite", voie: "2", libelle: "Ponctualité", description: "Classement, heures sensibles, objectif", icone: Gauge },
    { id: "previsions", voie: "3", libelle: "Prévisions", description: "Risques des 14 prochains jours", icone: CalendarClock },
    { id: "relation", voie: "4", libelle: "Fiche relation", description: "Une relation en détail", icone: TrainFront },
];
