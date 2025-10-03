'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card';

export default function SuscripcionPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Suscripción</h1>
                <p className="text-zinc-400 mt-1">
                    Gestiona tu plan de suscripción
                </p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Plan Actual</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Información de tu suscripción actual
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-zinc-500">
                        Información de Suscripción - En desarrollo
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
