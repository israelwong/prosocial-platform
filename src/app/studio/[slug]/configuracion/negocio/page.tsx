'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NegocioPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Negocio</h1>
                <p className="text-zinc-400 mt-1">
                    Configuración general del negocio
                </p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Información General</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Datos básicos del negocio
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Información General - En desarrollo
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Horarios de Atención</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Configura los horarios de atención al cliente
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Horarios de Atención - En desarrollo
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Redes Sociales</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Enlaces a tus redes sociales
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Redes Sociales - En desarrollo
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Cuenta de Depósito</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Información bancaria para pagos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Cuenta de Depósito - En desarrollo
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
