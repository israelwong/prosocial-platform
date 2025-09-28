'use server';

import { prisma } from '@/lib/prisma';
import {
    createPersonalSchema,
    updatePersonalSchema,
    createCategoriaPersonalSchema,
    updateCategoriaPersonalSchema,
    updateOrdenCategoriasSchema,
    createPerfilPersonalSchema,
    updatePerfilPersonalSchema,
    updateOrdenPerfilesSchema,
    type PersonalListResponse,
    type CategoriaPersonalListResponse,
    type PersonalResponse,
    type CategoriaPersonalResponse
} from '@/lib/actions/schemas/personal-schemas';

// =============================================================================
// SERVER ACTIONS PARA PERSONAL
// =============================================================================

/**
 * Obtener todo el personal de un proyecto
 */
export async function obtenerPersonal(studioSlug: string): Promise<PersonalListResponse> {
    try {
        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        const personal = await prisma.project_personal.findMany({
            where: { projectId: project.id },
            include: {
                categoria: {
                    select: {
                        id: true,
                        nombre: true,
                        tipo: true,
                        color: true,
                        icono: true
                    }
                },
                platformUser: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            },
            orderBy: [
                { categoria: { orden: 'asc' } },
                { nombre: 'asc' }
            ]
        });

        return { success: true, data: personal };
    } catch (error) {
        console.error('Error al obtener personal:', error);
        return { success: false, error: 'Error interno del servidor' };
    }
}

/**
 * Crear nuevo personal
 */
export async function crearPersonal(
    studioSlug: string,
    data: any
): Promise<PersonalResponse> {
    try {
        // Validar datos
        const validatedData = createPersonalSchema.parse(data);

        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        // Verificar que la categoría existe y pertenece al proyecto
        const categoria = await prisma.project_categorias_personal.findFirst({
            where: {
                id: validatedData.categoriaId,
                projectId: project.id
            }
        });

        if (!categoria) {
            return { success: false, error: 'Categoría no encontrada' };
        }

        // Crear personal
        const personal = await prisma.project_personal.create({
            data: {
                ...validatedData,
                projectId: project.id,
                email: validatedData.email || null,
                telefono: validatedData.telefono || null,
                platformUserId: validatedData.platformUserId || null,
                honorarios_fijos: validatedData.honorarios_fijos || null,
                honorarios_variables: validatedData.honorarios_variables || null,
                notas: validatedData.notas || null
            },
            include: {
                categoria: {
                    select: {
                        id: true,
                        nombre: true,
                        tipo: true,
                        color: true,
                        icono: true
                    }
                },
                platformUser: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            }
        });

        return { success: true, data: personal };
    } catch (error) {
        console.error('Error al crear personal:', error);
        if (error instanceof Error && error.name === 'ZodError') {
            return { success: false, error: 'Datos de entrada inválidos' };
        }
        return { success: false, error: 'Error interno del servidor' };
    }
}

/**
 * Actualizar personal existente
 */
export async function actualizarPersonal(
    studioSlug: string,
    personalId: string,
    data: any
): Promise<PersonalResponse> {
    try {
        // Validar datos
        const validatedData = updatePersonalSchema.parse({ ...data, id: personalId });

        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        // Verificar que el personal existe y pertenece al proyecto
        const existingPersonal = await prisma.project_personal.findFirst({
            where: {
                id: personalId,
                projectId: project.id
            }
        });

        if (!existingPersonal) {
            return { success: false, error: 'Personal no encontrado' };
        }

        // Si se está cambiando la categoría, verificar que existe
        if (validatedData.categoriaId) {
            const categoria = await prisma.project_categorias_personal.findFirst({
                where: {
                    id: validatedData.categoriaId,
                    projectId: project.id
                }
            });

            if (!categoria) {
                return { success: false, error: 'Categoría no encontrada' };
            }
        }

        // Actualizar personal
        const personal = await prisma.project_personal.update({
            where: { id: personalId },
            data: {
                ...validatedData,
                email: validatedData.email || null,
                telefono: validatedData.telefono || null,
                platformUserId: validatedData.platformUserId || null,
                honorarios_fijos: validatedData.honorarios_fijos || null,
                honorarios_variables: validatedData.honorarios_variables || null,
                notas: validatedData.notas || null
            },
            include: {
                categoria: {
                    select: {
                        id: true,
                        nombre: true,
                        tipo: true,
                        color: true,
                        icono: true
                    }
                },
                platformUser: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                        avatarUrl: true
                    }
                }
            }
        });

        return { success: true, data: personal };
    } catch (error) {
        console.error('Error al actualizar personal:', error);
        if (error instanceof Error && error.name === 'ZodError') {
            return { success: false, error: 'Datos de entrada inválidos' };
        }
        return { success: false, error: 'Error interno del servidor' };
    }
}

/**
 * Eliminar personal
 */
