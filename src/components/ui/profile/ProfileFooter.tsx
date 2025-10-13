'use client';

import React from 'react';
import { Globe, Mail, Phone, MapPin, Hash } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/icons/WhatsAppIcon';
import InstagramIcon from '@/components/ui/icons/InstagramIcon';
import FacebookIcon from '@/components/ui/icons/FacebookIcon';
import TikTokIcon from '@/components/ui/icons/TikTokIcon';
import YouTubeIcon from '@/components/ui/icons/YouTubeIcon';
import LinkedInIcon from '@/components/ui/icons/LinkedInIcon';
import ThreadsIcon from '@/components/ui/icons/ThreadsIcon';
import SpotifyIcon from '@/components/ui/icons/SpotifyIcon';

interface ProfileFooterProps {
    data?: {
        // Datos de identidad (pie de página)
        pagina_web?: string | null;
        palabras_clave?: string | null;
        redes_sociales?: Array<{
            plataforma: string;
            url: string;
        }>;
        // Datos de contacto
        email?: string | null;
        telefonos?: Array<{
            numero: string;
            tipo: 'llamadas' | 'whatsapp' | 'ambos';
            is_active?: boolean;
        }>;
        direccion?: string | null;
        google_maps_url?: string | null;
    };
    loading?: boolean;
}

/**
 * ProfileFooter - Componente reutilizable para footer del perfil
 * Migrado desde FooterPreview del builder con mejor naming
 * 
 * Usado en:
 * - Builder preview (footer con datos de contacto)
 * - Perfil público (footer con información completa)
 */
export function ProfileFooter({ data, loading = false }: ProfileFooterProps) {
    const footerData = data || {};

    // Helper function to safely get array values
    const getArrayValue = <T,>(value: unknown, defaultValue: T[]): T[] => {
        return Array.isArray(value) ? value as T[] : defaultValue;
    };

    const telefonos = getArrayValue(footerData.telefonos, []) as Array<{
        numero: string;
        tipo: 'llamadas' | 'whatsapp' | 'ambos';
        is_active?: boolean;
    }>;
    const redesSociales = getArrayValue(footerData.redes_sociales, []) as Array<{
        plataforma: string;
        url: string;
    }>;
    const telefonoActivo = telefonos.find(t => t.is_active !== false);

    // Función para obtener icono de red social
    const getSocialIcon = (plataforma: string | undefined | null) => {
        if (!plataforma || typeof plataforma !== 'string') {
            return <Globe className="w-4 h-4" />;
        }

        const platform = plataforma.toLowerCase();
        switch (platform) {
            case 'instagram':
                return <InstagramIcon className="w-4 h-4" />;
            case 'facebook':
                return <FacebookIcon className="w-4 h-4" />;
            case 'tiktok':
                return <TikTokIcon className="w-4 h-4" />;
            case 'youtube':
                return <YouTubeIcon className="w-4 h-4" />;
            case 'linkedin':
                return <LinkedInIcon className="w-4 h-4" />;
            case 'threads':
                return <ThreadsIcon className="w-4 h-4" />;
            case 'spotify':
                return <SpotifyIcon className="w-4 h-4" />;
            default:
                return <Globe className="w-4 h-4" />;
        }
    };

    return (
        <div className="bg-zinc-900/30  p-3 mt-10 pt-5 pb-5 relative">
            {/* Separador elegante con efecto de profundidad */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-zinc-900/60 to-transparent rounded-full shadow-lg shadow-zinc-900/20"></div>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-zinc-700/80 to-transparent rounded-full"></div>
            {loading ? (
                // Skeleton del footer
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-zinc-700 rounded animate-pulse"></div>
                        <div className="h-3 bg-zinc-700 rounded animate-pulse w-20"></div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-zinc-700 rounded animate-pulse"></div>
                        <div className="h-3 bg-zinc-700 rounded animate-pulse w-24"></div>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    {/* Página Web */}
                    {footerData.pagina_web && (
                        <div className="flex items-center gap-2">
                            <Globe className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                            <a
                                href={footerData.pagina_web}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-zinc-300 text-xs hover:text-zinc-200 transition-colors truncate"
                            >
                                {footerData.pagina_web}
                            </a>
                        </div>
                    )}

                    {/* Redes Sociales */}
                    {redesSociales.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {redesSociales.map((red, index) => (
                                <a
                                    key={index}
                                    href={red.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-zinc-300 hover:text-zinc-200 transition-colors text-xs"
                                >
                                    {getSocialIcon(red.plataforma)}
                                    <span className="capitalize">
                                        {red.plataforma || 'Red Social'}
                                    </span>
                                </a>
                            ))}
                        </div>
                    )}

                    {/* Palabras Clave como badges */}
                    {footerData.palabras_clave && (
                        <div className="flex items-center gap-2 flex-wrap">
                            <Hash className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                            <div className="flex gap-1 flex-wrap">
                                {(Array.isArray(footerData.palabras_clave)
                                    ? footerData.palabras_clave
                                    : footerData.palabras_clave.split(',')
                                ).map((palabra, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-zinc-800 text-zinc-300 border border-zinc-700"
                                    >
                                        {typeof palabra === 'string' ? palabra.trim() : palabra}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Teléfono con iconos según tipo */}
                    {telefonoActivo && (
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                {telefonoActivo.tipo === 'llamadas' || telefonoActivo.tipo === 'ambos' ? (
                                    <Phone className="w-3 h-3 text-zinc-400" />
                                ) : null}
                                {telefonoActivo.tipo === 'whatsapp' || telefonoActivo.tipo === 'ambos' ? (
                                    <WhatsAppIcon className="w-3 h-3 text-zinc-400" />
                                ) : null}
                            </div>
                            <a
                                href={`tel:${telefonoActivo.numero}`}
                                className="text-zinc-300 text-xs hover:text-zinc-200 transition-colors truncate"
                            >
                                {telefonoActivo.numero}
                            </a>
                        </div>
                    )}

                    {/* Email */}
                    {footerData.email && (
                        <div className="flex items-center gap-2">
                            <Mail className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                            <a
                                href={`mailto:${footerData.email}`}
                                className="text-zinc-300 text-xs hover:text-zinc-200 transition-colors truncate"
                            >
                                {footerData.email}
                            </a>
                        </div>
                    )}

                    {/* Dirección */}
                    {footerData.direccion && (
                        <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-zinc-400 flex-shrink-0" />
                            {footerData.google_maps_url ? (
                                <a
                                    href={footerData.google_maps_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-zinc-300 text-xs hover:text-zinc-200 transition-colors truncate"
                                >
                                    {footerData.direccion}
                                </a>
                            ) : (
                                <span className="text-zinc-300 text-xs truncate">
                                    {footerData.direccion}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
