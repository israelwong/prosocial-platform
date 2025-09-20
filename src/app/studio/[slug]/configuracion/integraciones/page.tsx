'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function IntegracionesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Integraciones</h1>
                <p className="text-zinc-400 mt-1">
                    Configuración de integraciones externas
                </p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Stripe Onboarding</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Configuración de Stripe para pagos en línea
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Stripe Onboarding - En desarrollo
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">ManyChat</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Integración con ManyChat para automatización
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            ManyChat Integration - En desarrollo
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
