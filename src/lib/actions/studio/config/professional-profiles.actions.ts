"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { retryDatabaseOperation } from "@/lib/actions/utils/database-retry";
import { z } from "zod";

// Schema para crear perfil profesional
const ProfessionalProfileCreateSchema = z.object({
    name: z.string().min(1, "El nombre es requerido").max(50, "El nombre es muy largo"),
    slug: z.string().min(1, "El slug es requerido").max(50, "El slug es muy largo"),
    description: z.string().optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color debe ser un hex válido").optional(),
    icon: z.string().optional(),
    isActive: z.boolean().default(true),
    order: z.number().default(0),
});

// Schema para actualizar perfil profesional
const ProfessionalProfileUpdateSchema = z.object({
    id: z.string().min(1, "ID requerido"),
    name: z.string().min(1, "El nombre es requerido").max(50, "El nombre es muy largo").optional(),
    slug: z.string().min(1, "El slug es requerido").max(50, "El slug es muy largo").optional(),
    description: z.string().optional(),
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color debe ser un hex válido").optional(),
    icon: z.string().optional(),
    isActive: z.boolean().optional(),
    order: z.number().optional(),
});

// Schema para eliminar perfil profesional
const ProfessionalProfileDeleteSchema = z.object({
    id: z.string().min(1, "ID requerido"),
});

// Tipos TypeScript
export type ProfessionalProfileCreateForm = z.infer<typeof ProfessionalProfileCreateSchema>;
export type ProfessionalProfileUpdateForm = z.infer<typeof ProfessionalProfileUpdateSchema>;
export type ProfessionalProfileDeleteForm = z.infer<typeof ProfessionalProfileDeleteSchema>;

// Función auxiliar para obtener el studio por slug
async function getStudioBySlug(studioSlug: string) {
    const studio = await prisma.projects.findUnique({
        where: { slug: studioSlug },
        select: { id: true, slug: true },
    });

    if (!studio) {
        throw new Error("Studio no encontrado");
    }

    return studio;
}

// Obtener todos los perfiles profesionales de un studio
export async function obtenerPerfilesProfesionalesStudio(studioSlug: string) {
    return await retryDatabaseOperation(async () => {
        const studio = await getStudioBySlug(studioSlug);

        const perfiles = await prisma.project_professional_profiles.findMany({
            where: { projectId: studio.id },
            orderBy: [
                { isDefault: 'desc' }, // Perfiles del sistema primero
                { order: 'asc' },
                { name: 'asc' }
            ],
        });

        return perfiles;
    });
}

// Obtener estadísticas de perfiles profesionales
export async function obtenerEstadisticasPerfilesProfesionales(studioSlug: string) {
    return await retryDatabaseOperation(async () => {
        const studio = await getStudioBySlug(studioSlug);

        const [totalPerfiles, perfilesActivos, asignacionesPorPerfil] = await Promise.all([
            prisma.project_professional_profiles.count({
                where: { projectId: studio.id },
            }),
            prisma.project_professional_profiles.count({
                where: { projectId: studio.id, isActive: true },
            }),
            prisma.project_user_professional_profiles.groupBy({
                by: ["profileId"],
                where: {
                    user: { projectId: studio.id },
                    isActive: true,
                },
                _count: { profileId: true },
            }),
        ]);

        return {
            totalPerfiles,
            perfilesActivos,
            totalInactivos: totalPerfiles - perfilesActivos,
            asignacionesPorPerfil: asignacionesPorPerfil.reduce((acc, item) => {
                acc[item.profileId] = item._count.profileId;
                return acc;
            }, {} as Record<string, number>),
        };
    });
}

// Crear nuevo perfil profesional
export async function crearPerfilProfesional(
    studioSlug: string,
    data: ProfessionalProfileCreateForm
) {
    return await retryDatabaseOperation(async () => {
        const studio = await getStudioBySlug(studioSlug);
        const validatedData = ProfessionalProfileCreateSchema.parse(data);

        // Verificar que el slug no exista
        const existingProfile = await prisma.project_professional_profiles.findFirst({
            where: {
                projectId: studio.id,
                slug: validatedData.slug,
            },
        });

        if (existingProfile) {
            throw new Error("Ya existe un perfil con ese slug");
        }

        const perfil = await prisma.project_professional_profiles.create({
            data: {
                ...validatedData,
                projectId: studio.id,
                isDefault: false, // Los perfiles creados por el usuario no son del sistema
            },
        });

        // Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/perfiles`);

        return perfil;
    });
}

