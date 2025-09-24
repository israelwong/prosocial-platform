'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Tag,
    Users,
    Settings,
    Palette,
    TrendingUp,
    CheckCircle,
    Star
} from 'lucide-react';

interface ProfessionalProfilesStatsProps {
    estadisticas: {
        totalPerfiles: number;
        perfilesActivos: number;
        perfilesPorDefecto: number;
        perfilesPersonalizados: number;
        asignacionesPorPerfil: Array<{
            id: string;
            name: string;
            count: number;
        }>;
    };
}

export function ProfessionalProfilesStats({ estadisticas }: ProfessionalProfilesStatsProps) {
    const {
        totalPerfiles,
        perfilesActivos,
        perfilesPorDefecto,
        perfilesPersonalizados,
        asignacionesPorPerfil,
    } = estadisticas;

    const topPerfiles = asignacionesPorPerfil
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total de perfiles */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Total Perfiles</CardTitle>
                    <Tag className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{totalPerfiles}</div>
                    <p className="text-xs text-zinc-500">
                        {perfilesActivos} activos
                    </p>
                </CardContent>
            </Card>

            {/* Perfiles por defecto */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Sistema</CardTitle>
                    <Star className="h-4 w-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{perfilesPorDefecto}</div>
                    <p className="text-xs text-zinc-500">
                        Perfiles del sistema
                    </p>
                </CardContent>
            </Card>

            {/* Perfiles personalizados */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Personalizados</CardTitle>
                    <Palette className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{perfilesPersonalizados}</div>
                    <p className="text-xs text-zinc-500">
                        Creados por ti
                    </p>
                </CardContent>
            </Card>

            {/* Asignaciones activas */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">Asignaciones</CardTitle>
                    <Users className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">
                        {asignacionesPorPerfil.reduce((sum, p) => sum + p.count, 0)}
                    </div>
                    <p className="text-xs text-zinc-500">
                        En uso activo
                    </p>
                </CardContent>
            </Card>

            {/* Top perfiles más usados */}
            {topPerfiles.length > 0 && (
                <Card className="bg-zinc-900 border-zinc-800 md:col-span-2 lg:col-span-4">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Perfiles Más Utilizados
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {topPerfiles.map((perfil) => (
                                <Badge
                                    key={perfil.id}
                                    variant="secondary"
                                    className="bg-zinc-700 text-zinc-200 flex items-center gap-1"
                                >
                                    <CheckCircle className="h-3 w-3" />
                                    {perfil.name}
                                    <Badge variant="outline" className="ml-1 text-xs">
                                        {perfil.count}
                                    </Badge>
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
