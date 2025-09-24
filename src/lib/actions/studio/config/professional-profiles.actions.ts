"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { retryDatabaseOperation } from "@/lib/actions/utils/database-retry";
import {
    ProfessionalProfileCreateSchema,
    ProfessionalProfileUpdateSchema,
    ProfessionalProfileFiltersSchema,
    UserProfileAssignmentSchema,
    DEFAULT_PROFESSIONAL_PROFILES,
    type ProfessionalProfileCreateForm,
    type ProfessionalProfileUpdateForm,
    type ProfessionalProfileFiltersForm,
    type UserProfileAssignmentForm,
} from "@/lib/actions/schemas/professional-profiles-schemas";

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
export async function obtenerPerfilesProfesionalesStudio(
    studioSlug: string,
    filters?: ProfessionalProfileFiltersForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Validar filtros si se proporcionan
        const validatedFilters = filters ? ProfessionalProfileFiltersSchema.parse(filters) : {};

        // 3. Construir where clause
        const whereClause: any = {
            projectId: studio.id,
        };

        if (validatedFilters.isActive !== undefined) {
            whereClause.isActive = validatedFilters.isActive;
        }

        if (validatedFilters.isDefault !== undefined) {
            whereClause.isDefault = validatedFilters.isDefault;
        }

        if (validatedFilters.search) {
            whereClause.OR = [
                { name: { contains: validatedFilters.search, mode: "insensitive" } },
                { description: { contains: validatedFilters.search, mode: "insensitive" } },
            ];
        }

        // 4. Obtener perfiles
        const perfiles = await prisma.project_professional_profiles.findMany({
            where: whereClause,
            orderBy: [
                { isDefault: "desc" },
                { order: "asc" },
                { name: "asc" },
            ],
        });

        return perfiles;
    });
}

// Crear nuevo perfil profesional
export async function crearPerfilProfesional(
    studioSlug: string,
    data: ProfessionalProfileCreateForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Validar datos
        const validatedData = ProfessionalProfileCreateSchema.parse(data);

        // 3. Verificar que no existe otro perfil con el mismo slug en este proyecto
        const existingProfile = await prisma.project_professional_profiles.findFirst({
            where: {
                projectId: studio.id,
                slug: validatedData.slug,
            },
        });

        if (existingProfile) {
            throw new Error(`Ya existe un perfil profesional con el slug "${validatedData.slug}" en tu proyecto`);
        }

        // 4. Crear perfil
        const nuevoPerfil = await prisma.project_professional_profiles.create({
            data: {
                ...validatedData,
                projectId: studio.id,
            },
        });

        // 5. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/empleados`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/proveedores`);

        return nuevoPerfil;
    });
}

// Actualizar perfil profesional
export async function actualizarPerfilProfesional(
    studioSlug: string,
    perfilId: string,
    data: ProfessionalProfileUpdateForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Validar datos
        const validatedData = ProfessionalProfileUpdateSchema.parse(data);

        // 3. Verificar que el perfil existe y pertenece al studio
        const existingPerfil = await prisma.project_professional_profiles.findFirst({
            where: {
                id: perfilId,
                projectId: studio.id,
            },
        });

        if (!existingPerfil) {
            throw new Error("El perfil profesional que intentas actualizar no existe o no tienes permisos para modificarlo");
        }

        // 4. Si se proporciona slug, verificar que no esté en uso por otro perfil
        if (validatedData.slug && validatedData.slug !== existingPerfil.slug) {
            const existingSlug = await prisma.project_professional_profiles.findFirst({
                where: {
                    projectId: studio.id,
                    slug: validatedData.slug,
                    id: { not: perfilId },
                },
            });

            if (existingSlug) {
                throw new Error(`Ya existe otro perfil profesional con el slug "${validatedData.slug}" en tu proyecto`);
            }
        }

        // 5. Actualizar perfil
        const perfilActualizado = await prisma.project_professional_profiles.update({
            where: { id: perfilId },
            data: {
                ...validatedData,
                updatedAt: new Date(),
            },
        });

        // 6. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/empleados`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/proveedores`);

        return perfilActualizado;
    });
}

// Eliminar perfil profesional
export async function eliminarPerfilProfesional(
    studioSlug: string,
    perfilId: string
) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Verificar que el perfil existe y pertenece al studio
        const existingPerfil = await prisma.project_professional_profiles.findFirst({
            where: {
                id: perfilId,
                projectId: studio.id,
            },
            include: {
                userProfiles: {
                    where: { isActive: true },
                },
            },
        });

        if (!existingPerfil) {
            throw new Error("El perfil profesional que intentas eliminar no existe o no tienes permisos para eliminarlo");
        }

        // 3. Verificar si es un perfil por defecto
        if (existingPerfil.isDefault) {
            throw new Error("No se pueden eliminar los perfiles profesionales del sistema");
        }

        // 4. Verificar si tiene usuarios asignados
        if (existingPerfil.userProfiles.length > 0) {
            throw new Error(`No se puede eliminar el perfil porque tiene ${existingPerfil.userProfiles.length} usuario(s) asignado(s). Primero desasigna los usuarios de este perfil.`);
        }

        // 5. Eliminar perfil
        await prisma.project_professional_profiles.delete({
            where: { id: perfilId },
        });

        // 6. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/empleados`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/proveedores`);

        return { deleted: true };
    });
}

