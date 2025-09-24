'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2 } from 'lucide-react';
import { CuentaBancariaItem } from './CuentaBancariaItem';
import { CuentaBancaria } from '../types';

interface CuentaBancariaListProps {
    cuentas: CuentaBancaria[];
    onEdit: (cuenta: CuentaBancaria) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string, activo: boolean) => void;
    onAdd: () => void;
    loading?: boolean;
}

export function CuentaBancariaList({
    cuentas,
    onEdit,
    onDelete,
    onToggleActive,
    onAdd,
    loading
}: CuentaBancariaListProps) {
    return (
        <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-white">Cuentas Bancarias</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Gestiona las cuentas donde recibirás los pagos
                        </CardDescription>
                    </div>
                    <Button
                        onClick={onAdd}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Cuenta
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-16 bg-zinc-700 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                ) : cuentas.length === 0 ? (
                    <div className="text-center py-8">
                        <Building2 className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                        <p className="text-zinc-400">No hay cuentas bancarias configuradas</p>
                        <p className="text-zinc-500 text-sm mt-2">
                            Usa el botón "Agregar Cuenta" para comenzar
                        </p>
                    </div>
                ) : (
                    cuentas.map((cuenta) => (
                        <CuentaBancariaItem
                            key={cuenta.id}
                            cuenta={cuenta}
                            onEdit={onEdit}
                            onDelete={onDelete}
                            onToggleActive={onToggleActive}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
}
