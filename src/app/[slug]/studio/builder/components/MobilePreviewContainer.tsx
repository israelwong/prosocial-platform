'use client';

import React, { useRef } from 'react';
import { ProfileIdentity, ProfileContent, ProfileFooter } from '@/components/ui/profile';

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
    contentVariant = 'skeleton'
}: MobilePreviewContainerProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Simulador de móvil con proporciones reales */}
            <div ref={scrollContainerRef} className="bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl w-[375px] h-[812px] flex flex-col overflow-y-auto">
                {/* Header de identidad */}
                {showHeader && (
                    <ProfileIdentity
                        data={data}
                        loading={loading}
                    />
                )}

                {/* Contenido principal sin scroll interno */}
                <div className="flex-1 p-5">
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
