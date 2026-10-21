//-----------------------------------------------------------------------
// <copyright company="Microsoft Corporation">
//        Copyright (c) Microsoft Corporation.  All rights reserved.
//        Licensed under the MIT license. See LICENSE file in the project root for full license information.
// </copyright>
//-----------------------------------------------------------------------

export const ErrorFallback = ({ error, resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) => {
    const message = error instanceof Error ? error.message : String(error);

    // Journalise la pile complète en développement ; l'utilisateur voit le cadre ci-dessous.
    if (import.meta.env.DEV) console.error("[ErrorBoundary]", error);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="w-full max-w-md text-center">
                <h2 className="mb-2 font-heading text-500 font-semibold leading-500 text-foreground">Une erreur est survenue</h2>
                <pre className="mb-4 max-h-32 overflow-auto rounded-lg border border-border bg-muted p-3 text-left text-300 text-muted-foreground">
                    {message}
                </pre>
                <button
                    onClick={resetErrorBoundary}
                    className="rounded-lg border border-border px-4 py-2 text-300 text-foreground hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    Réessayer
                </button>
            </div>
        </div>
    );
}
