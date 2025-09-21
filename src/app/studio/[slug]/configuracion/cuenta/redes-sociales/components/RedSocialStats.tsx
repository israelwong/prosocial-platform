'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Share2, CheckCircle, XCircle } from 'lucide-react';
import { RedSocial } from '../types';

interface RedSocialStatsProps {
    redes: RedSocial[];
}

export function RedSocialStats({ redes }: RedSocialStatsProps) {
    const redesActivas = redes.filter(r => r.activo).length;
    const redesInactivas = redes.filter(r => !r.activo).length;
    const totalRedes = redes.length;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Total Redes
                    </CardTitle>
                    <Share2 className="h-4 w-4 text-zinc-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-white">{totalRedes}</div>
                    <p className="text-xs text-zinc-500">
                        Redes sociales configuradas
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Activas
                    </CardTitle>
                    <CheckCircle className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-400">{redesActivas}</div>
                    <p className="text-xs text-zinc-500">
                        Redes sociales activas
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-400">
                        Inactivas
                    </CardTitle>
                    <XCircle className="h-4 w-4 text-red-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-red-400">{redesInactivas}</div>
                    <p className="text-xs text-zinc-500">
                        Redes sociales inactivas
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
