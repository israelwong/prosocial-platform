"use server";

import { prisma } from "@/lib/prisma";
import { retryDatabaseOperation } from "@/lib/actions/utils/database-retry";
import { revalidatePath } from "next/cache";
import {
    HorarioCreateSchema,
    HorarioUpdateSchema,
    HorarioToggleSchema,
    type HorarioCreateForm,
    type HorarioUpdateForm,
    type HorarioToggleForm,
} from "@/lib/actions/schemas/horarios-schemas";

// Crear nuevo horario
export async function crearHorario(studioSlug: string, data: HorarioCreateForm) {
    try {
        console.log('➕ [crearHorario] Creando horario para studio:', studioSlug, 'con datos:', data);

        // Validar datos
        const validatedData = HorarioCreateSchema.parse(data);

        // Obtener studio
        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // Crear horario usando el nuevo schema
        const horario = await retryDatabaseOperation(async () => {
            return await prisma.studio_business_hours.create({
                data: {
                    studio_id: studio.id,
                    day_of_week: validatedData.day_of_week,
                    start_time: validatedData.start_time,
                    end_time: validatedData.end_time,
                    is_active: validatedData.is_active,
                    order: validatedData.order || 0,
                },
                select: {
                    id: true,
                    day_of_week: true,
                    start_time: true,
                    end_time: true,
                    is_active: true,
                    order: true,
                    created_at: true,
                    updated_at: true,
                },
            });
        });

        console.log('✅ [crearHorario] Horario creado:', horario);

        // Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/studio/horarios`);

        return horario;
    } catch (error) {
        console.error('❌ [crearHorario] Error:', error);
        throw new Error("Error al crear el horario");
    }
}

// Actualizar horario
export async function actualizarHorario(id: string, data: HorarioUpdateForm) {
    try {
        console.log('✏️ [actualizarHorario] Actualizando horario:', id, 'con datos:', data);

        // Validar datos
        const validatedData = HorarioUpdateSchema.parse(data);

        // Actualizar horario usando el nuevo schema
        const horario = await retryDatabaseOperation(async () => {
            return await prisma.studio_business_hours.update({
                where: { id },
                data: {
                    day_of_week: validatedData.day_of_week,
                    start_time: validatedData.start_time,
                    end_time: validatedData.end_time,
                    is_active: validatedData.is_active,
                    order: validatedData.order,
                },
                select: {
                    id: true,
                    day_of_week: true,
                    start_time: true,
                    end_time: true,
                    is_active: true,
                    order: true,
                    created_at: true,
                    updated_at: true,
                },
            });
        });

        console.log('✅ [actualizarHorario] Horario actualizado:', horario);

        // Revalidar cache
        revalidatePath(`/studio/${data.studio_slug}/configuracion/studio/horarios`);

        return horario;
    } catch (error) {
        console.error('❌ [actualizarHorario] Error:', error);
        throw new Error("Error al actualizar el horario");
    }
}

// Toggle estado del horario
export async function toggleHorarioEstado(id: string, data: HorarioToggleForm) {
    try {
        console.log('🔄 [toggleHorarioEstado] Toggle horario:', id, 'activo:', data.is_active);

        // Validar datos
        const validatedData = HorarioToggleSchema.parse(data);

        // Actualizar estado usando el nuevo schema
        const horario = await retryDatabaseOperation(async () => {
            return await prisma.studio_business_hours.update({
                where: { id },
                data: {
                    is_active: validatedData.is_active,
                },
                select: {
                    id: true,
                    day_of_week: true,
                    start_time: true,
                    end_time: true,
                    is_active: true,
                    order: true,
                    created_at: true,
                    updated_at: true,
                },
            });
        });

        console.log('✅ [toggleHorarioEstado] Estado actualizado:', horario);

        // Revalidar cache
        revalidatePath(`/studio/${data.studio_slug}/configuracion/studio/horarios`);

        return horario;
    } catch (error) {
        console.error('❌ [toggleHorarioEstado] Error:', error);
        throw new Error("Error al cambiar el estado del horario");
    }
}

// Inicializar horarios por defecto
export async function inicializarHorariosPorDefecto(studioSlug: string) {
    try {
        console.log('🚀 [inicializarHorariosPorDefecto] Inicializando horarios para studio:', studioSlug);

        // Obtener studio
        const studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // Verificar si ya existen horarios
        const existingHorarios = await prisma.studio_business_hours.count({
            where: { studio_id: studio.id },
        });

        if (existingHorarios > 0) {
            console.log('ℹ️ [inicializarHorariosPorDefecto] Ya existen horarios, saltando inicialización');
            return;
        }

        // Crear horarios por defecto
        const diasSemana = [
            { day: 'monday', name: 'Lunes' },
            { day: 'tuesday', name: 'Martes' },
            { day: 'wednesday', name: 'Miércoles' },
            { day: 'thursday', name: 'Jueves' },
            { day: 'friday', name: 'Viernes' },
            { day: 'saturday', name: 'Sábado' },
            { day: 'sunday', name: 'Domingo' },
        ];

        const horariosPorDefecto = diasSemana.map((dia, index) => ({
            studio_id: studio.id,
            day_of_week: dia.day,
            start_time: '09:00',
            end_time: '18:00',
            is_active: index < 5, // Lunes a Viernes activos por defecto
            order: index,
        }));

        await retryDatabaseOperation(async () => {
            await prisma.studio_business_hours.createMany({
                data: horariosPorDefecto,
            });
        });

        console.log('✅ [inicializarHorariosPorDefecto] Horarios inicializados:', horariosPorDefecto.length);

        // Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/studio/horarios`);

        return horariosPorDefecto;
    } catch (error) {
        console.error('❌ [inicializarHorariosPorDefecto] Error:', error);
        throw new Error("Error al inicializar los horarios por defecto");
    }
}