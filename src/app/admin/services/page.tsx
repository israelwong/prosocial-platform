import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { ServicesPageClient } from './components';

export default function ServicesPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Servicios</h1>
                    <p className="text-muted-foreground">
                        Administra los servicios disponibles para configurar límites en los planes
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/services/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Servicio
                    </Link>
                </Button>
            </div>

            {/* Client Components */}
            <ServicesPageClient />
        </div>
    );
}
