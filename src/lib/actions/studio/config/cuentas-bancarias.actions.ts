"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
    CuentaBancariaCreateSchema,
    CuentaBancariaUpdateSchema,
    CuentaBancariaDeleteSchema,
    type CuentaBancariaCreateForm,
    type CuentaBancariaUpdateForm,
    type CuentaBancariaDeleteForm,
} from "@/lib/actions/schemas/cuentas-bancarias-schemas";

// Obtener cuentas bancarias del studio
export async function obtenerCuentasBancariasStudio(studioSlug: string) {
    try {
        const studio = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        const cuentas = await prisma.project_cuentas_bancarias.findMany({
            where: { projectId: studio.id },
            orderBy: [
                { esPrincipal: 'desc' },
                { createdAt: 'desc' }
            ],
        });

        return cuentas;
    } catch (error) {
        console.error('Error al obtener cuentas bancarias:', error);
        throw new Error("Error al cargar las cuentas bancarias");
    }
}

// Obtener estadísticas de cuentas bancarias
export async function obtenerEstadisticasCuentasBancarias(studioSlug: string) {
    try {
        const studio = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        const cuentas = await prisma.project_cuentas_bancarias.findMany({
            where: { projectId: studio.id },
        });

        const stats = {
            total: cuentas.length,
            activas: cuentas.filter(c => c.activo).length,
            inactivas: cuentas.filter(c => !c.activo).length,
            principales: cuentas.filter(c => c.esPrincipal).length,
        };

        return stats;
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        throw new Error("Error al cargar las estadísticas");
    }
}

// Crear nueva cuenta bancaria
export async function crearCuentaBancaria(
    studioSlug: string,
    data: CuentaBancariaCreateForm
) {
    try {
        const studio = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        const validatedData = CuentaBancariaCreateSchema.parse(data);

        // Si se marca como principal, desmarcar las demás
        if (validatedData.esPrincipal) {
            await prisma.project_cuentas_bancarias.updateMany({
                where: { projectId: studio.id },
                data: { esPrincipal: false },
            });
        }

        const nuevaCuenta = await prisma.project_cuentas_bancarias.create({
            data: {
                projectId: studio.id,
                ...validatedData,
            },
        });

        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/cuentas-bancarias`);
        return nuevaCuenta;
    } catch (error) {
        console.error('Error al crear cuenta bancaria:', error);
        throw new Error("Error al crear la cuenta bancaria");
    }
}

// Actualizar cuenta bancaria existente
export async function actualizarCuentaBancaria(
    cuentaId: string,
    data: CuentaBancariaUpdateForm
) {
    try {
        const validatedData = CuentaBancariaUpdateSchema.parse(data);

        // Si se marca como principal, desmarcar las demás
        if (validatedData.esPrincipal) {
            const cuenta = await prisma.project_cuentas_bancarias.findUnique({
                where: { id: cuentaId },
                select: { projectId: true },
            });

            if (cuenta) {
                await prisma.project_cuentas_bancarias.updateMany({
                    where: { projectId: cuenta.projectId },
                    data: { esPrincipal: false },
                });
            }
        }

        const cuentaActualizada = await prisma.project_cuentas_bancarias.update({
            where: { id: cuentaId },
            data: validatedData,
        });

        revalidatePath(`/studio/[slug]/configuracion/negocio/cuentas-bancarias`);
        return cuentaActualizada;
    } catch (error) {
        console.error('Error al actualizar cuenta bancaria:', error);
        throw new Error("Error al actualizar la cuenta bancaria");
    }
}

// Eliminar cuenta bancaria
export async function eliminarCuentaBancaria(cuentaId: string) {
    try {
        await prisma.project_cuentas_bancarias.delete({
            where: { id: cuentaId },
        });

        revalidatePath(`/studio/[slug]/configuracion/negocio/cuentas-bancarias`);
        return { success: true };
    } catch (error) {
        console.error('Error al eliminar cuenta bancaria:', error);
        throw new Error("Error al eliminar la cuenta bancaria");
    }
}

// Toggle estado activo/inactivo
export async function toggleCuentaBancariaEstado(
    cuentaId: string,
    data: { id: string; activo: boolean }
) {
    try {
        const cuentaActualizada = await prisma.project_cuentas_bancarias.update({
            where: { id: cuentaId },
            data: { activo: data.activo },
        });

        revalidatePath(`/studio/[slug]/configuracion/negocio/cuentas-bancarias`);
        return cuentaActualizada;
    } catch (error) {
        console.error('Error al cambiar estado de cuenta bancaria:', error);
        throw new Error("Error al cambiar el estado de la cuenta bancaria");
    }
}
