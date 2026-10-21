//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

import { type ReactNode } from "react";

import { useAuth } from "@/hooks/auth.context";

interface AuthGateProps {
    children: ReactNode;
}

export function AuthGate({ children }: AuthGateProps) {
    const {
        isLoading,
        isAuthenticated,
        signIn,
        isSigningIn,
        signInError,
    } = useAuth();

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <div className="text-300 text-muted-foreground">
                    Connexion à Fabric…
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background p-4">
                <div className="w-full max-w-md rounded-xl border border-border bg-card p-8 text-center shadow-8">
                    <h1 className="mb-2 text-500 font-semibold leading-500 text-card-foreground">
                        Connectez-vous pour ouvrir le studio
                    </h1>
                    <p className="mb-6 text-300 leading-300 text-muted-foreground">
                        Utilisez votre compte Fabric pour accéder à RailPulse et au modèle sémantique SM_RailPulse.
                    </p>
                    <button
                        type="button"
                        onClick={signIn}
                        disabled={isSigningIn}
                        aria-busy={isSigningIn}
                        className="rounded-lg bg-primary px-4 py-2 text-300 font-semibold text-primary-foreground hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSigningIn ? "Connexion…" : "Se connecter avec Fabric"}
                    </button>
                    {signInError && (
                        <p
                            role="alert"
                            className="mt-4 text-300 leading-300 text-destructive"
                        >
                            Connexion impossible : {signInError.message} Réessayez en autorisant les fenêtres contextuelles pour ce site.
                        </p>
                    )}
                </div>
            </div>
        );
    }

    return <>{children}</>;
}