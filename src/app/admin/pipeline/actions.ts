'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createPipelineStage(formData: FormData) {
    try {
        const nombre = formData.get('nombre') as string;
        const descripcion = formData.get('descripcion') as string;
        const color = formData.get('color') as string;

        if (!nombre) {
            throw new Error('El nombre es requerido');
        }

        // Obtener el siguiente orden
        const lastStage = await prisma.platform_pipeline_stages.findFirst({
            orderBy: { orden: 'desc' }
        });
        const nextOrder = (lastStage?.orden || 0) + 1;

        const stage = await prisma.platform_pipeline_stages.create({
            data: {
                nombre,
                descripcion: descripcion || null,
                color: color || '#3B82F6',
                orden: nextOrder,
                isActive: true
            }
        });

        revalidatePath('/admin/pipeline');
        return { success: true, stage };
    } catch (error) {
        console.error('Error creating pipeline stage:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}

export async function updatePipelineStage(id: string, formData: FormData) {
    try {
        const nombre = formData.get('nombre') as string;
        const descripcion = formData.get('descripcion') as string;
        const color = formData.get('color') as string;

        if (!nombre) {
            throw new Error('El nombre es requerido');
        }

        const stage = await prisma.platform_pipeline_stages.update({
            where: { id },
            data: {
                nombre,
                descripcion: descripcion || null,
                color: color || '#3B82F6'
            }
        });

        revalidatePath('/admin/pipeline');
        return { success: true, stage };
    } catch (error) {
        console.error('Error updating pipeline stage:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}

export async function deletePipelineStage(id: string) {
    try {
        // Verificar si hay leads en esta etapa
        const leadCount = await prisma.platform_leads.count({
            where: { etapaId: id }
        });

        if (leadCount > 0) {
            throw new Error(`No se puede eliminar la etapa porque tiene ${leadCount} leads asignados`);
        }

        await prisma.platform_pipeline_stages.delete({
            where: { id }
        });

        revalidatePath('/admin/pipeline');
        return { success: true };
    } catch (error) {
        console.error('Error deleting pipeline stage:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}

export async function togglePipelineStageStatus(id: string) {
    try {
        const stage = await prisma.platform_pipeline_stages.findUnique({
            where: { id }
        });

        if (!stage) {
            throw new Error('Etapa no encontrada');
        }

        const updatedStage = await prisma.platform_pipeline_stages.update({
            where: { id },
            data: {
                isActive: !stage.isActive
            }
        });

        revalidatePath('/admin/pipeline');
        return { success: true, stage: updatedStage };
    } catch (error) {
        console.error('Error toggling pipeline stage status:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}

export async function reorderPipelineStages(stageIds: string[]) {
    try {
        // Actualizar el orden de todas las etapas
        const updatePromises = stageIds.map((id, index) =>
            prisma.platform_pipeline_stages.update({
                where: { id },
                data: { orden: index + 1 }
            })
        );

        await Promise.all(updatePromises);

        revalidatePath('/admin/pipeline');
        return { success: true };
    } catch (error) {
        console.error('Error reordering pipeline stages:', error);
        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}
