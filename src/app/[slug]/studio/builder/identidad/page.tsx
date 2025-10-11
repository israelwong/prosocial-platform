'use client';

import React, { useEffect, useState } from 'react';
import { IdentidadEditorZen } from './components/';
import { SectionLayout } from '../components';
import { useParams } from 'next/navigation';
import { obtenerIdentidadStudio, actualizarLogo } from '@/lib/actions/studio/config/identidad.actions';
import { obtenerContactoStudio } from '@/lib/actions/studio/config/contacto.actions';
import { IdentidadData } from './types';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { Image as ImageIcon } from 'lucide-react';

export default function IdentidadPage() {
    const params = useParams();
    const studioSlug = params.slug as string;
    const [identidadData, setIdentidadData] = useState<IdentidadData | null>(null);
    const [contactoData, setContactoData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Cargar datos de identidad
                const identidadResult = await obtenerIdentidadStudio(studioSlug);
                if (identidadResult.success !== false) {
                    setIdentidadData(identidadResult as unknown as IdentidadData);
                }

                // Cargar datos de contacto para el footer
                const contactoResult = await obtenerContactoStudio(studioSlug);
                if (contactoResult.success !== false) {
                    setContactoData(contactoResult);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [studioSlug]);

    // Combinar datos de identidad y contacto para el preview
    const combinedData = {
        ...identidadData,
        ...contactoData,
    };

    return (
        <SectionLayout section="identidad" studioSlug={studioSlug} data={combinedData as unknown as Record<string, unknown>} loading={loading}>
            <ZenCard variant="default" padding="none">
                <ZenCardHeader className="border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600/20 rounded-lg">
                            <ImageIcon className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                            <ZenCardTitle>Editor de Identidad</ZenCardTitle>
                            <ZenCardDescription>
                                Configura la información y elementos visuales
                            </ZenCardDescription>
                        </div>
                    </div>
                </ZenCardHeader>
                <ZenCardContent className="p-6">
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
                </ZenCardContent>
            </ZenCard>
        </SectionLayout>
    );
}
