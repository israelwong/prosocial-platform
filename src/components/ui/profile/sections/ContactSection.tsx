import React from 'react';
import { Phone, Calendar } from 'lucide-react';
import { ZenButton, ZenBadge } from '@/components/ui/zen';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsAppIcon';
import { PublicStudioProfile, PublicContactInfo } from '@/types/public-profile';

interface InfoViewProps {
    studio: PublicStudioProfile;
    contactInfo: PublicContactInfo;
}

/**
 * InfoView - Business information and contact details
 * Uses ZenButton and ZenCard from ZEN Design System
 * Shows contact actions, location, and social links
 */
export function ContactSection({ studio, contactInfo }: InfoViewProps) {
    // Debug: Verificar si las zonas de trabajo están llegando
    const handleCall = (phoneNumber: string) => {
        window.open(`tel:${phoneNumber}`, '_self');
    };

    const handleMessage = (phoneNumber: string) => {
        // Open WhatsApp with the phone number
        const whatsappUrl = `https://wa.me/${phoneNumber.replace(/[^\d]/g, '')}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleSchedule = () => {
        // TODO: Open scheduling modal or redirect to booking page
        console.log('Schedule appointment clicked');
    };


    return (
        <div className="px-4 space-y-6">

            {/* Business Description - Minimalist title, no wrapper */}
            {studio.description && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-zinc-500">Descripción del negocio</h3>
                    <p className="text-zinc-300 leading-relaxed">
                        {studio.description.charAt(0).toUpperCase() + studio.description.slice(1)}
                    </p>
                </div>
            )}

            {/* Botones de contacto unificados */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-zinc-500">Contacto</h3>
                <div className="space-y-3">
                    {/* Botones de teléfono */}
                    {contactInfo.phones.length > 0 && contactInfo.phones.map((phone) => (
                        <div key={phone.id} className="space-y-3">
                            {/* Botón de llamada - solo si el teléfono permite llamadas */}
                            {(phone.type === 'principal' ||
                                phone.type === 'emergency' ||
                                phone.type === 'office') && (
                                    <ZenButton
                                        variant="outline"
                                        onClick={() => handleCall(phone.number)}
                                        className="w-full rounded-full flex items-center justify-center gap-2 bg-blue-800 hover:bg-blue-700 py-3"
                                    >
                                        <Phone className="h-4 w-4" />
                                        Llamar
                                    </ZenButton>
                                )}

                            {/* Botón de WhatsApp - solo si el teléfono permite WhatsApp */}
                            {(phone.type === 'whatsapp' ||
                                phone.type === 'principal') && (
                                    <ZenButton
                                        variant="outline"
                                        onClick={() => handleMessage(phone.number)}
                                        className="w-full rounded-full flex items-center justify-center gap-2 bg-green-800 hover:bg-green-700 py-3"
                                    >
                                        <WhatsAppIcon className="h-4 w-4" />
                                        WhatsApp
                                    </ZenButton>
                                )}
                        </div>
                    ))}

                    {/* Botón de Agendar */}
                    <ZenButton
                        variant="outline"
                        onClick={handleSchedule}
                        className="w-full rounded-full flex items-center justify-center gap-2 py-3"
                    >
                        <Calendar className="h-4 w-4" />
                        Agendar
                    </ZenButton>
                </div>
            </div>



            {/* Work Zones - Solo desde tabla studio_zonas_trabajo */}
            {studio.zonas_trabajo && studio.zonas_trabajo.length > 0 && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-zinc-500">Zonas de trabajo</h3>
                    <div className="flex flex-wrap gap-2">
                        {studio.zonas_trabajo.map((zona) => (
                            <ZenBadge key={zona.id} variant="outline" className="text-xs">
                                {zona.nombre}
                            </ZenBadge>
                        ))}
                    </div>
                </div>
            )}

            {/* Location - Text + Google Maps button if exists */}
            {contactInfo.address && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-zinc-500">Ubicación</h3>
                    <p className="text-zinc-300">{contactInfo.address}</p>
                    {contactInfo.google_maps_url && (
                        <ZenButton
                            variant="outline"
                            size="sm"
                            onClick={() => contactInfo.google_maps_url && window.open(contactInfo.google_maps_url, '_blank')}
                            className="rounded-full"
                        >
                            Ver en Google Maps
                        </ZenButton>
                    )}
                </div>
            )}
        </div>
    );
}
