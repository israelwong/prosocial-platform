'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Phone, Clock, Zap } from 'lucide-react';

interface HorariosPreviewProps {
    data?: any;
    studioSlug: string;
}

export function HorariosPreview({ data, studioSlug }: HorariosPreviewProps) {
    const studioData = data || {
        studio_name: 'Mi Estudio',
        slogan: null,
        logo_url: null,
    };

    const horariosData = data?.horarios || {
        dias_semana: [],
        horarios_especiales: []
    };

    return (
        <div className="w-full max-w-sm mx-auto">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
                {/* Header con datos cargados */}
                <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 text-center">
                    {/* Logo */}
                    <div className="mb-4">
                        {studioData.logo_url ? (
                            <div className="w-16 h-16 mx-auto bg-white rounded-lg flex items-center justify-center overflow-hidden">
                                <Image
                                    src={studioData.logo_url}
                                    alt="Logo"
                                    width={64}
                                    height={64}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-16 h-16 mx-auto bg-zinc-700 rounded-lg flex items-center justify-center">
                                <Star className="h-8 w-8 text-zinc-400" />
                            </div>
                        )}
                    </div>

                    {/* Nombre del estudio */}
                    <h1 className="text-xl font-bold text-white mb-2">
                        {studioData.studio_name}
                    </h1>

                    {/* Slogan */}
                    {studioData.slogan && (
                        <p className="text-zinc-300 text-sm">
                            {studioData.slogan}
                        </p>
                    )}
                </div>

                {/* Sección Horarios Resaltada */}
                <div className="p-4">
                    <div className="text-center text-zinc-500 text-sm mb-4">
                        Vista previa - Sección Horarios
                    </div>

                    {/* Sección Horarios Completa */}
                    <div className="bg-green-900/20 border border-green-800/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="h-4 w-4 text-green-400" />
                            <h3 className="text-green-400 font-semibold">Horarios de Atención</h3>
                        </div>

                        {/* Horarios de la semana */}
                        <div className="space-y-2">
                            {horariosData.dias_semana && horariosData.dias_semana.length > 0 ? (
                                horariosData.dias_semana.map((dia: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-300">{dia.nombre}</span>
                                        <span className="text-zinc-400">
                                            {dia.abierto ? `${dia.hora_inicio} - ${dia.hora_fin}` : 'Cerrado'}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-300">Lunes - Viernes</span>
                                        <span className="text-zinc-400">9:00 - 18:00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-300">Sábado</span>
                                        <span className="text-zinc-400">10:00 - 16:00</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-zinc-300">Domingo</span>
                                        <span className="text-zinc-400">Cerrado</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Esqueleto de otras secciones */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Phone className="h-4 w-4 text-zinc-400" />
                            <div className="flex-1">
                                <div className="h-3 bg-zinc-700 rounded w-3/4 mb-1"></div>
                                <div className="h-2 bg-zinc-700 rounded w-1/2"></div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Zap className="h-4 w-4 text-zinc-400" />
                            <div className="flex-1">
                                <div className="h-3 bg-zinc-700 rounded w-1/2 mb-1"></div>
                                <div className="h-2 bg-zinc-700 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
