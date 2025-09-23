'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus } from 'lucide-react';

export default function ProveedoresPage() {
    return (
        <div className="space-y-6">

            {/* Lista de Proveedores */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Lista de Proveedores
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Gestiona la información de tus proveedores
                        </CardDescription>
                    </div>
                    <Button
                        onClick={() => {
                            // TODO: Implementar modal de creación
                            console.log('Abrir modal de proveedor');
                        }}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Proveedor
                    </Button>
                </CardHeader>
                <CardContent>
                    <div className="h-32 flex items-center justify-center text-zinc-500">
                        Lista de proveedores
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}