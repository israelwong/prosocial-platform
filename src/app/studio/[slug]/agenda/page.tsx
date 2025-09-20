'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AgendaPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Agenda</h1>
                <p className="text-zinc-400 mt-1">
                    Calendario de eventos y citas
                </p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Calendario de Eventos</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Gestiona tus eventos y citas con clientes
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-zinc-500">
                        Calendario - En desarrollo
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
