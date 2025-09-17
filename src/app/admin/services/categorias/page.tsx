import React from 'react';
import { ServiceCategoriesPageClient } from './components/ServiceCategoriesPageClient';

export default function ServiceCategoriesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categorías de Servicios</h1>
                    <p className="text-muted-foreground">
                        Organiza los servicios en categorías para una mejor experiencia de usuario
                    </p>
                </div>
            </div>

            {/* Client Components */}
            <ServiceCategoriesPageClient />
        </div>
    );
}
