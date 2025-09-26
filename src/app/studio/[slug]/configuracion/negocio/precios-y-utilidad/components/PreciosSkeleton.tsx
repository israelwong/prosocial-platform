'use client';

import React from 'react';
import { ZenCard } from '@/components/ui/zen';

export function PreciosSkeleton() {
    return (
        <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
            {/* Header Navigation Skeleton */}
            <ZenCard variant="default" padding="lg">
                <div className="animate-pulse">
                    <div className="h-8 bg-zinc-700 rounded w-1/3 mb-2"></div>
                    <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                </div>
            </ZenCard>

            {/* Porcentajes de Utilidad Skeleton */}
            <ZenCard variant="default" padding="lg">
                <div className="animate-pulse">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-5 w-5 bg-zinc-700 rounded"></div>
                        <div className="h-6 bg-zinc-700 rounded w-1/3"></div>
                    </div>
                    <div className="h-4 bg-zinc-700 rounded w-1/2 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
                            <div className="h-10 bg-zinc-700 rounded"></div>
                            <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
                            <div className="h-10 bg-zinc-700 rounded"></div>
                            <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </ZenCard>

            {/* Comisiones y Sobreprecio Skeleton */}
            <ZenCard variant="default" padding="lg">
                <div className="animate-pulse">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-5 w-5 bg-zinc-700 rounded"></div>
                        <div className="h-6 bg-zinc-700 rounded w-1/3"></div>
                    </div>
                    <div className="h-4 bg-zinc-700 rounded w-1/2 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
                            <div className="h-10 bg-zinc-700 rounded"></div>
                            <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
                            <div className="h-10 bg-zinc-700 rounded"></div>
                            <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
                        </div>
                    </div>
                </div>
            </ZenCard>

            {/* Preview de Cálculo Skeleton */}
            <ZenCard variant="default" padding="lg">
                <div className="animate-pulse">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-5 w-5 bg-zinc-700 rounded"></div>
                        <div className="h-6 bg-zinc-700 rounded w-1/3"></div>
                    </div>
                    <div className="h-4 bg-zinc-700 rounded w-1/2 mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Ejemplo Servicio Skeleton */}
                        <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                            <div className="h-5 bg-zinc-700 rounded w-1/4 mb-2"></div>
                            <div className="space-y-1">
                                <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                                <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                                <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                                <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                                <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                            </div>
                        </div>
                        {/* Ejemplo Producto Skeleton */}
                        <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                            <div className="h-5 bg-zinc-700 rounded w-1/4 mb-2"></div>
                            <div className="space-y-1">
                                <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                                <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                                <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                                <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                                <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </ZenCard>
        </div>
    );
}
