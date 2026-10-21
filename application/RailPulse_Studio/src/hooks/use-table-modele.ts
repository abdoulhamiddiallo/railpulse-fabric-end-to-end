import { useMemo } from "react";
import type { DataTable } from "@microsoft/fabric-visuals-core";
import { useSemanticModelQuery } from "@/hooks/use-semantic-model-query";
import { toDataTable } from "@/lib/to-data-table";
import type { DefinitionRequete } from "@/queries";

export interface ResultatTable {
    table: DataTable | undefined;
    isLoading: boolean;
    error: Error | undefined;
}

/**
 * Exécute la requête d'une définition et la convertit en DataTable
 * (alias de colonnes et formats de columnMetadata).
 */
export function useTableModele(definition: DefinitionRequete): ResultatTable {
    const { connection, query, columnMetadata } = definition;
    const { data, isLoading, error } = useSemanticModelQuery({ connection, query });

    const table = useMemo(() => {
        if (error || data?.status !== "success") return undefined;
        return toDataTable(data.table, columnMetadata);
    }, [data, error, columnMetadata]);

    return { table, isLoading: isLoading || (!data && !error), error };
}