// Inicializar perfiles por defecto para un studio
export async function inicializarPerfilesPorDefecto(studioSlug: string) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Verificar si ya tiene perfiles
        const existingProfiles = await prisma.project_professional_profiles.count({
            where: { projectId: studio.id },
        });

        if (existingProfiles > 0) {
            throw new Error("Este proyecto ya tiene perfiles profesionales configurados");
        }

        // 3. Crear perfiles por defecto
        const perfilesCreados = await prisma.project_professional_profiles.createMany({
            data: DEFAULT_PROFESSIONAL_PROFILES.map(perfil => ({
                ...perfil,
                projectId: studio.id,
            })),
        });

        // 4. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal`);

        return {
            created: perfilesCreados.count,
            profiles: DEFAULT_PROFESSIONAL_PROFILES.length
        };
    });
}

// Asignar perfiles a un usuario
export async function asignarPerfilesAUsuario(
    studioSlug: string,
    data: UserProfileAssignmentForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Validar datos
        const validatedData = UserProfileAssignmentSchema.parse(data);

        // 3. Verificar que el usuario existe y pertenece al studio
        const existingUser = await prisma.project_users.findFirst({
            where: {
                id: validatedData.userId,
                projectId: studio.id,
            },
        });

        if (!existingUser) {
            throw new Error("El usuario no existe o no tienes permisos para modificarlo");
        }

        // 4. Verificar que todos los perfiles existen y pertenecen al studio
        const perfiles = await prisma.project_professional_profiles.findMany({
            where: {
                id: { in: validatedData.profileIds },
                projectId: studio.id,
                isActive: true,
            },
        });

        if (perfiles.length !== validatedData.profileIds.length) {
            throw new Error("Uno o más perfiles no existen o no están disponibles");
        }

        // 5. Actualizar asignaciones en transacción
        const resultado = await prisma.$transaction(async (tx) => {
            // Desactivar perfiles existentes del usuario
            await tx.project_user_professional_profiles.updateMany({
                where: { userId: validatedData.userId },
                data: { isActive: false },
            });

            // Crear o reactivar perfiles asignados
            const asignaciones = await Promise.all(
                validatedData.profileIds.map(async (profileId) => {
                    const existingAssignment = await tx.project_user_professional_profiles.findFirst({
                        where: {
                            userId: validatedData.userId,
                            profileId: profileId,
                        },
                    });

                    if (existingAssignment) {
                        // Reactivar asignación existente
                        return await tx.project_user_professional_profiles.update({
                            where: { id: existingAssignment.id },
                            data: {
                                isActive: true,
                                description: validatedData.descriptions?.[profileId] || existingAssignment.description,
                                updatedAt: new Date(),
                            },
                        });
                    } else {
                        // Crear nueva asignación
                        return await tx.project_user_professional_profiles.create({
                            data: {
                                userId: validatedData.userId,
                                profileId: profileId,
                                description: validatedData.descriptions?.[profileId] || null,
                                isActive: true,
                            },
                        });
                    }
                })
            );

            return asignaciones;
        });

        // 6. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/empleados`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/proveedores`);

        return resultado;
    });
}

// Obtener estadísticas de perfiles profesionales
export async function obtenerEstadisticasPerfilesProfesionales(studioSlug: string) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Obtener estadísticas
        const [
            totalPerfiles,
            perfilesActivos,
            perfilesPorDefecto,
            perfilesPersonalizados,
            asignacionesPorPerfil,
        ] = await Promise.all([
            prisma.project_professional_profiles.count({
                where: { projectId: studio.id },
            }),
            prisma.project_professional_profiles.count({
                where: { projectId: studio.id, isActive: true },
            }),
            prisma.project_professional_profiles.count({
                where: { projectId: studio.id, isDefault: true },
            }),
            prisma.project_professional_profiles.count({
                where: { projectId: studio.id, isDefault: false },
            }),
            prisma.project_professional_profiles.groupBy({
                by: ["id", "name"],
                where: {
                    projectId: studio.id,
                    isActive: true,
                    userProfiles: {
                        some: { isActive: true },
                    },
                },
                _count: {
                    userProfiles: {
                        where: { isActive: true },
                    },
                },
                orderBy: { name: "asc" },
            }),
        ]);

        return {
            totalPerfiles,
            perfilesActivos,
            perfilesPorDefecto,
            perfilesPersonalizados,
            asignacionesPorPerfil: asignacionesPorPerfil.map(item => ({
                id: item.id,
                name: item.name,
                count: item._count.userProfiles,
            })),
        };
    });
}
