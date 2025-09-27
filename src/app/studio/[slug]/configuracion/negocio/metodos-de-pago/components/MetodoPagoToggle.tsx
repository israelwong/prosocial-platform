'use client';

import React from 'react';
import {
    ZenCard,
    ZenCardContent,
    ZenBadge
} from '@/components/ui/zen';
import { Switch } from '@/components/ui/shadcn/switch';
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

    // Obtener variante del badge según el estado
    const getStatusBadgeVariant = () => {
        return isActive ? 'success' : 'secondary';
    };

    const handleToggle = (checked: boolean) => {
        onToggle(metodo.id, checked);
    };

    return (
        <ZenCard
            variant="default"
            padding="lg"
            className={`transition-all duration-200 hover:shadow-lg ${isActive
                    ? 'bg-zinc-900/80 border-zinc-700 shadow-md'
                    : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900/70'
                }`}
        >
            <div className="flex items-center justify-between">
                {/* Información del método */}
                <div className="flex items-center space-x-4 flex-1">
                    {/* Icono */}
                    <div className={`transition-colors duration-200 ${isActive ? 'text-zinc-300' : 'text-zinc-500'
                        }`}>
                        {getMethodIcon()}
                    </div>

                    {/* Contenido */}
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                            <h3 className={`text-lg font-semibold transition-colors duration-200 ${isActive ? 'text-white' : 'text-zinc-400'
                                }`}>
                                {metodo.metodo_pago}
                            </h3>
                            <ZenBadge
                                variant={getStatusBadgeVariant()}
                            >
                                {isActive ? 'Activo' : 'Inactivo'}
                            </ZenBadge>
                        </div>

                        {/* Descripción del método */}
                        <p className={`text-sm transition-colors duration-200 ${isActive ? 'text-zinc-400' : 'text-zinc-600'
                            }`}>
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
        </ZenCard>
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
