import React from 'react';
import Image from 'next/image';
import { Play, Grid3X3 } from 'lucide-react';
import { PublicPortfolio } from '@/types/public-profile';

interface PostGridViewProps {
    portfolios: PublicPortfolio[];
}

/**
 * PostGridView - 3-column grid display of portfolio items
 * Shows images and videos from studio portfolios
 * Mobile-first responsive design
 */
export function PostGridView({ portfolios }: PostGridViewProps) {
    // Flatten all portfolio items into a single array
    const allItems = portfolios.flatMap(portfolio =>
        portfolio.items.map(item => ({
            ...item,
            portfolioTitle: portfolio.title,
            portfolioCategory: portfolio.category,
        }))
    );

    if (allItems.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="text-zinc-400 mb-2">
                    <Grid3X3 className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-zinc-300 mb-2">
                    No hay publicaciones aún
                </h3>
                <p className="text-sm text-zinc-500">
                    Este estudio aún no ha compartido su trabajo
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-1 p-1">
            {allItems.map((item) => (
                <div
                    key={item.id}
                    className="relative aspect-square bg-zinc-800 rounded-lg overflow-hidden group cursor-pointer"
                >
                    {/* Image/Video */}
                    {item.image_url ? (
                        <Image
                            src={item.image_url}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                            sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                    ) : (
                        <div className="w-full h-full bg-zinc-700 flex items-center justify-center">
                            <span className="text-zinc-500 text-sm">Sin imagen</span>
                        </div>
                    )}

                    {/* Video play overlay */}
                    {item.item_type === 'VIDEO' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="bg-white/90 rounded-full p-2">
                                <Play className="h-6 w-6 text-zinc-800 fill-current" />
                            </div>
                        </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-200" />
                </div>
            ))}
        </div>
    );
}
