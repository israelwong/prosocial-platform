'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Phone, MapPin, Globe } from 'lucide-react';
import { Telefono, ContactoData } from '../types';

interface ContactoStatsProps {
    telefonos: Telefono[];
    contactoData: ContactoData;
    loading?: boolean;
}

export function ContactoStats({ telefonos, contactoData, loading }: ContactoStatsProps) {
    const telefonosActivos = telefonos.filter(t => t.activo).length;
    const telefonosInactivos = telefonos.filter(t => !t.activo).length;
    const totalTelefonos = telefonos.length;

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-zinc-900/50 border-zinc-800">
                        <CardHeader className="pb-2">
                            <div className="h-4 w-24 bg-zinc-700 rounded animate-pulse" />
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 w-16 bg-zinc-700 rounded animate-pulse" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Teléfonos Activos */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-300">
                        Teléfonos Activos
                    </CardTitle>
                    <Phone className="h-4 w-4 text-green-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-400">{telefonosActivos}</div>
                    <p className="text-xs text-zinc-500">
                        de {totalTelefonos} total
                    </p>
                </CardContent>
            </Card>

            {/* Dirección */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-300">
                        Dirección
                    </CardTitle>
                    <MapPin className="h-4 w-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-400">
                        {contactoData.direccion ? '✓' : '✗'}
                    </div>
                    <p className="text-xs text-zinc-500">
                        {contactoData.direccion ? 'Configurada' : 'Sin configurar'}
                    </p>
                </CardContent>
            </Card>

            {/* Página Web */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-zinc-300">
                        Página Web
                    </CardTitle>
                    <Globe className="h-4 w-4 text-purple-400" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-purple-400">
                        {contactoData.website ? '✓' : '✗'}
                    </div>
                    <p className="text-xs text-zinc-500">
                        {contactoData.website ? 'Configurada' : 'Sin configurar'}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
