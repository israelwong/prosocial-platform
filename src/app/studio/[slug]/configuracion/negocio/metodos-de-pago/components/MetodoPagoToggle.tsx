'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/shadcn/card';
import { Switch } from '@/components/ui/shadcn/switch';
import { Badge } from '@/components/ui/shadcn/badge';
import { CreditCard, DollarSign, Building, Smartphone } from 'lucide-react';
import { MetodoPagoData } from '../types';

interface MetodoPagoToggleProps {
    metodo: MetodoPagoData;
    onToggle: (metodoId: string, isActive: boolean) => void;
    disabled?: boolean;
}

export function MetodoPagoToggle({ metodo, onToggle, disabled = false }: MetodoPagoToggleProps) {
    const isActive = metodo.status === 'active';

    // Obtener icono según el método de pago
    const getMethodIcon = () => {
        switch (metodo.payment_method) {
            case 'card':
                return <CreditCard className="h-5 w-5" />;
            case 'cash':
                return <DollarSign className="h-5 w-5" />;
            case 'deposit':
                return <Building className="h-5 w-5" />;
            case 'transfer':
                return <Smartphone className="h-5 w-5" />;
            case 'oxxo':
                return <CreditCard className="h-5 w-5" />;
            default:
                return <DollarSign className="h-5 w-5" />;
        }
    };

    // Obtener color del badge según el estado
    const getStatusBadgeColor = () => {
        return isActive ? 'bg-green-600' : 'bg-zinc-600';
    };

    const handleToggle = (checked: boolean) => {
        onToggle(metodo.id, checked);
    };

    return (
        <Card className={`bg-zinc-900/50 border-zinc-800 transition-all duration-200 ${isActive ? 'ring-2 ring-green-500/20' : ''
            }`}>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    {/* Información del método */}
                    <div className="flex items-center space-x-4 flex-1">
                        {/* Icono */}
                        <div className="text-zinc-400">
                            {getMethodIcon()}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-1">
                                <h3 className="text-lg font-semibold text-white">
                                    {metodo.metodo_pago}
                                </h3>
                                <Badge
                                    variant={isActive ? 'default' : 'secondary'}
                                    className={getStatusBadgeColor()}
                                >
                                    {isActive ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </div>

                            {/* Descripción del método */}
                            <p className="text-sm text-zinc-400">
                                {getMethodDescription(metodo.payment_method)}
                            </p>
                        </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex items-center space-x-3">
                        <Switch
                            checked={isActive}
                            onCheckedChange={handleToggle}
                            disabled={disabled}
                            className="data-[state=checked]:bg-green-600"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Función para obtener descripción del método
function getMethodDescription(paymentMethod: string | null | undefined): string {
    switch (paymentMethod) {
        case 'cash':
            return 'Pago en efectivo al recibir el servicio';
        case 'deposit':
            return 'Depósito directo en cuenta bancaria';
        case 'transfer':
            return 'Transferencia bancaria o SPEI';
        case 'oxxo':
            return 'Pago en tiendas OXXO';
        case 'card':
            return 'Pago con tarjeta de crédito o débito';
        default:
            return 'Método de pago personalizado';
    }
}
