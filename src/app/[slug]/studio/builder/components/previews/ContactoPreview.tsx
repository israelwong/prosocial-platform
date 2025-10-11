'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Phone, Clock, Zap } from 'lucide-react';

interface ContactoPreviewProps {
    data?: Record<string, unknown>;
    studioSlug: string;
}

interface Telefono {
    numero: string;
    tipo?: string;
}

interface RedSocial {
    nombre: string;
    url: string;
}

interface StudioData {
    studio_name: string;
    slogan: string | null;
    logo_url: string | null;
}

interface ContactoData {
    descripcion: string;
    telefonos: Telefono[];
    redes_sociales: RedSocial[];
}

// Helper function to safely get string values
const getStringValue = (value: unknown, defaultValue: string): string => {
    return typeof value === 'string' ? value : defaultValue;
};

// Helper function to safely get array values
const getArrayValue = <T,>(value: unknown, defaultValue: T[]): T[] => {
    return Array.isArray(value) ? value as T[] : defaultValue;
};

export function ContactoPreview({ data }: ContactoPreviewProps) {

    // Process studio data
    const studioData: StudioData = {
        studio_name: getStringValue(data?.studio_name, 'Mi Estudio'),
        slogan: typeof data?.slogan === 'string' ? data.slogan : null,
        logo_url: typeof data?.logo_url === 'string' ? data.logo_url : null,
    };

    // Process contacto data
    const contactoRaw = data?.contacto as Record<string, unknown> | undefined;
    const contactoData: ContactoData = {
        descripcion: getStringValue(contactoRaw?.descripcion, 'Descripción del estudio...'),
        telefonos: getArrayValue<Telefono>(contactoRaw?.telefonos, []),
        redes_sociales: getArrayValue<RedSocial>(contactoRaw?.redes_sociales, [])
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

                {/* Sección Contacto Resaltada */}
                <div className="p-4">
                    <div className="text-center text-zinc-500 text-sm mb-4">
                        Vista previa - Sección Contacto
                    </div>

                    {/* Sección Contacto Completa */}
                    <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 mb-3">
                            <Phone className="h-4 w-4 text-blue-400" />
                            <h3 className="text-blue-400 font-semibold">Contacto</h3>
                        </div>

                        {/* Descripción */}
                        <p className="text-zinc-300 text-sm mb-3">
                            {contactoData.descripcion}
                        </p>

                        {/* Teléfonos */}
                        {contactoData.telefonos.length > 0 && (
                            <div className="space-y-2 mb-3">
                                {contactoData.telefonos.map((telefono, index) => (
                                    <div key={index} className="flex items-center gap-2 text-sm text-zinc-300">
                                        <Phone className="h-3 w-3" />
                                        <span>{telefono.numero}</span>
                                        {telefono.tipo && (
                                            <span className="text-zinc-500 text-xs">({telefono.tipo})</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Redes sociales */}
                        {contactoData.redes_sociales.length > 0 && (
                            <div className="flex gap-2">
                                {contactoData.redes_sociales.map((red, index) => (
                                    <div key={index} className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
                                        <Zap className="h-4 w-4 text-zinc-400" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Esqueleto de otras secciones */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                            <Clock className="h-4 w-4 text-zinc-400" />
                            <div className="flex-1">
                                <div className="h-3 bg-zinc-700 rounded w-2/3 mb-1"></div>
                                <div className="h-2 bg-zinc-700 rounded w-1/3"></div>
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