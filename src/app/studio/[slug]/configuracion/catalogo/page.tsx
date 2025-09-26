'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card';

export default function CatalogoPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Catálogo</h1>
                <p className="text-zinc-400 mt-1">
                    Gestiona tu catálogo de servicios y tipos de evento
                </p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Catálogo de Servicios</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Administra tus servicios disponibles
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Catálogo de Servicios - En desarrollo
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Tipos de Evento</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Configura los tipos de eventos que manejas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Tipos de Evento - En desarrollo
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
