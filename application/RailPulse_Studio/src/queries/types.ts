import type { VisualizationSpec } from "@microsoft/fabric-visuals";
import type { ColumnMetadataMap } from "@/lib/to-data-table";

/** Alias de connexion du modèle sémantique SM_RailPulse (fabric.yaml). */
export const CONNEXION = "railpulse";

/** Requête DAX et métadonnées de colonnes (KPI, récits, grilles). */
export interface DefinitionRequete {
    connection: string;
    query: string;
    columnMetadata: ColumnMetadataMap;
}

/** Requête DAX accompagnée de sa spec Vega-Lite. */
export interface DefinitionVisuel extends DefinitionRequete {
    vegaLiteSpec: VisualizationSpec;
}

/** Paramètre commun : relation sélectionnée dans l'application. */
export interface ParametresRelation {
    relation?: string | null;
}

/** Copie profonde d'une spec JSON importée, pour la personnaliser sans la muter. */
export function copierSpec<T>(spec: T): T {
    return structuredClone(spec);
}
