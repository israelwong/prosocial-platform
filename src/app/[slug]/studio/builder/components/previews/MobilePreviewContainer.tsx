'use client';

import React from 'react';
import { HeaderPreview } from './HeaderPreview';
import { FooterPreview } from './FooterPreview';

interface MobilePreviewContainerProps {
    children: React.ReactNode;
    // Datos para header y footer
    data?: Record<string, unknown>;
    loading?: boolean;
    // Opciones de renderizado
    showHeader?: boolean;
    showFooter?: boolean;
}

export function MobilePreviewContainer({
    children,
    data,
    loading = false,
    showHeader = true,
    showFooter = true
}: MobilePreviewContainerProps) {
    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Simulador de móvil con proporciones reales */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-4 shadow-2xl w-[375px] h-[812px] flex flex-col">
                {/* Header fijo */}
                {showHeader && (
                    <div className="flex-shrink-0 sticky top-0 z-10">
                        <HeaderPreview data={data} loading={loading} />
                    </div>
                )}

                {/* Contenido principal con scroll */}
                <div className="flex-1 overflow-y-auto">
                    {children}

                    {/* Footer dentro del contenido */}
                    {showFooter && (
                        <div className="mt-4">
                            <FooterPreview data={data} loading={loading} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
