'use client';

import React from 'react';
import { ZenCard } from '@/components/ui/zen';

/**
 * CondicionesComercialesSkeletonZen - Skeleton loading state para condiciones comerciales
 * 
 * Características:
 * - ✅ Usa ZenCard para consistencia visual
 * - ✅ Animación pulse suave
 * - ✅ Layout que coincide con el contenido real
 * - ✅ Colores zinc coherentes con el tema
 * - ✅ Espaciado consistente con design tokens
 */
export function CondicionesComercialesSkeletonZen() {
    return (
        <div className="space-y-6">
            {/* Header con botón skeleton */}
            <ZenCard variant="default" padding="lg">
                <div className="animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <div className="h-6 bg-zinc-700 rounded w-1/3 mb-2"></div>
                            <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                        </div>
                        <div className="h-10 bg-zinc-700 rounded w-32"></div>
                    </div>
                </div>
            </ZenCard>

            {/* Lista de Condiciones Skeleton */}
            <ZenCard variant="default" padding="lg">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="p-4 bg-zinc-900/30 rounded-lg border border-zinc-800">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-5 w-5 bg-zinc-700 rounded"></div>
                                    <div className="h-6 bg-zinc-700 rounded w-32"></div>
                                    <div className="h-5 bg-zinc-700 rounded w-16"></div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-8 bg-zinc-700 rounded w-8"></div>
                                    <div className="h-8 bg-zinc-700 rounded w-8"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                                <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </ZenCard>
        </div>
    );
}
