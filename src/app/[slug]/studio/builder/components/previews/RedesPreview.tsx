'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Phone, Clock, Zap } from 'lucide-react';

interface RedesPreviewProps {
    data?: any;
    studioSlug: string;
}

export function RedesPreview({ data, studioSlug }: RedesPreviewProps) {
    const studioData = data || {
        studio_name: 'Mi Estudio',
        slogan: null,
        logo_url: null,
    };

    const redesData = data?.redes || {
        instagram: null,
        facebook: null,
        twitter: null,
        tiktok: null
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

                {/* Sección Redes Resaltada */}
                <div className="p-4">
                    <div className="text-center text-zinc-500 text-sm mb-4">
                        Vista previa - Sección Redes Sociales
                    </div>

                    {/* Sección Redes Completa */}
                    <div className="bg-purple-900/20 border border-purple-800/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="h-4 w-4 text-purple-400" />
                            <h3 className="text-purple-400 font-semibold">Síguenos</h3>
                        </div>

                        {/* Redes sociales */}
                        <div className="grid grid-cols-2 gap-3">
                            {redesData.instagram && (
                                <div className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-lg">
                                    <div className="w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-600 rounded flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">IG</span>
                                    </div>
                                    <span className="text-zinc-300 text-sm">Instagram</span>
                                </div>
                            )}

                            {redesData.facebook && (
                                <div className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-lg">
                                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">FB</span>
                                    </div>
                                    <span className="text-zinc-300 text-sm">Facebook</span>
                                </div>
                            )}

                            {redesData.twitter && (
                                <div className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-lg">
                                    <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">TW</span>
                                    </div>
                                    <span className="text-zinc-300 text-sm">Twitter</span>
                                </div>
                            )}

                            {redesData.tiktok && (
                                <div className="flex items-center gap-2 p-2 bg-zinc-800/50 rounded-lg">
                                    <div className="w-6 h-6 bg-black rounded flex items-center justify-center">
                                        <span className="text-white text-xs font-bold">TT</span>
                                    </div>
                                    <span className="text-zinc-300 text-sm">TikTok</span>
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
                            <Clock className="h-4 w-4 text-zinc-400" />
                            <div className="flex-1">
                                <div className="h-3 bg-zinc-700 rounded w-2/3 mb-1"></div>
                                <div className="h-2 bg-zinc-700 rounded w-1/3"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