export async function eliminarPersonal(
    studioSlug: string,
    personalId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        // Verificar que el personal existe y pertenece al proyecto
        const existingPersonal = await prisma.project_personal.findFirst({
            where: {
                id: personalId,
                projectId: project.id
            }
        });

        if (!existingPersonal) {
            return { success: false, error: 'Personal no encontrado' };
        }

        // Eliminar personal
        await prisma.project_personal.delete({
            where: { id: personalId }
        });

        return { success: true };
    } catch (error) {
        console.error('Error al eliminar personal:', error);
        return { success: false, error: 'Error interno del servidor' };
    }
}

// =============================================================================
// SERVER ACTIONS PARA CATEGORÍAS DE PERSONAL
// =============================================================================

/**
 * Obtener categorías de personal de un proyecto
 */
export async function obtenerCategoriasPersonal(studioSlug: string): Promise<CategoriaPersonalListResponse> {
    try {
        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        const categorias = await prisma.project_categorias_personal.findMany({
            where: { projectId: project.id },
            include: {
                _count: {
                    select: {
                        personal: true
                    }
                }
            },
            orderBy: [
                { tipo: 'asc' },
                { orden: 'asc' },
                { nombre: 'asc' }
            ]
        });

        return { success: true, data: categorias };
    } catch (error) {
        console.error('Error al obtener categorías de personal:', error);
        return { success: false, error: 'Error interno del servidor' };
    }
}

/**
 * Crear nueva categoría de personal
 */
export async function crearCategoriaPersonal(
    studioSlug: string,
    data: any
): Promise<CategoriaPersonalResponse> {
    try {
        // Validar datos
        const validatedData = createCategoriaPersonalSchema.parse(data);

        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        // Verificar que no existe una categoría con el mismo nombre
        const existingCategoria = await prisma.project_categorias_personal.findFirst({
            where: {
                projectId: project.id,
                nombre: validatedData.nombre
            }
        });

        if (existingCategoria) {
            return { success: false, error: 'Ya existe una categoría con este nombre' };
        }

        // Crear categoría
        const categoria = await prisma.project_categorias_personal.create({
            data: {
                ...validatedData,
                projectId: project.id,
                descripcion: validatedData.descripcion || null,
                color: validatedData.color || null,
                icono: validatedData.icono || null
            },
            include: {
                _count: {
                    select: {
                        personal: true
                    }
                }
            }
        });

        return { success: true, data: categoria };
    } catch (error) {
        console.error('Error al crear categoría de personal:', error);
        if (error instanceof Error && error.name === 'ZodError') {
            return { success: false, error: 'Datos de entrada inválidos' };
        }
        return { success: false, error: 'Error interno del servidor' };
    }
}

/**
 * Actualizar categoría de personal
 */
export async function actualizarCategoriaPersonal(
    studioSlug: string,
    categoriaId: string,
    data: any
): Promise<CategoriaPersonalResponse> {
    try {
        // Validar datos
        const validatedData = updateCategoriaPersonalSchema.parse({ ...data, id: categoriaId });

        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        // Verificar que la categoría existe y pertenece al proyecto
        const existingCategoria = await prisma.project_categorias_personal.findFirst({
            where: {
                id: categoriaId,
                projectId: project.id
            }
        });

        if (!existingCategoria) {
            return { success: false, error: 'Categoría no encontrada' };
        }

        // Si se está cambiando el nombre, verificar que no existe otra con el mismo nombre
        if (validatedData.nombre && validatedData.nombre !== existingCategoria.nombre) {
            const duplicateCategoria = await prisma.project_categorias_personal.findFirst({
                where: {
                    projectId: project.id,
                    nombre: validatedData.nombre,
                    id: { not: categoriaId }
                }
            });

            if (duplicateCategoria) {
                return { success: false, error: 'Ya existe una categoría con este nombre' };
            }
        }

        // Actualizar categoría
        const categoria = await prisma.project_categorias_personal.update({
            where: { id: categoriaId },
            data: {
                ...validatedData,
                descripcion: validatedData.descripcion || null,
                color: validatedData.color || null,
                icono: validatedData.icono || null
            },
            include: {
                _count: {
                    select: {
                        personal: true
                    }
                }
            }
        });

        return { success: true, data: categoria };
    } catch (error) {
        console.error('Error al actualizar categoría de personal:', error);
        if (error instanceof Error && error.name === 'ZodError') {
            return { success: false, error: 'Datos de entrada inválidos' };
        }
        return { success: false, error: 'Error interno del servidor' };
    }
}

/**
 * Eliminar categoría de personal
 */
