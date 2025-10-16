'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { ContactoEditorZen } from './components/ContactoEditorZen';
import { SectionLayout } from '../components';
import { useParams } from 'next/navigation';
import { getBuilderProfileData } from '@/lib/actions/studio/builder/builder-profile.actions';
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
                console.log('🔄 [ContactoPage] Loading builder data for slug:', studioSlug);
                // ✅ UNA SOLA CONSULTA - Estrategia homologada con perfil público
                const result = await getBuilderProfileData(studioSlug);
                console.log('📊 [ContactoPage] Builder data result:', result);
                if (result.success && result.data) {
                    setBuilderData(result.data);
                    console.log('✅ [ContactoPage] Builder data loaded successfully');
                } else {
                    console.error('❌ [ContactoPage] Error loading builder data:', result.error);
                }
            } catch (error) {
                console.error('❌ [ContactoPage] Error loading data:', error);
            } finally {
                console.log('🏁 [ContactoPage] Setting loading to false');
                setLoading(false);
            }
        };

        loadData();
    }, [studioSlug]);

    // Memoizar función para evitar re-renders
    const handleLocalUpdate = useCallback((data: unknown) => {
        console.log('🔄 [ContactoPage] onLocalUpdate called with:', data);
        setBuilderData((prev: BuilderProfileData | null) => {
            if (!prev) return null;
            const updateData = data as Partial<ContactoData>;
            console.log('📝 [ContactoPage] Updating builderData with:', updateData);

            // Debug: Verificar si hay horarios en la actualización
            if (updateData.horarios) {
                console.log('🕐 [ContactoPage] Horarios update detected:', updateData.horarios);
                console.log('🕐 [ContactoPage] Horarios length:', updateData.horarios.length);
            }
            return {
                ...prev,
                studio: {
                    ...prev.studio,
                    description: updateData.descripcion !== undefined ? updateData.descripcion : prev.studio.description,
                    address: updateData.direccion !== undefined ? updateData.direccion : prev.studio.address,
                    maps_url: updateData.google_maps_url !== undefined ? updateData.google_maps_url : prev.studio.maps_url
                },
                contactInfo: {
                    ...prev.contactInfo,
                    address: updateData.direccion !== undefined ? updateData.direccion : prev.contactInfo.address,
                    website: updateData.google_maps_url !== undefined ? updateData.google_maps_url : prev.contactInfo.website,
                    phones: updateData.telefonos !== undefined ? updateData.telefonos.map(phone => ({
                        id: phone.id || '',
                        number: phone.numero,
                        type: phone.tipo === 'whatsapp' ? 'WHATSAPP' :
                            phone.tipo === 'llamadas' ? 'LLAMADAS' : 'AMBOS',
                        label: phone.etiqueta || null,
                        is_active: phone.is_active !== undefined ? phone.is_active : true
                    })) : prev.contactInfo.phones,
                    horarios: updateData.horarios !== undefined ? updateData.horarios.map(horario => ({
                        id: horario.id || '',
                        dia: horario.dia,
                        apertura: horario.apertura,
                        cierre: horario.cierre,
                        cerrado: horario.cerrado,
                    })) : prev.contactInfo.horarios
                },
                // Manejar zonas de trabajo si están en updateData
                ...(updateData.zonas_trabajo !== undefined && {
                    studio: {
                        ...prev.studio,
                        zonas_trabajo: updateData.zonas_trabajo.map(zona => ({
                            id: zona.id || '',
                            nombre: zona.nombre,
                            orden: zona.orden || 0
                        }))
                    }
                })
            };
        });
    }, []);

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
            etiqueta: phone.label || undefined,
            is_active: phone.is_active
        })),
        direccion: builderData.contactInfo.address,
        google_maps_url: builderData.studio.maps_url,
        // Para ProfileContent (sección contacto)
        studio: builderData.studio,
        contactInfo: {
            ...builderData.contactInfo,
            google_maps_url: builderData.studio.maps_url
        },
        socialNetworks: builderData.socialNetworks,
        zonas_trabajo: builderData.studio.zonas_trabajo || []
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
                                google_maps_url: builderData.studio.maps_url || '',
                                horarios: builderData.contactInfo.horarios?.map(h => ({
                                    id: h.id,
                                    dia: h.dia as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
                                    apertura: h.apertura,
                                    cierre: h.cierre,
                                    cerrado: h.cerrado
                                })) || [],
                                telefonos: builderData.contactInfo.phones.map(phone => ({
                                    id: phone.id,
                                    numero: phone.number,
                                    tipo: (phone.type === 'WHATSAPP' ? 'whatsapp' :
                                        phone.type === 'LLAMADAS' ? 'llamadas' : 'ambos') as 'llamadas' | 'whatsapp' | 'ambos',
                                    etiqueta: phone.label || undefined,
                                    is_active: phone.is_active
                                })),
                                zonas_trabajo: builderData.studio.zonas_trabajo?.map(z => ({
                                    id: z.id,
                                    nombre: z.nombre,
                                    orden: z.orden
                                })) || []
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
                            onLocalUpdate={handleLocalUpdate}
                            studioSlug={studioSlug}
                            loading={loading}
                        />
                    )}
                </ZenCardContent>
            </ZenCard>
        </SectionLayout>
    );
}
