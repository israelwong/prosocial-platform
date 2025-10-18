'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { X, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
    ZenButton,
    ZenTextarea,
    ZenCard,
    ZenCardContent,
} from '@/components/ui/zen';
import {
    crearServicio,
    actualizarServicio,
    obtenerCategorias,
} from '@/lib/actions/studio/builder/catalogo/items.actions';
import { obtenerConfiguracionPrecios as cargarConfiguracionPrecios } from '@/lib/actions/studio/builder/catalogo/utilidad.actions';
import { calcularPrecio, formatearMoneda, type ConfiguracionPrecios } from '@/lib/actions/studio/builder/catalogo/calcular-precio';
import type { ServicioData, CategoriaData } from '@/lib/actions/schemas/catalogo-schemas';

interface ServicioFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    studioSlug: string;
    servicio?: ServicioData | null;
    categoriaId?: string | null;
}

interface Gasto {
    nombre: string;
    costo: string;
}

/**
 * Calcular precios dinámicamente usando la función centralizada
 */
export function ServicioForm({
    isOpen,
    onClose,
    onSuccess,
    studioSlug,
    servicio,
    categoriaId,
}: ServicioFormProps) {

    console.log('servicio', servicio);

    const [loading, setLoading] = useState(false);
    const [categorias, setCategorias] = useState<CategoriaData[]>([]);
    const [configuracion, setConfiguracion] = useState<ConfiguracionPrecios | null>(null);

    // Campos del formulario
    const [nombre, setNombre] = useState('');
    const [costo, setCosto] = useState('');
    const [tipoUtilidad, setTipoUtilidad] = useState<'servicio' | 'producto'>('servicio');
    const [selectedCategoriaId, setSelectedCategoriaId] = useState('');
    const [status, setStatus] = useState<'active' | 'inactive'>('active');
    const [gastos, setGastos] = useState<Gasto[]>([]);

    // Campos temporales para agregar gastos
    const [nuevoGastoNombre, setNuevoGastoNombre] = useState('');
    const [nuevoGastoCosto, setNuevoGastoCosto] = useState('');

    // Estados para secciones colapsables
    const [showDesglosePrecios, setShowDesglosePrecios] = useState(false);

    // ✅ Función para validar y formatear números a 2 decimales sin negativos
    const formatearNumero = (valor: string): string => {
        if (!valor) return '';
        const numero = parseFloat(valor);
        if (isNaN(numero)) return '';
        // No permitir negativos
        if (numero < 0) return '0.00';
        // Limitar a 2 decimales
        return numero.toFixed(2);
    };

    // ✅ Validar input numérico en tiempo real
    const validarNumeroInput = (valor: string): string => {
        if (!valor) return '';
        // Permitir solo números y punto decimal
        const valorLimpio = valor.replace(/[^0-9.]/g, '');
        // Evitar múltiples puntos decimales
        const partes = valorLimpio.split('.');
        if (partes.length > 2) {
            return partes[0] + '.' + partes.slice(1).join('');
        }
        // Limitar decimales a 2 dígitos mientras se escribe
        if (partes[1] && partes[1].length > 2) {
            return partes[0] + '.' + partes[1].substring(0, 2);
        }
        return valorLimpio;
    };

    // Función para resetear el formulario
    const resetForm = () => {
        setNombre('');
        setCosto('');
        setTipoUtilidad('servicio');
        setSelectedCategoriaId('');
        setStatus('active');
        setGastos([]);
        setNuevoGastoNombre('');
        setNuevoGastoCosto('');
    };

    // Cargar categorías y configuración
    useEffect(() => {
        if (isOpen) {
            cargarDatos();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    // Cargar datos del servicio al editar
    useEffect(() => {
        if (servicio) {
            setNombre(servicio.nombre);
            setCosto(String(servicio.costo));
            setTipoUtilidad(servicio.tipo_utilidad as 'servicio' | 'producto');
            setSelectedCategoriaId(servicio.servicioCategoriaId);
            setStatus(servicio.status as 'active' | 'inactive');
            // Cargar gastos si existen
            if (servicio.gastos && servicio.gastos.length > 0) {
                setGastos(servicio.gastos.map((g) => ({
                    nombre: g.nombre,
                    costo: String(g.costo),
                })));
            } else {
                setGastos([]);
            }
        } else {
            resetForm();
            if (categoriaId) {
                setSelectedCategoriaId(categoriaId);
            }
        }
    }, [servicio, categoriaId]);

    const cargarDatos = async () => {
        try {
            const [resultCategorias, resultConfiguracion] = await Promise.all([
                obtenerCategorias(),
                cargarConfiguracionPrecios(studioSlug),
            ]);

            if (resultCategorias.success && resultCategorias.data) {
                setCategorias(resultCategorias.data);
            }

            if (resultConfiguracion) {                // Convertir strings a números - calcularPrecios() normalizará automáticamente
                setConfiguracion({
                    utilidad_servicio: parseFloat(resultConfiguracion.utilidad_servicio),
                    utilidad_producto: parseFloat(resultConfiguracion.utilidad_producto),
                    comision_venta: parseFloat(resultConfiguracion.comision_venta),
                    sobreprecio: parseFloat(resultConfiguracion.sobreprecio),
                });
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar configuración');
        }
    };

    // Cálculo del precio usando la función única
    const resultadoPrecio = useMemo(() => {
        const costoNum = parseFloat(costo) || 0;
        const gastosArray = gastos.map(g => parseFloat(g.costo) || 0);
        const totalGastos = parseFloat(gastosArray.reduce((acc, g) => acc + g, 0).toFixed(2));

        if (!configuracion) {
            return {
                // Precios finales
                precio_final: costoNum + totalGastos,
                precio_base: costoNum + totalGastos,

                // Componentes base
                costo: costoNum,
                gasto: totalGastos,
                utilidad_base: 0,

                // Desglose de precios
                subtotal: costoNum + totalGastos,
                monto_comision: 0,
                monto_sobreprecio: 0,

                // Porcentajes
                porcentaje_utilidad: 0,
                porcentaje_comision: 0,
                porcentaje_sobreprecio: 0,

                // Verificación
                utilidad_real: 0,
                porcentaje_utilidad_real: 0,
            };
        }

        return calcularPrecio(costoNum, totalGastos, tipoUtilidad, configuracion);
    }, [costo, gastos, tipoUtilidad, configuracion]);

    const handleAgregarGasto = () => {
        if (!nuevoGastoNombre.trim()) {
            toast.error('Ingresa el concepto del gasto');
            return;
        }

        const costoNum = parseFloat(nuevoGastoCosto);
        if (isNaN(costoNum) || costoNum < 0) {
            toast.error('Ingresa un monto válido (no puede ser negativo)');
            return;
        }

        const costoFormateado = formatearNumero(nuevoGastoCosto);
        setGastos([...gastos, { nombre: nuevoGastoNombre, costo: costoFormateado }]);
        setNuevoGastoNombre('');
        setNuevoGastoCosto('');
    };

    const handleEliminarGasto = (index: number) => {
        setGastos(gastos.filter((_, i) => i !== index));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!nombre.trim()) {
            toast.error('El nombre es requerido');
            return;
        }

        if (!selectedCategoriaId) {
            toast.error('Selecciona una categoría');
            return;
        }

        const costoNum = parseFloat(costo);
        if (isNaN(costoNum) || costoNum < 0) {
            toast.error('Ingresa un costo válido');
            return;
        }

        setLoading(true);
        try {
            const data = {
                nombre,
                costo: costoNum,
                gasto: gastos.reduce((sum, g) => sum + parseFloat(g.costo) || 0, 0), // Total de gastos
                utilidad: 0, // Se calculará en el backend
                precio_publico: resultadoPrecio.precio_final, // Precio calculado automáticamente
                tipo_utilidad: tipoUtilidad,
                servicioCategoriaId: selectedCategoriaId,
                status,
                orden: 0, // Se asignará automáticamente en el backend
                gastos: gastos.map((g) => ({
                    nombre: g.nombre,
                    costo: parseFloat(g.costo),
                })),
            };

            if (servicio) {
                // Actualizar
                const result = await actualizarServicio(studioSlug, servicio.id, data);
                if (result.success) {
                    toast.success('Servicio actualizado exitosamente');
                    onSuccess();
                } else {
                    toast.error(result.error || 'Error al actualizar');
                }
            } else {
                // Crear
                const result = await crearServicio(studioSlug, data);
                if (result.success) {
                    toast.success('Servicio creado exitosamente');
                    onSuccess();
                } else {
                    toast.error(result.error || 'Error al crear');
                }
            }
        } catch (error) {
            console.error('Error guardando servicio:', error);
            toast.error('Error al guardar el servicio');
        } finally {
            setLoading(false);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <ZenCard className="w-full max-w-4xl my-8">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-semibold text-white">
                        {servicio ? 'Editar Servicio' : 'Nuevo Servicio'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Contenido */}
                <ZenCardContent className="p-6">
                    <form onSubmit={handleSave} className="space-y-4">
                        {/* Información básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-300">
                                    Categoría <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={selectedCategoriaId}
                                    onChange={(e) => setSelectedCategoriaId(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categorias.map((categoria) => (
                                        <option key={categoria.id} value={categoria.id}>
                                            {categoria.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-300">
                                    Tipo de Utilidad
                                </label>
                                <select
                                    value={tipoUtilidad}
                                    onChange={(e) => setTipoUtilidad(e.target.value as 'servicio' | 'producto')}
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="servicio">
                                        Servicio ({configuracion ? configuracion.utilidad_servicio.toFixed(0) : '30'}% utilidad)
                                    </option>
                                    <option value="producto">
                                        Producto ({configuracion ? configuracion.utilidad_producto.toFixed(0) : '40'}% utilidad)
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Nombre / Descripción */}
                        <ZenTextarea
                            label="Nombre / Descripción del Servicio"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Ej: Shooting en estudio fotográfico hasta por 45 minutos"
                            required
                            minRows={2}
                            maxLength={500}
                        />

                        {/* Precios - Sección principal */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-300">
                                    Costo Base <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={costo}
                                    onChange={(e) => setCosto(validarNumeroInput(e.target.value))}
                                    onBlur={(e) => {
                                        if (e.target.value) {
                                            setCosto(formatearNumero(e.target.value));
                                        }
                                    }}
                                    placeholder="0.00"
                                    required
                                    className="flex h-10 w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-300">
                                    Precio Sugerido
                                </label>
                                <div className="flex h-10 w-full items-center rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-emerald-400 font-semibold">
                                    {formatearMoneda(resultadoPrecio.precio_final)}
                                </div>
                            </div>
                        </div>

                        {/* Gastos - Compacto */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-sm font-medium text-zinc-300">Gastos Asociados</h3>
                                <span className="text-xs text-zinc-500">{gastos.length} gasto{gastos.length !== 1 ? 's' : ''}</span>
                            </div>

                            {/* Lista de gastos compacta */}
                            {gastos.length > 0 && (
                                <div className="space-y-2 max-h-32 overflow-y-auto">
                                    {gastos.map((gasto, index) => (
                                        <div key={index} className="flex items-center gap-2 text-sm">
                                            <input
                                                value={gasto.nombre}
                                                onChange={(e) => {
                                                    const newGastos = [...gastos];
                                                    newGastos[index].nombre = e.target.value;
                                                    setGastos(newGastos);
                                                }}
                                                placeholder="Concepto"
                                                className="flex h-8 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-xs text-white"
                                            />
                                            <input
                                                value={gasto.costo}
                                                onChange={(e) => {
                                                    const newGastos = [...gastos];
                                                    newGastos[index].costo = validarNumeroInput(e.target.value);
                                                    setGastos(newGastos);
                                                }}
                                                onBlur={(e) => {
                                                    if (e.target.value) {
                                                        const newGastos = [...gastos];
                                                        newGastos[index].costo = formatearNumero(e.target.value);
                                                        setGastos(newGastos);
                                                    }
                                                }}
                                                placeholder="Monto"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                className="flex h-8 w-24 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-xs text-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleEliminarGasto(index)}
                                                className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-colors"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Agregar nuevo gasto */}
                            <div className="flex items-center gap-2">
                                <input
                                    value={nuevoGastoNombre}
                                    onChange={(e) => setNuevoGastoNombre(e.target.value)}
                                    placeholder="Nuevo concepto"
                                    className="flex h-8 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-xs text-white"
                                />
                                <input
                                    value={nuevoGastoCosto}
                                    onChange={(e) => setNuevoGastoCosto(validarNumeroInput(e.target.value))}
                                    onBlur={(e) => {
                                        if (e.target.value) {
                                            setNuevoGastoCosto(formatearNumero(e.target.value));
                                        }
                                    }}
                                    placeholder="Monto"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    className="flex h-8 w-24 rounded-md border border-zinc-700 bg-zinc-900 px-2 text-xs text-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleAgregarGasto}
                                    className="p-1 text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                >
                                    <Plus className="h-3 w-3" />
                                </button>
                            </div>
                        </div>

                        {/* Desglose de precios - Colapsable */}
                        <div className="border border-zinc-700/70 rounded-lg bg-zinc-800/30">
                            <button
                                type="button"
                                onClick={() => setShowDesglosePrecios(!showDesglosePrecios)}
                                className="w-full flex items-center justify-between p-3 text-left hover:bg-zinc-700/30 transition-colors"
                            >
                                <div>
                                    <span className="text-sm font-medium text-zinc-300">Desglose de Precios</span>
                                    <span className="text-xs text-zinc-500 ml-2">
                                        {formatearMoneda(resultadoPrecio.precio_final)} final
                                    </span>
                                </div>
                                {showDesglosePrecios ? (
                                    <ChevronUp className="h-4 w-4 text-zinc-400" />
                                ) : (
                                    <ChevronDown className="h-4 w-4 text-zinc-400" />
                                )}
                            </button>

                            {showDesglosePrecios && (
                                <div className="px-3 pb-3 space-y-3 border-t border-zinc-700/50">
                                    {/* Precio Final destacado */}
                                    <div className="text-center p-3 bg-zinc-900/50 rounded-lg">
                                        <div className="text-zinc-400 text-xs mb-1">Precio Final al Cliente</div>
                                        <div className="text-xl font-bold text-emerald-400">{formatearMoneda(resultadoPrecio.precio_final)}</div>
                                    </div>

                                    {/* Desglose compacto */}
                                    <div className="space-y-1 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Costo base:</span>
                                            <span className="text-zinc-200">{formatearMoneda(resultadoPrecio.costo)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Gastos:</span>
                                            <span className="text-zinc-200">{formatearMoneda(resultadoPrecio.gasto)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Utilidad ({resultadoPrecio.porcentaje_utilidad}%):</span>
                                            <span className="text-zinc-200">{formatearMoneda(resultadoPrecio.utilidad_base)}</span>
                                        </div>
                                        <div className="border-t border-zinc-700 pt-1">
                                            <div className="flex justify-between font-medium">
                                                <span className="text-zinc-300">Subtotal:</span>
                                                <span className="text-zinc-200">{formatearMoneda(resultadoPrecio.subtotal)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Comisión ({resultadoPrecio.porcentaje_comision}%):</span>
                                            <span className="text-zinc-200">{formatearMoneda(resultadoPrecio.monto_comision)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-zinc-400">Sobreprecio ({resultadoPrecio.porcentaje_sobreprecio}%):</span>
                                            <span className="text-zinc-200">{formatearMoneda(resultadoPrecio.monto_sobreprecio)}</span>
                                        </div>
                                        <div className="border-t border-zinc-700 pt-1">
                                            <div className="flex justify-between font-medium">
                                                <span className="text-zinc-200">Precio sistema:</span>
                                                <span className="text-emerald-400">{formatearMoneda(resultadoPrecio.precio_final)}</span>
                                            </div>
                                        </div>

                                        {/* Verificación compacta */}
                                        <div className="bg-zinc-700/20 rounded p-2 mt-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-zinc-300">Utilidad real:</span>
                                                <span className="text-emerald-400">{resultadoPrecio.porcentaje_utilidad_real}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Status - Compacto */}
                        <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-700/50 bg-zinc-800/30">
                            <div>
                                <span className="text-sm font-medium text-zinc-300">Estado</span>
                                <span className="text-xs text-zinc-500 ml-2">
                                    {status === 'active' ? 'Visible' : 'Oculto'}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStatus(status === 'active' ? 'inactive' : 'active')}
                                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${status === 'active' ? 'bg-blue-600' : 'bg-zinc-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${status === 'active' ? 'translate-x-5' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                            <ZenButton type="button" variant="ghost" onClick={onClose}>
                                Cancelar
                            </ZenButton>
                            <ZenButton
                                type="submit"
                                variant="primary"
                                loading={loading}
                                disabled={loading}
                            >
                                {servicio ? 'Actualizar' : 'Crear Servicio'}
                            </ZenButton>
                        </div>
                    </form>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}