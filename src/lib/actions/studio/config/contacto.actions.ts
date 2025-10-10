"use server";

import { prisma } from "@/lib/prisma";
import { retryDatabaseOperation } from "@/lib/actions/utils/database-retry";
import { revalidatePath } from "next/cache";
import {
    TelefonoCreateSchema,
    TelefonoUpdateSchema,
    TelefonosBulkUpdateSchema,
    TelefonoToggleSchema,
    TelefonosFiltersSchema,
    ContactoDataUpdateSchema,
    ContactoDataBulkUpdateSchema,
    type TelefonoCreateForm,
    type TelefonoUpdateForm,
    type TelefonosBulkUpdateForm,
    type TelefonoToggleForm,
    type TelefonosFiltersForm,
    type ContactoDataUpdateForm,
    type ContactoDataBulkUpdateForm,
} from "@/lib/actions/schemas/contacto-schemas";

// Obtener datos de contacto del studio
export async function obtenerContactoStudio(studioSlug: string) {
    try {
        console.log('🔍 [obtenerContactoStudio] Buscando studio con slug:', studioSlug);

        // 1. Obtener studio
        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: {
                id: true,
                studio_name: true,
                slug: true,
                address: true,
                website: true,
            },
        });

        console.log('🏢 [obtenerContactoStudio] Studio encontrado:', studio);

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // 2. Obtener teléfonos del studio
        const telefonos = await prisma.studio_phones.findMany({
            where: { studio_id: studio.id },
            select: {
                id: true,
                studio_id: true,
                number: true,
                type: true,
                is_active: true,
                order: true,
                created_at: true,
                updated_at: true,
            },
            orderBy: { order: "asc" },
        });

        console.log('📞 [obtenerContactoStudio] Telefonos encontrados:', telefonos);

        // 3. Transformar datos
        const contactoData = {
            direccion: studio.address || "",
            website: studio.website || "",
        };

        console.log('📍 [obtenerContactoStudio] Contacto data:', contactoData);

        return {
            contactoData,
            telefonos,
        };
    } catch (error) {
        console.error('❌ [obtenerContactoStudio] Error:', error);
        throw error;
    }
}

// Obtener teléfonos del studio con filtros
export async function obtenerTelefonosStudio(
    studioSlug: string,
    filters?: TelefonosFiltersForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Obtener studio
        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true, studio_name: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // 2. Construir filtros
        const whereClause: {
            studio_id: string;
            is_active?: boolean; // Actualizado: activo → is_active
            type?: string; // Actualizado: tipo → type
        } = {
            studio_id: studio.id,
        };

        if (filters) {
            const validatedFilters = TelefonosFiltersSchema.parse(filters);

            if (validatedFilters.is_active !== undefined) { // Actualizado: activo → is_active
                whereClause.is_active = validatedFilters.is_active; // Actualizado: activo → is_active
            }

            if (validatedFilters.type) { // Actualizado: tipo → type
                whereClause.type = validatedFilters.type; // Actualizado: tipo → type
            }
        }

        // 3. Obtener teléfonos
        const telefonos = await prisma.studio_phones.findMany({
            where: whereClause,
            orderBy: { created_at: "asc" },
        });

        return telefonos;
    });
}

// Crear teléfono
export async function crearTelefono(
    studioSlug: string,
    data: TelefonoCreateForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Obtener studio
        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // 2. Validar datos
        const validatedData = TelefonoCreateSchema.parse(data);

        // 3. Verificar si ya existe un teléfono del mismo tipo activo
        // Solo para tipo "principal" limitamos a uno activo
        if (validatedData.type === "principal") { // Actualizado: tipo → type
            const existingTelefono = await prisma.studio_phones.findFirst({
                where: {
                    studio_id: studio.id,
                    type: "principal",
                    is_active: true,
                },
            });

            if (existingTelefono && validatedData.is_active) { // Actualizado: activo → is_active
                throw new Error("Ya tienes un teléfono principal activo. Desactiva el existente o elige otro tipo.");
            }
        }

        // 4. Crear teléfono
        const nuevoTelefono = await prisma.studio_phones.create({
            data: {
                studio_id: studio.id,
                number: validatedData.number, // Actualizado: numero → number
                type: validatedData.type, // Actualizado: tipo → type
                is_active: validatedData.is_active, // Actualizado: activo → is_active
            },
        });

        // 5. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/studio/contacto`);

        return nuevoTelefono;
    });
}

