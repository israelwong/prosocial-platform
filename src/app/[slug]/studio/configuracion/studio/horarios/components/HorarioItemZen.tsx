'use client';

import React, { useState } from 'react';
import { ZenCard, ZenCardContent } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { Clock, Edit, Trash2, Check, X } from 'lucide-react';
import { Horario, DIAS_SEMANA_MAP } from '@/lib/actions/schemas/horarios-schemas';
import { HorarioFormZen } from './HorarioFormZen';

interface HorarioItemZenProps {
    horario: Horario;
    onToggle: (id: string, is_active: boolean) => Promise<void>;
    onUpdate: (id: string, data: { day_of_week: string; start_time: string; end_time: string }) => Promise<void>;
}

export function HorarioItemZen({ horario, onToggle, onUpdate }: HorarioItemZenProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleToggle = async () => {
        setIsLoading(true);
        try {
            await onToggle(horario.id, !horario.is_active);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async (data: { day_of_week: string; start_time: string; end_time: string; is_active: boolean }) => {
        setIsLoading(true);
        try {
            await onUpdate(horario.id, {
                day_of_week: data.day_of_week,
                start_time: data.start_time,
                end_time: data.end_time,
            });
            setIsEditing(false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <ZenCard variant="outline" padding="md">
                <ZenCardContent>
                    <HorarioFormZen
                        initialData={{
                            day_of_week: horario.day_of_week,
                            start_time: horario.start_time,
                            end_time: horario.end_time,
                            is_active: horario.is_active,
                        }}
                        onSubmit={handleUpdate}
                        onCancel={handleCancel}
                        submitLabel="Actualizar"
                        loading={isLoading}
                    />
                </ZenCardContent>
            </ZenCard>
        );
    }

    return (
        <ZenCard
            variant={horario.is_active ? "default" : "outline"}
            padding="md"
            className={`transition-all duration-200 ${horario.is_active
                    ? 'border-zinc-600 hover:border-zinc-500'
                    : 'border-zinc-700 bg-zinc-800/30'
                }`}
        >
            <ZenCardContent>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Icono y día */}
                        <div className="flex items-center gap-2">
                            <Clock className={`h-4 w-4 ${horario.is_active ? 'text-blue-400' : 'text-zinc-500'}`} />
                            <span className={`font-medium ${horario.is_active ? 'text-white' : 'text-zinc-400'}`}>
                                {DIAS_SEMANA_MAP[horario.day_of_week]}
                            </span>
                        </div>

                        {/* Horario */}
                        <div className="flex items-center gap-2">
                            <span className={`text-sm ${horario.is_active ? 'text-zinc-300' : 'text-zinc-500'}`}>
                                {horario.start_time} - {horario.end_time}
                            </span>
                        </div>

                        {/* Estado */}
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${horario.is_active
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-zinc-500/20 text-zinc-400'
                            }`}>
                            {horario.is_active ? 'Activo' : 'Inactivo'}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2">
                        <ZenButton
                            onClick={() => setIsEditing(true)}
                            variant="outline"
                            size="sm"
                            disabled={isLoading}
                        >
                            <Edit className="h-3 w-3" />
                        </ZenButton>

                        <ZenButton
                            onClick={handleToggle}
                            variant={horario.is_active ? "outline" : "primary"}
                            size="sm"
                            loading={isLoading}
                            disabled={isLoading}
                        >
                            {horario.is_active ? (
                                <>
                                    <X className="h-3 w-3 mr-1" />
                                    Desactivar
                                </>
                            ) : (
                                <>
                                    <Check className="h-3 w-3 mr-1" />
                                    Activar
                                </>
                            )}
                        </ZenButton>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="mt-3 pt-3 border-t border-zinc-700">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                        <span>Orden: {horario.order}</span>
                        <span>
                            Creado: {new Date(horario.created_at).toLocaleDateString('es-MX')}
                        </span>
                    </div>
                </div>
            </ZenCardContent>
        </ZenCard>
    );
}
