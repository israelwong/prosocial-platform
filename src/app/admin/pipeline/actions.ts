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
        let lastStage;
        let nextOrder = 0;

        try {
            lastStage = await prisma.platform_pipeline_stages.findFirst({
                orderBy: { orden: 'desc' }
            });
            nextOrder = (lastStage?.orden || 0) + 1;
        } catch (orderError) {
            console.warn('No se pudo obtener el último orden, usando 0:', orderError);
            nextOrder = 0;
        }

        const stage = await prisma.platform_pipeline_stages.create({
            data: {
                nombre,
                descripcion: descripcion || null,
                color: color || '#3B82F6',
                orden: nextOrder,
                isActive: true,
                updatedAt: new Date()
            }
        });

        revalidatePath('/admin/pipeline');
        return { success: true, stage };
    } catch (error) {
        console.error('Error creating pipeline stage:', error);

        // Manejar errores de conexión específicos
        if (error instanceof Error && (
            error.message.includes('Can\'t reach database server') ||
            error.message.includes('P1001') ||
            error.message.includes('connection') ||
            error.message.includes('PrismaClientInitializationError')
        )) {
            return {
                success: false,
                error: 'Error de conexión con la base de datos. Verifica tu conexión a internet e intenta nuevamente.'
            };
        }

        // Manejar errores de validación específicos
        if (error instanceof Error && error.message.includes('Argument')) {
            return {
                success: false,
                error: 'Error en los datos proporcionados. Verifica que todos los campos requeridos estén completos.'
            };
        }

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
                color: color || '#3B82F6',
                updatedAt: new Date()
            }
        });

        revalidatePath('/admin/pipeline');
        return { success: true, stage };
    } catch (error) {
        console.error('Error updating pipeline stage:', error);

        // Manejar errores de conexión específicos
        if (error instanceof Error && (
            error.message.includes('Can\'t reach database server') ||
            error.message.includes('P1001') ||
            error.message.includes('connection')
        )) {
            return {
                success: false,
                error: 'Error de conexión con la base de datos. Por favor, intenta nuevamente.'
            };
        }

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

        // Manejar errores de conexión específicos
        if (error instanceof Error && (
            error.message.includes('Can\'t reach database server') ||
            error.message.includes('P1001') ||
            error.message.includes('connection')
        )) {
            return {
                success: false,
                error: 'Error de conexión con la base de datos. Por favor, intenta nuevamente.'
            };
        }

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
                isActive: !stage.isActive,
                updatedAt: new Date()
            }
        });

        revalidatePath('/admin/pipeline');
        return { success: true, stage: updatedStage };
    } catch (error) {
        console.error('Error toggling pipeline stage status:', error);

        // Manejar errores de conexión específicos
        if (error instanceof Error && (
            error.message.includes('Can\'t reach database server') ||
            error.message.includes('P1001') ||
            error.message.includes('connection')
        )) {
            return {
                success: false,
                error: 'Error de conexión con la base de datos. Por favor, intenta nuevamente.'
            };
        }

        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}

export async function reorderPipelineStages(stageIds: string[]) {
    try {
        console.log('🔄 Reordenando etapas:', stageIds);

        // Verificar que las etapas existan antes de actualizar
        const existingStages = await prisma.platform_pipeline_stages.findMany({
            where: { id: { in: stageIds } },
            select: { id: true, nombre: true }
        });

        console.log('📋 Etapas existentes:', existingStages);

        if (existingStages.length !== stageIds.length) {
            const missingIds = stageIds.filter(id => !existingStages.find(stage => stage.id === id));
            console.error('❌ Etapas no encontradas:', missingIds);
            throw new Error(`No se encontraron ${missingIds.length} etapas: ${missingIds.join(', ')}`);
        }

        // Función para actualizar una etapa con reintentos específicos para P1001
        const updateStageWithRetry = async (id: string, orden: number, maxRetries = 5) => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    console.log(`🔄 Actualizando etapa ${id} (orden: ${orden}) - Intento ${attempt}/${maxRetries}`);
                    return await prisma.platform_pipeline_stages.update({
                        where: { id },
                        data: {
                            orden,
                            updatedAt: new Date()
                        }
                    });
                } catch (error: unknown) {
                    // Solo reintentar si es error de conectividad P1001
                    const prismaError = error as { code?: string; message?: string };
                    if (prismaError.code === 'P1001' && attempt < maxRetries) {
                        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Backoff exponencial, máximo 5s
                        console.warn(`⚠️ Error P1001 en intento ${attempt} para etapa ${id}, reintentando en ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                        continue;
                    }
                    // Si no es P1001 o se agotaron los intentos, lanzar error
                    throw error;
                }
            }
        };

        // Actualizar el orden de todas las etapas SECUENCIALMENTE para evitar saturar Supabase
        const results = [];
        for (let i = 0; i < stageIds.length; i++) {
            const id = stageIds[i];
            const orden = i + 1;
            
            try {
                console.log(`🔄 Actualizando etapa ${id} (orden: ${orden}) - Secuencial ${i + 1}/${stageIds.length}`);
                const result = await updateStageWithRetry(id, orden);
                results.push({ status: 'fulfilled', value: result });
            } catch (error) {
                console.error(`❌ Error actualizando etapa ${id}:`, error);
                results.push({ status: 'rejected', reason: error });
            }
        }

        // Verificar si alguna actualización falló
        const failedUpdates = results.filter(result => result.status === 'rejected');
        if (failedUpdates.length > 0) {
            console.error('❌ Algunas actualizaciones de orden fallaron después de reintentos:', failedUpdates);
            // Log detallado de errores
            failedUpdates.forEach((failed, index) => {
                console.error(`  ${index + 1}. ID: ${stageIds[index]}, Error:`, failed.reason);
            });

            // Si todas fallaron por P1001, es un problema de conectividad general
            const allP1001 = failedUpdates.every(failed =>
                failed.reason?.code === 'P1001' ||
                failed.reason?.message?.includes('Can\'t reach database server')
            );

            if (allP1001) {
                throw new Error('Error de conectividad con la base de datos. Verifica tu conexión a internet e intenta nuevamente.');
            }

            throw new Error(`Error al actualizar el orden de ${failedUpdates.length} etapas`);
        }

        console.log('✅ Reordenamiento completado exitosamente');

        revalidatePath('/admin/pipeline');
        return { success: true };
    } catch (error) {
        console.error('Error reordering pipeline stages:', error);

        // Manejar errores de conexión específicos
        if (error instanceof Error && (
            error.message.includes('Can\'t reach database server') ||
            error.message.includes('P1001') ||
            error.message.includes('connection') ||
            error.message.includes('PrismaClientInitializationError')
        )) {
            return {
                success: false,
                error: 'Error de conexión con la base de datos. Verifica tu conexión e intenta nuevamente.'
            };
        }

        // Manejar errores de etapas no encontradas
        if (error instanceof Error && error.message.includes('No se encontraron')) {
            return {
                success: false,
                error: 'Algunas etapas no se encontraron en la base de datos. Recarga la página e intenta nuevamente.'
            };
        }

        // Manejar errores de actualización específicos
        if (error instanceof Error && error.message.includes('actualizar el orden')) {
            return {
                success: false,
                error: 'Error al actualizar el orden de algunas etapas. Intenta nuevamente.'
            };
        }

        return { success: false, error: error instanceof Error ? error.message : 'Error desconocido' };
    }
}
