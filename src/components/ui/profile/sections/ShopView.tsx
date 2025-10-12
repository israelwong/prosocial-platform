import React from 'react';
import { Store } from 'lucide-react';
import { PublicCatalogItem } from '@/types/public-profile';
import { ProductCard } from './ProductCard';

interface ShopViewProps {
    items: PublicCatalogItem[];
}

/**
 * ShopView - Product catalog display
 * Shows studio items in a responsive grid
 * Uses ProductCard components
 */
export function ShopView({ items }: ShopViewProps) {
    if (items.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="text-zinc-400 mb-2">
                    <Store className="h-12 w-12 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-zinc-300 mb-2">
                    Tienda vacía
                </h3>
                <p className="text-sm text-zinc-500">
                    Este estudio aún no tiene productos disponibles
                </p>
            </div>
        );
    }

    return (
        <div className="p-4">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-zinc-100 mb-2">
                    Productos y Servicios
                </h2>
                <p className="text-sm text-zinc-400">
                    {items.length} {items.length === 1 ? 'producto' : 'productos'} disponibles
                </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                {items.map((item) => (
                    <ProductCard
                        key={item.id}
                        item={item}
                        onClick={() => {
                            // TODO: Navigate to product detail or open modal
                            console.log('Product clicked:', item.name);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
