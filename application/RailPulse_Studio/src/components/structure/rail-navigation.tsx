import * as Tabs from "@radix-ui/react-tabs";
import { SECTIONS } from "@/components/structure/sections";
import { cn } from "@/lib/utils";

/**
 * Rail de navigation : bandeau horizontal défilant sur mobile, colonne verticale
 * sur grand écran. Chaque section est une « voie » numérotée.
 */
export function RailNavigation() {
    return (
        <Tabs.List
            aria-label="Sections du studio"
            className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0"
        >
            {SECTIONS.map(({ id, voie, libelle, description, icone: Icone }) => (
                <Tabs.Trigger
                    key={id}
                    value={id}
                    className={cn(
                        "group relative flex shrink-0 items-center gap-3 rounded-lg px-2.5 py-2 text-left text-rail-muted transition-colors",
                        "hover:bg-rail-active hover:text-rail-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        "data-[state=active]:bg-rail-active data-[state=active]:text-rail-foreground",
                    )}
                >
                    <span
                        aria-hidden="true"
                        className="absolute inset-y-2 left-0 hidden w-0.5 rounded-full bg-highlight group-data-[state=active]:block max-lg:inset-x-2 max-lg:inset-y-auto max-lg:bottom-0 max-lg:h-0.5 max-lg:w-auto"
                    />
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-rail-muted/40 font-numeric text-300 font-bold text-rail-foreground group-data-[state=active]:border-highlight group-data-[state=active]:bg-highlight group-data-[state=active]:text-highlight-foreground">
                        {voie}
                    </span>
                    <span className="min-w-0">
                        <span className="flex items-center gap-1.5 font-heading text-300 font-semibold leading-300">
                            <Icone className="icon-size-200 hidden lg:inline" aria-hidden="true" />
                            {libelle}
                        </span>
                        <span className="hidden text-200 leading-200 text-rail-muted lg:block">{description}</span>
                    </span>
                </Tabs.Trigger>
            ))}
        </Tabs.List>
    );
}
