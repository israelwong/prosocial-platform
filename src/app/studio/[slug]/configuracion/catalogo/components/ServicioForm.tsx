'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { X, Plus, Trash2 } from 'lucide-react';
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
} from '@/lib/actions/studio/config/catalogo.actions';
import { obtenerConfiguracionPrecios } from '@/lib/actions/studio/config/configuracion-precios.actions';
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

interface ConfiguracionPrecios {
    utilidad_servicio: number; // Fracción (ej: 0.30 para 30%)
    utilidad_producto: number;
    comision_venta: number;
    sobreprecio: number;
}

export function ServicioForm({
    isOpen,
    onClose,
    onSuccess,
    studioSlug,
    servicio,
    categoriaId,
}: ServicioFormProps) {
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
                obtenerCategorias(studioSlug),
                obtenerConfiguracionPrecios(studioSlug),
            ]);

            if (resultCategorias.success && resultCategorias.data) {
                setCategorias(resultCategorias.data);
            }

            if (resultConfiguracion) {
                // Convertir de string porcentaje a fracción
                setConfiguracion({
                    utilidad_servicio: parseFloat(resultConfiguracion.utilidad_servicio) / 100,
                    utilidad_producto: parseFloat(resultConfiguracion.utilidad_producto) / 100,
                    comision_venta: parseFloat(resultConfiguracion.comision_venta) / 100,
                    sobreprecio: parseFloat(resultConfiguracion.sobreprecio) / 100,
                });
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar configuración');
        }
    };

    // Cálculos automáticos basados en la lógica del legacy
    const {
        utilidadBase,
        totalGastos,
        sobreprecioMonto,
        comisionVentaMonto,
        precioSistema,
    } = useMemo(() => {
        const costoNum = parseFloat(costo) || 0;
        const gastosArray = gastos.map(g => parseFloat(g.costo) || 0);
        const totalGastos = parseFloat(gastosArray.reduce((acc, g) => acc + g, 0).toFixed(2));

        // Obtener porcentajes según tipo de utilidad
        const utilidadPorcentaje = tipoUtilidad === 'servicio'
            ? (configuracion?.utilidad_servicio ?? 0.30)
            : (configuracion?.utilidad_producto ?? 0.40);
        const comisionPorcentaje = configuracion?.comision_venta ?? 0.10;
        const sobreprecioPorcentaje = configuracion?.sobreprecio ?? 0.05;

        // Cálculo según fórmula del legacy
        const utilidadBase = parseFloat((costoNum * utilidadPorcentaje).toFixed(2));
        const subtotal = parseFloat((costoNum + totalGastos + utilidadBase).toFixed(2));
        const sobreprecioMonto = parseFloat((sobreprecioPorcentaje * subtotal).toFixed(2));
        const montoTrasSobreprecio = parseFloat((subtotal + sobreprecioMonto).toFixed(2));
        const denominador = 1 - comisionPorcentaje;
        const precioSistema = denominador > 0
            ? parseFloat((montoTrasSobreprecio / denominador).toFixed(2))
            : Infinity;
        const comisionVentaMonto = parseFloat((precioSistema * comisionPorcentaje).toFixed(2));

        return {
            utilidadBase,
            totalGastos,
            subtotal,
            sobreprecioMonto,
            montoTrasSobreprecio,
            comisionVentaMonto,
            precioSistema,
        };
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
                gasto: totalGastos, // Total de gastos calculado
                utilidad: utilidadBase, // Utilidad calculada
                precio_publico: precioSistema, // Precio calculado automáticamente
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

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
        }).format(amount);
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
                    <form onSubmit={handleSave} className="space-y-6">
                        {/* Categoría y Tipo */}
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
                                    <option value="servicio">Servicio ({(configuracion?.utilidad_servicio ?? 0.30) * 100}% utilidad)</option>
                                    <option value="producto">Producto ({(configuracion?.utilidad_producto ?? 0.40) * 100}% utilidad)</option>
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
                            minRows={3}
                            maxLength={500}
                        />

                        {/* Gastos Fijos Asociados */}
                        <div className="p-4 rounded-lg border border-zinc-700/70 bg-zinc-800/50 space-y-4">
                            <h3 className="text-base font-medium text-zinc-200">Gastos Fijos Asociados</h3>

                            {/* Lista de gastos */}
                            <div className="space-y-2">
                                {gastos.map((gasto, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <input
                                            value={gasto.nombre}
                                            onChange={(e) => {
                                                const newGastos = [...gastos];
                                                newGastos[index].nombre = e.target.value;
                                                setGastos(newGastos);
                                            }}
                                            placeholder="Concepto"
                                            className="flex h-9 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-white"
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
                                            className="flex h-9 w-32 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleEliminarGasto(index)}
                                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Agregar nuevo gasto */}
                            <div className="flex items-center gap-2 pt-2 border-t border-zinc-700/50">
                                <input
                                    value={nuevoGastoNombre}
                                    onChange={(e) => setNuevoGastoNombre(e.target.value)}
                                    placeholder="Nuevo concepto"
                                    className="flex h-9 flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-white"
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
                                    className="flex h-9 w-32 rounded-md border border-zinc-700 bg-zinc-900 px-3 text-sm text-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleAgregarGasto}
                                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Precios */}
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-zinc-300">
                                        Costo Base del Servicio <span className="text-red-500">*</span>
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
                                        Precio Sistema (Sugerido)
                                    </label>
                                    <div className="flex h-10 w-full items-center rounded-md border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 font-semibold">
                                        {formatCurrency(precioSistema)}
                                    </div>
                                </div>
                            </div>

                            {/* Desglose de Cálculo */}
                            <div className="p-4 rounded-lg border border-zinc-700/70 bg-zinc-800/50 space-y-4">
                                <h3 className="text-base font-medium text-zinc-200">Desglose de Cálculo</h3>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                                    <div className="text-center">
                                        <div className="font-medium text-zinc-300 mb-1">Utilidad Base</div>
                                        <div className="text-zinc-400">{formatCurrency(utilidadBase)}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-medium text-zinc-300 mb-1">Gastos Totales</div>
                                        <div className="text-zinc-400">{formatCurrency(totalGastos)}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-medium text-zinc-300 mb-1">Sobreprecio</div>
                                        <div className="text-zinc-400">{formatCurrency(sobreprecioMonto)}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="font-medium text-zinc-300 mb-1">Comisión Venta</div>
                                        <div className="text-zinc-400">{formatCurrency(comisionVentaMonto)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Status */}
                        <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-700/70 bg-zinc-800/50">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-zinc-300">
                                    Estado del Servicio
                                </span>
                                <span className="text-xs text-zinc-400 mt-0.5">
                                    {status === 'active' ? 'Visible en cotizaciones' : 'Oculto en cotizaciones'}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={() => setStatus(status === 'active' ? 'inactive' : 'active')}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${status === 'active' ? 'bg-blue-600' : 'bg-zinc-600'
                                    }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${status === 'active' ? 'translate-x-6' : 'translate-x-1'
                                        }`}
                                />
                            </button>
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                            <ZenButton type="button" variant="ghost" onClick={onClose}>
                                Cancelar
                            </ZenButton>
                            <ZenButton
                                type="submit"
                                variant="primary"
                                loading={loading}
                                disabled={loading}
                            >
                                {servicio ? 'Actualizar Servicio' : 'Crear Servicio'}
                            </ZenButton>
                        </div>
                    </form>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}