'use client';

import React from 'react';
import { Globe, Mail, Phone, MapPin, Hash } from 'lucide-react';
import { WhatsAppIcon } from '@/components/ui/shadcn/icons/WhatsAppIcon';
import InstagramIcon from '@/components/ui/shadcn/icons/InstagramIcon';
import FacebookIcon from '@/components/ui/shadcn/icons/FacebookIcon';
import TikTokIcon from '@/components/ui/shadcn/icons/TikTokIcon';
import YouTubeIcon from '@/components/ui/shadcn/icons/YouTubeIcon';

interface FooterPreviewProps {
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

export function FooterPreview({ data, loading = false }: FooterPreviewProps) {
    const footerData = data || {};

    // Debug: Log data to see what's being passed
    console.log('🔍 FooterPreview - Data received:', data);
    console.log('🔍 FooterPreview - FooterData keys:', Object.keys(footerData));


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
    const getSocialIcon = (plataforma: string) => {
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
            default:
                return <Globe className="w-4 h-4" />;
        }
    };


    return (
        <div className="bg-zinc-900/30 border-t border-zinc-800/50 p-3 mt-6 pb-5">
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
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 text-zinc-400 flex-shrink-0">
                                {getSocialIcon(redesSociales[0].plataforma)}
                            </div>
                            <div className="flex gap-1">
                                {redesSociales.map((red, index) => (
                                    <a
                                        key={index}
                                        href={red.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-zinc-400 hover:text-zinc-300 transition-colors"
                                    >
                                        {getSocialIcon(red.plataforma)}
                                    </a>
                                ))}
                            </div>
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
