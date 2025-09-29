'use server';

import { prisma } from '@/lib/prisma';
import {
    SeccionSchema,
    CategoriaSchema,
    ServicioSchema,
    ActualizarOrdenSchema,
    ActualizarOrdenSeccionesSchema,
    ActualizarOrdenCategoriasSchema,
    type SeccionData,
    type CategoriaData,
    type ServicioData,
    type ActionResponse,
} from '@/lib/actions/schemas/catalogo-schemas';
import { revalidatePath } from 'next/cache';

// =====================================================
// UTILIDADES
// =====================================================

/**
 * Obtener studioId desde el slug
 */
async function getStudioIdFromSlug(slug: string): Promise<string | null> {
    const studio = await prisma.projects.findUnique({
        where: { slug },
        select: { id: true },
    });
    return studio?.id || null;
}

/**
 * Revalidar rutas del catálogo
 */
function revalidateCatalogo(slug: string) {
    revalidatePath(`/studio/${slug}/configuracion/catalogo`);
}

// =====================================================
// SECCIONES
// =====================================================

/**
 * Obtener todas las secciones con categorías y servicios
 */
export async function obtenerCatalogo(
    studioSlug: string
): Promise<ActionResponse<SeccionData[]>> {
    try {
        const studioId = await getStudioIdFromSlug(studioSlug);
        if (!studioId) {
            return { success: false, error: 'Estudio no encontrado' };
        }

        const secciones = await prisma.project_servicio_secciones.findMany({
            include: {
                seccion_categorias: {
                    include: {
                        servicio_categorias: {
                            include: {
                                servicios: {
                                    where: {
                                        studioId,
                                        status: 'active',
                                    },
                                    include: {
                                        servicio_gastos: true,
                                    },
                                    orderBy: { orden: 'asc' },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { orden: 'asc' },
        });

        // Transformar datos a estructura plana
        const catalogoData: SeccionData[] = secciones.map((seccion) => ({
            id: seccion.id,
            nombre: seccion.nombre,
            descripcion: seccion.descripcion,
            orden: seccion.orden,
            createdAt: seccion.createdAt,
            updatedAt: seccion.updatedAt,
            categorias: seccion.seccion_categorias.map((sc) => ({
                id: sc.servicio_categorias.id,
                nombre: sc.servicio_categorias.nombre,
                orden: sc.servicio_categorias.orden,
                createdAt: sc.servicio_categorias.createdAt,
                updatedAt: sc.servicio_categorias.updatedAt,
                seccionId: seccion.id,
                servicios: sc.servicio_categorias.servicios.map((s) => ({
                    id: s.id,
                    studioId: s.studioId,
                    servicioCategoriaId: s.servicioCategoriaId,
                    nombre: s.nombre,
                    costo: s.costo,
                    gasto: s.gasto,
                    utilidad: s.utilidad,
                    precio_publico: s.precio_publico,
                    tipo_utilidad: s.tipo_utilidad,
                    orden: s.orden,
                    status: s.status,
                    createdAt: s.createdAt,
                    updatedAt: s.updatedAt,
                    gastos: s.servicio_gastos.map((g) => ({
                        id: g.id,
                        nombre: g.nombre,
                        costo: g.costo,
                    })),
                })),
            })),
        }));

        return { success: true, data: catalogoData };
    } catch (error) {
        console.error('Error obteniendo catálogo:', error);
        return {
            success: false,
            error: 'Error al obtener el catálogo',
        };
    }
}

/**
 * Obtener solo las secciones (sin categorías ni servicios)
 */
export async function obtenerSecciones(
    studioSlug: string
): Promise<ActionResponse<SeccionData[]>> {
    try {
        const secciones = await prisma.project_servicio_secciones.findMany({
            orderBy: { orden: 'asc' },
        });

        const seccionesData: SeccionData[] = secciones.map((s) => ({
            id: s.id,
            nombre: s.nombre,
            descripcion: s.descripcion,
            orden: s.orden,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
            categorias: [],
        }));

        return { success: true, data: seccionesData };
    } catch (error) {
        console.error('Error obteniendo secciones:', error);
        return {
            success: false,
            error: 'Error al obtener las secciones',
        };
    }
}

/**
 * Crear una nueva sección
 */
export async function crearSeccion(
    studioSlug: string,
    data: unknown
): Promise<ActionResponse<SeccionData>> {
    try {
        // Validar datos
        const validatedData = SeccionSchema.parse(data);

        // Obtener el siguiente número de orden
        const ultimaSeccion = await prisma.project_servicio_secciones.findFirst({
            orderBy: { orden: 'desc' },
            select: { orden: true },
        });

        const nuevoOrden = ultimaSeccion ? ultimaSeccion.orden + 1 : 0;

        // Crear sección
        const seccion = await prisma.project_servicio_secciones.create({
            data: {
                nombre: validatedData.nombre,
                descripcion: validatedData.descripcion,
                orden: nuevoOrden,
            },
        });

        revalidateCatalogo(studioSlug);

        return {
            success: true,
            data: {
                id: seccion.id,
                nombre: seccion.nombre,
                descripcion: seccion.descripcion,
                orden: seccion.orden,
                createdAt: seccion.createdAt,
                updatedAt: seccion.updatedAt,
                categorias: [],
            },
        };
    } catch (error) {
        console.error('Error creando sección:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al crear la sección',
        };
    }
}

/**
 * Actualizar una sección existente
 */
export async function actualizarSeccion(
    studioSlug: string,
    seccionId: string,
    data: unknown
): Promise<ActionResponse<SeccionData>> {
    try {
        // Validar datos (parcial para permitir updates parciales)
        const validatedData = SeccionSchema.partial().parse(data);

        const seccion = await prisma.project_servicio_secciones.update({
            where: { id: seccionId },
            data: validatedData,
        });

        revalidateCatalogo(studioSlug);

        return {
            success: true,
            data: {
                id: seccion.id,
                nombre: seccion.nombre,
                descripcion: seccion.descripcion,
                orden: seccion.orden,
                createdAt: seccion.createdAt,
                updatedAt: seccion.updatedAt,
                categorias: [],
            },
        };
    } catch (error) {
        console.error('Error actualizando sección:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al actualizar la sección',
        };
    }
}

/**
 * Eliminar una sección (solo si no tiene categorías)
 */
export async function eliminarSeccion(
    studioSlug: string,
    seccionId: string
): Promise<ActionResponse<boolean>> {
    try {
        // Verificar si tiene categorías
        const seccion = await prisma.project_servicio_secciones.findUnique({
            where: { id: seccionId },
            include: {
                seccion_categorias: true,
            },
        });

        if (!seccion) {
            return { success: false, error: 'Sección no encontrada' };
        }

        if (seccion.seccion_categorias.length > 0) {
            return {
                success: false,
                error: 'No se puede eliminar una sección con categorías',
            };
        }

        await prisma.project_servicio_secciones.delete({
            where: { id: seccionId },
        });

        revalidateCatalogo(studioSlug);

        return { success: true, data: true };
    } catch (error) {
        console.error('Error eliminando sección:', error);
        return {
            success: false,
            error: 'Error al eliminar la sección',
        };
    }
}

/**
 * Actualizar orden de múltiples secciones
 */
export async function actualizarOrdenSecciones(
    studioSlug: string,
    data: unknown
): Promise<ActionResponse<boolean>> {
    try {
        const validatedData = ActualizarOrdenSeccionesSchema.parse(data);

        // Actualizar en batch
        await Promise.all(
            validatedData.secciones.map((seccion) =>
                prisma.project_servicio_secciones.update({
                    where: { id: seccion.id },
                    data: { orden: seccion.orden },
                })
            )
        );

        revalidateCatalogo(studioSlug);

        return { success: true, data: true };
    } catch (error) {
        console.error('Error actualizando orden de secciones:', error);
        return {
            success: false,
            error: 'Error al actualizar el orden',
        };
    }
}

// =====================================================
// CATEGORÍAS
// =====================================================

/**
 * Obtener todas las categorías
 */
export async function obtenerCategorias(
    studioSlug: string
): Promise<ActionResponse<CategoriaData[]>> {
    try {
        const categorias = await prisma.project_servicio_categorias.findMany({
            include: {
                seccion_categorias: {
                    select: {
                        seccionId: true,
                    },
                },
            },
            orderBy: { orden: 'asc' },
        });

        const categoriasData: CategoriaData[] = categorias.map((c) => ({
            id: c.id,
            nombre: c.nombre,
            orden: c.orden,
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            seccionId: c.seccion_categorias?.seccionId,
            servicios: [],
        }));

        return { success: true, data: categoriasData };
    } catch (error) {
        console.error('Error obteniendo categorías:', error);
        return {
            success: false,
            error: 'Error al obtener las categorías',
        };
    }
}

/**
 * Crear una nueva categoría y asignarla a una sección
 */
export async function crearCategoria(
    studioSlug: string,
    data: unknown,
    seccionId: string
): Promise<ActionResponse<CategoriaData>> {
    try {
        const validatedData = CategoriaSchema.parse(data);

        // Obtener el siguiente número de orden
        const ultimaCategoria =
            await prisma.project_servicio_categorias.findFirst({
                orderBy: { orden: 'desc' },
                select: { orden: true },
            });

        const nuevoOrden = ultimaCategoria ? ultimaCategoria.orden + 1 : 0;

        // Crear categoría con relación a sección
        const categoria = await prisma.project_servicio_categorias.create({
            data: {
                nombre: validatedData.nombre,
                orden: nuevoOrden,
                seccion_categorias: {
                    create: {
                        seccionId,
                    },
                },
            },
        });

        revalidateCatalogo(studioSlug);

        return {
            success: true,
            data: {
                id: categoria.id,
                nombre: categoria.nombre,
                orden: categoria.orden,
                createdAt: categoria.createdAt,
                updatedAt: categoria.updatedAt,
                seccionId,
                servicios: [],
            },
        };
    } catch (error) {
        console.error('Error creando categoría:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al crear la categoría',
        };
    }
}

/**
 * Actualizar una categoría existente
 */
export async function actualizarCategoria(
    studioSlug: string,
    categoriaId: string,
    data: unknown
): Promise<ActionResponse<CategoriaData>> {
    try {
        const validatedData = CategoriaSchema.partial().parse(data);

        const categoria = await prisma.project_servicio_categorias.update({
            where: { id: categoriaId },
            data: validatedData,
            include: {
                seccion_categorias: {
                    select: {
                        seccionId: true,
                    },
                },
            },
        });

        revalidateCatalogo(studioSlug);

        return {
            success: true,
            data: {
                id: categoria.id,
                nombre: categoria.nombre,
                orden: categoria.orden,
                createdAt: categoria.createdAt,
                updatedAt: categoria.updatedAt,
                seccionId: categoria.seccion_categorias?.seccionId,
                servicios: [],
            },
        };
    } catch (error) {
        console.error('Error actualizando categoría:', error);
        return {
            success: false,
            error: 'Error al actualizar la categoría',
        };
    }
}

/**
 * Eliminar una categoría (solo si no tiene servicios)
 */
export async function eliminarCategoria(
    studioSlug: string,
    categoriaId: string
): Promise<ActionResponse<boolean>> {
    try {
        // Verificar si tiene servicios
        const categoria = await prisma.project_servicio_categorias.findUnique({
            where: { id: categoriaId },
            include: {
                servicios: true,
            },
        });

        if (!categoria) {
            return { success: false, error: 'Categoría no encontrada' };
        }

        if (categoria.servicios.length > 0) {
            return {
                success: false,
                error: 'No se puede eliminar una categoría con servicios',
            };
        }

        // Eliminar categoría (cascade eliminará la relación en project_seccion_categorias)
        await prisma.project_servicio_categorias.delete({
            where: { id: categoriaId },
        });

        revalidateCatalogo(studioSlug);

        return { success: true, data: true };
    } catch (error) {
        console.error('Error eliminando categoría:', error);
        return {
            success: false,
            error: 'Error al eliminar la categoría',
        };
    }
}

/**
 * Actualizar orden de múltiples categorías
 */
export async function actualizarOrdenCategorias(
    studioSlug: string,
    data: unknown
): Promise<ActionResponse<boolean>> {
    try {
        const validatedData = ActualizarOrdenCategoriasSchema.parse(data);

        await Promise.all(
            validatedData.categorias.map((categoria) =>
                prisma.project_servicio_categorias.update({
                    where: { id: categoria.id },
                    data: { orden: categoria.orden },
                })
            )
        );

        revalidateCatalogo(studioSlug);

        return { success: true, data: true };
    } catch (error) {
        console.error('Error actualizando orden de categorías:', error);
        return {
            success: false,
            error: 'Error al actualizar el orden',
        };
    }
}

// =====================================================
// SERVICIOS
// =====================================================

/**
 * Obtener servicios de un estudio
 */
export async function obtenerServicios(
    studioSlug: string
): Promise<ActionResponse<ServicioData[]>> {
    try {
        const studioId = await getStudioIdFromSlug(studioSlug);
        if (!studioId) {
            return { success: false, error: 'Estudio no encontrado' };
        }

        const servicios = await prisma.project_servicios.findMany({
            where: { studioId },
            include: {
                servicio_categorias: {
                    include: {
                        seccion_categorias: {
                            select: {
                                seccionId: true,
                            },
                        },
                    },
                },
                servicio_gastos: true,
            },
            orderBy: { orden: 'asc' },
        });

        const serviciosData: ServicioData[] = servicios.map((s) => ({
            id: s.id,
            studioId: s.studioId,
            servicioCategoriaId: s.servicioCategoriaId,
            nombre: s.nombre,
            costo: s.costo,
            gasto: s.gasto,
            utilidad: s.utilidad,
            precio_publico: s.precio_publico,
            tipo_utilidad: s.tipo_utilidad,
            orden: s.orden,
            status: s.status,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt,
            gastos: s.servicio_gastos.map((g) => ({
                id: g.id,
                nombre: g.nombre,
                costo: g.costo,
            })),
            categoria: {
                id: s.servicio_categorias.id,
                nombre: s.servicio_categorias.nombre,
                orden: s.servicio_categorias.orden,
                createdAt: s.servicio_categorias.createdAt,
                updatedAt: s.servicio_categorias.updatedAt,
                seccionId: s.servicio_categorias.seccion_categorias?.seccionId,
                servicios: [],
            },
        }));

        return { success: true, data: serviciosData };
    } catch (error) {
        console.error('Error obteniendo servicios:', error);
        return {
            success: false,
            error: 'Error al obtener los servicios',
        };
    }
}

/**
 * Crear un nuevo servicio
 */
export async function crearServicio(
    studioSlug: string,
    data: unknown
): Promise<ActionResponse<ServicioData>> {
    try {
        const studioId = await getStudioIdFromSlug(studioSlug);
        if (!studioId) {
            return { success: false, error: 'Estudio no encontrado' };
        }

        const validatedData = ServicioSchema.parse(data);

        // Obtener el siguiente número de orden para esta categoría
        const ultimoServicio = await prisma.project_servicios.findFirst({
            where: {
                studioId,
                servicioCategoriaId: validatedData.servicioCategoriaId,
            },
            orderBy: { orden: 'desc' },
            select: { orden: true },
        });

        const nuevoOrden = ultimoServicio ? ultimoServicio.orden + 1 : 0;

        const servicio = await prisma.project_servicios.create({
            data: {
                studioId,
                servicioCategoriaId: validatedData.servicioCategoriaId,
                nombre: validatedData.nombre,
                costo: validatedData.costo,
                gasto: validatedData.gasto,
                utilidad: validatedData.utilidad,
                precio_publico: validatedData.precio_publico,
                tipo_utilidad: validatedData.tipo_utilidad,
                orden: nuevoOrden,
                status: validatedData.status,
                servicio_gastos: {
                    create: validatedData.gastos?.map((gasto) => ({
                        nombre: gasto.nombre,
                        costo: gasto.costo,
                    })) || [],
                },
            },
            include: {
                servicio_categorias: true,
                servicio_gastos: true,
            },
        });

        revalidateCatalogo(studioSlug);

        return {
            success: true,
            data: {
                id: servicio.id,
                studioId: servicio.studioId,
                servicioCategoriaId: servicio.servicioCategoriaId,
                nombre: servicio.nombre,
                costo: servicio.costo,
                gasto: servicio.gasto,
                utilidad: servicio.utilidad,
                precio_publico: servicio.precio_publico,
                tipo_utilidad: servicio.tipo_utilidad,
                orden: servicio.orden,
                status: servicio.status,
                createdAt: servicio.createdAt,
                updatedAt: servicio.updatedAt,
                gastos: servicio.servicio_gastos.map((g) => ({
                    id: g.id,
                    nombre: g.nombre,
                    costo: g.costo,
                })),
            },
        };
    } catch (error) {
        console.error('Error creando servicio:', error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : 'Error al crear el servicio',
        };
    }
}

/**
 * Actualizar un servicio existente
 */
export async function actualizarServicio(
    studioSlug: string,
    servicioId: string,
    data: unknown
): Promise<ActionResponse<ServicioData>> {
    try {
        const validatedData = ServicioSchema.partial().parse(data);
        const { gastos, ...servicioData } = validatedData;

        // Actualizar servicio y reemplazar gastos si se proporcionan
        const servicio = await prisma.project_servicios.update({
            where: { id: servicioId },
            data: {
                ...servicioData,
                ...(gastos !== undefined && {
                    servicio_gastos: {
                        deleteMany: {}, // Eliminar todos los gastos existentes
                        create: gastos.map((gasto) => ({
                            nombre: gasto.nombre,
                            costo: gasto.costo,
                        })),
                    },
                }),
            },
            include: {
                servicio_gastos: true,
            },
        });

        revalidateCatalogo(studioSlug);

        return {
            success: true,
            data: {
                id: servicio.id,
                studioId: servicio.studioId,
                servicioCategoriaId: servicio.servicioCategoriaId,
                nombre: servicio.nombre,
                costo: servicio.costo,
                gasto: servicio.gasto,
                utilidad: servicio.utilidad,
                precio_publico: servicio.precio_publico,
                tipo_utilidad: servicio.tipo_utilidad,
                orden: servicio.orden,
                status: servicio.status,
                createdAt: servicio.createdAt,
                updatedAt: servicio.updatedAt,
                gastos: servicio.servicio_gastos.map((g) => ({
                    id: g.id,
                    nombre: g.nombre,
                    costo: g.costo,
                })),
            },
        };
    } catch (error) {
        console.error('Error actualizando servicio:', error);
        return {
            success: false,
            error: 'Error al actualizar el servicio',
        };
    }
}

/**
 * Eliminar un servicio
 */
export async function eliminarServicio(
    studioSlug: string,
    servicioId: string
): Promise<ActionResponse<boolean>> {
    try {
        await prisma.project_servicios.delete({
            where: { id: servicioId },
        });

        revalidateCatalogo(studioSlug);

        return { success: true, data: true };
    } catch (error) {
        console.error('Error eliminando servicio:', error);
        return {
            success: false,
            error: 'Error al eliminar el servicio',
        };
    }
}

/**
 * Duplicar un servicio
 */
export async function duplicarServicio(
    studioSlug: string,
    servicioId: string
): Promise<ActionResponse<ServicioData>> {
    try {
        const servicioOriginal = await prisma.project_servicios.findUnique({
            where: { id: servicioId },
            include: {
                servicio_gastos: true,
            },
        });

        if (!servicioOriginal) {
            return { success: false, error: 'Servicio no encontrado' };
        }

        // Obtener el siguiente orden
        const ultimoServicio = await prisma.project_servicios.findFirst({
            where: {
                studioId: servicioOriginal.studioId,
                servicioCategoriaId: servicioOriginal.servicioCategoriaId,
            },
            orderBy: { orden: 'desc' },
            select: { orden: true },
        });

        const nuevoOrden = ultimoServicio ? ultimoServicio.orden + 1 : 0;

        const servicioNuevo = await prisma.project_servicios.create({
            data: {
                studioId: servicioOriginal.studioId,
                servicioCategoriaId: servicioOriginal.servicioCategoriaId,
                nombre: `${servicioOriginal.nombre} (Copia)`,
                costo: servicioOriginal.costo,
                gasto: servicioOriginal.gasto,
                utilidad: servicioOriginal.utilidad,
                precio_publico: servicioOriginal.precio_publico,
                tipo_utilidad: servicioOriginal.tipo_utilidad,
                orden: nuevoOrden,
                status: servicioOriginal.status,
                servicio_gastos: {
                    create: servicioOriginal.servicio_gastos.map((gasto) => ({
                        nombre: gasto.nombre,
                        costo: gasto.costo,
                    })),
                },
            },
            include: {
                servicio_gastos: true,
            },
        });

        revalidateCatalogo(studioSlug);

        return {
            success: true,
            data: {
                id: servicioNuevo.id,
                studioId: servicioNuevo.studioId,
                servicioCategoriaId: servicioNuevo.servicioCategoriaId,
                nombre: servicioNuevo.nombre,
                costo: servicioNuevo.costo,
                gasto: servicioNuevo.gasto,
                utilidad: servicioNuevo.utilidad,
                precio_publico: servicioNuevo.precio_publico,
                tipo_utilidad: servicioNuevo.tipo_utilidad,
                orden: servicioNuevo.orden,
                status: servicioNuevo.status,
                createdAt: servicioNuevo.createdAt,
                updatedAt: servicioNuevo.updatedAt,
                gastos: servicioNuevo.servicio_gastos.map((g) => ({
                    id: g.id,
                    nombre: g.nombre,
                    costo: g.costo,
                })),
            },
        };
    } catch (error) {
        console.error('Error duplicando servicio:', error);
        return {
            success: false,
            error: 'Error al duplicar el servicio',
        };
    }
}

// =====================================================
// DRAG & DROP
// =====================================================

/**
 * Actualizar posición de un elemento (drag & drop)
 */
export async function actualizarPosicionCatalogo(
    studioSlug: string,
    itemId: string,
    itemType: 'seccion' | 'categoria' | 'servicio',
    newIndex: number,
    parentId?: string | null
): Promise<ActionResponse<boolean>> {
    try {
        const studioId = await getStudioIdFromSlug(studioSlug);

        if (itemType === 'seccion') {
            // Actualizar orden de sección
            await prisma.project_servicio_secciones.update({
                where: { id: itemId },
                data: { orden: newIndex },
            });
        } else if (itemType === 'categoria') {
            // Actualizar orden de categoría y posiblemente cambiar de sección
            if (parentId) {
                // Cambiar de sección si parentId es diferente
                await prisma.$transaction(async (tx) => {
                    // Actualizar orden
                    await tx.project_servicio_categorias.update({
                        where: { id: itemId },
                        data: { orden: newIndex },
                    });

                    // Actualizar relación de sección
                    await tx.project_seccion_categorias.update({
                        where: { categoriaId: itemId },
                        data: { seccionId: parentId },
                    });
                });
            } else {
                await prisma.project_servicio_categorias.update({
                    where: { id: itemId },
                    data: { orden: newIndex },
                });
            }
        } else if (itemType === 'servicio') {
            // Actualizar orden de servicio y posiblemente cambiar de categoría
            if (parentId) {
                await prisma.project_servicios.update({
                    where: { id: itemId },
                    data: {
                        orden: newIndex,
                        servicioCategoriaId: parentId,
                    },
                });
            } else {
                await prisma.project_servicios.update({
                    where: { id: itemId },
                    data: { orden: newIndex },
                });
            }
        }

        revalidateCatalogo(studioSlug);

        return { success: true, data: true };
    } catch (error) {
        console.error('Error actualizando posición:', error);
        return {
            success: false,
            error: 'Error al actualizar la posición',
        };
    }
}

// =====================================================
// SINCRONIZACIÓN DE PRECIOS
// =====================================================

/**
 * Sincronizar precios de todos los servicios con la configuración actual
 */
export async function sincronizarPreciosCatalogo(
    studioSlug: string
): Promise<ActionResponse<{ serviciosActualizados: number }>> {
    try {
        const studioId = await getStudioIdFromSlug(studioSlug);
        if (!studioId) {
            return { success: false, error: 'Estudio no encontrado' };
        }

        // Obtener configuración activa
        const config = await prisma.project_configuraciones.findFirst({
            where: {
                projectId: studioId,
                status: 'active',
            },
            orderBy: {
                updatedAt: 'desc',
            },
        });

        if (!config) {
            return {
                success: false,
                error: 'No se encontró configuración activa',
            };
        }

        // Función para calcular precios
        function calcularPrecios(
            costo: number,
            gasto: number,
            tipoUtilidad: string
        ): { utilidad: number; precio_publico: number } {
            const utilidadPorcentaje =
                tipoUtilidad === 'servicio'
                    ? config.utilidad_servicio
                    : config.utilidad_producto;

            const costoTotal = costo + gasto;
            const subtotal = costoTotal / (1 - utilidadPorcentaje / 100);
            const utilidad = subtotal - costoTotal;
            const conSobreprecio = subtotal * (1 + config.sobreprecio / 100);
            const precio_publico =
                conSobreprecio * (1 + config.comision_venta / 100);

            return {
                utilidad: Number(utilidad.toFixed(2)),
                precio_publico: Number(precio_publico.toFixed(2)),
            };
        }

        // Obtener todos los servicios del estudio
        const servicios = await prisma.project_servicios.findMany({
            where: { studioId },
        });

        // Actualizar cada servicio
        let serviciosActualizados = 0;

        console.log(`🔄 Sincronizando ${servicios.length} servicios...`);

        for (const servicio of servicios) {
            const { utilidad, precio_publico } = calcularPrecios(
                servicio.costo,
                servicio.gasto,
                servicio.tipo_utilidad
            );

            await prisma.project_servicios.update({
                where: { id: servicio.id },
                data: {
                    utilidad,
                    precio_publico,
                },
            });

            serviciosActualizados++;
        }

        console.log(`✅ ${serviciosActualizados} servicios actualizados`);

        revalidateCatalogo(studioSlug);

        return {
            success: true,
            data: { serviciosActualizados },
        };
    } catch (error) {
        console.error('Error sincronizando precios:', error);
        return {
            success: false,
            error: 'Error al sincronizar los precios',
        };
    }
}
