'use client';

import React from 'react';
import { useSetupStatus } from '@/hooks/use-setup-status';
import { SetupProgressHeader, SetupSectionsGrid, SetupRecommendations } from '@/components/setup';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface ConfiguracionPageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default function ConfiguracionPage({ params }: ConfiguracionPageProps) {
    const { slug } = React.use(params);
    const { setupStatus, loading, error, refresh } = useSetupStatus(slug);

    // Estados de carga y error simplificados
    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={refresh} />;
    }

    if (!setupStatus) {
        return <NoDataState onRetry={refresh} />;
    }

    return (
        <div className="space-y-8">
            <SetupProgressHeader
                overallProgress={setupStatus.overallProgress}
                isFullyConfigured={setupStatus.isFullyConfigured}
                projectName={setupStatus.project.name}
            />

            {/* <SetupRecommendations
                sections={setupStatus.sections}
                studioSlug={slug}
            /> */}

            <SetupSectionsGrid
                sections={setupStatus.sections}
                studioSlug={slug}
            />

            <div className="flex justify-center pt-4">
                <Button onClick={refresh} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualizar Estado
                </Button>
            </div>
        </div>
    );
}

// Componentes de estado simplificados
function LoadingState() {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-zinc-400">Cargando configuración...</span>
        </div>
    );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
    return (
        <div className="text-center py-12">
            <p className="text-red-400 mb-4">Error: {error}</p>
            <Button onClick={onRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
            </Button>
        </div>
    );
}

function NoDataState({ onRetry }: { onRetry: () => void }) {
    return (
        <div className="text-center py-12">
            <p className="text-zinc-400 mb-4">No se pudo cargar la configuración</p>
            <Button onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Cargar Configuración
            </Button>
        </div>
    );
}
