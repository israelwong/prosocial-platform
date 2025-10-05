// components/cotizaciones/CotizacionFormularioClient.tsx
"use client"

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ServicioParaCotizacion } from '@/components/ui/paquetes/columns'
import { ZenCard, ZenInput, ZenTextarea, ZenButton, ZenBadge } from '@/components/ui/zen'
import { calcularPrecios, formatCurrency } from '@/lib/utils/pricing'
import type { SeccionData } from '@/lib/actions/schemas/catalogo-schemas'
import type { PaqueteConServiciosCompletos, PaqueteServicioData } from '@/lib/actions/schemas/paquete-schemas'
import { crearPaquete, actualizarPaquete } from '@/lib/actions/studio/manager/paquetes.actions'

interface CotizacionFormularioClientProps {
    catalogo: SeccionData[]
    eventoId: string
    cotizacion: PaqueteConServiciosCompletos | null // Tipo completo de tu cotización
    studioConfig: {
        utilidad_servicio: number
        utilidad_producto: number
        sobreprecio: number
        comision_venta: number
    }
    studioId: string
    studioSlug: string
}

export function CotizacionFormularioClient({
    catalogo,
    eventoId,
    cotizacion,
    studioConfig,
    studioId,
    studioSlug
}: CotizacionFormularioClientProps) {
    const router = useRouter()

    // Estado
    const [nombre, setNombre] = useState(cotizacion?.nombre || '')
    const [descripcion, setDescripcion] = useState(cotizacion?.descripcion || '')
    const [descuentoPorcentaje] = useState(0)
    const [precioPersonalizado, setPrecioPersonalizado] = useState(0)
    const [items, setItems] = useState<{ [servicioId: string]: number }>(() => {
        const initial: { [id: string]: number } = {}

        // Inicializar todos los servicios con cantidad 0
        catalogo.forEach(seccion => {
            seccion.categorias.forEach(categoria => {
                categoria.servicios.forEach(servicio => {
                    initial[servicio.id] = 0
                })
            })
        })

        // Si hay cotización existente, sobrescribir con valores reales
        if (cotizacion?.servicios) {
            cotizacion.servicios.forEach((s: PaqueteServicioData) => {
                initial[s.servicioId] = s.cantidad
            })
        }

        return initial
    })
    const [guardando, setGuardando] = useState(false)
    const [showValidationModal, setShowValidationModal] = useState(false)
    const [validationMessage, setValidationMessage] = useState('')

    // Transformar catálogo a formato tabla
    const serviciosParaTabla = useMemo((): (ServicioParaCotizacion & { categoriaId: string })[] => {
        const servicios: (ServicioParaCotizacion & { categoriaId: string })[] = []
        catalogo.forEach(seccion => {
            seccion.categorias.forEach(categoria => {
                categoria.servicios.forEach(servicio => {
                    const precios = calcularPrecios(
                        servicio.costo,
                        servicio.gasto,
                        servicio.tipo_utilidad as 'servicio' | 'producto',
                        studioConfig
                    )
                    servicios.push({
                        id: servicio.id,
                        nombre: servicio.nombre,
                        categoria: categoria.nombre,
                        categoriaId: categoria.id,
                        seccion: seccion.nombre,
                        precioUnitario: precios.precio_publico,
                        costo: servicio.costo,
                        gasto: servicio.gasto,
                        tipo_utilidad: servicio.tipo_utilidad as 'servicio' | 'producto'
                    })
                })
            })
        })
        return servicios
    }, [catalogo, studioConfig])

    // Mapa de servicios para cálculos
    const servicioMap = useMemo(() => {
        const map = new Map<string, ServicioParaCotizacion & { categoriaId: string }>()
        serviciosParaTabla.forEach(s => map.set(s.id, s))
        return map
    }, [serviciosParaTabla])

    // Cálculos
    const calculoCotizacion = useMemo(() => {
        const serviciosSeleccionados = Object.entries(items)
            .filter(([, cantidad]) => cantidad > 0)
            .map(([id, cantidad]) => ({ ...servicioMap.get(id)!, cantidad }))

        if (serviciosSeleccionados.length === 0) {
            return {
                subtotal: 0,
                totalCosto: 0,
                totalGasto: 0,
                descuentoMonto: 0,
                total: 0,
                comisionMonto: 0,
                utilidadNeta: 0
            }
        }

        let subtotal = 0
        let totalCosto = 0
        let totalGasto = 0

        serviciosSeleccionados.forEach(s => {
            subtotal += s.precioUnitario * s.cantidad
            totalCosto += s.costo * s.cantidad
            totalGasto += s.gasto * s.cantidad
        })

        const descuentoMonto = subtotal * (descuentoPorcentaje / 100)
        const totalCalculado = subtotal - descuentoMonto
        const total = precioPersonalizado > 0 ? precioPersonalizado : totalCalculado
        const comisionMonto = total * (studioConfig.comision_venta / 100)
        const utilidadNeta = total - (totalCosto + totalGasto + comisionMonto)

        return {
            subtotal: Number(subtotal.toFixed(2)),
            totalCosto: Number(totalCosto.toFixed(2)),
            totalGasto: Number(totalGasto.toFixed(2)),
            descuentoMonto: Number(descuentoMonto.toFixed(2)),
            total: Number(total.toFixed(2)),
            comisionMonto: Number(comisionMonto.toFixed(2)),
            utilidadNeta: Number(utilidadNeta.toFixed(2))
        }
    }, [items, servicioMap, descuentoPorcentaje, precioPersonalizado, studioConfig.comision_venta])

    // Análisis financiero avanzado
    const analisisFinanciero = useMemo(() => {
        if (calculoCotizacion.total <= 0) return null

        const { total, totalCosto, totalGasto, comisionMonto, utilidadNeta } = calculoCotizacion
        const costosTotal = totalCosto + totalGasto
        const margenPorcentaje = (utilidadNeta / total) * 100

        // Determinar estado basado en margen de utilidad
        const estado = utilidadNeta < 0 ? 'perdida' :
            margenPorcentaje < 10 ? 'alerta' :
                margenPorcentaje < 20 ? 'precaucion' : 'saludable'

        return {
            costosTotal,
            utilidadReal: utilidadNeta,
            margenPorcentaje,
            estado
        }
    }, [calculoCotizacion])

    // Handlers
    const updateQuantity = (servicioId: string, cantidad: number) => {
        setItems(prev => {
            const newItems = { ...prev }
            if (cantidad > 0) {
                newItems[servicioId] = cantidad
            } else {
                delete newItems[servicioId]
            }
            return newItems
        })
    }

    const handleGuardar = async () => {
        if (!nombre.trim()) {
            toast.error('El nombre del paquete es requerido')
            return
        }

        if (Object.keys(items).length === 0) {
            toast.error('Agrega al menos un servicio')
            return
        }

        // Validar precio personalizado
        const precioFinal = precioPersonalizado > 0 ? precioPersonalizado : calculoCotizacion.total
        if (precioFinal <= 0) {
            setValidationMessage('Debes establecer un precio personalizado mayor a $0 para continuar.')
            setShowValidationModal(true)
            return
        }

        // Validar utilidad negativa
        if (calculoCotizacion.utilidadNeta < 0) {
            setValidationMessage('La utilidad no puede ser negativa. Ajusta el precio o reduce los costos para continuar.')
            setShowValidationModal(true)
            return
        }

        setGuardando(true)
        const loadingToast = toast.loading('Guardando paquete...', {
            description: 'Por favor espera mientras procesamos tu solicitud'
        })

        try {
            const servicios = Object.entries(items)
                .filter(([, cantidad]) => cantidad > 0)
                .map(([servicioId, cantidad]) => {
                    const servicio = servicioMap.get(servicioId)
                    return {
                        servicioId,
                        cantidad,
                        servicioCategoriaId: servicio?.categoriaId || ''
                    }
                })

            const paqueteData = {
                nombre,
                descripcion: descripcion || undefined,
                precio: precioFinal,
                costo: calculoCotizacion.totalCosto,
                gasto: calculoCotizacion.totalGasto,
                utilidad: calculoCotizacion.utilidadNeta,
                eventoTipoId: eventoId,
                servicios
            }

            let result
            if (cotizacion?.id) {
                // Actualizar paquete existente
                result = await actualizarPaquete(cotizacion.id, studioSlug, paqueteData)
            } else {
                // Crear nuevo paquete
                result = await crearPaquete(studioId, studioSlug, paqueteData)
            }

            toast.dismiss(loadingToast)

            if (result.success) {
                toast.success('¡Paquete guardado exitosamente!', {
                    description: result.message,
                    duration: 4000
                })

                // Redireccionar después de un breve delay
                setTimeout(() => {
                    router.push(`/studio/${studioSlug}/configuracion/comercial/catalogo-servicios/paquetes`)
                }, 1500)
            } else {
                toast.error('Error al guardar paquete', {
                    description: result.error || 'Ocurrió un error inesperado'
                })
            }
        } catch (error) {
            toast.dismiss(loadingToast)
            toast.error('Error al guardar paquete', {
                description: 'Ocurrió un error inesperado. Intenta nuevamente.'
            })
            console.error('Error guardando paquete:', error)
        } finally {
            setGuardando(false)
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-6">
                {/* Columna 3/4: Servicios anidados por sección > categoría */}
                <div className="lg:col-span-3">
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            Servicios Disponibles
                            <ZenBadge variant="secondary">
                                {serviciosParaTabla.length} servicios
                            </ZenBadge>
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {catalogo.map((seccion) => (
                            <ZenCard key={seccion.id} className="border border-zinc-800/50">
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-white mb-4">
                                        {seccion.nombre}
                                    </h3>

                                    {seccion.categorias.map((categoria) => (
                                        <ZenCard key={categoria.id} className="mb-4 last:mb-0 border border-zinc-700/50 bg-zinc-800/30">
                                            <div className="p-4">
                                                <h4 className="text-md font-medium text-zinc-200 mb-4 flex items-center gap-2">
                                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                                    {categoria.nombre}
                                                </h4>

                                                <div className="overflow-x-auto">
                                                    <table className="w-full">
                                                        <thead>
                                                            <tr className="border-b border-zinc-600/50">
                                                                <th className="text-left py-2 px-3 text-sm font-medium text-zinc-400">Servicio</th>
                                                                <th className="text-right py-2 px-3 text-sm font-medium text-zinc-400">Precio</th>
                                                                <th className="text-center py-2 px-3 text-sm font-medium text-zinc-400">Cantidad</th>
                                                                <th className="text-right py-2 px-3 text-sm font-medium text-zinc-400">Subtotal</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {categoria.servicios.map((servicio) => {
                                                                const precios = calcularPrecios(
                                                                    servicio.costo,
                                                                    servicio.gasto,
                                                                    servicio.tipo_utilidad as 'servicio' | 'producto',
                                                                    studioConfig
                                                                )
                                                                const cantidad = items[servicio.id] || 0
                                                                const subtotal = precios.precio_publico * cantidad

                                                                return (
                                                                    <tr
                                                                        key={servicio.id}
                                                                        className={`border-b border-zinc-700/30 hover:bg-zinc-700/20 transition-colors ${cantidad > 0
                                                                            ? 'bg-emerald-900/20 border-emerald-800/30'
                                                                            : ''
                                                                            }`}
                                                                    >
                                                                        <td className="py-3 px-3">
                                                                            <div className="font-medium text-white">
                                                                                {servicio.nombre}
                                                                            </div>
                                                                            <div className="text-xs text-zinc-500">
                                                                                {servicio.tipo_utilidad}
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-3 px-3 text-right">
                                                                            <div className="font-medium text-white">
                                                                                {formatCurrency(precios.precio_publico)}
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-3 px-3 text-center">
                                                                            <div className="flex items-center justify-center gap-1">
                                                                                <button
                                                                                    onClick={() => updateQuantity(servicio.id, Math.max(0, cantidad - 1))}
                                                                                    className="w-6 h-6 flex items-center justify-center rounded bg-zinc-600 hover:bg-zinc-500 text-zinc-300 hover:text-white transition-colors"
                                                                                >
                                                                                    -
                                                                                </button>
                                                                                <span className={`w-8 text-center font-medium ${cantidad > 0 ? 'text-emerald-400' : 'text-white'
                                                                                    }`}>
                                                                                    {cantidad}
                                                                                </span>
                                                                                <button
                                                                                    onClick={() => updateQuantity(servicio.id, cantidad + 1)}
                                                                                    className="w-6 h-6 flex items-center justify-center rounded bg-zinc-600 hover:bg-zinc-500 text-zinc-300 hover:text-white transition-colors"
                                                                                >
                                                                                    +
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                        <td className="py-3 px-3 text-right">
                                                                            <div className={`font-medium ${cantidad > 0 ? 'text-emerald-400' : 'text-zinc-500'
                                                                                }`}>
                                                                                {formatCurrency(subtotal)}
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </ZenCard>
                                    ))}
                                </div>
                            </ZenCard>
                        ))}
                    </div>
                </div>

                {/* Columna 1/4: Resumen y análisis */}
                <div className="lg:col-span-1 space-y-4 lg:sticky lg:top-6">
                    <h2 className="text-lg font-semibold text-white">Resumen</h2>

                    {/* Información básica */}
                    <ZenCard>
                        <div className="p-4 space-y-4">
                            <ZenInput
                                label="Nombre de la Cotización *"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Cotización Boda García"
                            />

                            <ZenTextarea
                                label="Descripción (opcional)"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Notas sobre esta cotización..."
                                rows={3}
                            />
                        </div>
                    </ZenCard>

                    {/* Análisis financiero */}
                    <ZenCard>
                        <div className="p-4 space-y-4">
                            <div className="space-y-4">
                                {/* Subtotal */}
                                <div className="flex justify-between text-sm">
                                    <span className="text-zinc-400">Subtotal</span>
                                    <span className="text-white font-medium">
                                        {formatCurrency(calculoCotizacion.subtotal)}
                                    </span>
                                </div>

                                {/* Precio personalizado */}
                                <div>
                                    <label className="text-sm text-zinc-400 mb-1 block">Precio personalizado</label>
                                    <ZenInput
                                        type="number"
                                        min={0}
                                        step={0.01}
                                        value={precioPersonalizado || calculoCotizacion.total}
                                        onChange={(e) => {
                                            const valor = parseFloat(e.target.value) || 0
                                            setPrecioPersonalizado(valor)
                                        }}
                                        placeholder="Precio final"
                                    />
                                    {precioPersonalizado > 0 && (
                                        <div className="text-xs text-zinc-500 mt-1">
                                            Precio calculado: {formatCurrency(calculoCotizacion.subtotal - calculoCotizacion.descuentoMonto)}
                                        </div>
                                    )}
                                </div>



                                {/* Acciones */}
                                <div className="flex gap-2 pt-4">
                                    <ZenButton
                                        variant="secondary"
                                        onClick={() => router.back()}
                                        className="flex-1"
                                        disabled={guardando}
                                    >
                                        Cancelar
                                    </ZenButton>
                                    <ZenButton
                                        onClick={handleGuardar}
                                        className="flex-1"
                                        disabled={guardando}
                                    >
                                        {guardando ? 'Guardando...' : 'Guardar'}
                                    </ZenButton>
                                </div>
                            </div>
                        </div>
                    </ZenCard>

                    {/* Análisis de rentabilidad */}
                    {analisisFinanciero && (
                        <ZenCard className={`border-zinc-800/30 ${analisisFinanciero.estado === 'perdida' ? 'border-red-800/30' :
                            analisisFinanciero.estado === 'alerta' ? 'border-orange-800/30' :
                                analisisFinanciero.estado === 'precaucion' ? 'border-yellow-800/30' :
                                    'border-emerald-800/30'
                            }`}>
                            <div className="p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-zinc-400">
                                        Análisis de Rentabilidad
                                    </span>
                                    <span className={`text-xs font-semibold uppercase ${analisisFinanciero.estado === 'perdida' ? 'text-red-400' :
                                        analisisFinanciero.estado === 'alerta' ? 'text-orange-400' :
                                            analisisFinanciero.estado === 'precaucion' ? 'text-yellow-400' :
                                                'text-emerald-400'
                                        }`}>
                                        {analisisFinanciero.estado === 'perdida' ? 'PÉRDIDAS' :
                                            analisisFinanciero.estado === 'alerta' ? 'UTILIDAD BAJA' :
                                                analisisFinanciero.estado === 'precaucion' ? 'BAJO OBJETIVO' :
                                                    'UTILIDAD GENERADA'}
                                    </span>
                                </div>

                                <div className="border-t border-zinc-800/50 -mx-4"></div>

                                {/* Ganancia principal */}
                                <div className="text-center">
                                    <div className="text-xs text-zinc-500 mb-1 uppercase tracking-wide">
                                        Utilidad Neta
                                    </div>
                                    <div className={`text-3xl font-bold ${analisisFinanciero.estado === 'perdida' ? 'text-red-400' :
                                        analisisFinanciero.estado === 'alerta' ? 'text-orange-400' :
                                            analisisFinanciero.estado === 'precaucion' ? 'text-yellow-400' :
                                                'text-emerald-400'
                                        }`}>
                                        {formatCurrency(analisisFinanciero.utilidadReal)}
                                    </div>
                                    <div className="text-sm text-zinc-400">
                                        {analisisFinanciero.margenPorcentaje.toFixed(1)}% del total
                                    </div>
                                </div>

                                {/* Barra de distribución */}
                                <div className="py-4">
                                    <div className="text-xs text-zinc-500 mb-2 uppercase tracking-wide">
                                        Distribución del total
                                    </div>
                                    <div className="relative h-6 bg-zinc-900 rounded-md overflow-hidden mb-3">
                                        {(() => {
                                            const porcentajeCostos = (calculoCotizacion.totalCosto / calculoCotizacion.total) * 100;
                                            const porcentajeGastos = (calculoCotizacion.totalGasto / calculoCotizacion.total) * 100;
                                            const porcentajeComision = (calculoCotizacion.comisionMonto / calculoCotizacion.total) * 100;
                                            const porcentajeUtilidad = (calculoCotizacion.utilidadNeta / calculoCotizacion.total) * 100;

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
                                                            width: `${porcentajeGastos}%`
                                                        }}
                                                    />
                                                    <div
                                                        className="absolute h-full bg-yellow-500/50"
                                                        style={{
                                                            left: `${porcentajeCostos + porcentajeGastos}%`,
                                                            width: `${porcentajeComision}%`
                                                        }}
                                                    />
                                                    <div
                                                        className="absolute h-full bg-emerald-500/50"
                                                        style={{
                                                            left: `${porcentajeCostos + porcentajeGastos + porcentajeComision}%`,
                                                            width: `${porcentajeUtilidad}%`
                                                        }}
                                                    />
                                                </>
                                            );
                                        })()}
                                    </div>

                                    {/* Leyenda */}
                                    <div className="space-y-1.5">
                                        {(() => {
                                            const porcentajeCostos = (calculoCotizacion.totalCosto / calculoCotizacion.total) * 100;
                                            const porcentajeGastos = (calculoCotizacion.totalGasto / calculoCotizacion.total) * 100;
                                            const porcentajeComision = (calculoCotizacion.comisionMonto / calculoCotizacion.total) * 100;
                                            const porcentajeUtilidad = (calculoCotizacion.utilidadNeta / calculoCotizacion.total) * 100;

                                            return (
                                                <>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-red-500/50 rounded-sm"></div>
                                                            <span className="text-zinc-500">Costos</span>
                                                        </div>
                                                        <span className="text-zinc-400 font-mono">
                                                            {formatCurrency(calculoCotizacion.totalCosto)} · {porcentajeCostos.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-orange-500/50 rounded-sm"></div>
                                                            <span className="text-zinc-500">Gastos</span>
                                                        </div>
                                                        <span className="text-zinc-400 font-mono">
                                                            {formatCurrency(calculoCotizacion.totalGasto)} · {porcentajeGastos.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-yellow-500/50 rounded-sm"></div>
                                                            <span className="text-zinc-500">Comisión</span>
                                                        </div>
                                                        <span className="text-zinc-400 font-mono">
                                                            {formatCurrency(calculoCotizacion.comisionMonto)} · {porcentajeComision.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-emerald-500/50 rounded-sm"></div>
                                                            <span className="text-zinc-500">Utilidad</span>
                                                        </div>
                                                        <span className="text-emerald-400 font-mono font-medium">
                                                            {formatCurrency(calculoCotizacion.utilidadNeta)} · {porcentajeUtilidad.toFixed(0)}%
                                                        </span>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </ZenCard>
                    )}
                </div>
            </div>

            {/* Modal de validación */}
            {
                showValidationModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-md w-full">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                    <span className="text-orange-400 text-xl">⚠️</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Validación Requerida</h3>
                                    <p className="text-sm text-zinc-400">No se puede continuar</p>
                                </div>
                            </div>

                            <p className="text-zinc-300 mb-6">
                                {validationMessage}
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowValidationModal(false)}
                                    className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-md transition-colors"
                                >
                                    Entendido
                                </button>
                            </div>
                        </div>
                    </div>
                )}
        </>
    )
}