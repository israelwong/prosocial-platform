"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { retryDatabaseOperation } from "@/lib/actions/utils/database-retry";

export interface TelefonoData {
    id: string;
    studio_id: string;
    numero: string;
    tipo: 'WHATSAPP' | 'LLAMADAS' | 'AMBOS';
    etiqueta?: string;
    is_active: boolean;
    order: number;
    created_at: Date;
    updated_at: Date;
}

export interface TelefonoFormData {
    numero: string;
    tipo: 'WHATSAPP' | 'LLAMADAS' | 'AMBOS';
    etiqueta?: string;
    is_active?: boolean;
}

/**
 * Crear un nuevo teléfono
 */
export async function crearTelefono(
    studioSlug: string,
    data: TelefonoFormData
) {
    try {
        console.log('➕ [crearTelefono] Creando teléfono para studio:', studioSlug);

        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // Obtener el siguiente orden
        const ultimoTelefono = await prisma.studio_phones.findFirst({
            where: { studio_id: studio.id },
            orderBy: { order: 'desc' }
        });

        const nuevoOrden = ultimoTelefono ? ultimoTelefono.order + 1 : 0;

        const telefono = await prisma.studio_phones.create({
            data: {
                studio_id: studio.id,
                number: data.numero,
                type: data.tipo,
                label: data.etiqueta,
                is_active: data.is_active ?? true,
                order: nuevoOrden
            }
        });

        revalidatePath(`/studio/${studioSlug}/builder/contacto`);
        console.log('✅ [crearTelefono] Teléfono creado exitosamente');
        return telefono;
    } catch (error) {
        console.error('❌ [crearTelefono] Error:', error);
        throw error;
    }
}

/**
 * Actualizar un teléfono existente
 */
export async function actualizarTelefono(
    telefonoId: string,
    data: Partial<TelefonoFormData>
) {
    try {
        console.log('✏️ [actualizarTelefono] Actualizando teléfono:', telefonoId);

        // Verificar que el teléfono existe antes de actualizarlo
        const telefonoExistente = await prisma.studio_phones.findUnique({
            where: { id: telefonoId }
        });

        if (!telefonoExistente) {
            console.warn('⚠️ [actualizarTelefono] Teléfono no encontrado:', telefonoId);
            throw new Error('Teléfono no encontrado');
        }

        const telefono = await prisma.studio_phones.update({
            where: { id: telefonoId },
            data: {
                number: data.numero,
                type: data.tipo,
                label: data.etiqueta,
                is_active: data.is_active
            }
        });

        console.log('✅ [actualizarTelefono] Teléfono actualizado exitosamente');
        return telefono;
    } catch (error) {
        console.error('❌ [actualizarTelefono] Error:', error);
        throw error;
    }
}

/**
 * Eliminar un teléfono
 */
export async function eliminarTelefono(telefonoId: string) {
    try {
        console.log('🗑️ [eliminarTelefono] Eliminando teléfono:', telefonoId);

        // Verificar que el teléfono existe antes de eliminarlo
        const telefono = await prisma.studio_phones.findUnique({
            where: { id: telefonoId }
        });

        if (!telefono) {
            console.warn('⚠️ [eliminarTelefono] Teléfono no encontrado:', telefonoId);
            return; // No lanzar error si no existe
        }

        await prisma.studio_phones.delete({
            where: { id: telefonoId }
        });

        console.log('✅ [eliminarTelefono] Teléfono eliminado exitosamente');
    } catch (error) {
        console.error('❌ [eliminarTelefono] Error:', error);
        throw error;
    }
}

/**
 * Reordenar teléfonos
 */
export async function reordenarTelefonos(
    studioSlug: string,
    telefonos: { id: string; order: number }[]
) {
    try {
        console.log('🔄 [reordenarTelefonos] Reordenando teléfonos para studio:', studioSlug);

        await retryDatabaseOperation(async () => {
            await prisma.$transaction(
                telefonos.map(telefono =>
                    prisma.studio_phones.update({
                        where: { id: telefono.id },
                        data: { order: telefono.order }
                    })
                )
            );
        });

        revalidatePath(`/studio/${studioSlug}/builder/contacto`);
        console.log('✅ [reordenarTelefonos] Teléfonos reordenados exitosamente');
    } catch (error) {
        console.error('❌ [reordenarTelefonos] Error:', error);
        throw error;
    }
}
