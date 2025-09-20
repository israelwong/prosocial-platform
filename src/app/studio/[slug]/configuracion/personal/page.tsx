'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function PersonalPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Personal</h1>
                <p className="text-zinc-400 mt-1">
                    Gestiona empleados y proveedores
                </p>
            </div>

            <div className="grid gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Empleados</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Administra tu equipo de trabajo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Gestión de Empleados - En desarrollo
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Proveedores</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Gestiona tus proveedores y colaboradores
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-32 flex items-center justify-center text-zinc-500">
                            Gestión de Proveedores - En desarrollo
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
