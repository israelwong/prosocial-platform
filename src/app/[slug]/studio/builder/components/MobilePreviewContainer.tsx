'use client';

import React, { useRef } from 'react';
import { ProfileHeader, ProfileContent, ProfileFooter } from '@/components/ui/profile';

interface MobilePreviewContainerProps {
    children?: React.ReactNode;
    // Datos para header y footer
    data?: Record<string, unknown>;
    loading?: boolean;
    // Opciones de renderizado
    showHeader?: boolean;
    showFooter?: boolean;
    showContent?: boolean;
    // Configuración de contenido
    activeTab?: string;
    contentVariant?: 'skeleton' | 'posts' | 'shop' | 'info';
}

/**
 * MobilePreviewContainer - Contenedor para preview móvil
 * Migrado desde la carpeta previews del builder
 * 
 * Actualizado para usar ProfileHeader unificado con transición fluida
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
    showContent = true,
    activeTab = 'inicio',
    contentVariant = 'skeleton'
}: MobilePreviewContainerProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Simulador de móvil con proporciones reales */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-4 shadow-2xl w-[375px] h-[812px] flex flex-col overflow-hidden">
                {/* Header unificado con navegación */}
                {showHeader && (
                    <div className="flex-shrink-0">
                        <ProfileHeader
                            data={data}
                            loading={loading}
                            activeSection={activeTab}
                            scrollContainer={scrollContainerRef.current}
                            scrollThreshold={50}
                        />
                    </div>
                )}

                {/* Contenido principal con scroll interno */}
                <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
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
