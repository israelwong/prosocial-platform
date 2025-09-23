'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HeaderNavigation } from '@/components/ui/header-navigation';
import { Users, UserPlus } from 'lucide-react';

export default function PersonalPage() {

    return (
        <div className="space-y-6">
            {/* Header de Empleados (por defecto) */}
            <HeaderNavigation
                title="Empleados"
                description="Administra tu equipo de trabajo"
                actionButton={{
                    label: "Agregar Empleado",
                    icon: UserPlus,
                    onClick: () => {
                        // TODO: Implementar modal de creación
                        console.log('Abrir modal de empleado');
                    }
                }}
            />

            {/* Lista de Empleados */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Lista de Empleados
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Gestiona la información de tu equipo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-32 flex items-center justify-center text-zinc-500">
                        Gestión de Empleados - En desarrollo
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
