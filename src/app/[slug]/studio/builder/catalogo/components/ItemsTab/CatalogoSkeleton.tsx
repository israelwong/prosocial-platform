import { ZenCard, ZenCardContent, ZenCardHeader } from '@/components/ui/zen';

export function CatalogoSkeleton() {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-6 w-6 bg-zinc-700 rounded animate-pulse" />
                    <div className="h-5 w-24 bg-zinc-700 rounded animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                    <div className="h-9 w-32 bg-zinc-700 rounded animate-pulse" />
                    <div className="h-9 w-24 bg-zinc-700 rounded animate-pulse" />
                </div>
            </div>

            {/* Secciones skeleton */}
            {[1, 2].map((i) => (
                <ZenCard key={i}>
                    <ZenCardHeader>
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 bg-zinc-700 rounded animate-pulse" />
                            <div className="h-6 w-48 bg-zinc-700 rounded animate-pulse" />
                            <div className="h-5 w-16 bg-zinc-700 rounded animate-pulse" />
                        </div>
                    </ZenCardHeader>
                    <ZenCardContent>
                        {/* Categorías skeleton */}
                        {[1, 2].map((j) => (
                            <div key={j} className="mb-4 last:mb-0">
                                <div className="p-4 rounded-md bg-zinc-800/70 border border-zinc-700/80">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <div className="h-4 w-4 bg-zinc-700 rounded animate-pulse" />
                                            <div className="h-5 w-32 bg-zinc-700 rounded animate-pulse" />
                                            <div className="h-4 w-12 bg-zinc-700 rounded animate-pulse" />
                                        </div>
                                        <div className="h-7 w-24 bg-zinc-700 rounded animate-pulse" />
                                    </div>

                                    {/* Servicios skeleton */}
                                    <div className="space-y-2 ml-4">
                                        {[1, 2, 3].map((k) => (
                                            <div
                                                key={k}
                                                className="flex items-center justify-between p-2 bg-zinc-800 border border-zinc-700/50 rounded-md"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="h-3 w-3 bg-zinc-700 rounded animate-pulse" />
                                                    <div className="h-4 w-48 bg-zinc-700 rounded animate-pulse" />
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-4 w-20 bg-zinc-700 rounded animate-pulse" />
                                                    <div className="h-4 w-4 bg-zinc-700 rounded animate-pulse" />
                                                    <div className="h-4 w-4 bg-zinc-700 rounded animate-pulse" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </ZenCardContent>
                </ZenCard>
            ))}
        </div>
    );
}
