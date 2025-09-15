import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function NewPlanPage() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/plans">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a Planes
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Crear Nuevo Plan</h1>
                    <p className="text-muted-foreground">
                        Crea un nuevo plan de suscripción para la plataforma
                    </p>
                </div>
            </div>

            {/* Placeholder Content */}
            <div className="bg-muted/50 border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                <div className="text-muted-foreground">
                    <h3 className="text-lg font-medium mb-2">Formulario de Creación</h3>
                    <p className="text-sm mb-4">
                        El formulario para crear planes estará disponible próximamente
                    </p>
                    <Button variant="outline" asChild>
                        <Link href="/admin/plans">
                            Volver a la lista de planes
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
