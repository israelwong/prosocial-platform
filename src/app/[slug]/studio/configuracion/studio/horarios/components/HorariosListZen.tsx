'use client';

import React, { useState } from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { Plus, Filter } from 'lucide-react';
import { Horario } from '@/lib/actions/schemas/horarios-schemas';
import { HorarioItemZen } from './HorarioItemZen';
import { HorarioFormZen } from './HorarioFormZen';

interface HorariosListZenProps {
    horarios: Horario[];
    onToggleHorario: (id: string, is_active: boolean) => Promise<void>;
    onUpdateHorario: (id: string, data: { day_of_week: string; start_time: string; end_time: string }) => Promise<void>;
    onAddHorario: (data: { day_of_week: string; start_time: string; end_time: string; is_active: boolean }) => Promise<void>;
    loading?: boolean;
}

export function HorariosListZen({
    horarios,
    onToggleHorario,
    onUpdateHorario,
    onAddHorario,
    loading = false
}: HorariosListZenProps) {
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const filteredHorarios = horarios.filter(horario => {
        if (filter === 'active') return horario.is_active;
        if (filter === 'inactive') return !horario.is_active;
        return true;
    });

    const handleAddHorario = async (data: { day_of_week: string; start_time: string; end_time: string; is_active: boolean }) => {
        await onAddHorario(data);
        setShowForm(false);
    };

    if (loading) {
        return (
            <ZenCard variant="default" padding="lg">
                <ZenCardHeader>
                    <ZenCardTitle>Horarios de Atención</ZenCardTitle>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-16 bg-zinc-700 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </ZenCardContent>
            </ZenCard>
        );
    }

    return (
        <ZenCard variant="default" padding="lg">
            <ZenCardHeader>
                <div className="flex items-center justify-between">
                    <ZenCardTitle>Horarios de Atención</ZenCardTitle>
                    <div className="flex items-center gap-2">
                        {/* Filtros */}
                        <div className="flex items-center gap-1 bg-zinc-800 rounded-lg p-1">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-3 py-1 text-xs rounded-md transition-colors ${filter === 'all'
                                        ? 'bg-zinc-700 text-white'
                                        : 'text-zinc-400 hover:text-white'
                                    }`}
                            >
                                Todos
                            </button>
                            <button
                                onClick={() => setFilter('active')}
                                className={`px-3 py-1 text-xs rounded-md transition-colors ${filter === 'active'
                                        ? 'bg-zinc-700 text-white'
                                        : 'text-zinc-400 hover:text-white'
                                    }`}
                            >
                                Activos
                            </button>
                            <button
                                onClick={() => setFilter('inactive')}
                                className={`px-3 py-1 text-xs rounded-md transition-colors ${filter === 'inactive'
                                        ? 'bg-zinc-700 text-white'
                                        : 'text-zinc-400 hover:text-white'
                                    }`}
                            >
                                Inactivos
                            </button>
                        </div>

                        {/* Botón agregar */}
                        <ZenButton
                            onClick={() => setShowForm(!showForm)}
                            variant="primary"
                            size="sm"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Horario
                        </ZenButton>
                    </div>
                </div>
            </ZenCardHeader>
            <ZenCardContent>
                {/* Formulario de nuevo horario */}
                {showForm && (
                    <div className="mb-6">
                        <HorarioFormZen
                            onSubmit={handleAddHorario}
                            onCancel={() => setShowForm(false)}
                            submitLabel="Agregar Horario"
                        />
                    </div>
                )}

                {/* Lista de horarios */}
                {filteredHorarios.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="text-zinc-400 mb-2">
                            {filter === 'all' && 'No hay horarios configurados'}
                            {filter === 'active' && 'No hay horarios activos'}
                            {filter === 'inactive' && 'No hay horarios inactivos'}
                        </div>
                        <p className="text-sm text-zinc-500">
                            {filter === 'all' && 'Agrega tu primer horario de atención'}
                            {filter === 'active' && 'Todos los horarios están inactivos'}
                            {filter === 'inactive' && 'Todos los horarios están activos'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredHorarios.map((horario) => (
                            <HorarioItemZen
                                key={horario.id}
                                horario={horario}
                                onToggle={onToggleHorario}
                                onUpdate={onUpdateHorario}
                            />
                        ))}
                    </div>
                )}

                {/* Información de ayuda */}
                {horarios.length > 0 && (
                    <div className="mt-6 p-4 bg-zinc-800/30 rounded-lg border border-zinc-700">
                        <div className="flex items-start gap-3">
                            <Filter className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-medium text-white">Consejos para configurar horarios</h4>
                                <ul className="text-xs text-zinc-400 space-y-1">
                                    <li>• Los horarios activos se mostrarán en tu página pública</li>
                                    <li>• Puedes tener múltiples horarios para el mismo día</li>
                                    <li>• Los horarios se ordenan automáticamente por día y hora</li>
                                    <li>• Usa horarios inactivos para temporadas especiales</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </ZenCardContent>
        </ZenCard>
    );
}