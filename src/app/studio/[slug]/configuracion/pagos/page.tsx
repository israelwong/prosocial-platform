'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PagosPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Pagos</h1>
                <p className="text-zinc-400 mt-1">
                    Configuración de pagos y condiciones comerciales
                </p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Condiciones Comerciales</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Métodos de pago, descuentos y porcentaje de anticipo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Condiciones Comerciales - En desarrollo
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Cuentas Bancarias</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Información bancaria del negocio
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Cuentas Bancarias - En desarrollo
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Parámetros</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Porcentajes de utilidad y descuentos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Parámetros - En desarrollo
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Pagos Stripe</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Configuración de métodos de pago Stripe (opcional)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Pagos Stripe - En desarrollo
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
