'use client';

import React from 'react';
import { ProfileIdentity, ProfileNavTabs, ProfileContent, ProfileFooter } from '@/components/ui/profile';

interface MobilePreviewContainerProps {
    children?: React.ReactNode;
    // Datos para header y footer
    data?: Record<string, unknown>;
    loading?: boolean;
    // Opciones de renderizado
    showHeader?: boolean;
    showFooter?: boolean;
    showNavbar?: boolean;
    showContent?: boolean;
    // Configuración de contenido
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    contentVariant?: 'skeleton' | 'posts' | 'shop' | 'info';
}

/**
 * MobilePreviewContainer - Contenedor para preview móvil
 * Migrado desde la carpeta previews del builder
 * 
 * Usado en:
 * - Builder preview (contenedor de preview móvil)
 * - Perfil público (contenedor de preview móvil)
 */
export function MobilePreviewContainer({
    children,
    data,
    loading = false,
    showHeader = true,
    showFooter = true,
    showNavbar = true,
    showContent = true,
    activeTab = 'inicio',
    onTabChange,
    contentVariant = 'skeleton'
}: MobilePreviewContainerProps) {
    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Simulador de móvil con proporciones reales */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-4 shadow-2xl w-[375px] h-[812px] flex flex-col">
                {/* Header fijo */}
                {showHeader && (
                    <div className="flex-shrink-0 sticky top-0 z-10">
                        <ProfileIdentity
                            data={data}
                            loading={loading}
                        // variant="full" // TODO: Remove this
                        // showStats={true} // TODO: Remove this
                        />
                    </div>
                )}

                {/* Navigation Tabs */}
                {showNavbar && (
                    <div className="flex-shrink-0">
                        <ProfileNavTabs
                            activeTab={activeTab}
                            onTabChange={onTabChange || (() => { })}
                        />
                    </div>
                )}

                {/* Contenido principal con scroll */}
                <div className="flex-1 overflow-y-auto">
                    {showContent && !children && (
                        <ProfileContent
                            variant={contentVariant}
                            data={data}
                            loading={loading}
                        />
                    )}

                    {children}

                    {/* Footer dentro del contenido */}
                    {showFooter && (
                        <div className="mt-4">
                            <ProfileFooter
                                data={data}
                                loading={loading}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
