'use client';

import React from 'react';
import { SectionPreview } from './SectionPreview';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { Type } from 'lucide-react';

interface SectionLayoutProps {
    children: React.ReactNode;
    section: string;
    studioSlug: string;
    data?: Record<string, unknown>;
    loading?: boolean;
}

export function SectionLayout({ children, section, studioSlug, data, loading = false }: SectionLayoutProps) {
    return (
        <div className="space-y-8">
            {/* Main Content Grid - Editor + Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna 1 - Editor */}
                <div className="space-y-6">
                    {children}
                </div>

                {/* Columna 2 - Preview Mobile (solo desktop) */}
                <div className="hidden lg:block lg:sticky lg:top-4 space-y-6">
                    <ZenCard variant="default" padding="none">
                        <ZenCardHeader className="border-b border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-600/20 rounded-lg">
                                    <Type className="h-5 w-5 text-purple-400" />
                                </div>
                                <div>
                                    <ZenCardTitle>Vista Previa Mobile</ZenCardTitle>
                                    <ZenCardDescription>
                                        Cómo se verá tu perfil digital
                                    </ZenCardDescription>
                                </div>
                            </div>
                        </ZenCardHeader>
                        <ZenCardContent className="p-6">
                            {loading ? (
                                <div className="h-96 bg-zinc-800/50 rounded-lg animate-pulse flex items-center justify-center">
                                    <span className="text-zinc-400">Cargando vista previa...</span>
                                </div>
                            ) : (
                                <SectionPreview
                                    section={section}
                                    studioSlug={studioSlug}
                                    data={data}
                                    loading={loading}
                                />
                            )}
                        </ZenCardContent>
                    </ZenCard>
                </div>
            </div>
        </div>
    );
}
