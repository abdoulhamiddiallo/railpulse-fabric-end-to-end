import { createContext, useContext } from "react";

/** Relation sélectionnée, partagée par toutes les pages. */
export interface ContexteRelation {
    relation: string | null;
    choisirRelation: (relation: string | null) => void;
}

export const RelationContext = createContext<ContexteRelation | undefined>(undefined);

export function useRelation(): ContexteRelation {
    const contexte = useContext(RelationContext);
    if (!contexte) {
        throw new Error("useRelation doit être utilisé dans un RelationContext.Provider");
    }
    return contexte;
}
