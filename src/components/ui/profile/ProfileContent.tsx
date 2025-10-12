'use client';

import React from 'react';
import { MainSection, PortfolioSection, CatalogSection, ContactSection } from './sections';
import { PublicPortfolio, PublicCatalogItem, PublicStudioProfile, PublicContactInfo, PublicSocialNetwork } from '@/types/public-profile';

interface ProfileContentProps {
    variant?: 'skeleton' | 'posts' | 'portfolio' | 'shop' | 'info';
    data?: Record<string, unknown>;
    loading?: boolean;
}

/**
 * ProfileContent - Componente reutilizable para contenido del perfil
 * Migrado desde ContentPreviewSkeleton del builder con mejor naming
 * 
 * Usado en:
 * - Builder preview (contenido de skeleton)
 * - Perfil público (contenido dinámico)
 */
export function ProfileContent({
    variant = 'skeleton',
    data,
    loading = false
}: ProfileContentProps) {
    // Skeleton loading state
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-zinc-800 rounded-lg animate-pulse"></div>
                    ))}
                </div>
                <div className="space-y-2">
                    <div className="h-3 bg-zinc-800 rounded w-3/4 animate-pulse"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/2 animate-pulse"></div>
                    <div className="h-3 bg-zinc-800 rounded w-5/6 animate-pulse"></div>
                </div>
            </div>
        );
    }

    // Skeleton placeholder (builder preview)
    if (variant === 'skeleton') {
        return (
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="aspect-square bg-zinc-800 rounded-lg"></div>
                    ))}
                </div>
                <div className="space-y-2">
                    <div className="h-3 bg-zinc-800 rounded w-3/4"></div>
                    <div className="h-3 bg-zinc-800 rounded w-1/2"></div>
                    <div className="h-3 bg-zinc-800 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    // Posts/Main content
    if (variant === 'posts') {
        const portfolios = data?.portfolios as PublicPortfolio[] || [];
        return <MainSection portfolios={portfolios} />;
    }

    // Portfolio content
    if (variant === 'portfolio') {
        const portfolios = data?.portfolios as PublicPortfolio[] || [];
        return <PortfolioSection portfolios={portfolios} />;
    }

    // Shop/Catalog content
    if (variant === 'shop') {
        const items = data?.items as PublicCatalogItem[] || [];
        return <CatalogSection items={items} />;
    }

    // Info/Contact content
    if (variant === 'info') {
        const studio = data?.studio as PublicStudioProfile;
        const contactInfo = data?.contactInfo as PublicContactInfo;
        const socialNetworks = data?.socialNetworks as PublicSocialNetwork[] || [];

        if (!studio || !contactInfo) {
            return (
                <div className="p-8 text-center">
                    <h3 className="text-lg font-medium text-zinc-300 mb-2">
                        Información no disponible
                    </h3>
                    <p className="text-sm text-zinc-500">
                        Los datos de contacto no están disponibles
                    </p>
                </div>
            );
        }

        return <ContactSection studio={studio} contactInfo={contactInfo} socialNetworks={socialNetworks} />;
    }

    // Default fallback
    return (
        <div className="p-8 text-center">
            <h3 className="text-lg font-medium text-zinc-300 mb-2">
                Contenido no disponible
            </h3>
            <p className="text-sm text-zinc-500">
                No se pudo cargar el contenido solicitado
            </p>
        </div>
    );
}
