'use client';

import React from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { Phone, MapPin, Globe, CheckCircle, XCircle } from 'lucide-react';
import { Telefono, ContactoData } from '../types';

interface ContactoStatsZenProps {
    telefonos: Telefono[];
    contactoData: ContactoData;
    loading?: boolean;
}

export function ContactoStatsZen({ telefonos, contactoData, loading }: ContactoStatsZenProps) {
    const telefonosActivos = telefonos.filter(t => t.activo).length;
    const telefonosInactivos = telefonos.filter(t => !t.activo).length;
    const totalTelefonos = telefonos.length;

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <ZenCard key={i} variant="default" padding="md">
                        <div className="animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="h-4 w-24 bg-zinc-700 rounded" />
                                <div className="h-4 w-4 bg-zinc-700 rounded" />
                            </div>
                            <div className="h-8 w-16 bg-zinc-700 rounded mb-2" />
                            <div className="h-3 w-20 bg-zinc-700 rounded" />
                        </div>
                    </ZenCard>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Teléfonos Activos */}
            <ZenCard variant="default" padding="md" className="hover:bg-zinc-800/30 transition-colors duration-200">
                <ZenCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <ZenCardTitle className="text-sm font-medium text-zinc-300">
                        Teléfonos Activos
                    </ZenCardTitle>
                    <div className="p-2 bg-green-900/20 rounded-full">
                        <Phone className="h-4 w-4 text-green-400" />
                    </div>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-green-400">{telefonosActivos}</div>
                        <div className="text-sm text-zinc-500">
                            de {totalTelefonos} total
                        </div>
                    </div>
                    {telefonosInactivos > 0 && (
                        <div className="mt-2 text-xs text-zinc-500">
                            {telefonosInactivos} inactivo{telefonosInactivos !== 1 ? 's' : ''}
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>

            {/* Dirección */}
            <ZenCard variant="default" padding="md" className="hover:bg-zinc-800/30 transition-colors duration-200">
                <ZenCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <ZenCardTitle className="text-sm font-medium text-zinc-300">
                        Dirección
                    </ZenCardTitle>
                    <div className="p-2 bg-blue-900/20 rounded-full">
                        <MapPin className="h-4 w-4 text-blue-400" />
                    </div>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold">
                            {contactoData.direccion ? (
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            ) : (
                                <XCircle className="h-8 w-8 text-red-400" />
                            )}
                        </div>
                        <div className="text-sm text-zinc-500">
                            {contactoData.direccion ? 'Configurada' : 'Sin configurar'}
                        </div>
                    </div>
                    {contactoData.direccion && (
                        <div className="mt-2 text-xs text-zinc-400 truncate">
                            {contactoData.direccion}
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>

            {/* Página Web */}
            <ZenCard variant="default" padding="md" className="hover:bg-zinc-800/30 transition-colors duration-200">
                <ZenCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <ZenCardTitle className="text-sm font-medium text-zinc-300">
                        Página Web
                    </ZenCardTitle>
                    <div className="p-2 bg-purple-900/20 rounded-full">
                        <Globe className="h-4 w-4 text-purple-400" />
                    </div>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold">
                            {contactoData.website ? (
                                <CheckCircle className="h-8 w-8 text-green-400" />
                            ) : (
                                <XCircle className="h-8 w-8 text-red-400" />
                            )}
                        </div>
                        <div className="text-sm text-zinc-500">
                            {contactoData.website ? 'Configurada' : 'Sin configurar'}
                        </div>
                    </div>
                    {contactoData.website && (
                        <div className="mt-2 text-xs text-zinc-400 truncate">
                            {contactoData.website}
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