export async function eliminarCategoriaPersonal(
    studioSlug: string,
    categoriaId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        // Verificar que la categoría existe y pertenece al proyecto
        const existingCategoria = await prisma.project_categorias_personal.findFirst({
            where: {
                id: categoriaId,
                projectId: project.id
            },
            include: {
                _count: {
                    select: {
                        personal: true
                    }
                }
            }
        });

        if (!existingCategoria) {
            return { success: false, error: 'Categoría no encontrada' };
        }

        // Verificar que no hay personal asignado a esta categoría
        if (existingCategoria._count.personal > 0) {
            return { success: false, error: 'No se puede eliminar una categoría que tiene personal asignado' };
        }

        // No permitir eliminar categorías del sistema
        if (existingCategoria.esDefault) {
            return { success: false, error: 'No se puede eliminar una categoría del sistema' };
        }

        // Eliminar categoría
        await prisma.project_categorias_personal.delete({
            where: { id: categoriaId }
        });

        return { success: true };
    } catch (error) {
        console.error('Error al eliminar categoría de personal:', error);
        return { success: false, error: 'Error interno del servidor' };
    }
}

/**
 * Actualizar orden de categorías
 */
export async function actualizarOrdenCategoriasPersonal(
    studioSlug: string,
    data: any
): Promise<{ success: boolean; error?: string }> {
    try {
        // Validar datos
        const validatedData = updateOrdenCategoriasSchema.parse(data);

        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        // Actualizar orden de cada categoría
        await prisma.$transaction(
            validatedData.categorias.map(categoria =>
                prisma.project_categorias_personal.updateMany({
                    where: {
                        id: categoria.id,
                        projectId: project.id
                    },
                    data: {
                        orden: categoria.orden
                    }
                })
            )
        );

        return { success: true };
    } catch (error) {
        console.error('Error al actualizar orden de categorías:', error);
        if (error instanceof Error && error.name === 'ZodError') {
            return { success: false, error: 'Datos de entrada inválidos' };
        }
        return { success: false, error: 'Error interno del servidor' };
    }
}

// =============================================================================
// SERVER ACTIONS PARA PERFILES DE PERSONAL
// =============================================================================

/**
 * Obtener todos los perfiles de personal de un proyecto
 */
export async function obtenerPerfilesPersonal(studioSlug: string) {
    try {
        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        const perfiles = await prisma.project_perfiles_personal.findMany({
            where: { projectId: project.id },
            orderBy: { orden: 'asc' },
            include: {
                _count: {
                    select: {
                        personal_perfiles: true
                    }
                }
            }
        });

        return { success: true, data: perfiles };
    } catch (error) {
        console.error('Error al obtener perfiles:', error);
        return { success: false, error: 'Error interno del servidor' };
    }
}

/**
 * Crear un nuevo perfil de personal
 */
export async function crearPerfilPersonal(studioSlug: string, data: any) {
    try {
        // Validar datos
        const validatedData = createPerfilPersonalSchema.parse(data);

        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        const perfil = await prisma.project_perfiles_personal.create({
            data: {
                ...validatedData,
                projectId: project.id
            }
        });

        return { success: true, data: perfil };
    } catch (error) {
        console.error('Error al crear perfil:', error);
        if (error instanceof Error && error.name === 'ZodError') {
            return { success: false, error: 'Datos de entrada inválidos' };
        }
        return { success: false, error: 'Error interno del servidor' };
    }
}

/**
 * Actualizar un perfil de personal
 */
export async function actualizarPerfilPersonal(studioSlug: string, perfilId: string, data: any) {
    try {
        // Validar datos
        const validatedData = updatePerfilPersonalSchema.parse({ ...data, id: perfilId });

        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        const perfil = await prisma.project_perfiles_personal.update({
            where: {
                id: perfilId,
                projectId: project.id
            },
            data: validatedData
        });

        return { success: true, data: perfil };
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        if (error instanceof Error && error.name === 'ZodError') {
            return { success: false, error: 'Datos de entrada inválidos' };
        }
        return { success: false, error: 'Error interno del servidor' };
    }
}

/**
 * Eliminar un perfil de personal
 */
export async function eliminarPerfilPersonal(studioSlug: string, perfilId: string) {
    try {
        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        await prisma.project_perfiles_personal.delete({
            where: {
                id: perfilId,
                projectId: project.id
            }
        });

        return { success: true };
    } catch (error) {
        console.error('Error al eliminar perfil:', error);
        return { success: false, error: 'Error interno del servidor' };
    }
}

/**
 * Actualizar orden de perfiles
 */
export async function actualizarOrdenPerfilesPersonal(studioSlug: string, data: any) {
    try {
        // Validar datos
        const validatedData = updateOrdenPerfilesSchema.parse(data);

        // Buscar el proyecto por slug
        const project = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true }
        });

        if (!project) {
            return { success: false, error: 'Proyecto no encontrado' };
        }

        // Actualizar orden de cada perfil
        await Promise.all(
            validatedData.perfiles.map((perfil) =>
                prisma.project_perfiles_personal.update({
                    where: {
                        id: perfil.id,
                        projectId: project.id
                    },
                    data: { orden: perfil.orden }
                })
            )
        );

        return { success: true };
    } catch (error) {
        console.error('Error al actualizar orden de perfiles:', error);
        if (error instanceof Error && error.name === 'ZodError') {
            return { success: false, error: 'Datos de entrada inválidos' };
        }
        return { success: false, error: 'Error interno del servidor' };
    }
}