// Actualizar teléfono
export async function actualizarTelefono(
    telefonoId: string,
    data: TelefonoUpdateForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Validar datos
        const validatedData = TelefonoUpdateSchema.parse(data);

        // 2. Obtener teléfono existente
        const existingTelefono = await prisma.studio_phones.findUnique({
            where: { id: telefonoId },
            include: {
                studio: { select: { slug: true } },
            },
        });

        if (!existingTelefono) {
            throw new Error("Teléfono no encontrado");
        }

        // 3. Actualizar teléfono
        const telefonoActualizado = await prisma.studio_phones.update({
            where: { id: telefonoId },
            data: {
                ...(validatedData.number && { number: validatedData.number }), // Actualizado: numero → number
                ...(validatedData.type && { type: validatedData.type }), // Actualizado: tipo → type
                ...(validatedData.is_active !== undefined && { is_active: validatedData.is_active }), // Actualizado: activo → is_active
            },
        });

        // 4. Revalidar cache
        revalidatePath(`/studio/${existingTelefono.studio.slug}/configuracion/studio/contacto`);

        return telefonoActualizado;
    });
}

// Actualizar múltiples teléfonos
export async function actualizarTelefonosBulk(
    studioSlug: string,
    data: TelefonosBulkUpdateForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Obtener studio
        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // 2. Validar datos
        const validatedData = TelefonosBulkUpdateSchema.parse(data);

        // 3. Actualizar todos los teléfonos en una transacción
        const resultados = await prisma.$transaction(
            validatedData.telefonos.map((telefono) =>
                prisma.studio_phones.update({
                    where: { id: telefono.id },
                    data: {
                        ...(telefono.number && { number: telefono.number }), // Actualizado: numero → number
                        ...(telefono.type && { type: telefono.type }), // Actualizado: tipo → type
                        ...(telefono.is_active !== undefined && { is_active: telefono.is_active }), // Actualizado: activo → is_active
                    },
                })
            )
        );

        // 4. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/studio/contacto`);

        return resultados;
    });
}

// Toggle estado de teléfono
export async function toggleTelefonoEstado(
    telefonoId: string,
    data: TelefonoToggleForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Validar datos
        const validatedData = TelefonoToggleSchema.parse(data);

        // 2. Obtener teléfono existente
        const existingTelefono = await prisma.studio_phones.findUnique({
            where: { id: telefonoId },
            include: {
                studio: { select: { slug: true } },
            },
        });

        if (!existingTelefono) {
            throw new Error("Teléfono no encontrado");
        }

        // 3. Actualizar estado
        const telefonoActualizado = await prisma.studio_phones.update({
            where: { id: telefonoId },
            data: { is_active: validatedData.is_active }, // Actualizado: activo → is_active
        });

        // 4. Revalidar cache
        revalidatePath(`/studio/${existingTelefono.studio.slug}/configuracion/studio/contacto`);

        return telefonoActualizado;
    });
}

// Eliminar teléfono
export async function eliminarTelefono(telefonoId: string) {
    return await retryDatabaseOperation(async () => {
        // 1. Obtener teléfono existente
        const existingTelefono = await prisma.studio_phones.findUnique({
            where: { id: telefonoId },
            include: {
                studio: { select: { slug: true } },
            },
        });

        if (!existingTelefono) {
            throw new Error("Teléfono no encontrado");
        }

        // 2. Eliminar teléfono
        await prisma.studio_phones.delete({
            where: { id: telefonoId },
        });

        // 3. Revalidar cache
        revalidatePath(`/studio/${existingTelefono.studio.slug}/configuracion/studio/contacto`);

        return { success: true };
    });
}

