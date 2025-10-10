'use client';

import React from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';

export function HorariosSkeletonZen() {
    return (
        <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
            {/* Header skeleton */}
            <div className="space-y-2">
                <div className="h-8 bg-zinc-700 rounded w-1/3 animate-pulse"></div>
                <div className="h-4 bg-zinc-700 rounded w-1/2 animate-pulse"></div>
            </div>

            {/* Stats skeleton */}
            <ZenCard variant="default" padding="lg">
                <ZenCardHeader>
                    <ZenCardTitle className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-zinc-700 rounded animate-pulse"></div>
                        <div className="h-5 bg-zinc-700 rounded w-48 animate-pulse"></div>
                    </ZenCardTitle>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 bg-zinc-700 rounded w-3/4 animate-pulse"></div>
                                <div className="h-8 bg-zinc-700 rounded w-1/2 animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </ZenCardContent>
            </ZenCard>

            {/* List skeleton */}
            <ZenCard variant="default" padding="lg">
                <ZenCardHeader>
                    <div className="flex items-center justify-between">
                        <div className="h-6 bg-zinc-700 rounded w-48 animate-pulse"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 bg-zinc-700 rounded w-20 animate-pulse"></div>
                            <div className="h-8 bg-zinc-700 rounded w-32 animate-pulse"></div>
                        </div>
                    </div>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-16 bg-zinc-700 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </ZenCardContent>
            </ZenCard>

            {/* Info skeleton */}
            <ZenCard variant="default" padding="lg">
                <ZenCardHeader>
                    <div className="h-6 bg-zinc-700 rounded w-64 animate-pulse"></div>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <div className="h-4 bg-zinc-700 rounded w-32 animate-pulse"></div>
                            <div className="space-y-1">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-3 bg-zinc-700 rounded w-full animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-zinc-700 rounded w-40 animate-pulse"></div>
                            <div className="space-y-1">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-3 bg-zinc-700 rounded w-full animate-pulse"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}