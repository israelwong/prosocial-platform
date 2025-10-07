'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import {
    ZenCard,
    ZenCardHeader,
    ZenCardTitle,
    ZenCardDescription,
    ZenCardContent
} from '@/components/ui/zen';
import {
    obtenerIdentidadStudio,
    actualizarPalabrasClave
} from '@/lib/actions/studio/config/identidad.actions';
import { PalabrasClaveManagerZen } from './components/PalabrasClaveManagerZen';

export default function SEOSEMPage() {
    const params = useParams();
    const studioSlug = params.slug as string;

    const [palabrasClave, setPalabrasClave] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const result = await obtenerIdentidadStudio(studioSlug);

                if (result.success && result.data) {
                    setPalabrasClave(result.data.palabras_clave || []);
                } else {
                    toast.error('Error al cargar datos de SEO');
                }
            } catch (error) {
                console.error('Error al cargar datos:', error);
                toast.error('Error al cargar datos de SEO');
            } finally {
                setLoading(false);
            }
        };

        cargarDatos();
    }, [studioSlug]);

    // Actualizar palabras clave
    const handleUpdatePalabrasClave = useCallback(async (nuevasPalabras: string[]) => {
        try {
            const result = await actualizarPalabrasClave(studioSlug, nuevasPalabras);

            if (result.success) {
                setPalabrasClave(nuevasPalabras);
                toast.success('Palabras clave actualizadas');
            } else {
                throw new Error(result.error || 'Error al actualizar');
            }
        } catch (error) {
            console.error('Error al actualizar palabras clave:', error);
            throw error;
        }
    }, [studioSlug]);

    // Actualización local (optimista)
    const handleLocalUpdate = useCallback((palabras: string[]) => {
        setPalabrasClave(palabras);
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        SEO / SEM
                    </h1>
                    <p className="text-zinc-400">
                        Optimización para motores de búsqueda
                    </p>
                </div>

                <ZenCard className="p-6">
                    <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
                        <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                        <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
                    </div>
                </ZenCard>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    SEO / SEM
                </h1>
                <p className="text-zinc-400">
                    Optimización para motores de búsqueda
                </p>
            </div>

            {/* Palabras Clave - ZEN CARD */}
            <ZenCard variant="default" padding="none">
                <ZenCardHeader>
                    <ZenCardTitle>Palabras Clave</ZenCardTitle>
                    <ZenCardDescription>
                        Términos que describen tu negocio para SEO y búsquedas
                    </ZenCardDescription>
                </ZenCardHeader>
                <ZenCardContent>
                    <PalabrasClaveManagerZen
                        palabrasClave={palabrasClave}
                        onUpdate={handleUpdatePalabrasClave}
                        onLocalUpdate={handleLocalUpdate}
                        loading={loading}
                    />
                </ZenCardContent>
            </ZenCard>

            {/* Funcionalidades futuras */}
            <ZenCard variant="default" padding="none">
                <ZenCardHeader>
                    <ZenCardTitle>Funcionalidades Futuras</ZenCardTitle>
                    <ZenCardDescription>
                        Próximas características de SEO que se implementarán
                    </ZenCardDescription>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="text-center py-8">
                        <div className="text-zinc-400 mb-4">
                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">
                            Más funcionalidades SEO
                        </h3>
                        <p className="text-zinc-400 mb-4">
                            Meta descripciones, títulos optimizados, análisis de palabras clave
                        </p>
                        <div className="text-sm text-zinc-500">
                            Próximamente
                        </div>
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
