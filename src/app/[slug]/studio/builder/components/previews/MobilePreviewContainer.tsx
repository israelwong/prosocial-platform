'use client';

import React from 'react';

interface MobilePreviewContainerProps {
    children: React.ReactNode;
    footerText?: string;
}

export function MobilePreviewContainer({ children, footerText }: MobilePreviewContainerProps) {
    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Simulador de móvil */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-4 shadow-2xl">
                {/* Header del móvil */}
                <div className="flex items-center justify-between mb-6">
                    <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
                    <div className="w-6 h-1 bg-zinc-600 rounded-full"></div>
                    <div className="w-8 h-8 bg-zinc-700 rounded-full"></div>
                </div>

                {/* Contenido principal */}
                <div className="space-y-6">
                    {children}

                    {/* Footer */}
                    {footerText && (
                        <div className="border-t border-zinc-700 pt-4">
                            <p className="text-zinc-400 text-xs leading-relaxed text-center">
                                {footerText}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
