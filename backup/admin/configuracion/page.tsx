import React from 'react';
import { prisma } from '@/lib/prisma';
import { ConfiguracionPageClient } from './components/ConfiguracionPageClient';

interface PlatformConfig {
    id: string;
    nombre_empresa: string;
    logo_url: string | null;
    favicon_url: string | null;
    comercial_telefono: string | null;
    comercial_email: string | null;
    comercial_whatsapp: string | null;
    soporte_telefono: string | null;
    soporte_email: string | null;
    soporte_chat_url: string | null;
    direccion: string | null;
    horarios_atencion: string | null;
    timezone: string;
    facebook_url: string | null;
    instagram_url: string | null;
    twitter_url: string | null;
    linkedin_url: string | null;
    terminos_condiciones: string | null;
    politica_privacidad: string | null;
    aviso_legal: string | null;
    meta_description: string | null;
    meta_keywords: string | null;
    google_analytics_id: string | null;
    google_tag_manager_id: string | null;
    createdAt: Date;
    updatedAt: Date;
}

// Función para obtener la configuración de la plataforma
async function getPlatformConfig(): Promise<PlatformConfig | null> {
    try {
        // En build time, retornar null para evitar errores de conexión
        if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
            return null;
        }

        const config = await prisma.platform_config.findFirst();
        return config;
    } catch (error) {
        console.error('Error fetching platform config:', error);
        // En build time, retornar null en lugar de lanzar error
        if (process.env.NODE_ENV === 'production') {
            return null;
        }
        return null;
    }
}

export default async function ConfiguracionPage() {
    const config = await getPlatformConfig();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Configuración de la Plataforma</h1>
                <p className="text-zinc-400 mt-1">
                    Gestiona la configuración general de la plataforma
                </p>
            </div>

            <ConfiguracionPageClient initialConfig={config} />
        </div>
    );
}
