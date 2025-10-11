'use client';

import React from 'react';

interface MobilePreviewContainerProps {
    children: React.ReactNode;
    footerText?: string;
}

export function MobilePreviewContainer({ children, footerText }: MobilePreviewContainerProps) {
    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Simulador de móvil con proporciones reales */}
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-4 shadow-2xl w-[375px] h-[812px] flex flex-col">
                {/* Contenido principal con scroll */}
                <div className="flex-1 overflow-y-auto space-y-4">
                    {children}

                    {/* Footer */}
                    {footerText && (
                        <div className="border-t border-zinc-700 pt-3 flex-shrink-0">
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
