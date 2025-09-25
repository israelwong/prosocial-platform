"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { retryDatabaseOperation } from "@/lib/actions/utils/database-retry";
import {
    PersonalCreateSchema,
    PersonalUpdateSchema,
    PersonalFiltersSchema,
    type PersonalCreateForm,
    type PersonalUpdateForm,
    type PersonalFiltersForm,
} from "@/lib/actions/schemas/personal-schemas";

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

// Obtener todo el personal de un studio
export async function obtenerPersonalStudio(
    studioSlug: string,
    filters?: PersonalFiltersForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Validar filtros si se proporcionan
        const validatedFilters = filters ? PersonalFiltersSchema.parse(filters) : {};

        // 3. Construir where clause
        const whereClause: any = {
            projectId: studio.id,
        };

        if (validatedFilters.type) {
            whereClause.type = validatedFilters.type;
        }

        if (validatedFilters.isActive !== undefined) {
            whereClause.isActive = validatedFilters.isActive;
        }

        if (validatedFilters.search) {
            whereClause.OR = [
                { fullName: { contains: validatedFilters.search, mode: "insensitive" } },
                { email: { contains: validatedFilters.search, mode: "insensitive" } },
                { phone: { contains: validatedFilters.search, mode: "insensitive" } },
            ];
        }

        // 4. Obtener personal con perfiles profesionales
        const personal = await prisma.project_users.findMany({
            where: whereClause,
            include: {
                professional_profiles: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        profile: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                color: true,
                                icon: true,
                            }
                        },
                        description: true,
                        isActive: true,
                    },
                },
            },
            orderBy: [
                { type: "asc" },
                { fullName: "asc" },
            ],
        });

        // 5. Filtrar por perfil si se especifica
        let filteredPersonal = personal;
        if (validatedFilters.profile) {
            filteredPersonal = personal.filter(person =>
                person.professional_profiles.some(profile =>
                    profile.profile === validatedFilters.profile
                )
            );
        }

        return filteredPersonal;
    });
}

// Crear nuevo miembro del personal
export async function crearPersonal(
    studioSlug: string,
    data: PersonalCreateForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Validar datos
        const validatedData = PersonalCreateSchema.parse(data);

        // 3. Verificar que no existe otro usuario con el mismo email en este proyecto
        const existingUser = await prisma.project_users.findFirst({
            where: {
                projectId: studio.id,
                email: validatedData.email,
            },
        });

        if (existingUser) {
            throw new Error(`Ya existe una persona con el email ${validatedData.email} en tu equipo`);
        }

        // 4. Crear usuario y perfiles profesionales en una transacción
        const nuevoPersonal = await prisma.$transaction(async (tx) => {
            // Crear usuario
            const usuario = await tx.project_users.create({
                data: {
                    fullName: validatedData.fullName,
                    email: validatedData.email,
                    phone: validatedData.phone,
                    type: validatedData.type,
                    isActive: validatedData.isActive,
                    projectId: studio.id,
                    role: "user", // Role por defecto
                    status: "active", // Status por defecto
                },
            });

            // Crear perfiles profesionales
            const perfilesProfesionales = await Promise.all(
                validatedData.profiles.map(profileId =>
                    tx.project_user_professional_profiles.create({
                        data: {
                            userId: usuario.id,
                            profileId: profileId,
                            description: validatedData.profileDescriptions?.[profileId] || null,
                            isActive: true,
                        },
                    })
                )
            );

            return {
                ...usuario,
                professional_profiles: perfilesProfesionales,
            };
        });

        // 5. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/empleados`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/proveedores`);

        return nuevoPersonal;
    });
}

