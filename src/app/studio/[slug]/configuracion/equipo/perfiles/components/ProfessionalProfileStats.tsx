'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tag, Users, UserCheck, UserX } from 'lucide-react';
import { ProfessionalProfileStats } from '../types';

interface ProfessionalProfileStatsProps {
    stats: ProfessionalProfileStats;
    loading?: boolean;
}

export function ProfessionalProfileStats({ stats, loading = false }: ProfessionalProfileStatsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-zinc-900 border-zinc-800 animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-4 bg-zinc-700 rounded w-1/2 mb-2"></div>
                            <div className="h-8 bg-zinc-700 rounded w-1/3"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    const mainStats = [
        {
            title: "Total Perfiles",
            value: stats.totalPerfiles,
            subtitle: `${stats.perfilesActivos} activos`,
            icon: Tag,
            color: "text-blue-400",
        },
        {
            title: "En Uso",
            value: Object.keys(stats.asignacionesPorPerfil).length,
            subtitle: "Perfiles asignados",
            icon: Users,
            color: "text-green-400",
        },
        {
            title: "Inactivos",
            value: stats.totalInactivos,
            subtitle: "Sin usar",
            icon: UserX,
            color: "text-zinc-400",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {mainStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">
                                {stat.title}
                            </CardTitle>
                            <Icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-zinc-500">{stat.subtitle}</p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
