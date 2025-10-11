'use client';

import React, { useEffect, useState } from 'react';
import { ContactoEditorZen } from './components/ContactoEditorZen';
import { SectionLayout } from '../components';
import { useParams } from 'next/navigation';
import { obtenerContactoStudio } from '@/lib/actions/studio/config/contacto.actions';
import { obtenerIdentidadStudio } from '@/lib/actions/studio/config/identidad.actions';
import { ContactoData } from './types';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { Phone } from 'lucide-react';

export default function ContactoPage() {
    const params = useParams();
    const studioSlug = params.slug as string;
    const [contactoData, setContactoData] = useState<ContactoData | null>(null);
    const [identidadData, setIdentidadData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // Cargar datos de contacto
                const contactoResult = await obtenerContactoStudio(studioSlug);
                if ('success' in contactoResult && contactoResult.success === false) {
                    console.error('Error loading contacto:', contactoResult.error);
                } else {
                    setContactoData(contactoResult as ContactoData);
                }

                // Cargar datos de identidad para el header
                const identidadResult = await obtenerIdentidadStudio(studioSlug);
                if ('success' in identidadResult && identidadResult.success === false) {
                    console.error('Error loading identidad:', identidadResult.error);
                } else {
                    setIdentidadData(identidadResult);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [studioSlug]);

    // Combinar datos de contacto e identidad para el preview
    const combinedData = {
        ...contactoData,
        ...identidadData,
    };

    return (
        <SectionLayout section="contacto" studioSlug={studioSlug} data={combinedData as unknown as Record<string, unknown>} loading={loading}>
            <ZenCard variant="default" padding="none">
                <ZenCardHeader className="border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-600/20 rounded-lg">
                            <Phone className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                            <ZenCardTitle>Editor de Contacto</ZenCardTitle>
                            <ZenCardDescription>
                                Configura la información de contacto y ubicación
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
                        <ContactoEditorZen
                            data={contactoData || {
                                id: 'temp-id',
                                studio_id: 'temp-studio-id',
                                descripcion: '',
                                direccion: '',
                                google_maps_url: '',
                                horarios: [],
                                telefonos: [],
                                zonas_trabajo: []
                            }}
                            onLocalUpdate={(data: unknown) => {
                                setContactoData(prev => {
                                    if (!prev) return null;
                                    const updateData = data as Partial<ContactoData>;
                                    return Object.assign({}, prev, updateData);
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
