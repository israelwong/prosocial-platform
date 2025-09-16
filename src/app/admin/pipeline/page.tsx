import React from 'react';
import { prisma } from '@/lib/prisma';
import { PipelinePageClient } from './components/PipelinePageClient';

interface PipelineStage {
    id: string;
    name: string;
    description: string | null;
    color: string;
    order: number;
    isActive: boolean;
    leadCount: number;
}

// Función para obtener las etapas del pipeline desde la base de datos
async function getPipelineStages(): Promise<PipelineStage[]> {
    try {
        const stages = await prisma.platform_pipeline_stages.findMany({
            include: {
                _count: {
                    select: {
                        platform_leads: true
                    }
                }
            },
            orderBy: {
                orden: 'asc'
            }
        });

        return stages.map(stage => ({
            id: stage.id,
            name: stage.nombre,
            description: stage.descripcion,
            color: stage.color,
            order: stage.orden,
            isActive: stage.isActive,
            leadCount: stage._count.platform_leads
        }));
    } catch (error) {
        console.error('Error fetching pipeline stages:', error);

        let errorMessage = 'Error de conexión a la base de datos';

        if (error instanceof Error) {
            if (error.message.includes('permission denied')) {
                errorMessage = 'Permisos insuficientes para acceder a los datos del pipeline.';
            } else if (error.message.includes('Tenant or user not found')) {
                errorMessage = 'Credenciales de base de datos incorrectas.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Tiempo de espera agotado al cargar el pipeline.';
            } else {
                errorMessage = `Error de base de datos: ${error.message}`;
            }
        }

        throw new Error(errorMessage);
    }
}

export default async function PipelinePage() {
    let pipelineStages: PipelineStage[] = [];
    let error: string | null = null;

    try {
        pipelineStages = await getPipelineStages();
    } catch (err) {
        error = err instanceof Error ? err.message : 'Error desconocido al cargar el pipeline';
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Pipeline de Ventas</h1>
                        <p className="text-muted-foreground">
                            Gestiona las etapas del proceso de ventas
                        </p>
                    </div>
                </div>

                {/* Error State */}
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-red-400 font-medium mb-2">Error al cargar pipeline</h3>
                            <p className="text-red-300 text-sm mb-3">{error}</p>
                            <div className="text-red-300 text-sm space-y-1">
                                <p><strong>Posibles soluciones:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Verifica que las variables de entorno estén configuradas correctamente</li>
                                    <li>Confirma que el modelo prosocial_pipeline_stages existe en la base de datos</li>
                                    <li>Revisa las políticas RLS en la tabla prosocial_pipeline_stages</li>
                                    <li>Intenta recargar la página</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <PipelinePageClient stages={pipelineStages} />;
}