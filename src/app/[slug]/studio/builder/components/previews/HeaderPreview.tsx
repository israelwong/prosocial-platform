'use client';

import React from 'react';
import Image from 'next/image';
import { ZenBadge } from '@/components/ui/zen';

interface HeaderPreviewProps {
    data?: {
        studio_name?: string;
        slogan?: string | null;
        palabras_clave?: string[];
        logo_url?: string | null;
    };
}

export function HeaderPreview({ data }: HeaderPreviewProps) {
    const studioData = data || {
        studio_name: 'Mi Estudio',
        slogan: null,
        palabras_clave: [],
        logo_url: null,
    };

    return (
        <div className="text-center space-y-4">
            {/* Logo */}
            {studioData.logo_url ? (
                <div className="w-20 h-20 mx-auto bg-zinc-800 rounded-xl flex items-center justify-center overflow-hidden">
                    <Image
                        src={studioData.logo_url}
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
                    {studioData.studio_name || 'Mi Estudio'}
                </h1>
                {studioData.slogan && (
                    <p className="text-zinc-400 text-sm">
                        {studioData.slogan}
                    </p>
                )}
            </div>

            {/* Palabras clave */}
            {studioData.palabras_clave && studioData.palabras_clave.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center">
                    {studioData.palabras_clave.slice(0, 3).map((palabra: string, index: number) => (
                        <ZenBadge key={index} variant="secondary" size="sm">
                            {palabra}
                        </ZenBadge>
                    ))}
                    {studioData.palabras_clave.length > 3 && (
                        <ZenBadge variant="outline" size="sm">
                            +{studioData.palabras_clave.length - 3}
                        </ZenBadge>
                    )}
                </div>
            )}
        </div>
    );
}
