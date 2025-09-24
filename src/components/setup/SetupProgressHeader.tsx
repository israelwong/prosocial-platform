// src/components/setup/SetupProgressHeader.tsx

'use client';

import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SetupProgressHeaderProps {
    overallProgress: number;
    isFullyConfigured: boolean;
    projectName?: string;
}

export function SetupProgressHeader({
    overallProgress,
    isFullyConfigured,
    projectName
}: SetupProgressHeaderProps) {
    const getStatusIcon = () => {
        if (isFullyConfigured) {
            return <CheckCircle className="h-8 w-8 text-green-400" />;
        } else if (overallProgress >= 50) {
            return <Clock className="h-8 w-8 text-yellow-400" />;
        } else {
            return <AlertCircle className="h-8 w-8 text-red-400" />;
        }
    };

    const getStatusBadge = () => {
        if (isFullyConfigured) {
            return (
                <Badge variant="outline" className="border-green-500 text-green-400">
                    Configuración Completa
                </Badge>
            );
        } else if (overallProgress >= 70) {
            return (
                <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                    Casi Completo
                </Badge>
            );
        } else if (overallProgress >= 30) {
            return (
                <Badge variant="outline" className="border-blue-500 text-blue-400">
                    En Progreso
                </Badge>
            );
        } else {
            return (
                <Badge variant="outline" className="border-red-500 text-red-400">
                    Recién Comenzando
                </Badge>
            );
        }
    };

    const getMotivationalMessage = () => {
        if (isFullyConfigured) {
            return '¡Excelente! Tu estudio está listo para recibir clientes y generar ingresos.';
        } else if (overallProgress >= 70) {
            return '¡Ya casi terminas! Solo faltan algunos detalles para completar tu configuración.';
        } else if (overallProgress >= 30) {
            return 'Vas por buen camino. Continúa configurando para aprovechar al máximo ZENPro.';
        } else {
            return 'Comencemos a configurar tu estudio. Cada paso te acerca más a profesionalizar tu negocio.';
        }
    };

    return (
        <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 rounded-lg p-6 border border-zinc-700">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                    {getStatusIcon()}
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            {isFullyConfigured ? '¡Configuración Completa!' : 'Configuración del Estudio'}
                        </h1>
                        {projectName && (
                            <p className="text-zinc-400 mt-1">
                                {projectName}
                            </p>
                        )}
                    </div>
                </div>
                {getStatusBadge()}
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-zinc-300">
                        Progreso General
                    </span>
                    <span className="text-sm font-bold text-white">
                        {overallProgress}%
                    </span>
                </div>

                {/* Barra de Progreso */}
                <div className="w-full bg-zinc-700 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ${isFullyConfigured
                                ? 'bg-gradient-to-r from-green-500 to-green-400'
                                : overallProgress >= 70
                                    ? 'bg-gradient-to-r from-yellow-500 to-yellow-400'
                                    : overallProgress >= 30
                                        ? 'bg-gradient-to-r from-blue-500 to-blue-400'
                                        : 'bg-gradient-to-r from-red-500 to-red-400'
                            }`}
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
            </div>

            <p className="text-zinc-300 text-sm leading-relaxed">
                {getMotivationalMessage()}
            </p>
        </div>
    );
}
