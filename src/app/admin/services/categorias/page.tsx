import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
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
                <Button asChild>
                    <Link href="/admin/services/categorias/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nueva Categoría
                    </Link>
                </Button>
            </div>

            {/* Client Components */}
            <ServiceCategoriesPageClient />
        </div>
    );
}
