'use client';

import React, { useEffect, useState } from 'react';
import { CatalogoEditorZen } from './components/CatalogoEditorZen';
import { SectionLayout } from '../components';
import { useParams } from 'next/navigation';
import { getBuilderProfileData } from '@/lib/actions/studio/builder/builder-profile.actions';
import { CatalogoData } from './types';
import { BuilderProfileData } from '@/types/builder-profile';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { Store } from 'lucide-react';

export default function CatalogoPage() {
    const params = useParams();
    const studioSlug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [builderData, setBuilderData] = useState<BuilderProfileData | null>(null);
    const [catalogoData, setCatalogoData] = useState<CatalogoData | null>(null);

    // Cargar datos del builder
    useEffect(() => {
        const loadBuilderData = async () => {
            try {
                setLoading(true);
                const result = await getBuilderProfileData(studioSlug);

                if (result.success && result.data) {
                    setBuilderData(result.data);

                    // Transformar datos para el editor de catálogo
                    const transformedData: CatalogoData = {
                        items: result.data.items.map(item => ({
                            id: item.id,
                            name: item.name,
                            type: item.type,
                            cost: item.cost,
                            order: item.order,
                            description: '', // No hay descripción en BuilderProfileData
                            image_url: '', // No hay imagen en BuilderProfileData
                            is_active: true
                        }))
                    };

                    setCatalogoData(transformedData);
                } else {
                    console.error('Error loading builder data:', result.error);
                }
            } catch (error) {
                console.error('Error in loadBuilderData:', error);
            } finally {
                setLoading(false);
            }
        };

        loadBuilderData();
    }, [studioSlug]);

    // Datos para el preview móvil
    const previewData = builderData ? {
        // Para ProfileIdentity
        studio_name: builderData.studio.studio_name,
        logo_url: builderData.studio.logo_url,
        slogan: builderData.studio.slogan,
        // Para ProfileContent (sección catálogo)
        studio: builderData.studio,
        items: builderData.items,
        // Para ProfileFooter
        pagina_web: builderData.studio.website,
        palabras_clave: builderData.studio.keywords,
        redes_sociales: builderData.socialNetworks.map(network => ({
            plataforma: network.platform?.name || 'Red Social',
            url: network.url
        })),
        email: null, // No hay email en BuilderProfileData
        telefonos: builderData.contactInfo.phones.map(phone => ({
            numero: phone.number,
            tipo: phone.type === 'principal' ? 'ambos' as const :
                phone.type === 'whatsapp' ? 'whatsapp' as const : 'llamadas' as const,
            is_active: true
        })),
        direccion: builderData.contactInfo.address,
        google_maps_url: builderData.studio.maps_url
    } : null;

    return (
        <SectionLayout section="catalogo" studioSlug={studioSlug} data={previewData as unknown as Record<string, unknown>} loading={loading}>
            <ZenCard variant="default" padding="none">
                <ZenCardHeader className="border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-600/20 rounded-lg">
                            <Store className="h-5 w-5 text-green-400" />
                        </div>
                        <div>
                            <ZenCardTitle>Catálogo</ZenCardTitle>
                            <ZenCardDescription>
                                Gestiona tus productos y servicios
                            </ZenCardDescription>
                        </div>
                    </div>
                </ZenCardHeader>
                <ZenCardContent className="p-6">
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-8 bg-zinc-800/50 rounded animate-pulse"></div>
                            <div className="h-32 bg-zinc-800/50 rounded animate-pulse"></div>
                            <div className="h-32 bg-zinc-800/50 rounded animate-pulse"></div>
                        </div>
                    ) : (
                        <CatalogoEditorZen
                            studioSlug={studioSlug}
                            data={catalogoData}
                            loading={loading}
                        />
                    )}
                </ZenCardContent>
            </ZenCard>
        </SectionLayout>
    );
}
