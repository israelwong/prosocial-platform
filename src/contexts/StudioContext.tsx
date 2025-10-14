'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Tipo que coincide exactamente con lo que devuelve Prisma
export type StudioProfileResult = {
    id: string;
    slug: string;
    studio_name: string;
    logo_url: string | null;
    isotipo_url: string | null;
    slogan: string | null;
    description: string | null;
    email: string | null;
    website: string | null;
    address: string | null;
    phones: Array<{
        id: string;
        number: string;
        type: string;
        order: number;
    }>;
    business_hours: Array<{
        id: string;
        day_of_week: string;
        start_time: string;
        end_time: string;
    }>;
    social_networks: Array<{
        id: string;
        url: string;
        platform: {
            name: string;
        } | null;
    }>;
};

// Alias para mantener compatibilidad
type PublicProfileData = StudioProfileResult;

interface StudioContextValue {
    slug: string;
    profileData: PublicProfileData;
    activeSection: string;
    setActiveSection: (section: string) => void;
    isPreviewMode: boolean;
    navigateToSection: (section: string) => void;
}

const StudioContext = createContext<StudioContextValue | undefined>(undefined);

interface StudioProviderProps {
    children: React.ReactNode;
    initialData: PublicProfileData;
}

export function StudioProvider({ children, initialData }: StudioProviderProps) {
    const [profileData, setProfileData] = useState<PublicProfileData>(initialData);
    const [activeSection, setActiveSection] = useState<string>('inicio');
    const pathname = usePathname();

    // Detectar sección activa desde la URL
    useEffect(() => {
        const pathSegments = pathname.split('/');
        const lastSegment = pathSegments[pathSegments.length - 1];

        // Mapear rutas a secciones
        const sectionMap: Record<string, string> = {
            'inicio': 'inicio',
            'portafolio': 'portafolio',
            'paquetes': 'paquetes',
            'contacto': 'contacto',
            'payment': 'payment',
            'clientes': 'clientes'
        };

        if (sectionMap[lastSegment]) {
            setActiveSection(sectionMap[lastSegment]);
        }
    }, [pathname]);

    const navigateToSection = (section: string) => {
        setActiveSection(section);
        // La navegación se maneja con Next.js Link en los componentes
    };

    const value: StudioContextValue = {
        slug: profileData.slug,
        profileData,
        activeSection,
        setActiveSection,
        isPreviewMode: false,
        navigateToSection
    };

    return (
        <StudioContext.Provider value={value}>
            {children}
        </StudioContext.Provider>
    );
}

export function useStudio() {
    const context = useContext(StudioContext);
    if (context === undefined) {
        throw new Error('useStudio must be used within a StudioProvider');
    }
    return context;
}
