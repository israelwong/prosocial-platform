'use client';

import React from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { Clock, Plus } from 'lucide-react';
import { HorariosItemZen } from './HorariosItemZen';
import { Horario } from '../types';
import { DIAS_SEMANA } from '../types';
import { DiaSemana } from '@/lib/actions/schemas/horarios-schemas';

interface HorariosListZenProps {
    horarios: Horario[];
    onToggleHorario: (id: string, activo: boolean) => void;
    onUpdateHorario: (id: string, data: { dia_semana: DiaSemana; hora_inicio: string; hora_fin: string }) => void;
    onAddHorario: (data: { dia_semana: DiaSemana; hora_inicio: string; hora_fin: string; activo: boolean }) => void;
    loading?: boolean;
}

export function HorariosListZen({
    horarios,
    onToggleHorario,
    onUpdateHorario,
    onAddHorario,
    loading
}: HorariosListZenProps) {
    // Crear un mapa de horarios por día para acceso rápido
    const horariosPorDia = new Map(
        horarios.map(horario => [horario.dia_semana, horario])
    );

    // Crear horarios para todos los días de la semana
    const todosLosDias = DIAS_SEMANA.map(dia => {
        const horarioExistente = horariosPorDia.get(dia.value);
        return horarioExistente || {
            id: `temp-${dia.value}`,
            projectId: '',
            dia_semana: dia.value,
            hora_inicio: '09:00',
            hora_fin: '18:00',
            activo: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    });

    const diasConHorarios = todosLosDias.filter(h => h.id.startsWith('temp-') === false);
    const diasSinHorarios = todosLosDias.filter(h => h.id.startsWith('temp-'));

    return (
        <ZenCard variant="default" padding="none">
            <ZenCardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <ZenCardTitle>Horarios por Día de la Semana</ZenCardTitle>
                        <ZenCardDescription>
                            Configura los horarios de atención para cada día
                        </ZenCardDescription>
                    </div>
                    {diasSinHorarios.length > 0 && (
                        <ZenButton
                            onClick={() => {
                                // Agregar el primer día sin horario
                                const primerDiaSinHorario = diasSinHorarios[0];
                                onAddHorario({
                                    dia_semana: primerDiaSinHorario.dia_semana as DiaSemana,
                                    hora_inicio: primerDiaSinHorario.hora_inicio,
                                    hora_fin: primerDiaSinHorario.hora_fin,
                                    activo: true
                                });
                            }}
                            variant="outline"
                            size="sm"
                            className="bg-blue-600/10 border-blue-600 text-blue-400 hover:bg-blue-600/20"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Horario
                        </ZenButton>
                    )}
                </div>
            </ZenCardHeader>
            <ZenCardContent className="space-y-4">
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-16 bg-zinc-700 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todosLosDias.map((horario) => (
                            <HorariosItemZen
                                key={horario.dia_semana}
                                horario={horario}
                                onToggleActive={onToggleHorario}
                                onUpdateHorario={onUpdateHorario}
                                onAddHorario={onAddHorario}
                            />
                        ))}
                    </div>
                )}

                {/* Información adicional */}
                <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-900/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Clock className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium text-sm">Información sobre horarios</h4>
                            <div className="text-xs text-zinc-400 space-y-1">
                                <p>• Los horarios activos aparecerán en tu perfil público</p>
                                <p>• Puedes configurar diferentes horarios para cada día</p>
                                <p>• Los horarios inactivos no se mostrarán a los clientes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </ZenCardContent>
        </ZenCard>
    );
}
