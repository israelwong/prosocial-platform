'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { HorariosStats } from './components/HorariosStats';
import { HorariosList } from './components/HorariosList';
import { Horario } from './types';

export default function HorariosPage() {
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Datos iniciales de horarios
    const initialHorarios: Horario[] = [
        {
            id: '1',
            dia: 'lunes',
            hora_inicio: '09:00',
            hora_fin: '18:00',
            activo: true
        },
        {
            id: '2',
            dia: 'martes',
            hora_inicio: '09:00',
            hora_fin: '18:00',
            activo: true
        },
        {
            id: '3',
            dia: 'miercoles',
            hora_inicio: '09:00',
            hora_fin: '18:00',
            activo: true
        },
        {
            id: '4',
            dia: 'jueves',
            hora_inicio: '09:00',
            hora_fin: '18:00',
            activo: true
        },
        {
            id: '5',
            dia: 'viernes',
            hora_inicio: '09:00',
            hora_fin: '18:00',
            activo: true
        },
        {
            id: '6',
            dia: 'sabado',
            hora_inicio: '10:00',
            hora_fin: '16:00',
            activo: true
        },
        {
            id: '7',
            dia: 'domingo',
            hora_inicio: '10:00',
            hora_fin: '14:00',
            activo: false
        }
    ];

    useEffect(() => {
        loadData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const loadData = async (isRetry = false) => {
        if (!isRetry) {
            setLoading(true);
        }
        setError(null);

        try {
            // Simular carga de datos (en el futuro esto vendrá de una API)
            await new Promise(resolve => setTimeout(resolve, 1000));
            setHorarios(initialHorarios);
        } catch (err) {
            const errorMessage = 'Error al cargar horarios';
            setError(errorMessage);
            console.error('Error loading horarios:', err);

            if (!isRetry) {
                toast.error(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleToggleActive = async (id: string, activo: boolean) => {
        try {
            setHorarios(prev => prev.map(h =>
                h.id === id ? { ...h, activo } : h
            ));

            toast.success(`Horario ${activo ? 'activado' : 'desactivado'} exitosamente`);
        } catch (err) {
            console.error('Error toggling horario:', err);
            toast.error('Error al cambiar estado del horario');
        }
    };

    const handleUpdateHorario = async (id: string, field: string, value: string) => {
        try {
            setHorarios(prev => prev.map(h =>
                h.id === id ? { ...h, [field]: value } : h
            ));
        } catch (err) {
            console.error('Error updating horario:', err);
            toast.error('Error al actualizar horario');
        }
    };


    if (error && !loading) {
        return (
            <div className="p-6">
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-6 text-center">
                        <div className="space-y-4">
                            <div className="text-red-400">
                                <RefreshCw className="h-12 w-12 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Error al cargar horarios</h3>
                                <p className="text-zinc-400">{error}</p>
                            </div>
                            <Button
                                onClick={() => loadData(true)}
                                variant="outline"
                                className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Reintentar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Estadísticas */}
            <HorariosStats horarios={horarios} loading={loading} />

            {/* Lista de horarios */}
            <HorariosList
                horarios={horarios}
                onToggleActive={handleToggleActive}
                onUpdateHorario={handleUpdateHorario}
                loading={loading}
            />

            {/* Información de uso */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">¿Dónde se usan estos horarios?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Landing Page</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Sección de horarios de atención</li>
                                <li>• Footer con información de contacto</li>
                                <li>• Formularios de contacto</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Portales y Comunicación</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Calendario de disponibilidad</li>
                                <li>• Programación de citas</li>
                                <li>• Notificaciones automáticas</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}