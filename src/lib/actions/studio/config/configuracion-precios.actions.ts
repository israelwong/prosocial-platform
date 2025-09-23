'use server';

import { prisma } from '@/lib/prisma';
import { retryDatabaseOperation } from '@/lib/actions/utils/database-retry';
import { revalidatePath } from 'next/cache';
import {
    ConfiguracionPreciosSchema,
    ServiciosExistentesSchema,
    type ConfiguracionPreciosForm,
    type ServiciosExistentes
} from '@/lib/actions/schemas/configuracion-precios-schemas';

// Obtener configuración de precios del studio
export async function obtenerConfiguracionPrecios(studioSlug: string) {
    return await retryDatabaseOperation(async () => {
        const studio = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: {
                id: true,
                name: true,
                slug: true,
                configuraciones: {
                    where: { status: 'active' },
                    orderBy: { updatedAt: 'desc' },
                    take: 1,
                },
            },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // Obtener la configuración activa o crear una por defecto
        let configuracion = studio.configuraciones[0];

        if (!configuracion) {
            // Crear configuración por defecto
            configuracion = await prisma.project_configuraciones.create({
                data: {
                    projectId: studio.id,
                    nombre: 'Configuración de Precios',
                    utilidad_servicio: 0.30, // 30%
                    utilidad_producto: 0.40, // 40%
                    comision_venta: 0.10, // 10%
                    sobreprecio: 0.05, // 5%
                    status: 'active',
                    updatedAt: new Date(),
                },
            });
        }

        return {
            id: studio.id,
            nombre: studio.name,
            slug: studio.slug,
            utilidad_servicio: String((configuracion.utilidad_servicio ?? 0.30) * 100), // Convertir a porcentaje
            utilidad_producto: String((configuracion.utilidad_producto ?? 0.40) * 100),
            comision_venta: String((configuracion.comision_venta ?? 0.10) * 100),
            sobreprecio: String((configuracion.sobreprecio ?? 0.05) * 100),
        };
    });
}

// Verificar si hay servicios existentes que requieran actualización masiva
export async function verificarServiciosExistentes(studioSlug: string): Promise<ServiciosExistentes> {
    return await retryDatabaseOperation(async () => {
        const studio = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // Contar servicios existentes
        const servicios = await prisma.project_servicios.findMany({
            where: { projectId: studio.id },
            select: {
                id: true,
                tipo_utilidad: true,
            },
        });

        const total_servicios = servicios.length;
        const servicios_por_tipo = {
            servicios: servicios.filter(s => s.tipo_utilidad === 'servicio').length,
            productos: servicios.filter(s => s.tipo_utilidad === 'producto').length,
            paquetes: servicios.filter(s => s.tipo_utilidad === 'paquete').length,
        };

        return {
            total_servicios,
            servicios_por_tipo,
            requiere_actualizacion_masiva: total_servicios > 0,
        };
    });
}

