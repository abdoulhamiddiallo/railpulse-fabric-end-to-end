import { AlertTriangle, Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

/** Squelette de chargement qui reprend la forme du contenu attendu. */
export function Squelette({ className }: { className?: string }) {
    return <div aria-hidden="true" className={cn("animate-pulse rounded-xl bg-accent", className)} />;
}

/** Message centré et discret quand aucune donnée n'est disponible. */
export function EtatVide({ message, className }: { message: string; className?: string }) {
    return (
        <div className={cn("flex h-full min-h-24 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border p-6 text-center", className)}>
            <Inbox className="icon-size-400 text-muted-foreground" aria-hidden="true" />
            <p className="text-300 leading-300 text-muted-foreground">{message}</p>
        </div>
    );
}

/** Bandeau d'erreur au style destructif. */
export function EtatErreur({ titre, erreur, className }: { titre: string; erreur: Error; className?: string }) {
    return (
        <div
            role="alert"
            className={cn("flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-destructive", className)}
        >
            <AlertTriangle className="icon-size-300 mt-0.5 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
                <p className="font-heading text-300 font-semibold leading-300">{titre}</p>
                <p className="mt-1 break-words text-200 leading-200 text-foreground/80">{erreur.message}</p>
            </div>
        </div>
    );
}