// Actualizar perfil profesional
export async function actualizarPerfilProfesional(
    studioSlug: string,
    perfilId: string,
    data: ProfessionalProfileUpdateForm
) {
    return await retryDatabaseOperation(async () => {
        const studio = await getStudioBySlug(studioSlug);
        const validatedData = ProfessionalProfileUpdateSchema.parse({ ...data, id: perfilId });

        // Verificar que el perfil existe y pertenece al studio
        const existingProfile = await prisma.project_professional_profiles.findFirst({
            where: {
                id: perfilId,
                projectId: studio.id,
            },
        });

        if (!existingProfile) {
            throw new Error("El perfil que intentas actualizar no existe o no tienes permisos para modificarlo");
        }

        // Si se está cambiando el slug, verificar que no exista otro
        if (validatedData.slug && validatedData.slug !== existingProfile.slug) {
            const duplicateSlug = await prisma.project_professional_profiles.findFirst({
                where: {
                    projectId: studio.id,
                    slug: validatedData.slug,
                    id: { not: perfilId },
                },
            });

            if (duplicateSlug) {
                throw new Error("Ya existe un perfil con ese slug");
            }
        }

        const perfil = await prisma.project_professional_profiles.update({
            where: { id: perfilId },
            data: {
                ...validatedData,
                updatedAt: new Date(),
            },
        });

        // Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/perfiles`);

        return perfil;
    });
}

// Eliminar perfil profesional
export async function eliminarPerfilProfesional(studioSlug: string, perfilId: string) {
    return await retryDatabaseOperation(async () => {
        const studio = await getStudioBySlug(studioSlug);

        // Verificar que el perfil existe y pertenece al studio
        const existingProfile = await prisma.project_professional_profiles.findFirst({
            where: {
                id: perfilId,
                projectId: studio.id,
            },
        });

        if (!existingProfile) {
            throw new Error("El perfil que intentas eliminar no existe o no tienes permisos para eliminarlo");
        }

        // Verificar si tiene asignaciones activas
        const asignacionesActivas = await prisma.project_user_professional_profiles.count({
            where: {
                profileId: perfilId,
                isActive: true,
            },
        });

        if (asignacionesActivas > 0) {
            // En lugar de eliminar, desactivar
            const perfilDesactivado = await prisma.project_professional_profiles.update({
                where: { id: perfilId },
                data: {
                    isActive: false,
                    updatedAt: new Date(),
                },
            });

            return {
                deleted: false,
                deactivated: true,
                perfil: perfilDesactivado,
                message: `El perfil ha sido desactivado porque tiene ${asignacionesActivas} asignaciones activas`,
            };
        }

        // Si no tiene asignaciones, eliminar completamente
        await prisma.project_professional_profiles.delete({
            where: { id: perfilId },
        });

        // Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/perfiles`);

        return {
            deleted: true,
            deactivated: false,
            perfil: existingProfile,
            message: "Perfil eliminado exitosamente",
        };
    });
}

// Toggle estado activo/inactivo
export async function togglePerfilProfesionalEstado(studioSlug: string, perfilId: string) {
    return await retryDatabaseOperation(async () => {
        const studio = await getStudioBySlug(studioSlug);

        const perfil = await prisma.project_professional_profiles.findFirst({
            where: {
                id: perfilId,
                projectId: studio.id,
            },
        });

        if (!perfil) {
            throw new Error("Perfil no encontrado");
        }

        const perfilActualizado = await prisma.project_professional_profiles.update({
            where: { id: perfilId },
            data: {
                isActive: !perfil.isActive,
                updatedAt: new Date(),
            },
        });

        // Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/perfiles`);

        return perfilActualizado;
    });
}

// Inicializar perfiles del sistema
export async function inicializarPerfilesSistema(studioSlug: string) {
    return await retryDatabaseOperation(async () => {
        const studio = await getStudioBySlug(studioSlug);

        // Verificar si ya existen perfiles del sistema
        const perfilesExistentes = await prisma.project_professional_profiles.count({
            where: {
                projectId: studio.id,
                isDefault: true,
            },
        });

        if (perfilesExistentes > 0) {
            throw new Error("Los perfiles del sistema ya han sido inicializados");
        }

        const perfilesIniciales = [
            { name: "Fotógrafo", slug: "fotografo", color: "#3B82F6", icon: "Camera", order: 1 },
            { name: "Asistente de Producción", slug: "asistente-produccion", color: "#10B981", icon: "User", order: 2 },
            { name: "Camarógrafo", slug: "camarografo", color: "#8B5CF6", icon: "Video", order: 3 },
            { name: "Editor de Video", slug: "editor-video", color: "#F59E0B", icon: "Edit", order: 4 },
            { name: "Retocador de Fotos", slug: "retocador-fotos", color: "#EF4444", icon: "Image", order: 5 },
            { name: "Operador de Dron", slug: "operador-dron", color: "#06B6D4", icon: "Zap", order: 6 },
        ];

        const perfilesCreados = await prisma.project_professional_profiles.createMany({
            data: perfilesIniciales.map(perfil => ({
                ...perfil,
                projectId: studio.id,
                isDefault: true,
                isActive: true,
                description: `Perfil profesional de ${perfil.name.toLowerCase()}`,
            })),
        });

        // Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/perfiles`);

        return {
            count: perfilesCreados.count,
            perfiles: perfilesIniciales,
        };
    });
}