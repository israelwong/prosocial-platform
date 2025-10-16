import React from 'react';
import Image from 'next/image';
import { ZenCard, ZenCardContent, ZenBadge } from '@/components/ui/zen';
import { PublicCatalogItem } from '@/types/public-profile';

interface ProductCardProps {
    item: PublicCatalogItem;
    onClick?: () => void;
}

/**
 * ProductCard - Reusable product/catalog item card
 * Used in ShopView for displaying studio items
 * Uses ZEN Design System components
 */
export function ProductCard({ item, onClick }: ProductCardProps) {
    const formatPrice = (cost: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(cost);
    };

    return (
        <ZenCard
            className="cursor-pointer hover:bg-zinc-800/50 transition-colors duration-200"
            onClick={onClick}
        >
            <ZenCardContent className="p-0">
                {/* Product Image Placeholder */}
                <div className="relative aspect-square bg-zinc-800 rounded-t-lg overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center">
                        <span className="text-zinc-500 text-sm">
                            {item.type === 'PRODUCTO' ? '📦' : '🔧'}
                        </span>
                    </div>
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-3">
                    {/* Title */}
                    <h3 className="font-medium text-zinc-100 line-clamp-2">
                        {item.name}
                    </h3>

                    {/* Type Badge */}
                    <ZenBadge variant="outline" className="text-xs">
                        {item.type === 'PRODUCTO' ? 'Producto' : 'Servicio'}
                    </ZenBadge>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-purple-400">
                            {formatPrice(item.cost)}
                        </span>
                    </div>
                </div>
            </ZenCardContent>
        </ZenCard>
    );
}
