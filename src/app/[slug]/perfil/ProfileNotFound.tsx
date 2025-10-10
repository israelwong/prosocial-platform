import React from 'react';
import { ZenCard, ZenCardContent, ZenButton } from '@/components/ui/zen';
import { Search, Home } from 'lucide-react';
import Link from 'next/link';

/**
 * ProfileNotFound - 404 state for studio not found
 * Shows friendly message with navigation options
 * Uses ZEN Design System components
 */
export function ProfileNotFound() {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
            <ZenCard className="max-w-md w-full">
                <ZenCardContent className="p-8 text-center space-y-6">
                    {/* 404 Icon */}
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-zinc-800 rounded-full flex items-center justify-center">
                            <Search className="h-8 w-8 text-zinc-400" />
                        </div>
                    </div>

                    {/* Error Message */}
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-zinc-100">
                            Estudio no encontrado
                        </h2>
                        <p className="text-sm text-zinc-400">
                            El estudio que buscas no existe o no está disponible en este momento.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/">
                            <ZenButton variant="outline" className="w-full flex items-center gap-2">
                                <Home className="h-4 w-4" />
                                Ir al inicio
                            </ZenButton>
                        </Link>

                        <ZenButton
                            onClick={() => window.history.back()}
                            className="w-full"
                        >
                            Volver atrás
                        </ZenButton>
                    </div>

                    {/* Additional Help */}
                    <div className="text-xs text-zinc-500">
                        Verifica que la URL sea correcta o contacta al soporte si crees que es un error
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
