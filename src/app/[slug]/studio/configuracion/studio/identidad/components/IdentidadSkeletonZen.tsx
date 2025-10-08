'use client';

import React from 'react';
import { ZenCard } from '@/components/ui/zen';

/**
 * IdentidadSkeletonZen - Skeleton loading state para la página de identidad
 * 
 * Características:
 * - ✅ Usa ZenCard para consistencia visual
 * - ✅ Animación pulse suave
 * - ✅ Layout responsive que coincide con el contenido real
 * - ✅ Colores zinc coherentes con el tema
 * - ✅ Espaciado consistente con design tokens
 * - ✅ Solo incluye: Información Básica y Logos (sin palabras clave)
 */
export function IdentidadSkeletonZen() {
    return (
        <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
            {/* Header Navigation Skeleton */}
            <ZenCard variant="default" padding="md">
                <div className="animate-pulse">
                    <div className="h-8 bg-zinc-700 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                </div>
            </ZenCard>

            {/* Información Básica Skeleton */}
            <ZenCard variant="default" padding="md">
                <div className="animate-pulse">
                    <div className="h-6 bg-zinc-700 rounded w-1/4 mb-2"></div>
                    <div className="h-4 bg-zinc-700 rounded w-1/2 mb-4"></div>
                    <div className="space-y-3">
                        <div className="h-10 bg-zinc-700 rounded"></div>
                        <div className="h-10 bg-zinc-700 rounded"></div>
                        <div className="h-20 bg-zinc-700 rounded"></div>
                    </div>
                </div>
            </ZenCard>

            {/* Logos Skeleton */}
            <div className="grid gap-6 md:grid-cols-2">
                <ZenCard variant="default" padding="md">
                    <div className="animate-pulse">
                        <div className="h-6 bg-zinc-700 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-zinc-700 rounded w-2/3 mb-4"></div>
                        <div className="h-32 bg-zinc-700 rounded mb-4"></div>
                        <div className="h-10 bg-zinc-700 rounded"></div>
                    </div>
                </ZenCard>
                <ZenCard variant="default" padding="md">
                    <div className="animate-pulse">
                        <div className="h-6 bg-zinc-700 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-zinc-700 rounded w-2/3 mb-4"></div>
                        <div className="h-32 bg-zinc-700 rounded mb-4"></div>
                        <div className="h-10 bg-zinc-700 rounded"></div>
                    </div>
                </ZenCard>
            </div>
        </div>
    );
}