// Actualizar configuración de precios
export async function actualizarConfiguracionPrecios(
    studioSlug: string,
    data: ConfiguracionPreciosForm
) {
    return await retryDatabaseOperation(async () => {
        // Validar datos
        const validationResult = ConfiguracionPreciosSchema.safeParse(data);

        if (!validationResult.success) {
            return {
                success: false,
                error: validationResult.error.flatten().fieldErrors,
            };
        }

        const { id, ...validatedData } = validationResult.data;

        // Convertir porcentajes a decimales para almacenamiento
        const dataToSave = {
            utilidad_servicio: parseFloat((parseFloat(validatedData.utilidad_servicio) / 100).toFixed(4)),
            utilidad_producto: parseFloat((parseFloat(validatedData.utilidad_producto) / 100).toFixed(4)),
            comision_venta: parseFloat((parseFloat(validatedData.comision_venta) / 100).toFixed(4)),
            sobreprecio: parseFloat((parseFloat(validatedData.sobreprecio) / 100).toFixed(4)),
        };

        // Obtener el studio
        const studio = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        // 1. Buscar configuración existente
        const configuracionExistente = await prisma.project_configuraciones.findFirst({
            where: {
                projectId: studio.id,
                status: 'active',
            },
        });

        // 2. Actualizar o crear la configuración del studio
        if (configuracionExistente) {
            await prisma.project_configuraciones.update({
                where: {
                    id: configuracionExistente.id,
                },
                data: {
                    utilidad_servicio: dataToSave.utilidad_servicio,
                    utilidad_producto: dataToSave.utilidad_producto,
                    comision_venta: dataToSave.comision_venta,
                    sobreprecio: dataToSave.sobreprecio,
                    status: 'active',
                    updatedAt: new Date(),
                },
            });
        } else {
            await prisma.project_configuraciones.create({
                data: {
                    projectId: studio.id,
                    nombre: 'Configuración de Precios',
                    utilidad_servicio: dataToSave.utilidad_servicio,
                    utilidad_producto: dataToSave.utilidad_producto,
                    comision_venta: dataToSave.comision_venta,
                    sobreprecio: dataToSave.sobreprecio,
                    status: 'active',
                    updatedAt: new Date(),
                },
            });
        }

        // 3. Verificar si hay servicios existentes para actualización masiva
        const serviciosExistentes = await verificarServiciosExistentes(studioSlug);

        if (serviciosExistentes.requiere_actualizacion_masiva) {
            // 4. Obtener todos los servicios existentes para el recálculo masivo
            const todosLosServicios = await prisma.project_servicios.findMany({
                where: { projectId: studio.id },
                include: {
                    // Incluir gastos si existen
                    servicio_gastos: true,
                },
            });

            // 4. Preparamos la lista de operaciones de actualización de precios
            const updatePromises = todosLosServicios.map(servicio => {
                const totalGastos = servicio.servicio_gastos?.reduce((acc, gasto) => acc + (gasto.costo || 0), 0) || 0;

                // Determinar el tipo de utilidad
                let utilidadPorcentaje: number;
                switch (servicio.tipo_utilidad) {
                    case 'servicio':
                        utilidadPorcentaje = dataToSave.utilidad_servicio;
                        break;
                    case 'producto':
                        utilidadPorcentaje = dataToSave.utilidad_producto;
                        break;
                    case 'paquete':
                        utilidadPorcentaje = dataToSave.utilidad_servicio; // Usar utilidad_servicio como base para paquetes
                        break;
                    default:
                        utilidadPorcentaje = dataToSave.utilidad_servicio;
                }

                // CÁLCULO DE PRECIOS - usando la misma lógica que el legacy
                const costoBase = servicio.costo || 0;
                const utilidadBase = parseFloat((costoBase * utilidadPorcentaje).toFixed(2));
                const subtotal = parseFloat((costoBase + totalGastos + utilidadBase).toFixed(2));
                const sobreprecioMonto = parseFloat((subtotal * dataToSave.sobreprecio).toFixed(2));
                const montoTrasSobreprecio = parseFloat((subtotal + sobreprecioMonto).toFixed(2));
                const denominador = 1 - dataToSave.comision_venta;
                const nuevoPrecioSistema = denominador > 0
                    ? parseFloat((montoTrasSobreprecio / denominador).toFixed(2))
                    : 0;

                // Aplicar IVA si está habilitado
                const precioFinal = dataToSave.incluir_iva
                    ? parseFloat((nuevoPrecioSistema * 1.16).toFixed(2)) // IVA 16%
                    : nuevoPrecioSistema;

                // Redondear si está habilitado
                const precioFinalRedondeado = dataToSave.redondear_precios
                    ? Math.round(precioFinal)
                    : precioFinal;

                return prisma.project_servicios.update({
                    where: { id: servicio.id },
                    data: {
                        precio_publico: precioFinalRedondeado,
                        utilidad: utilidadBase,
                        // Actualizar otros campos si es necesario
                        updatedAt: new Date(),
                    },
                });
            });

            // 5. Ejecutar todas las actualizaciones de precios
            await Promise.all(updatePromises);
        }

        // 6. Revalidar las rutas
        revalidatePath(`/studio/${studioSlug}/configuracion/negocio/configuracion-precios`);
        revalidatePath(`/studio/${studioSlug}/configuracion/catalogo/servicios`);
        revalidatePath(`/studio/${studioSlug}/configuracion/catalogo/paquetes`);

        return {
            success: true,
            servicios_actualizados: serviciosExistentes.total_servicios,
            requiere_actualizacion_masiva: serviciosExistentes.requiere_actualizacion_masiva,
        };

    });
}

// Obtener estadísticas de servicios para mostrar en la UI
export async function obtenerEstadisticasServicios(studioSlug: string) {
    return await retryDatabaseOperation(async () => {
        const studio = await prisma.projects.findUnique({
            where: { slug: studioSlug },
            select: { id: true },
        });

        if (!studio) {
            throw new Error("Studio no encontrado");
        }

        const servicios = await prisma.project_servicios.findMany({
            where: { projectId: studio.id },
            select: {
                id: true,
                nombre: true,
                tipo_utilidad: true,
                costo: true,
                precio_publico: true,
                utilidad: true,
            },
        });

        const estadisticas = {
            total_servicios: servicios.length,
            servicios_por_tipo: {
                servicios: servicios.filter(s => s.tipo_utilidad === 'servicio').length,
                productos: servicios.filter(s => s.tipo_utilidad === 'producto').length,
                paquetes: servicios.filter(s => s.tipo_utilidad === 'paquete').length,
            },
            precio_promedio: servicios.length > 0
                ? servicios.reduce((acc, s) => acc + (s.precio_publico || 0), 0) / servicios.length
                : 0,
            utilidad_promedio: servicios.length > 0
                ? servicios.reduce((acc, s) => acc + (s.utilidad || 0), 0) / servicios.length
                : 0,
        };

        return estadisticas;
    });
}
