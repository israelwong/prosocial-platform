import { useState, useEffect } from 'react';

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

interface UsePlatformConfigReturn {
    config: PlatformConfig | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

// Cache global para evitar múltiples requests
let globalConfig: PlatformConfig | null = null;
let globalLoading = false;
let globalError: string | null = null;

export function usePlatformConfig(): UsePlatformConfigReturn {
    const [config, setConfig] = useState<PlatformConfig | null>(globalConfig);
    const [loading, setLoading] = useState(globalLoading);
    const [error, setError] = useState<string | null>(globalError);

    const fetchConfig = async () => {
        // Si ya tenemos la configuración en cache, la devolvemos
        if (globalConfig && !globalLoading) {
            setConfig(globalConfig);
            setLoading(false);
            setError(null);
            return;
        }

        // Si ya hay una request en progreso, esperamos
        if (globalLoading) {
            setLoading(true);
            return;
        }

        globalLoading = true;
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/platform-config');
            
            if (!response.ok) {
                throw new Error('Error al cargar la configuración');
            }

            const data = await response.json();
            globalConfig = data;
            setConfig(data);
            globalError = null;
            setError(null);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            globalError = errorMessage;
            setError(errorMessage);
            console.error('Error fetching platform config:', err);
        } finally {
            globalLoading = false;
            setLoading(false);
        }
    };

    const refetch = async () => {
        globalConfig = null; // Limpiar cache
        await fetchConfig();
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    return {
        config,
        loading,
        error,
        refetch
    };
}

// Hook para obtener solo el nombre de la empresa (más ligero)
export function usePlatformName(): string {
    const { config } = usePlatformConfig();
    return config?.nombre_empresa || 'ProSocial Platform';
}

// Hook para obtener solo el logo (más ligero)
export function usePlatformLogo(): string | null {
    const { config } = usePlatformConfig();
    return config?.logo_url || null;
}

// Hook para obtener el isotipo (solo ícono)
export function usePlatformIsotipo(): string | null {
    const { config } = usePlatformConfig();
    return config?.logo_url || null; // Por ahora usamos el mismo, pero podríamos agregar un campo específico
}

// Hook para obtener información completa del branding
export function usePlatformBranding() {
    const { config } = usePlatformConfig();
    return {
        nombre: config?.nombre_empresa || 'ProSocial Platform',
        isotipo: config?.logo_url || null,
        logotipo: config?.logo_url || null, // Por ahora igual, pero podríamos separar
        favicon: config?.favicon_url || null,
    };
}

// Hook para obtener información de contacto
export function usePlatformContact() {
    const { config } = usePlatformConfig();
    return {
        comercial: {
            telefono: config?.comercial_telefono || null,
            email: config?.comercial_email || null,
            whatsapp: config?.comercial_whatsapp || null,
        },
        soporte: {
            telefono: config?.soporte_telefono || null,
            email: config?.soporte_email || null,
            chat_url: config?.soporte_chat_url || null,
        }
    };
}

// Hook para obtener redes sociales
export function usePlatformSocialMedia() {
    const { config } = usePlatformConfig();
    return {
        facebook: config?.facebook_url || null,
        instagram: config?.instagram_url || null,
        twitter: config?.twitter_url || null,
        linkedin: config?.linkedin_url || null,
    };
}