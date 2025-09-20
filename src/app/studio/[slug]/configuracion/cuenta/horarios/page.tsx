'use client';

import React, { useState } from 'react';
import { SectionLayout } from '@/components/layouts/section-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
    Clock,
    Plus,
    Trash2,
    Save,
    Calendar
} from 'lucide-react';

interface Horario {
    id: string;
    dia: string;
    hora_inicio: string;
    hora_fin: string;
    activo: boolean;
}

const DIAS_SEMANA = [
    { value: 'lunes', label: 'Lunes' },
    { value: 'martes', label: 'Martes' },
    { value: 'miercoles', label: 'Miércoles' },
    { value: 'jueves', label: 'Jueves' },
    { value: 'viernes', label: 'Viernes' },
    { value: 'sabado', label: 'Sábado' },
    { value: 'domingo', label: 'Domingo' }
];

export default function HorariosPage() {
    const [horarios, setHorarios] = useState<Horario[]>([
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
    ]);

    const handleToggleHorario = (id: string) => {
        setHorarios(prev => prev.map(h =>
            h.id === id ? { ...h, activo: !h.activo } : h
        ));
    };

    const handleUpdateHorario = (id: string, field: string, value: string) => {
        setHorarios(prev => prev.map(h =>
            h.id === id ? { ...h, [field]: value } : h
        ));
    };

    const handleSave = () => {
        // TODO: Implementar guardado
        console.log('Guardando horarios:', horarios);
    };

    const getDiaLabel = (dia: string) => {
        return DIAS_SEMANA.find(d => d.value === dia)?.label || dia;
    };

    const horariosActivos = horarios.filter(h => h.activo).length;
    const horariosInactivos = horarios.filter(h => !h.activo).length;

    return (
        <SectionLayout
            title="Horarios de Atención"
            description="Configura los horarios de atención al cliente"
            actionButton={{
                label: "Guardar Cambios",
                onClick: handleSave,
                icon: Save
            }}
        >
            <div className="space-y-6">
                {/* Resumen */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5 text-green-400" />
                                <div>
                                    <p className="text-2xl font-bold text-white">{horariosActivos}</p>
                                    <p className="text-sm text-zinc-400">Días Activos</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Clock className="h-5 w-5 text-zinc-400" />
                                <div>
                                    <p className="text-2xl font-bold text-white">{horariosInactivos}</p>
                                    <p className="text-sm text-zinc-400">Días Inactivos</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-4">
                            <div className="flex items-center space-x-2">
                                <Calendar className="h-5 w-5 text-blue-400" />
                                <div>
                                    <p className="text-2xl font-bold text-white">{horarios.length}</p>
                                    <p className="text-sm text-zinc-400">Total Días</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Horarios por día */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Horarios por Día de la Semana</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Configura los horarios de atención para cada día
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {horarios.map((horario) => (
                            <div key={horario.id} className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <div className="w-24">
                                        <p className="text-white font-medium">{getDiaLabel(horario.dia)}</p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Input
                                            type="time"
                                            value={horario.hora_inicio}
                                            onChange={(e) => handleUpdateHorario(horario.id, 'hora_inicio', e.target.value)}
                                            className="bg-zinc-700 border-zinc-600 text-white w-32"
                                            disabled={!horario.activo}
                                        />
                                        <span className="text-zinc-400">-</span>
                                        <Input
                                            type="time"
                                            value={horario.hora_fin}
                                            onChange={(e) => handleUpdateHorario(horario.id, 'hora_fin', e.target.value)}
                                            className="bg-zinc-700 border-zinc-600 text-white w-32"
                                            disabled={!horario.activo}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={horario.activo}
                                            onCheckedChange={() => handleToggleHorario(horario.id)}
                                        />
                                        <span className={`text-sm ${horario.activo ? 'text-green-400' : 'text-zinc-400'}`}>
                                            {horario.activo ? 'Activo' : 'Inactivo'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Horarios especiales */}
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Horarios Especiales</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Configura horarios especiales para días festivos o eventos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                            <p className="text-zinc-400 mb-4">Próximamente: Horarios especiales</p>
                            <Button variant="outline" disabled>
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Horario Especial
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Información de uso */}
                <Card className="bg-zinc-900 border-zinc-800">
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
        </SectionLayout>
    );
}
