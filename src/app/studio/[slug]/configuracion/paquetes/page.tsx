'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PaquetesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Paquetes</h1>
                <p className="text-zinc-400 mt-1">
                    Gestiona paquetes por tipo de evento
                </p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Paquetes por Tipo de Evento</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Configura paquetes específicos para cada tipo de evento
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-zinc-500">
                        Gestión de Paquetes - En desarrollo
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
