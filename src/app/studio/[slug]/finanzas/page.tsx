'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FinanzasPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Finanzas</h1>
                <p className="text-zinc-400 mt-1">
                    Control financiero y reportes
                </p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Reportes Financieros</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Análisis de ingresos, gastos y rentabilidad
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-zinc-500">
                        Reportes Financieros - En desarrollo
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
