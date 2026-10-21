import { useEffect, useState } from "react";

const formatHeure = new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit" });
const formatJour = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });

/** Horloge de quai : heure locale, rafraîchie chaque minute. */
export function Horloge({ className }: { className?: string }) {
    const [maintenant, setMaintenant] = useState(() => new Date());

    useEffect(() => {
        const minuterie = window.setInterval(() => setMaintenant(new Date()), 15_000);
        return () => window.clearInterval(minuterie);
    }, []);

    return (
        <time dateTime={maintenant.toISOString()} className={className} title={formatJour.format(maintenant)}>
            {formatHeure.format(maintenant)}
        </time>
    );
}
