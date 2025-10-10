import React from 'react';
import { Phone, MessageCircle, Calendar, MapPin, Globe, ExternalLink } from 'lucide-react';
import { ZenButton, ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenBadge } from '@/components/ui/zen';
import { PublicStudioProfile, PublicContactInfo, PublicSocialNetwork } from '@/types/public-profile';

interface InfoViewProps {
    studio: PublicStudioProfile;
    contactInfo: PublicContactInfo;
    socialNetworks: PublicSocialNetwork[];
}

/**
 * InfoView - Business information and contact details
 * Uses ZenButton and ZenCard from ZEN Design System
 * Shows contact actions, location, and social links
 */
export function InfoView({ studio, contactInfo, socialNetworks }: InfoViewProps) {
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

    const getSocialIcon = (platformName: string) => {
        const name = platformName.toLowerCase();
        if (name.includes('facebook')) return '📘';
        if (name.includes('instagram')) return '📷';
        if (name.includes('tiktok')) return '🎵';
        if (name.includes('youtube')) return '📺';
        if (name.includes('twitter')) return '🐦';
        return '🔗';
    };

    return (
        <div className="p-4 space-y-6">
            {/* Contact Actions */}
            <ZenCard>
                <ZenCardHeader>
                    <ZenCardTitle className="flex items-center gap-2">
                        <Phone className="h-5 w-5" />
                        Contacto
                    </ZenCardTitle>
                </ZenCardHeader>
                <ZenCardContent className="space-y-4">
                    {/* Action Buttons */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {contactInfo.phones.length > 0 && (
                            <>
                                <ZenButton
                                    variant="outline"
                                    onClick={() => handleCall(contactInfo.phones[0].number)}
                                    className="flex items-center gap-2"
                                >
                                    <Phone className="h-4 w-4" />
                                    Llamar
                                </ZenButton>

                                <ZenButton
                                    variant="outline"
                                    onClick={() => handleMessage(contactInfo.phones[0].number)}
                                    className="flex items-center gap-2"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Mensaje
                                </ZenButton>
                            </>
                        )}

                        <ZenButton
                            variant="outline"
                            onClick={handleSchedule}
                            className="flex items-center gap-2"
                        >
                            <Calendar className="h-4 w-4" />
                            Agendar
                        </ZenButton>
                    </div>

                    {/* Phone Numbers */}
                    {contactInfo.phones.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-zinc-300">Teléfonos</h4>
                            {contactInfo.phones.map((phone) => (
                                <div key={phone.id} className="flex items-center justify-between">
                                    <span className="text-zinc-400">{phone.number}</span>
                                    <ZenBadge variant="outline" className="text-xs">
                                        {phone.type}
                                    </ZenBadge>
                                </div>
                            ))}
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>

            {/* Business Description */}
            {studio.description && (
                <ZenCard>
                    <ZenCardHeader>
                        <ZenCardTitle>Descripción del negocio</ZenCardTitle>
                    </ZenCardHeader>
                    <ZenCardContent>
                        <p className="text-zinc-300 leading-relaxed">
                            {studio.description}
                        </p>
                    </ZenCardContent>
                </ZenCard>
            )}

            {/* Location */}
            {contactInfo.address && (
                <ZenCard>
                    <ZenCardHeader>
                        <ZenCardTitle className="flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Ubicación
                        </ZenCardTitle>
                    </ZenCardHeader>
                    <ZenCardContent>
                        <p className="text-zinc-300">{contactInfo.address}</p>
                    </ZenCardContent>
                </ZenCard>
            )}

            {/* Keywords/Tags */}
            {studio.keywords && (
                <ZenCard>
                    <ZenCardHeader>
                        <ZenCardTitle>Especialidades</ZenCardTitle>
                    </ZenCardHeader>
                    <ZenCardContent>
                        <div className="flex flex-wrap gap-2">
                            {studio.keywords.split(',').map((keyword, index) => (
                                <ZenBadge key={index} variant="outline" className="text-xs">
                                    {keyword.trim()}
                                </ZenBadge>
                            ))}
                        </div>
                    </ZenCardContent>
                </ZenCard>
            )}

            {/* Social Networks */}
            {socialNetworks.length > 0 && (
                <ZenCard>
                    <ZenCardHeader>
                        <ZenCardTitle>Redes Sociales</ZenCardTitle>
                    </ZenCardHeader>
                    <ZenCardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {socialNetworks.map((network) => (
                                <a
                                    key={network.id}
                                    href={network.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 hover:bg-zinc-700/50 transition-colors"
                                >
                                    <span className="text-2xl">
                                        {getSocialIcon(network.platform?.name || '')}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-zinc-100 truncate">
                                            {network.platform?.name || 'Red Social'}
                                        </p>
                                        <p className="text-xs text-zinc-400 truncate">
                                            {network.url}
                                        </p>
                                    </div>
                                    <ExternalLink className="h-4 w-4 text-zinc-400" />
                                </a>
                            ))}
                        </div>
                    </ZenCardContent>
                </ZenCard>
            )}

            {/* Website */}
            {contactInfo.website && (
                <ZenCard>
                    <ZenCardHeader>
                        <ZenCardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Sitio Web
                        </ZenCardTitle>
                    </ZenCardHeader>
                    <ZenCardContent>
                        <a
                            href={contactInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors"
                        >
                            <span className="truncate">{contactInfo.website}</span>
                            <ExternalLink className="h-4 w-4 flex-shrink-0" />
                        </a>
                    </ZenCardContent>
                </ZenCard>
            )}
        </div>
    );
}
