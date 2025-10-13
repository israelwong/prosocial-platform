import React from 'react';
import { Phone, Calendar, MapPin } from 'lucide-react';
import { ZenButton, ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenBadge } from '@/components/ui/zen';
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
        <div className="px-4 py-8 space-y-6">

            {/* Business Description - Minimalist title, no wrapper */}
            {studio.description && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-zinc-500">Descripción del negocio</h3>
                    <p className="text-zinc-300 leading-relaxed">
                        {studio.description.charAt(0).toUpperCase() + studio.description.slice(1)}
                    </p>
                </div>
            )}

            {/* Action Buttons - Block layout, rounded full */}
            <div className="space-y-3">
                {contactInfo.phones.length > 0 && (
                    <>
                        <ZenButton
                            variant="outline"
                            onClick={() => handleCall(contactInfo.phones[0].number)}
                            className="w-full rounded-full flex items-center justify-center gap-2 bg-blue-800"
                        >
                            <Phone className="h-4 w-4" />
                            Llamar
                        </ZenButton>

                        <ZenButton
                            variant="outline"
                            onClick={() => handleMessage(contactInfo.phones[0].number)}
                            className="w-full rounded-full flex items-center justify-center gap-2 bg-green-800"
                        >
                            <WhatsAppIcon className="h-4 w-4" />
                            Enviar Mensaje
                        </ZenButton>
                    </>
                )}

                <ZenButton
                    variant="outline"
                    onClick={handleSchedule}
                    className="w-full rounded-full flex items-center justify-center gap-2"
                >
                    <Calendar className="h-4 w-4" />
                    Agendar
                </ZenButton>
            </div>



            {/* Work Zones - As tags */}
            {studio.keywords && (
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-zinc-500">Zonas de trabajo</h3>
                    <div className="flex flex-wrap gap-2">
                        {studio.keywords.split(',').map((keyword, index) => (
                            <ZenBadge key={index} variant="outline" className="text-xs">
                                {keyword.trim()}
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
