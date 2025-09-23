'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, UserPlus } from 'lucide-react';

export default function EmpleadosPage() {
    return (
        <div className="space-y-6">

            {/* Lista de Empleados */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Users className="h-5 w-5" />
                            Lista de Empleados
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Gestiona la información de tu equipo
                        </CardDescription>
                    </div>
                    <Button
                        onClick={() => {
                            // TODO: Implementar modal de creación
                            console.log('Abrir modal de empleado');
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Crear Empleado
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="h-32 flex items-center justify-center text-zinc-500">
                        Lista de empleados
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}