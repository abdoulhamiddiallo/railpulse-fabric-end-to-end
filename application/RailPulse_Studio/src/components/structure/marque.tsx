/**
 * Emblème RailPulse : une voie ferrée en perspective dont l'horizon se change
 * en battement de cœur. Le rail dit le réseau, le pouls dit le temps réel.
 */
export function Embleme({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
            <defs>
            <linearGradient id="rpFond" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#22c4c4"/>
            <stop offset="1" stopColor="#00706f"/>
            </linearGradient>
            <radialGradient id="rpLueur" cx="32" cy="14" r="30" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#ffffff" stopOpacity="0.28"/>
            <stop offset="1" stopColor="#ffffff" stopOpacity="0"/>
            </radialGradient>
            <linearGradient id="rpVoie" x1="0" y1="60" x2="0" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#0b1f3a"/>
            <stop offset="1" stopColor="#0b1f3a" stopOpacity="0.25"/>
            </linearGradient>
            <clipPath id="rpTuile"><rect width="64" height="64" rx="14"/></clipPath>
            </defs>
            <g clipPath="url(#rpTuile)">
            <rect width="64" height="64" rx="14" fill="url(#rpFond)"/>
            <rect width="64" height="64" rx="14" fill="url(#rpLueur)"/>
            <g stroke="url(#rpVoie)" strokeLinecap="round" fill="none">
            <path d="M8 62 L31 30.5" strokeWidth="3.2"/>
            <path d="M56 62 L33 30.5" strokeWidth="3.2"/>
            <path d="M15.6 52 H48.4" strokeWidth="2.4"/>
            <path d="M20.7 45 H43.3" strokeWidth="2.1"/>
            <path d="M24.4 40 H39.6" strokeWidth="1.8"/>
            <path d="M27.1 36.2 H36.9" strokeWidth="1.5"/>
            </g>
            <path d="M6 30 H22.5 L25.5 33.5 L31 12 L36.5 37 L40 30 H58" fill="none" stroke="#0b1f3a" strokeOpacity="0.18" strokeWidth="5.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 30 H22.5 L25.5 33.5 L31 12 L36.5 37 L40 30 H58" fill="none" stroke="#f6c35b" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="31" cy="12" r="4.2" fill="#f6c35b" opacity="0.35"/>
            <circle cx="31" cy="12" r="2.1" fill="#fff6dc"/>
            </g>
        </svg>
    );
}

/** Logotype RailPulse : emblème et nom du studio. */
export function Marque() {
    return (
        <div className="flex items-center gap-3">
            <Embleme className="size-10 shrink-0 drop-shadow-md" />
            <span className="leading-tight">
                <span className="block font-heading text-500 font-bold leading-500 tracking-tight text-rail-foreground">RailPulse</span>
                <span className="block text-200 uppercase leading-200 tracking-widest text-rail-muted">Studio d'exploitation</span>
            </span>
        </div>
    );
}
