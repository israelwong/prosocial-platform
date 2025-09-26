'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Clock, Calendar } from 'lucide-react';
import { Horario } from '../types';

interface HorariosStatsProps {
    horarios: Horario[];
    loading?: boolean;
}

export function HorariosStats({ horarios, loading }: HorariosStatsProps) {
    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-zinc-900/50 border-zinc-800">
                        <CardContent className="p-4">
                            <div className="animate-pulse">
                                <div className="flex items-center space-x-2">
                                    <div className="h-5 w-5 bg-zinc-700 rounded"></div>
                                    <div>
                                        <div className="h-6 w-8 bg-zinc-700 rounded mb-1"></div>
                                        <div className="h-4 w-20 bg-zinc-700 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const horariosActivos = horarios.filter(h => h.activo).length;
    const horariosInactivos = horarios.filter(h => !h.activo).length;
    const totalHorarios = horarios.length;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-zinc-500" />
                        <div>
                            <p className="text-2xl font-bold text-white">{horariosActivos}</p>
                            <p className="text-sm text-zinc-400">Días Activos</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-zinc-500" />
                        <div>
                            <p className="text-2xl font-bold text-white">{horariosInactivos}</p>
                            <p className="text-sm text-zinc-400">Días Inactivos</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardContent className="p-4">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-zinc-500" />
                        <div>
                            <p className="text-2xl font-bold text-white">{totalHorarios}</p>
                            <p className="text-sm text-zinc-400">Total Días</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
