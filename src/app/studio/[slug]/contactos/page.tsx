'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function ContactosPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Contactos</h1>
                <p className="text-zinc-400 mt-1">
                    Gestión de clientes y contactos
                </p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Base de Contactos</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Administra tu base de datos de clientes y contactos
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-zinc-500">
                        Lista de Contactos - En desarrollo
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
