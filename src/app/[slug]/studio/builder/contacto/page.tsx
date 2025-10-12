'use client';

import React, { useEffect, useState } from 'react';
import { ContactoEditorZen } from './components/ContactoEditorZen';
import { SectionLayout } from '../components';
import { useParams } from 'next/navigation';
import { getBuilderProfileData } from '@/lib/actions/studio/builder-profile.actions';
import { ContactoData } from './types';
import { BuilderProfileData } from '@/types/builder-profile';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { Phone } from 'lucide-react';

export default function ContactoPage() {
    const params = useParams();
    const studioSlug = params.slug as string;
    const [builderData, setBuilderData] = useState<BuilderProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // ✅ UNA SOLA CONSULTA - Estrategia homologada con perfil público
                const result = await getBuilderProfileData(studioSlug);
                if (result.success && result.data) {
                    setBuilderData(result.data);
                } else {
                    console.error('Error loading builder data:', result.error);
                }
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [studioSlug]);

    // ✅ Mapear datos para preview - Header, Footer y Contenido de contacto
    const previewData = builderData ? {
        // Para ProfileIdentity
        studio_name: builderData.studio.studio_name,
        slogan: builderData.studio.slogan,
        logo_url: builderData.studio.logo_url,
        // Para ProfileFooter
        pagina_web: builderData.studio.website,
        palabras_clave: builderData.studio.keywords,
        redes_sociales: builderData.socialNetworks.map(network => ({
            plataforma: network.platform?.name || '',
            url: network.url
        })),
        email: null, // No hay email en BuilderProfileData
        telefonos: builderData.contactInfo.phones.map(phone => ({
            numero: phone.number,
            tipo: phone.type === 'WHATSAPP' ? 'whatsapp' as const :
                phone.type === 'LLAMADAS' ? 'llamadas' as const : 'ambos' as const,
            is_active: true
        })),
        direccion: builderData.contactInfo.address,
        google_maps_url: null, // No hay google_maps_url en BuilderProfileData
        // Para ProfileContent (sección contacto)
        studio: builderData.studio,
        contactInfo: builderData.contactInfo,
        socialNetworks: builderData.socialNetworks
    } : null;

    return (
        <SectionLayout section="contacto" studioSlug={studioSlug} data={previewData as unknown as Record<string, unknown>} loading={loading}>
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
                            data={builderData ? {
                                id: builderData.studio.id,
                                studio_id: builderData.studio.id,
                                descripcion: builderData.studio.description || '',
                                direccion: builderData.contactInfo.address || '',
                                google_maps_url: '',
                                horarios: [],
                                telefonos: builderData.contactInfo.phones.map(phone => ({
                                    id: phone.id,
                                    numero: phone.number,
                                    tipo: (phone.type === 'WHATSAPP' ? 'whatsapp' :
                                        phone.type === 'LLAMADAS' ? 'llamadas' : 'ambos') as 'llamadas' | 'whatsapp' | 'ambos',
                                    is_active: true
                                })),
                                zonas_trabajo: []
                            } : {
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
                                setBuilderData((prev: BuilderProfileData | null) => {
                                    if (!prev) return null;
                                    const updateData = data as Partial<ContactoData>;
                                    return {
                                        ...prev,
                                        contactInfo: { ...prev.contactInfo, ...updateData }
                                    };
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
