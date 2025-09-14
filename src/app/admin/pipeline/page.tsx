import React from 'react';
import { prisma } from '@/lib/prisma';
import { PipelinePageClient } from './components/PipelinePageClient';

// Función para obtener las etapas del pipeline desde la base de datos
async function getPipelineStages() {
    try {
        const stages = await prisma.proSocialPipelineStage.findMany({
            include: {
                _count: {
                    select: {
                        leads: true
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
            leadCount: stage._count.leads
        }));
    } catch (error) {
        console.error('Error fetching pipeline stages:', error);
        return [];
    }
}

export default async function PipelinePage() {
    const pipelineStages = await getPipelineStages();

    return <PipelinePageClient stages={pipelineStages} />;
}