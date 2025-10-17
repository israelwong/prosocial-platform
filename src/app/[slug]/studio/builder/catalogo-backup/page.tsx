'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Store, Package, Layers, DollarSign } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/shadcn/tabs';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { SectionLayout } from '../components';
import { ItemsTab, PaquetesTab, UtilidadTab } from './components';
import { getBuilderProfileData } from '@/lib/actions/studio/builder/builder-profile.actions';
import type { BuilderProfileData } from '@/types/builder-profile';
import type { TabValue } from './types';

export default function CatalogoPage() {
    const params = useParams();
    const studioSlug = params.slug as string;

    const [activeTab, setActiveTab] = useState<TabValue>('items');
    const [loading, setLoading] = useState(true);
    const [builderData, setBuilderData] = useState<BuilderProfileData | null>(null);

    // Cargar datos del builder (para preview móvil)
    useEffect(() => {
        const loadBuilderData = async () => {
            try {
                setLoading(true);
                const result = await getBuilderProfileData(studioSlug);

                if (result.success && result.data) {
                    setBuilderData(result.data);
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
        <SectionLayout
            section="catalogo"
            studioSlug={studioSlug}
            data={previewData as unknown as Record<string, unknown>}
            loading={loading}
        >
            <ZenCard variant="default" padding="none">
                <ZenCardHeader className="border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-600/20 rounded-lg">
                            <Store className="h-5 w-5 text-purple-400" />
                        </div>
                        <div>
                            <ZenCardTitle>Catálogo</ZenCardTitle>
                            <ZenCardDescription>
                                Gestiona tus servicios, paquetes y configuración de precios
                            </ZenCardDescription>
                        </div>
                    </div>
                </ZenCardHeader>

                <ZenCardContent className="p-6">
                    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
                        <TabsList className="grid w-full grid-cols-3 mb-6">
                            <TabsTrigger value="items" className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                <span>Catálogo</span>
                            </TabsTrigger>
                            <TabsTrigger value="paquetes" className="flex items-center gap-2">
                                <Layers className="h-4 w-4" />
                                <span>Paquetes</span>
                            </TabsTrigger>
                            <TabsTrigger value="utilidad" className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                <span>Utilidad</span>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="items">
                            <ItemsTab studioSlug={studioSlug} />
                        </TabsContent>

                        <TabsContent value="paquetes">
                            <PaquetesTab studioSlug={studioSlug} />
                        </TabsContent>

                        <TabsContent value="utilidad">
                            <UtilidadTab studioSlug={studioSlug} />
                        </TabsContent>
                    </Tabs>
                </ZenCardContent>
            </ZenCard>
        </SectionLayout>
    );
}