// Actualizar miembro del personal
export async function actualizarPersonal(
    studioSlug: string,
    personalId: string,
    data: PersonalUpdateForm
) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Validar datos
        const validatedData = PersonalUpdateSchema.parse(data);

        // 3. Verificar que el personal existe y pertenece al studio
        const existingPersonal = await prisma.project_users.findFirst({
            where: {
                id: personalId,
                projectId: studio.id,
            },
            include: {
                professional_profiles: true,
            },
        });

        if (!existingPersonal) {
            throw new Error("El miembro del personal que intentas actualizar no existe o no tienes permisos para modificarlo");
        }

        // 4. Si se proporciona email, verificar que no esté en uso por otro usuario
        if (validatedData.email && validatedData.email !== existingPersonal.email) {
            const existingEmail = await prisma.project_users.findFirst({
                where: {
                    projectId: studio.id,
                    email: validatedData.email,
                    id: { not: personalId },
                },
            });

            if (existingEmail) {
                throw new Error(`Ya existe otra persona con el email ${validatedData.email} en tu equipo`);
            }
        }

        // 5. Actualizar en transacción
        const personalActualizado = await prisma.$transaction(async (tx) => {
            // Actualizar datos básicos del usuario
            const usuario = await tx.project_users.update({
                where: { id: personalId },
                data: {
                    ...(validatedData.fullName && { fullName: validatedData.fullName }),
                    ...(validatedData.email && { email: validatedData.email }),
                    ...(validatedData.phone !== undefined && { phone: validatedData.phone }),
                    ...(validatedData.type && { type: validatedData.type }),
                    ...(validatedData.isActive !== undefined && { isActive: validatedData.isActive }),
                    updatedAt: new Date(),
                },
            });

            // Si se proporcionan nuevos perfiles, actualizar
            if (validatedData.profiles) {
                // Desactivar perfiles existentes
                await tx.project_user_professional_profiles.updateMany({
                    where: { userId: personalId },
                    data: { isActive: false },
                });

                // Crear o reactivar perfiles
                const perfilesProfesionales = await Promise.all(
                    validatedData.profiles.map(async (profile) => {
                        // Buscar si ya existe el perfil
                        const existingProfile = await tx.project_user_professional_profiles.findFirst({
                            where: {
                                userId: personalId,
                                profileId: profile,
                            },
                        });

                        if (existingProfile) {
                            // Reactivar y actualizar
                            return await tx.project_user_professional_profiles.update({
                                where: { id: existingProfile.id },
                                data: {
                                    isActive: true,
                                    description: validatedData.profileDescriptions?.[profile] || existingProfile.description,
                                    updatedAt: new Date(),
                                },
                            });
                        } else {
                            // Crear nuevo
                            return await tx.project_user_professional_profiles.create({
                                data: {
                                    userId: personalId,
                                    profileId: profile,
                                    description: validatedData.profileDescriptions?.[profile] || null,
                                    isActive: true,
                                },
                            });
                        }
                    })
                );

                return {
                    ...usuario,
                    professional_profiles: perfilesProfesionales,
                };
            }

            // Si no se actualizan perfiles, obtener los existentes
            const perfilesExistentes = await tx.project_user_professional_profiles.findMany({
                where: { userId: personalId, isActive: true },
            });

            return {
                ...usuario,
                professional_profiles: perfilesExistentes,
            };
        });

        // 6. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/empleados`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/proveedores`);

        return personalActualizado;
    });
}

// Eliminar miembro del personal
export async function eliminarPersonal(
    studioSlug: string,
    personalId: string
) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Verificar que el personal existe y pertenece al studio
        const existingPersonal = await prisma.project_users.findFirst({
            where: {
                id: personalId,
                projectId: studio.id,
            },
        });

        if (!existingPersonal) {
            throw new Error("El miembro del personal que intentas eliminar no existe o no tienes permisos para eliminarlo");
        }

        // 3. Verificar si el usuario tiene datos relacionados que impidan la eliminación
        const relatedData = await prisma.$transaction(async (tx) => {
            const [agenda, eventos, gastos, nominas, pagos, sesiones] = await Promise.all([
                tx.project_agenda.count({ where: { userId: personalId } }),
                tx.project_eventos.count({ where: { userId: personalId } }),
                tx.project_gastos.count({ where: { userId: personalId } }),
                tx.project_nominas.count({
                    where: {
                        OR: [
                            { userId: personalId },
                            { autorizado_por: personalId },
                            { pagado_por: personalId },
                        ]
                    }
                }),
                tx.project_pagos.count({ where: { userId: personalId } }),
                tx.project_sesiones.count({ where: { userId: personalId } }),
            ]);

            return { agenda, eventos, gastos, nominas, pagos, sesiones };
        });

        const totalRelations = Object.values(relatedData).reduce((sum, count) => sum + count, 0);

        if (totalRelations > 0) {
            // Si tiene datos relacionados, solo desactivar
            await prisma.$transaction(async (tx) => {
                await tx.project_users.update({
                    where: { id: personalId },
                    data: { isActive: false, updatedAt: new Date() },
                });

                await tx.project_user_professional_profiles.updateMany({
                    where: { userId: personalId },
                    data: { isActive: false, updatedAt: new Date() },
                });
            });
        } else {
            // Si no tiene datos relacionados, eliminar completamente
            await prisma.$transaction(async (tx) => {
                await tx.project_user_professional_profiles.deleteMany({
                    where: { userId: personalId },
                });

                await tx.project_users.delete({
                    where: { id: personalId },
                });
            });
        }

        // 4. Revalidar cache
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/empleados`);
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/personal/proveedores`);

        return {
            deleted: totalRelations === 0,
            deactivated: totalRelations > 0,
            relatedDataCount: totalRelations,
        };
    });
}

// Obtener estadísticas del personal
export async function obtenerEstadisticasPersonal(studioSlug: string) {
    return await retryDatabaseOperation(async () => {
        // 1. Verificar que el studio existe
        const studio = await getStudioBySlug(studioSlug);

        // 2. Obtener estadísticas
        const [totalEmpleados, totalProveedores, totalActivos, totalInactivos, perfilesPorTipo] = await Promise.all([
            prisma.project_users.count({
                where: { projectId: studio.id, type: "EMPLEADO" },
            }),
            prisma.project_users.count({
                where: { projectId: studio.id, type: "PROVEEDOR" },
            }),
            prisma.project_users.count({
                where: { projectId: studio.id, isActive: true },
            }),
            prisma.project_users.count({
                where: { projectId: studio.id, isActive: false },
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
            totalEmpleados,
            totalProveedores,
            totalPersonal: totalEmpleados + totalProveedores,
            totalActivos,
            totalInactivos,
            perfilesProfesionales: perfilesPorTipo.reduce((acc, item) => {
                acc[item.profileId] = item._count.profileId;
                return acc;
            }, {} as Record<string, number>),
        };
    });
}
