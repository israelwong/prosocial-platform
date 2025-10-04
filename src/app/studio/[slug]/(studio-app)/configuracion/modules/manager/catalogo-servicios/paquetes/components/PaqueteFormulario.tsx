'use client';

import React, { useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ZenCard, ZenButton, ZenInput, ZenTextarea, ZenBadge } from '@/components/ui/zen';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/shadcn/dialog';
import { ChevronDown, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { SeccionData, ServicioData } from '@/lib/actions/schemas/catalogo-schemas';
import type { TipoEventoData } from '@/lib/actions/schemas/tipos-evento-schemas';
import type {
    PaqueteServicioData,
    PaqueteConServiciosCompletos,
} from '@/lib/actions/schemas/paquete-schemas';
import {
    crearPaquete,
    actualizarPaquete,
    eliminarPaquete,
} from '@/lib/actions/studio/negocio/paquetes.actions';
import { calcularPrecios, formatCurrency } from '@/lib/utils/pricing';

interface PaqueteFormularioProps {
    catalogo: SeccionData[];
    paquete: PaqueteConServiciosCompletos | null;
    tipoEvento: TipoEventoData | null;
    studioSlug: string;
    modo: 'crear' | 'editar';
    studioConfig: {
        utilidad_servicio: number;
        utilidad_producto: number;
        sobreprecio: number;
        comision_venta: number;
    };
}

type EstadoFinanciero = 'perdida' | 'alerta' | 'precaucion' | 'saludable';

interface ServicioSeleccionado {
    servicioId: string;
    servicioCategoriaId: string;
    cantidad: number;
    // Info adicional para mostrar
    nombre: string;
    costo: number;
    gasto: number;
    tipo_utilidad: string;
    seccionNombre: string;
    categoriaNombre: string;
}

export function PaqueteFormulario({
    catalogo,
    paquete,
    tipoEvento,
    studioSlug,
    modo,
    studioConfig,
}: PaqueteFormularioProps) {
    const router = useRouter();

    // Estado del formulario
    const [nombre, setNombre] = useState(paquete?.nombre || '');
    const [descripcion, setDescripcion] = useState(paquete?.descripcion || '');
    const [precioVenta, setPrecioVenta] = useState(paquete?.precio || 0);
    const [serviciosSeleccionados, setServiciosSeleccionados] = useState<
        Map<string, ServicioSeleccionado>
    >(() => {
        const map = new Map();
        if (paquete?.serviciosDetalle) {
            paquete.serviciosDetalle.forEach((s) => {
                map.set(s.servicioId, {
                    servicioId: s.servicioId,
                    servicioCategoriaId: s.servicioCategoriaId,
                    cantidad: s.cantidad,
                    nombre: s.nombre,
                    costo: s.costo,
                    gasto: s.gasto,
                    tipo_utilidad: s.tipo_utilidad,
                    seccionNombre: s.seccionNombre || 'Sin sección',
                    categoriaNombre: s.categoriaNombre,
                });
            });
        }
        return map;
    });

    const [guardando, setGuardando] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [seccionActiva, setSeccionActiva] = useState<string | null>(null);
    const [mostrarModalEliminar, setMostrarModalEliminar] = useState(false);

    // Calcular precios usando pricing.ts
    const calculoPaquete = useMemo(() => {
        const servicios = Array.from(serviciosSeleccionados.values());

        if (servicios.length === 0) {
            return {
                totalCosto: 0,
                totalGasto: 0,
                totalUtilidadServicios: 0,
                totalUtilidadProductos: 0,
                totalUtilidad: 0,
                subtotal: 0,
                comisionVentaMonto: 0,
                factorSeguridadMonto: 0,
                sobreprecioMonto: 0,
                precioSistema: 0,
                precioVenta: 0,
                descuentoMonto: 0,
                comisionVentaReal: 0
            };
        }

        let totalCosto = 0;
        let totalGasto = 0;
        let totalUtilidadServicios = 0;
        let totalUtilidadProductos = 0;
        let precioSistema = 0;

        // Calcular totales
        servicios.forEach(servicio => {
            // Costos y gastos
            totalCosto += servicio.costo * servicio.cantidad;
            totalGasto += servicio.gasto * servicio.cantidad;

            // Calcular precio usando pricing.ts
            const precios = calcularPrecios(
                servicio.costo,
                servicio.gasto,
                servicio.tipo_utilidad as 'servicio' | 'producto',
                studioConfig
            );

            // Sumar al precio sistema
            precioSistema += precios.precio_publico * servicio.cantidad;

            // Acumular utilidades
            if (servicio.tipo_utilidad === 'servicio') {
                totalUtilidadServicios += precios.utilidad * servicio.cantidad;
            } else {
                totalUtilidadProductos += precios.utilidad * servicio.cantidad;
            }
        });

        // Redondear precio sistema
        precioSistema = Number(precioSistema.toFixed(2));

        const totalUtilidad = totalUtilidadServicios + totalUtilidadProductos;
        const subtotal = totalCosto + totalGasto + totalUtilidad;

        // Calcular montos de comisión, factor de seguridad y sobreprecio
        const FACTOR_SEGURIDAD = 4.5; // Mantener como porcentaje para consistencia
        const factorSeguridadMonto = precioSistema * (FACTOR_SEGURIDAD / 100);
        const comisionVentaMonto = precioSistema * (studioConfig.comision_venta / 100);
        const sobreprecioMonto = precioSistema * (studioConfig.sobreprecio / 100);

        // Calcular el descuento
        const descuentoMonto = precioVenta < precioSistema
            ? precioSistema - precioVenta
            : 0;

        // Comisión final basada en el precio de venta real
        const comisionVentaReal = Number((precioVenta * (studioConfig.comision_venta / 100)).toFixed(2));

        return {
            totalCosto: Number(totalCosto.toFixed(2)),
            totalGasto: Number(totalGasto.toFixed(2)),
            totalUtilidadServicios: Number(totalUtilidadServicios.toFixed(2)),
            totalUtilidadProductos: Number(totalUtilidadProductos.toFixed(2)),
            totalUtilidad: Number(totalUtilidad.toFixed(2)),
            subtotal: Number(subtotal.toFixed(2)),
            comisionVentaMonto: Number(comisionVentaMonto.toFixed(2)),
            factorSeguridadMonto: Number(factorSeguridadMonto.toFixed(2)),
            sobreprecioMonto: Number(sobreprecioMonto.toFixed(2)),
            precioSistema,
            precioVenta,
            descuentoMonto,
            comisionVentaReal
        };
    }, [serviciosSeleccionados, precioVenta, studioConfig]);

    // Cálculos base para el análisis financiero
    const analisisFinanciero = useMemo(() => {
        if (serviciosSeleccionados.size === 0 || precioVenta <= 0) {
            return null;
        }

        const costosTotal = calculoPaquete.totalCosto + calculoPaquete.totalGasto;
        const utilidadEsperada = calculoPaquete.totalUtilidad; // Ya incluye ponderación de servicios/productos
        const utilidadReal = precioVenta - (costosTotal + calculoPaquete.comisionVentaReal);
        const margenPorcentaje = (utilidadReal / precioVenta) * 100;
        const desviacion = utilidadReal - utilidadEsperada;
        const porcentajeDesviacion = utilidadEsperada > 0 ? (desviacion / utilidadEsperada) * 100 : 0;

        // Determinar estado basado en desviación de la utilidad esperada
        const estado: EstadoFinanciero =
            utilidadReal < 0 ? 'perdida' :
                desviacion < -utilidadEsperada * 0.5 ? 'alerta' :  // Perdió >50% de utilidad esperada
                    desviacion < 0 ? 'precaucion' :  // Perdió algo de utilidad
                        'saludable';  // Cumple o supera utilidad esperada

        return {
            costosTotal,
            utilidadEsperada,
            utilidadReal,
            margenPorcentaje,
            desviacion,
            porcentajeDesviacion,
            estado
        };
    }, [calculoPaquete, precioVenta, serviciosSeleccionados.size]);

    // Agrupar servicios seleccionados por sección y categoría
    const serviciosAgrupadosSeleccionados = useMemo(() => {
        const grupos: {
            [seccionNombre: string]: {
                [categoriaNombre: string]: ServicioSeleccionado[];
            };
        } = {};

        // Usamos el catálogo como referencia para mantener el orden
        catalogo.forEach((seccion) => {
            const serviciosEnSeccion = Array.from(serviciosSeleccionados.values())
                .filter(s => s.seccionNombre === seccion.nombre);

            if (serviciosEnSeccion.length > 0) {
                grupos[seccion.nombre] = {};

                // Iteramos las categorías en el orden del catálogo
                seccion.categorias.forEach((categoria) => {
                    const serviciosEnCategoria = serviciosEnSeccion
                        .filter(s => s.categoriaNombre === categoria.nombre);

                    if (serviciosEnCategoria.length > 0) {
                        // Ordenamos los servicios según el orden en el catálogo
                        grupos[seccion.nombre][categoria.nombre] = categoria.servicios
                            .map(servicioCat => serviciosEnCategoria
                                .find(s => s.servicioId === servicioCat.id))
                            .filter((s): s is ServicioSeleccionado => s !== undefined);
                    }
                });
            }
        });

        return grupos;
    }, [serviciosSeleccionados, catalogo]);

    // Handlers
    const handleAgregarServicio = (
        servicio: ServicioData,
        categoriaNombre: string,
        seccionNombre: string
    ) => {
        const existente = serviciosSeleccionados.has(servicio.id);

        setServiciosSeleccionados((prev) => {
            const nuevo = new Map(prev);

            if (existente) {
                // Si ya existe, lo removemos (toggle)
                nuevo.delete(servicio.id);
            } else {
                // Agregar nuevo
                nuevo.set(servicio.id, {
                    servicioId: servicio.id,
                    servicioCategoriaId: servicio.servicioCategoriaId,
                    cantidad: 1,
                    nombre: servicio.nombre,
                    costo: servicio.costo,
                    gasto: servicio.gasto,
                    tipo_utilidad: servicio.tipo_utilidad,
                    seccionNombre,
                    categoriaNombre,
                });
            }

            return nuevo;
        });

        // Mostrar toast fuera del setter para evitar duplicados
        if (existente) {
            toast.success(`${servicio.nombre} removido`);
        } else {
            toast.success(`${servicio.nombre} agregado`);
        }
    };

    const handleCambiarCantidad = (servicioId: string, cantidad: number) => {
        if (cantidad < 1) {
            handleRemoverServicio(servicioId);
            return;
        }

        setServiciosSeleccionados((prev) => {
            const nuevo = new Map(prev);
            const servicio = nuevo.get(servicioId);
            if (servicio) {
                nuevo.set(servicioId, { ...servicio, cantidad });
            }
            return nuevo;
        });
    };

    const handleRemoverServicio = (servicioId: string) => {
        setServiciosSeleccionados((prev) => {
            const nuevo = new Map(prev);
            nuevo.delete(servicioId);
            return nuevo;
        });
    };

    const handleGuardar = async () => {
        // Validaciones
        if (!nombre.trim()) {
            toast.error('El nombre del paquete es requerido');
            return;
        }

        if (serviciosSeleccionados.size === 0) {
            toast.error('Debes agregar al menos un servicio al paquete');
            return;
        }

        if (!precioVenta || precioVenta <= 0) {
            toast.error('El precio del paquete es requerido y debe ser mayor a 0');
            return;
        }

        if (!tipoEvento) {
            toast.error('No se pudo identificar el tipo de evento');
            return;
        }

        setGuardando(true);
        toast.loading(
            modo === 'crear' ? 'Creando paquete...' : 'Actualizando paquete...'
        );

        try {
            const servicios: PaqueteServicioData[] = Array.from(
                serviciosSeleccionados.values()
            ).map((s) => ({
                servicioId: s.servicioId,
                servicioCategoriaId: s.servicioCategoriaId,
                cantidad: s.cantidad,
            }));

            const data = {
                nombre: nombre.trim(),
                descripcion: descripcion?.trim() || null,
                eventoTipoId: tipoEvento.id,
                precio: precioVenta,
                servicios,
                ...(modo === 'editar' && paquete && { id: paquete.id }),
            };

            const result =
                modo === 'crear'
                    ? await crearPaquete(studioSlug, data)
                    : await actualizarPaquete(studioSlug, data);

            toast.dismiss();

            if (result.success) {
                toast.success(
                    modo === 'crear'
                        ? 'Paquete creado correctamente'
                        : 'Paquete actualizado correctamente'
                );
                router.push(`/${studioSlug}/configuracion/catalogo/paquetes`);
                router.refresh();
            } else {
                toast.error(result.error || 'Error al guardar el paquete');
            }
        } catch (error) {
            toast.dismiss();
            toast.error('Error inesperado al guardar el paquete');
            console.error('Error guardando paquete:', error);
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async () => {
        if (!paquete) return;
        setMostrarModalEliminar(true);
    };

    const handleConfirmarEliminar = async () => {
        if (!paquete) return;

        setEliminando(true);
        setMostrarModalEliminar(false);
        toast.loading('Eliminando paquete...');

        try {
            const result = await eliminarPaquete(studioSlug, paquete.id);

            toast.dismiss();

            if (result.success) {
                toast.success('Paquete eliminado correctamente');
                router.push(`/${studioSlug}/configuracion/catalogo/paquetes`);
                router.refresh();
            } else {
                toast.error(result.error || 'Error al eliminar el paquete');
            }
        } catch (error) {
            toast.dismiss();
            toast.error('Error inesperado al eliminar el paquete');
            console.error('Error eliminando paquete:', error);
        } finally {
            setEliminando(false);
        }
    };

    const handleCancelar = () => {
        router.push(`/${studioSlug}/configuracion/catalogo/paquetes`);
    };

    const seccionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    const handleToggleSeccion = (seccionId: string) => {
        setSeccionActiva(current => {
            const willOpen = current !== seccionId;
            if (willOpen) {
                // Pequeño timeout para asegurar que el contenido se expanda antes de hacer scroll
                setTimeout(() => {
                    seccionRefs.current[seccionId]?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
            return willOpen ? seccionId : null;
        });
    };

    return (
        <div className="space-y-6">
            {/* Encabezado */}
            <div className="flex items-center justify-between bg-zinc-900/50 border-b border-zinc-800/50 px-6 py-4 -mx-6 z-10">
                <div className="flex items-center gap-4">
                    <h1 className="text-lg font-medium text-zinc-100">
                        {modo === 'crear' ? 'Crear Paquete' : 'Editar Paquete'}
                    </h1>
                    {tipoEvento && (
                        <div className="flex items-center gap-3">
                            <div className="h-4 w-px bg-zinc-800"></div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-zinc-400">Tipo:</span>
                                <span className="text-sm font-medium text-zinc-300">
                                    {tipoEvento.nombre}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2">
                    {modo === 'editar' && (
                        <>
                            <ZenButton
                                onClick={handleEliminar}
                                variant="destructive"
                                disabled={eliminando || guardando}
                                size="sm"
                            >
                                {eliminando ? 'Eliminando...' : 'Eliminar'}
                            </ZenButton>
                            <div className="h-4 w-px bg-zinc-800"></div>
                        </>
                    )}

                </div>
            </div>

            {/* Grid de 4 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Columna 1: Servicios Disponibles */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span>Servicios Disponibles</span>
                        <ZenBadge variant="secondary" className="text-xs">
                            {catalogo.length} secciones
                        </ZenBadge>
                    </h2>
                    <div className="space-y-4">
                        {catalogo.map((seccion) => (
                            <ZenCard
                                key={seccion.id}
                                className="border border-zinc-800/50 hover:border-zinc-700/50 transition-colors"
                            >
                                <div
                                    className="p-4"
                                    ref={(el: HTMLDivElement | null) => {
                                        if (el) seccionRefs.current[seccion.id] = el;
                                    }}
                                >
                                    <button
                                        onClick={() => handleToggleSeccion(seccion.id)}
                                        className="w-full flex items-center justify-between text-left mb-2"
                                    >
                                        <h3 className="text-sm font-semibold text-white">
                                            {seccion.nombre}
                                        </h3>
                                        <ChevronDown
                                            className={`w-4 h-4 text-zinc-400 transition-transform ${seccionActiva === seccion.id ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {seccionActiva === seccion.id && (
                                        <div className="space-y-4 mt-4">
                                            {seccion.categorias.map((categoria) => (
                                                <div
                                                    key={categoria.id}
                                                    className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800"
                                                >
                                                    <h4 className="text-xs font-medium text-zinc-300 mb-3 flex items-center gap-2">
                                                        <span>{categoria.nombre}</span>
                                                    </h4>
                                                    <div className="space-y-2">
                                                        {categoria.servicios.map(
                                                            (servicio) => {
                                                                const yaSeleccionado =
                                                                    serviciosSeleccionados.has(
                                                                        servicio.id
                                                                    );
                                                                return (
                                                                    <button
                                                                        key={servicio.id}
                                                                        onClick={() =>
                                                                            handleAgregarServicio(
                                                                                servicio,
                                                                                categoria.nombre,
                                                                                seccion.nombre
                                                                            )
                                                                        }
                                                                        className={`w-full text-left p-2.5 rounded-md text-sm transition-all ${yaSeleccionado
                                                                            ? 'bg-emerald-900/30 border border-emerald-600/50 text-emerald-100 shadow-sm shadow-emerald-900/20'
                                                                            : 'bg-zinc-800/50 hover:bg-zinc-700/50 text-zinc-300 hover:shadow-sm'
                                                                            }`}
                                                                    >
                                                                        <div>
                                                                            <span>{servicio.nombre}</span>{' '}
                                                                            <span className={`text-[10px] ${yaSeleccionado ? 'text-emerald-300/70' : 'text-zinc-500'}`}>
                                                                                {(() => {
                                                                                    const precios = calcularPrecios(
                                                                                        servicio.costo,
                                                                                        servicio.gasto,
                                                                                        servicio.tipo_utilidad as 'servicio' | 'producto',
                                                                                        studioConfig
                                                                                    );
                                                                                    return formatCurrency(precios.precio_publico);
                                                                                })()} c/u
                                                                            </span>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </ZenCard>
                        ))}
                    </div>
                </div>

                {/* Columna 2: Servicios Asociados */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">
                        Servicios en el Paquete
                    </h2>
                    {serviciosSeleccionados.size === 0 ? (
                        <ZenCard>
                            <div className="p-8 text-center">
                                <p className="text-sm text-zinc-500">
                                    Selecciona servicios de la izquierda
                                </p>
                            </div>
                        </ZenCard>
                    ) : (
                        <div className="space-y-3">
                            {Object.entries(serviciosAgrupadosSeleccionados).map(
                                ([seccionNombre, categorias]) => (
                                    <ZenCard key={seccionNombre}>
                                        <div className="p-3">
                                            <h3 className="text-sm font-semibold text-white mb-3">
                                                {seccionNombre}
                                            </h3>
                                            {Object.entries(categorias).map(
                                                ([
                                                    categoriaNombre,
                                                    servicios,
                                                ]) => (
                                                    <div
                                                        key={categoriaNombre}
                                                        className="mb-3"
                                                    >
                                                        <h4 className="text-xs font-medium text-zinc-400 mb-2">
                                                            {categoriaNombre}
                                                        </h4>
                                                        <div className="space-y-2">
                                                            {servicios.map(
                                                                (servicio) => (
                                                                    <div
                                                                        key={servicio.servicioId}
                                                                        className="group flex items-center justify-between gap-2 bg-zinc-800/50 p-2 rounded text-sm"
                                                                    >
                                                                        <div className="flex-1">
                                                                            <span className="text-zinc-300">
                                                                                {servicio.nombre}{' '}
                                                                                <span className="text-[10px] text-zinc-500">
                                                                                    {(() => {
                                                                                        const precios = calcularPrecios(
                                                                                            servicio.costo,
                                                                                            servicio.gasto,
                                                                                            servicio.tipo_utilidad as 'servicio' | 'producto',
                                                                                            studioConfig
                                                                                        );
                                                                                        return formatCurrency(precios.precio_publico * servicio.cantidad);
                                                                                    })()} total
                                                                                </span>
                                                                            </span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="flex items-center gap-1">
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleCambiarCantidad(
                                                                                            servicio.servicioId,
                                                                                            servicio.cantidad - 1
                                                                                        )
                                                                                    }
                                                                                    className="w-5 h-5 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300"
                                                                                >
                                                                                    -
                                                                                </button>
                                                                                <span className="w-6 text-center text-white font-medium">
                                                                                    {servicio.cantidad}
                                                                                </span>
                                                                                <button
                                                                                    onClick={() =>
                                                                                        handleCambiarCantidad(
                                                                                            servicio.servicioId,
                                                                                            servicio.cantidad + 1
                                                                                        )
                                                                                    }
                                                                                    className="w-5 h-5 flex items-center justify-center bg-zinc-700 hover:bg-zinc-600 rounded text-zinc-300"
                                                                                >
                                                                                    +
                                                                                </button>
                                                                            </div>
                                                                            <button
                                                                                onClick={() => handleRemoverServicio(servicio.servicioId)}
                                                                                className="w-5 h-5 flex items-center justify-center text-red-500 hover:text-red-400 transition-colors"
                                                                                title="Eliminar servicio"
                                                                            >
                                                                                <Trash2 className="w-3.5 h-3.5" />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </ZenCard>
                                )
                            )}
                        </div>
                    )}
                </div>

                {/* Columna 3: Detalles del Paquete */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">
                        Detalles del Paquete
                    </h2>
                    <div className="space-y-4">
                        {/* Card 1: Información Básica */}
                        <ZenCard>
                            <div className="p-4 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Nombre del Paquete *
                                    </label>
                                    <ZenInput
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Ej: Paquete Boda Premium"
                                    />
                                </div>

                                <div>
                                    <ZenTextarea
                                        label="Descripción (opcional)"
                                        value={descripcion || ''}
                                        onChange={(e) =>
                                            setDescripcion(e.target.value)
                                        }
                                        placeholder="Descripción del paquete..."
                                        rows={3}
                                    />
                                </div>


                            </div>
                        </ZenCard>

                        {/* Card 2: Precio */}
                        <ZenCard>
                            <div className="p-4 space-y-4">
                                <div className="bg-zinc-800/50 p-3 rounded-lg">
                                    <div className="text-xs text-zinc-400 mb-1">
                                        Precio Sistema
                                    </div>
                                    <div className="text-2xl font-bold text-yellow-400">
                                        {formatCurrency(calculoPaquete.precioSistema)}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                                        Precio del Paquete *
                                    </label>
                                    <ZenInput
                                        type="number"
                                        value={precioVenta === 0 ? '' : precioVenta}
                                        onChange={(e) =>
                                            setPrecioVenta(
                                                e.target.value === '' ? 0 : parseFloat(e.target.value)
                                            )
                                        }
                                        placeholder="Ingresa el precio de venta"
                                        step="0.01"
                                        min="0"
                                    />
                                </div>

                                <div className="flex items-center gap-2 w-full">
                                    <ZenButton
                                        className="flex-1"
                                        onClick={handleCancelar}
                                        variant="secondary"
                                        disabled={guardando || eliminando}
                                        size="sm"
                                    >
                                        Cancelar
                                    </ZenButton>
                                    <ZenButton
                                        className="flex-1"
                                        onClick={handleGuardar}
                                        disabled={guardando || eliminando}
                                        size="sm"
                                    >
                                        {guardando
                                            ? 'Guardando...'
                                            : modo === 'crear'
                                                ? 'Guardar'
                                                : 'Actualizar'}
                                    </ZenButton>
                                </div>
                            </div>
                        </ZenCard>

                    </div>
                </div>

                {/* Columna 4: Análisis Financiero */}

                {/*  Análisis Financiero */}
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-white">
                        Análisis Financiero
                    </h2>

                    {/* Mostrar solo si hay servicios y precio */}
                    {serviciosSeleccionados.size === 0 ? (
                        <ZenCard>
                            <div className="p-8 text-center">
                                <p className="text-sm text-zinc-500">
                                    Agrega servicios para ver el análisis
                                </p>
                            </div>
                        </ZenCard>
                    ) : precioVenta <= 0 ? (
                        <ZenCard>
                            <div className="p-8 text-center">
                                <p className="text-sm text-zinc-500">
                                    Ingresa un precio para ver el análisis
                                </p>
                            </div>
                        </ZenCard>
                    ) : (
                        <div className="space-y-4">
                            {(() => {
                                if (!analisisFinanciero) return null;
                                const { costosTotal, utilidadEsperada, utilidadReal, margenPorcentaje, desviacion, porcentajeDesviacion, estado } = analisisFinanciero;

                                const config = {
                                    perdida: {
                                        color: 'text-red-400',
                                        bgLight: 'bg-red-900/10',
                                        border: 'border-red-800/30',
                                        icon: '❌',
                                        label: 'PÉRDIDAS'
                                    },
                                    alerta: {
                                        color: 'text-orange-400',
                                        bgLight: 'bg-orange-900/10',
                                        border: 'border-orange-800/30',
                                        icon: '⚠️',
                                        label: 'UTILIDAD BAJA'
                                    },
                                    precaucion: {
                                        color: 'text-yellow-400',
                                        bgLight: 'bg-yellow-900/10',
                                        border: 'border-yellow-800/30',
                                        icon: '💡',
                                        label: 'BAJO OBJETIVO'
                                    },
                                    saludable: {
                                        color: 'text-emerald-400',
                                        bgLight: 'bg-emerald-900/10',
                                        border: 'border-emerald-800/30',
                                        icon: '✅',
                                        label: 'OBJETIVO CUMPLIDO'
                                    }
                                };

                                const colorActual = config[estado];

                                return (
                                    <ZenCard className={`${colorActual.border}`}>
                                        <div className={`p-6 ${colorActual.bgLight}`}>
                                            {/* Header con estado */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className={`text-[10px] font-semibold tracking-wider ${colorActual.color} uppercase`}>
                                                    {colorActual.label}
                                                </span>
                                                <span className="text-2xl">{colorActual.icon}</span>
                                            </div>

                                            {/* Ganancia principal */}
                                            <div className="mb-2">
                                                <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">
                                                    Ganancia
                                                </div>
                                                <div className={`text-4xl font-bold ${colorActual.color} tracking-tight`}>
                                                    {formatCurrency(utilidadReal)}
                                                </div>
                                            </div>

                                            {/* Porcentaje */}
                                            <div className="flex items-baseline gap-2">
                                                <span className={`text-lg font-semibold ${colorActual.color}`}>
                                                    {margenPorcentaje >= 0 ? '↑' : '↓'} {Math.abs(margenPorcentaje).toFixed(1)}%
                                                </span>
                                                <span className="text-xs text-zinc-500">
                                                    de {formatCurrency(precioVenta)}
                                                </span>
                                            </div>

                                            {/* Comparación con objetivo */}
                                            {estado !== 'perdida' && (
                                                <div className="mt-4 pt-4 border-t border-zinc-800/50">
                                                    <div className="flex items-center justify-between text-xs">
                                                        <span className="text-zinc-500">vs. Objetivo</span>
                                                        <span className={desviacion >= 0 ? 'text-emerald-400' : 'text-orange-400'}>
                                                            {desviacion >= 0 ? '+' : ''}{formatCurrency(desviacion)} ({porcentajeDesviacion >= 0 ? '+' : ''}{porcentajeDesviacion.toFixed(0)}%)
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </ZenCard>
                                );
                            })()}

                            {/* Card: Descuento Máximo */}
                            <ZenCard className="border-zinc-800/30">
                                <div className="p-6 bg-zinc-900/30">
                                    <div className="mb-4">
                                        <div className="text-[10px] font-semibold tracking-wider text-blue-400 uppercase mb-3">
                                            Descuento Máximo
                                        </div>
                                        <div className="text-2xl font-bold text-blue-400">
                                            {formatCurrency(Math.max(0, precioVenta - calculoPaquete.precioSistema))}
                                        </div>
                                        <div className="text-xs text-zinc-500 mt-1">
                                            Sobreprecio {studioConfig.sobreprecio}%
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-zinc-800/50 space-y-2">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-zinc-500">Precio mínimo</span>
                                            <span className="text-zinc-400 font-medium">
                                                {formatCurrency(calculoPaquete.precioSistema)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-zinc-500">Ganancia mínima</span>
                                            <span className="text-zinc-400 font-medium">
                                                {(() => {
                                                    if (!analisisFinanciero) return null;
                                                    const precioMin = calculoPaquete.precioSistema;
                                                    const comisionMin = precioMin * (studioConfig.comision_venta / 100);
                                                    const gananciaMin = precioMin - (analisisFinanciero.costosTotal + comisionMin);
                                                    return formatCurrency(gananciaMin);
                                                })()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </ZenCard>


                            {/* Card: Distribución y cálculos */}
                            <ZenCard className="border-zinc-800/30">
                                <div className="p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-zinc-400">
                                            Distribución y cálculos
                                        </span>
                                    </div>

                                    <div className="border-t border-zinc-800/50 -mx-4"></div>

                                    {/* Barra de distribución */}
                                    <div className="py-4">
                                        <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">
                                            Distribución del precio
                                        </div>
                                        <div className="relative h-6 bg-zinc-900 rounded-md overflow-hidden mb-3">
                                            {(() => {
                                                if (!analisisFinanciero) return null;
                                                const porcentajeCostos = (analisisFinanciero.costosTotal / precioVenta) * 100;
                                                const porcentajeComision = (calculoPaquete.comisionVentaReal / precioVenta) * 100;
                                                const porcentajeGanancia = (analisisFinanciero.utilidadReal / precioVenta) * 100;

                                                return (
                                                    <>
                                                        <div
                                                            className="absolute h-full bg-red-500/50"
                                                            style={{ width: `${porcentajeCostos}%` }}
                                                        />
                                                        <div
                                                            className="absolute h-full bg-orange-500/50"
                                                            style={{
                                                                left: `${porcentajeCostos}%`,
                                                                width: `${porcentajeComision}%`
                                                            }}
                                                        />
                                                        <div
                                                            className="absolute h-full bg-emerald-500/50"
                                                            style={{
                                                                left: `${porcentajeCostos + porcentajeComision}%`,
                                                                width: `${porcentajeGanancia}%`
                                                            }}
                                                        />
                                                    </>
                                                );
                                            })()}
                                        </div>

                                        {/* Leyenda minimalista */}
                                        <div className="space-y-1.5">
                                            {(() => {
                                                if (!analisisFinanciero) return null;
                                                const porcentajeCostos = (analisisFinanciero.costosTotal / precioVenta) * 100;
                                                const porcentajeComision = (calculoPaquete.comisionVentaReal / precioVenta) * 100;
                                                const porcentajeGanancia = (analisisFinanciero.utilidadReal / precioVenta) * 100;

                                                return (
                                                    <>
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-red-500/50 rounded-sm"></div>
                                                                <span className="text-zinc-500">Costos</span>
                                                            </div>
                                                            <span className="text-zinc-400 font-mono">
                                                                {formatCurrency(analisisFinanciero.costosTotal)} · {porcentajeCostos.toFixed(0)}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-orange-500/50 rounded-sm"></div>
                                                                <span className="text-zinc-500">Comisión</span>
                                                            </div>
                                                            <span className="text-zinc-400 font-mono">
                                                                {formatCurrency(calculoPaquete.comisionVentaReal)} · {porcentajeComision.toFixed(0)}%
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-xs">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-2 h-2 bg-emerald-500/50 rounded-sm"></div>
                                                                <span className="text-zinc-500">Ganancia</span>
                                                            </div>
                                                            <span className="text-emerald-400 font-mono font-medium">
                                                                {formatCurrency(analisisFinanciero.utilidadReal)} · {porcentajeGanancia.toFixed(0)}%
                                                            </span>
                                                        </div>
                                                    </>
                                                );
                                            })()}
                                        </div>
                                    </div>

                                    {/* Desglose técnico */}
                                    <div className="pt-4 border-t border-zinc-800/50 space-y-1.5">
                                        <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">
                                            Cálculo del sistema
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-zinc-600">Costos</span>
                                            <span className="text-zinc-500 font-mono">{formatCurrency(calculoPaquete.totalCosto)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-zinc-600">Gastos</span>
                                            <span className="text-zinc-500 font-mono">{formatCurrency(calculoPaquete.totalGasto)}</span>
                                        </div>
                                        {calculoPaquete.totalUtilidadServicios > 0 && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-zinc-600">Utilidad servicios ({studioConfig.utilidad_servicio}%)</span>
                                                <span className="text-zinc-500 font-mono">{formatCurrency(calculoPaquete.totalUtilidadServicios)}</span>
                                            </div>
                                        )}
                                        {calculoPaquete.totalUtilidadProductos > 0 && (
                                            <div className="flex justify-between text-xs">
                                                <span className="text-zinc-600">Utilidad productos ({studioConfig.utilidad_producto}%)</span>
                                                <span className="text-zinc-500 font-mono">{formatCurrency(calculoPaquete.totalUtilidadProductos)}</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between text-xs pt-1.5 border-t border-zinc-800/50">
                                            <span className="text-zinc-500">Comisión ({studioConfig.comision_venta}%)</span>
                                            <span className="text-zinc-400 font-mono">{formatCurrency(calculoPaquete.comisionVentaMonto)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-zinc-500">Factor seguridad (4.5%)</span>
                                            <span className="text-zinc-400 font-mono">{formatCurrency(calculoPaquete.factorSeguridadMonto)}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-zinc-500">Sobreprecio ({studioConfig.sobreprecio}%)</span>
                                            <span className="text-zinc-400 font-mono">{formatCurrency(calculoPaquete.sobreprecioMonto)}</span>
                                        </div>
                                    </div>
                                </div>
                            </ZenCard>
                        </div>
                    )}
                </div>


            </div>

            {/* Modal de confirmación para eliminar */}
            <Dialog
                open={mostrarModalEliminar}
                onOpenChange={(open: boolean) => setMostrarModalEliminar(open)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Paquete</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <p className="text-sm text-zinc-400">
                            ¿Estás seguro de eliminar el paquete <span className="text-zinc-200 font-medium">{paquete?.nombre}</span>?
                            <br />
                            <span className="text-red-400">Esta acción no se puede deshacer.</span>
                        </p>

                        <div className="flex items-center gap-2 pt-2">
                            <ZenButton
                                className="flex-1"
                                variant="secondary"
                                onClick={() => setMostrarModalEliminar(false)}
                                disabled={eliminando}
                            >
                                Cancelar
                            </ZenButton>
                            <ZenButton
                                className="flex-1"
                                variant="destructive"
                                onClick={handleConfirmarEliminar}
                                disabled={eliminando}
                            >
                                {eliminando ? 'Eliminando...' : 'Sí, Eliminar'}
                            </ZenButton>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}