import React from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader } from '@/components/ui/zen';

/**
 * ProfileSkeleton - Loading state for profile page
 * Shows skeleton placeholders while data loads
 * Uses ZEN Design System components
 */
export function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Mobile Layout Skeleton */}
            <div className="lg:hidden">
                {/* Header Skeleton */}
                <div className="flex flex-col items-center space-y-4 p-6">
                    <div className="h-24 w-24 bg-zinc-800 rounded-full animate-pulse" />
                    <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
                    <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                    <div className="flex space-x-6">
                        <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse" />
                        <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse" />
                    </div>
                </div>

                {/* Tabs Skeleton */}
                <div className="border-b border-zinc-800">
                    <div className="flex">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex-1 h-12 bg-zinc-800 animate-pulse" />
                        ))}
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="p-4">
                    <div className="grid grid-cols-3 gap-1">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="aspect-square bg-zinc-800 rounded animate-pulse" />
                        ))}
                    </div>
                </div>
            </div>

            {/* Desktop Layout Skeleton */}
            <div className="hidden lg:grid lg:grid-cols-[400px_1fr_380px] lg:gap-6 lg:p-6">
                {/* Column 1 */}
                <div className="space-y-6">
                    {/* Header Skeleton */}
                    <div className="flex flex-col items-center space-y-4 p-6">
                        <div className="h-24 w-24 bg-zinc-800 rounded-full animate-pulse" />
                        <div className="h-6 w-48 bg-zinc-800 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-zinc-800 rounded animate-pulse" />
                        <div className="flex space-x-6">
                            <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse" />
                            <div className="h-8 w-16 bg-zinc-800 rounded animate-pulse" />
                        </div>
                    </div>

                    {/* Tabs Skeleton */}
                    <div className="border-b border-zinc-800">
                        <div className="flex">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex-1 h-12 bg-zinc-800 animate-pulse" />
                            ))}
                        </div>
                    </div>

                    {/* Content Skeleton */}
                    <div className="p-4">
                        <div className="grid grid-cols-3 gap-1">
                            {Array.from({ length: 9 }).map((_, i) => (
                                <div key={i} className="aspect-square bg-zinc-800 rounded animate-pulse" />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Column 2 Skeleton */}
                <div>
                    <ZenCard>
                        <ZenCardHeader>
                            <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
                        </ZenCardHeader>
                        <ZenCardContent className="space-y-4">
                            <div className="aspect-video bg-zinc-800 rounded animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                                <div className="h-3 w-3/4 bg-zinc-800 rounded animate-pulse" />
                            </div>
                            <div className="h-10 w-full bg-zinc-800 rounded animate-pulse" />
                        </ZenCardContent>
                    </ZenCard>
                </div>

                {/* Column 3 Skeleton */}
                <div>
                    <ZenCard>
                        <ZenCardHeader>
                            <div className="h-6 w-32 bg-zinc-800 rounded animate-pulse" />
                        </ZenCardHeader>
                        <ZenCardContent className="space-y-4">
                            <div className="aspect-video bg-zinc-800 rounded animate-pulse" />
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
                                <div className="h-3 w-3/4 bg-zinc-800 rounded animate-pulse" />
                            </div>
                            <div className="h-10 w-full bg-zinc-800 rounded animate-pulse" />
                        </ZenCardContent>
                    </ZenCard>
                </div>
            </div>
        </div>
    );
}
