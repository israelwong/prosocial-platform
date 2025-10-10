'use client';

import React from 'react';
import Image from 'next/image';
import { ZenBadge } from '@/components/ui/zen';

interface StudioData {
    id: string;
    studio_name: string;
    slug: string;
    slogan?: string | null;
    descripcion?: string | null;
    palabras_clave?: string[];
    logo_url?: string | null;
    isotipo_url?: string | null;
}

interface StudioMobilePreviewProps {
    data: StudioData;
}

export function StudioMobilePreview({ data }: StudioMobilePreviewProps) {
    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Simulador de móvil */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-4 shadow-2xl">
                {/* Header del móvil */}
                <div className="flex items-center justify-between mb-6">
                    <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
                    <div className="w-6 h-1 bg-zinc-600 rounded-full"></div>
                    <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
                </div>

                {/* Contenido principal */}
                <div className="space-y-6">
                    {/* Header del perfil */}
                    <div className="text-center space-y-4">
                        {/* Logo */}
                        {data.logo_url ? (
                            <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                                <Image
                                    src={data.logo_url}
                                    alt="Logo"
                                    width={80}
                                    height={80}
                                    className="max-w-full max-h-full object-contain"
                                />
                            </div>
                        ) : (
                            <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-xl flex items-center justify-center">
                                <div className="w-8 h-8 bg-zinc-600 rounded-lg"></div>
                            </div>
                        )}

                        {/* Nombre del estudio */}
                        <div>
                            <h1 className="text-xl font-bold text-white mb-2">
                                {data.studio_name || 'Mi Estudio'}
                            </h1>
                            {data.slogan && (
                                <p className="text-zinc-400 text-sm">
                                    {data.slogan}
                                </p>
                            )}
                        </div>

                        {/* Palabras clave */}
                        {data.palabras_clave && data.palabras_clave.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center">
                                {data.palabras_clave.slice(0, 3).map((palabra, index) => (
                                    <ZenBadge key={index} variant="secondary" size="sm">
                                        {palabra}
                                    </ZenBadge>
                                ))}
                                {data.palabras_clave.length > 3 && (
                                    <ZenBadge variant="outline" size="sm">
                                        +{data.palabras_clave.length - 3}
                                    </ZenBadge>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Navbar simulado */}
                    <div className="border-t border-zinc-700 pt-4">
                        <div className="flex justify-around">
                            {['Inicio', 'Portafolio', 'Catálogo', 'Contacto'].map((item, index) => (
                                <div key={index} className="text-center">
                                    <div className="w-6 h-6 bg-zinc-700 rounded mx-auto mb-1"></div>
                                    <span className="text-xs text-zinc-400">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contenido simulado */}
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-zinc-800 rounded-lg"></div>
                            ))}
                        </div>

                        <div className="space-y-2">
                            <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
                            <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                            <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-zinc-700 pt-4">
                        {data.descripcion && (
                            <p className="text-zinc-400 text-xs leading-relaxed">
                                {data.descripcion}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
