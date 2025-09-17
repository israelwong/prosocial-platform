import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ServiceCategoriesPageClient } from './components/ServiceCategoriesPageClient';

export default function ServiceCategoriesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/services">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Regresar a Servicios
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Categorías de Servicios</h1>
                        <p className="text-muted-foreground">
                            Organiza los servicios en categorías para una mejor experiencia de usuario
                        </p>
                    </div>
                </div>
            </div>

            {/* Client Components */}
            <ServiceCategoriesPageClient />
        </div>
    );
}
