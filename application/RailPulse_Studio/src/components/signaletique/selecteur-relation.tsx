import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { useMemo } from "react";
import { PictogrammeLigne } from "@/components/signaletique/pictogramme-ligne";
import type { RelationReseau } from "@/hooks/use-relations";
import { cn } from "@/lib/utils";

interface SelecteurRelationProps {
    relations: RelationReseau[];
    valeur: string;
    onChange: (relation: string) => void;
    desactive?: boolean;
    className?: string;
}

/** Sélecteur des 24 relations, regroupées par ligne avec leur pictogramme. */
export function SelecteurRelation({ relations, valeur, onChange, desactive, className }: SelecteurRelationProps) {
    const groupes = useMemo(() => {
        const parLigne = new Map<string, RelationReseau[]>();
        for (const r of relations) {
            parLigne.set(r.ligne, [...(parLigne.get(r.ligne) ?? []), r]);
        }
        return [...parLigne.entries()].sort(([a], [b]) => a.localeCompare(b));
    }, [relations]);
    const courante = relations.find((r) => r.relation === valeur);

    return (
        <Select.Root value={valeur} onValueChange={onChange} disabled={desactive}>
            <Select.Trigger
                aria-label="Choisir une relation"
                className={cn(
                    "inline-flex h-10 min-w-64 items-center justify-between gap-3 rounded-lg border border-input bg-card px-3 text-left text-[length:var(--text-300)] text-card-foreground shadow-2 transition-[color,box-shadow]",
                    "hover:border-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60",
                    className,
                )}
            >
                <span className="flex min-w-0 items-center gap-2">
                    <PictogrammeLigne code={courante?.ligne} taille="compact" />
                    <Select.Value placeholder="Choisir une relation" />
                </span>
                <Select.Icon>
                    <ChevronDown className="icon-size-200 text-muted-foreground" aria-hidden="true" />
                </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
                <Select.Content
                    position="popper"
                    sideOffset={6}
                    className="z-50 max-h-[var(--radix-select-content-available-height)] min-w-[var(--radix-select-trigger-width)] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-28 animate-entree"
                >
                    <Select.Viewport className="p-1">
                        {groupes.map(([ligne, liste]) => (
                            <Select.Group key={ligne} className="py-1">
                                <Select.Label className="flex items-center gap-2 px-2 py-1 text-200 font-semibold uppercase leading-200 tracking-widest text-muted-foreground">
                                    <PictogrammeLigne code={ligne} taille="compact" />
                                    Ligne {ligne}
                                </Select.Label>
                                {liste.map((r) => (
                                    <Select.Item
                                        key={r.relation}
                                        value={r.relation}
                                        className="relative flex cursor-pointer select-none items-center rounded-md py-1.5 pl-8 pr-2 text-300 leading-300 outline-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[state=checked]:font-semibold"
                                    >
                                        <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                                            <Check className="icon-size-200 text-highlight" aria-hidden="true" />
                                        </Select.ItemIndicator>
                                        <Select.ItemText>{r.relation}</Select.ItemText>
                                    </Select.Item>
                                ))}
                            </Select.Group>
                        ))}
                    </Select.Viewport>
                </Select.Content>
            </Select.Portal>
        </Select.Root>
    );
}
