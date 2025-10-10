'use client';

import React, { useEffect, useState } from 'react';
import { IdentidadEditorZen } from './components/';
import { useParams } from 'next/navigation';
import { obtenerIdentidadStudio, actualizarLogo } from '@/lib/actions/studio/config/identidad.actions';
import { IdentidadData } from './types';

export default function IdentidadPage() {
    const params = useParams();
    const studioSlug = params.slug as string;
    const [identidadData, setIdentidadData] = useState<IdentidadData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadIdentidadData = async () => {
            try {
                const result = await obtenerIdentidadStudio(studioSlug);
                if (result.success !== false) {
                    setIdentidadData(result as unknown as IdentidadData);
                }
            } catch (error) {
                console.error('Error loading identidad data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadIdentidadData();
    }, [studioSlug]);

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Identidad del Estudio</h1>
                <p className="text-zinc-400">
                    Configura la información y elementos visuales de tu estudio
                </p>
            </div>

            {loading ? (
                <div className="space-y-6">
                    <div className="h-12 bg-zinc-800/50 rounded-lg animate-pulse"></div>
                    <div className="h-12 bg-zinc-800/50 rounded-lg animate-pulse"></div>
                    <div className="h-24 bg-zinc-800/50 rounded-lg animate-pulse"></div>
                </div>
            ) : (
                <IdentidadEditorZen
                    data={identidadData || {
                        id: 'temp-id',
                        studio_name: 'Mi Estudio',
                        slug: studioSlug,
                        slogan: null,
                        descripcion: null,
                        palabras_clave: [],
                        logo_url: null,
                        isotipo_url: null,
                    }}
                    onLocalUpdate={(data: unknown) => {
                        setIdentidadData(prev => {
                            if (!prev) return null;
                            const updateData = data as Partial<IdentidadData>;
                            return Object.assign({}, prev, updateData);
                        });
                    }}
                    onLogoUpdate={async (url: string) => {
                        try {
                            await actualizarLogo(studioSlug, { tipo: 'logo', url });
                        } catch (error) {
                            console.error('Error updating logo:', error);
                        }
                    }}
                    onLogoLocalUpdate={(url: string | null) => {
                        setIdentidadData(prev => {
                            if (!prev) return null;
                            return { ...prev, logo_url: url };
                        });
                    }}
                    studioSlug={studioSlug}
                />
            )}
        </div>
    );
}
