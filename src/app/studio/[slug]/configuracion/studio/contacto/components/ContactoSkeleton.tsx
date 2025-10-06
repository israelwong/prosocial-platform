'use client';

import React from 'react';
import { ZenCard } from '@/components/ui/zen';

/**
 * ContactoSkeleton - Componente skeleton para la página de contacto
 * 
 * Características:
 * - ✅ Skeleton unificado con ZEN Design System
 * - ✅ Animación de pulse consistente
 * - ✅ Layout responsive (grid, cards, etc.)
 * - ✅ Reutilizable y mantenible
 * - ✅ Estructura que replica el contenido real
 */
export function ContactoSkeleton() {
    return (
        <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
            {/* Header Navigation Skeleton */}
            <ZenCard variant="default" padding="lg">
                <div className="animate-pulse">
                    <div className="h-8 bg-zinc-700 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                </div>
            </ZenCard>

            {/* Estadísticas Skeleton */}
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <ZenCard key={i} variant="default" padding="md">
                        <div className="animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="h-4 w-24 bg-zinc-700 rounded" />
                                <div className="h-4 w-4 bg-zinc-700 rounded" />
                            </div>
                            <div className="h-8 w-16 bg-zinc-700 rounded mb-2" />
                            <div className="h-3 w-20 bg-zinc-700 rounded" />
                        </div>
                    </ZenCard>
                ))}
            </div>

            {/* Lista de Contacto Skeleton */}
            <ZenCard variant="default" padding="lg">
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="h-6 bg-zinc-700 rounded w-1/3 mb-2"></div>
                            <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                        </div>
                        <div className="h-10 bg-zinc-700 rounded w-32"></div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="h-16 bg-zinc-700 rounded"></div>
                        <div className="h-16 bg-zinc-700 rounded"></div>
                    </div>

                    <div className="space-y-3">
                        <div className="h-4 bg-zinc-700 rounded w-1/4 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-12 bg-zinc-700 rounded"></div>
                            <div className="h-12 bg-zinc-700 rounded"></div>
                            <div className="h-12 bg-zinc-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </ZenCard>

            {/* Información de uso Skeleton */}
            <ZenCard variant="default" padding="lg">
                <div className="animate-pulse">
                    <div className="h-6 bg-zinc-700 rounded w-1/3 mb-4"></div>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="h-5 bg-zinc-700 rounded w-1/4"></div>
                            <div className="space-y-1">
                                <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                                <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-5 bg-zinc-700 rounded w-1/4"></div>
                            <div className="space-y-1">
                                <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                                <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </ZenCard>
        </div>
    );
}
