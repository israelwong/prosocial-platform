'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, CreditCard, CheckCircle, XCircle, Star } from 'lucide-react';
import { CuentaBancariaStats as CuentaBancariaStatsType } from '../types';

interface CuentaBancariaStatsProps {
    stats: CuentaBancariaStatsType;
    loading?: boolean;
}

export function CuentaBancariaStats({ stats, loading }: CuentaBancariaStatsProps) {
    if (loading) {
        return (
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white flex items-center space-x-2">
                        <Building2 className="h-5 w-5" />
                        <span>Estadísticas</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse space-y-2">
                        <div className="h-4 bg-zinc-700 rounded"></div>
                        <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                    <Building2 className="h-5 w-5" />
                    <span>Estadísticas</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Total */}
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">{stats.total}</div>
                        <div className="text-sm text-zinc-400">Total</div>
                    </div>

                    {/* Activas */}
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-400 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 mr-1" />
                            {stats.activas}
                        </div>
                        <div className="text-sm text-zinc-400">Activas</div>
                    </div>

                    {/* Inactivas */}
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-400 flex items-center justify-center">
                            <XCircle className="h-5 w-5 mr-1" />
                            {stats.inactivas}
                        </div>
                        <div className="text-sm text-zinc-400">Inactivas</div>
                    </div>

                    {/* Principales */}
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center">
                            <Star className="h-5 w-5 mr-1" />
                            {stats.principales}
                        </div>
                        <div className="text-sm text-zinc-400">Principales</div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