// Actualizar datos de contacto (dirección y website)
export async function actualizarContactoData(
    studioSlug: string,
    data: ContactoDataUpdateForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Validar datos
        const validatedData = ContactoDataUpdateSchema.parse(data);

        // 2. Mapear campos del frontend a la base de datos
        const dbField = validatedData.field === "direccion" ? "address" : "website";

        // 3. Actualizar studio
        const studio = await prisma.studios.update({
            where: { slug: studioSlug },
            data: {
                [dbField]: validatedData.value,
            },
            select: {
                id: true,
                slug: true,
                address: true,
                website: true,
            },
        });

        // 4. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/studio/contacto`);

        return {
            direccion: studio.address || "",
            website: studio.website || "",
        };
    });
}

// Actualizar múltiples campos de contacto
export async function actualizarContactoDataBulk(
    studioSlug: string,
    data: ContactoDataBulkUpdateForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Validar datos
        const validatedData = ContactoDataBulkUpdateSchema.parse(data);

        // 2. Actualizar studio
        const studio = await prisma.studios.update({
            where: { slug: studioSlug },
            data: {
                ...(validatedData.direccion !== undefined && { address: validatedData.direccion }),
                ...(validatedData.website !== undefined && { website: validatedData.website }),
            },
            select: {
                id: true,
                slug: true,
                address: true,
                website: true,
            },
        });

        // 3. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/studio/contacto`);

        return {
            direccion: studio.address || "",
            website: studio.website || "",
        };
    });
}

// Obtener estadísticas de contacto
export async function obtenerEstadisticasContacto(studioSlug: string) {
    return await retryDatabaseOperation(async () => {
        // 1. Obtener studio
        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // 2. Obtener estadísticas
        const [totalTelefonos, telefonosActivos, telefonosInactivos] = await Promise.all([
            prisma.studio_phones.count({
                where: { studio_id: studio.id },
            }),
            prisma.studio_phones.count({
                where: { studio_id: studio.id, is_active: true },
            }),
            prisma.studio_phones.count({
                where: { studio_id: studio.id, is_active: false },
            }),
        ]);

        // 3. Obtener teléfonos por tipo
        const telefonosPorTipo = await prisma.studio_phones.findMany({
            where: { studio_id: studio.id },
            select: { type: true, is_active: true },
        });

        const tiposCount = telefonosPorTipo.reduce((acc: Record<string, number>, telefono: { type: string; is_active: boolean }) => {
            acc[telefono.type] = (acc[telefono.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalTelefonos,
            telefonosActivos,
            telefonosInactivos,
            porcentajeActivos: totalTelefonos > 0 ? Math.round((telefonosActivos / totalTelefonos) * 100) : 0,
            tiposCount,
        };
    });
}

// Validar número de teléfono
export async function validarTelefono(numero: string) {
    return await retryDatabaseOperation(async () => {
        // Validación básica del formato
        const telefonoRegex = /^[\+]?[0-9\s\-\(\)]+$/;
        const isValid = telefonoRegex.test(numero) && numero.length >= 7 && numero.length <= 20;

        return {
            isValid,
            formatted: numero.replace(/[^\d\+]/g, ''),
            suggestions: isValid ? [] : [
                "El número debe contener solo dígitos, espacios, guiones y paréntesis",
                "El número debe tener entre 7 y 20 caracteres",
                "Considera agregar el código de país (+52 para México)"
            ],
        };
    });
}

// Reordenar teléfonos
export async function reordenarTelefonos(studioSlug: string, telefonos: Array<{ id: string; order: number }>) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // 2. Actualizar el orden de cada teléfono
        const updatePromises = telefonos.map(({ id, order }) =>
            prisma.studio_phones.update({
                where: {
                    id,
                    studio_id: studio.id // Asegurar que pertenece al studio
                },
                data: { order },
            })
        );

        await Promise.all(updatePromises);

        // 3. Revalidar la página
        revalidatePath(`/studio/${studioSlug}/configuracion/estudio/contacto`);

        return {
            success: true,
            message: "Orden de teléfonos actualizado exitosamente",
        };
    });
}
