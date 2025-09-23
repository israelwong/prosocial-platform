'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    ConfiguracionPreciosSchema,
    type ConfiguracionPreciosForm as ConfiguracionPreciosFormType
} from '@/lib/actions/schemas/configuracion-precios-schemas';
import { type ConfiguracionPreciosData } from '../types';
import {
    actualizarConfiguracionPrecios,
    verificarServiciosExistentes
} from '@/lib/actions/studio/config/configuracion-precios.actions';
import { type ServiciosExistentes } from '@/lib/actions/schemas/configuracion-precios-schemas';

// Componente reutilizable para campos de porcentaje
interface PorcentajeFieldProps {
    label: string;
    name: keyof ConfiguracionPreciosFormType;
    description: string;
    register: ReturnType<typeof useForm<ConfiguracionPreciosFormType>>['register'];
    errors: ReturnType<typeof useForm<ConfiguracionPreciosFormType>>['formState']['errors'];
    placeholder?: string;
}

function PorcentajeField({ label, name, description, register, errors, placeholder = "0" }: PorcentajeFieldProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-300">
                {label} (%)
            </label>
            <div className="relative">
                <input
                    {...register(name)}
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    placeholder={placeholder}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <span className="text-zinc-400 text-sm">%</span>
                </div>
            </div>
            {errors[name] && (
                <p className="text-red-400 text-xs">{errors[name].message}</p>
            )}
            <p className="text-xs text-zinc-400">
                {description}
            </p>
        </div>
    );
}
import {
    Percent,
    Save,
    AlertTriangle,
    Calculator,
    TrendingUp
} from 'lucide-react';

interface ConfiguracionPreciosFormProps {
    studioSlug: string;
    initialData: ConfiguracionPreciosData;
    onUpdate?: (data: ConfiguracionPreciosData) => void;
}

export function ConfiguracionPreciosForm({
    studioSlug,
    initialData,
    onUpdate
}: ConfiguracionPreciosFormProps) {
    const [serviciosExistentes, setServiciosExistentes] = useState<ServiciosExistentes | null>(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
    } = useForm<ConfiguracionPreciosFormType>({
        resolver: zodResolver(ConfiguracionPreciosSchema),
        defaultValues: {
            utilidad_servicio: initialData?.utilidad_servicio || '30',
            utilidad_producto: initialData?.utilidad_producto || '40',
            // utilidad_paquete eliminada - no está en la base de datos
            comision_venta: initialData?.comision_venta || '10',
            sobreprecio: initialData?.sobreprecio || '5',
            // Campos eliminados: incluir_iva, redondear_precios, aplicar_descuentos_automaticos, numero_maximo_servicios_por_dia
        },
    });

    // Verificar servicios existentes al cargar
    useEffect(() => {
        const verificarServicios = async () => {
            try {
                const servicios = await verificarServiciosExistentes(studioSlug);
                setServiciosExistentes(servicios);
            } catch (error) {
                console.error('Error verificando servicios existentes:', error);
            }
        };

        verificarServicios();
    }, [studioSlug]);

    const onSubmit = async (data: ConfiguracionPreciosFormType) => {
        setLoading(true);
        const loadingToast = toast.loading('Guardando configuración de precios...');

        try {
            const result = await actualizarConfiguracionPrecios(studioSlug, data);

            // Cerrar toast de loading
            toast.dismiss(loadingToast);

            if (result.success) {
                toast.success('¡Configuración guardada con éxito!');

                // Mostrar información sobre servicios actualizados
                if (result.requiere_actualizacion_masiva && result.servicios_actualizados > 0) {
                    toast.success(
                        `Se actualizaron ${result.servicios_actualizados} servicios con los nuevos precios`,
                        { duration: 5000 }
                    );
                }

                // Actualizar datos locales
                const updatedData: ConfiguracionPreciosData = {
                    id: initialData.id,
                    nombre: initialData.nombre,
                    slug: initialData.slug,
                    utilidad_servicio: data.utilidad_servicio,
                    utilidad_producto: data.utilidad_producto,
                    comision_venta: data.comision_venta,
                    sobreprecio: data.sobreprecio,
                };
                onUpdate?.(updatedData);

                // Recargar servicios existentes
                const servicios = await verificarServiciosExistentes(studioSlug);
                setServiciosExistentes(servicios);
            } else {
                const fieldErrors = result.error ? Object.values(result.error).flat() : [];
                const errorMessage = fieldErrors[0] || 'Hubo un error al guardar. Inténtalo de nuevo.';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error al guardar configuración:', error);
            // Cerrar toast de loading en caso de error
            toast.dismiss(loadingToast);
            toast.error('Error interno del servidor. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Observar cambios en los campos para mostrar preview
    const watchedValues = watch();

    return (
        <div className="space-y-6">
            {/* Alerta de servicios existentes */}
            {serviciosExistentes?.requiere_actualizacion_masiva && (
                <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                    <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                            <div>
                                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                                    Actualización Masiva de Precios
                                </h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    Tienes {serviciosExistentes.total_servicios} servicios registrados que se actualizarán
                                    automáticamente con los nuevos porcentajes de utilidad.
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                                        {serviciosExistentes.servicios_por_tipo.servicios} Servicios
                                    </Badge>
                                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                                        {serviciosExistentes.servicios_por_tipo.productos} Productos
                                    </Badge>
                                    <Badge variant="outline" className="text-yellow-700 border-yellow-300">
                                        {serviciosExistentes.servicios_por_tipo.paquetes} Paquetes
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Porcentajes de Utilidad */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Percent className="h-5 w-5" />
                            Porcentajes de Utilidad
                        </CardTitle>
                        <CardDescription>
                            Define los márgenes de utilidad para tus servicios y productos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PorcentajeField
                                label="Utilidad en Servicios"
                                name="utilidad_servicio"
                                description="Margen de utilidad para servicios fotográficos"
                                register={register}
                                errors={errors}
                                placeholder="30"
                            />
                            <PorcentajeField
                                label="Utilidad en Productos"
                                name="utilidad_producto"
                                description="Margen de utilidad para productos físicos"
                                register={register}
                                errors={errors}
                                placeholder="40"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Comisiones y Sobreprecio */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Comisiones y Sobreprecio
                        </CardTitle>
                        <CardDescription>
                            Configura las comisiones de venta y el sobreprecio para aplicar descuentos seguros
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <PorcentajeField
                                label="Comisión de Venta"
                                name="comision_venta"
                                description="Comisión aplicada sobre el precio final"
                                register={register}
                                errors={errors}
                                placeholder="10"
                            />
                            <PorcentajeField
                                label="Sobreprecio aplicado al precio final"
                                name="sobreprecio"
                                description="Porcentaje que se suma al precio final para crear una reserva de descuento (no se podrá aplicar un descuento mayor al sobreprecio)"
                                register={register}
                                errors={errors}
                                placeholder="5"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Configuración Avanzada - ELIMINADA */}

                {/* Preview de Cálculo */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            Preview de Cálculo
                        </CardTitle>
                        <CardDescription>
                            Ejemplo de cómo se calcularían los precios con la configuración actual
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Ejemplo Servicio */}
                            <div className="p-4 bg-zinc-800 rounded-lg">
                                <h4 className="font-medium text-zinc-300 mb-2">Servicio</h4>
                                <div className="text-sm space-y-1">
                                    {(() => {
                                        const costo = 1000;
                                        const utilidadPorcentaje = parseFloat(watchedValues.utilidad_servicio || '0') / 100;
                                        const sobreprecioPorcentaje = parseFloat(watchedValues.sobreprecio || '0') / 100;
                                        const comisionPorcentaje = parseFloat(watchedValues.comision_venta || '0') / 100;

                                        // 1. Calcular utilidad base
                                        const utilidadBase = costo * utilidadPorcentaje;

                                        // 2. Calcular subtotal (costo + utilidad)
                                        const subtotal = costo + utilidadBase;

                                        // 3. Calcular precio base (subtotal + comisión)
                                        const precioBase = subtotal / (1 - comisionPorcentaje);
                                        const comisionMonto = precioBase * comisionPorcentaje;

                                        // 4. Aplicar sobreprecio al precio base (reserva para descuentos)
                                        const sobreprecioMonto = precioBase * sobreprecioPorcentaje;
                                        const precioFinal = precioBase + sobreprecioMonto;

                                        return (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Costo base:</span>
                                                    <span>${costo.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Utilidad ({watchedValues.utilidad_servicio}%):</span>
                                                    <span>${utilidadBase.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Subtotal:</span>
                                                    <span>${subtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Comisión ({watchedValues.comision_venta}%):</span>
                                                    <span>${comisionMonto.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Precio base:</span>
                                                    <span>${precioBase.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Sobreprecio ({watchedValues.sobreprecio}%):</span>
                                                    <span>${sobreprecioMonto.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between font-medium border-t border-zinc-700 pt-1">
                                                    <span>Precio final:</span>
                                                    <span>${precioFinal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-xs text-blue-400">
                                                    <span>Descuento máximo:</span>
                                                    <span>{watchedValues.sobreprecio}% (${sobreprecioMonto.toFixed(2)})</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Ejemplo Producto */}
                            <div className="p-4 bg-zinc-800 rounded-lg">
                                <h4 className="font-medium text-zinc-300 mb-2">Producto</h4>
                                <div className="text-sm space-y-1">
                                    {(() => {
                                        const costo = 500;
                                        const utilidadPorcentaje = parseFloat(watchedValues.utilidad_producto || '0') / 100;
                                        const sobreprecioPorcentaje = parseFloat(watchedValues.sobreprecio || '0') / 100;
                                        const comisionPorcentaje = parseFloat(watchedValues.comision_venta || '0') / 100;

                                        // 1. Calcular utilidad base
                                        const utilidadBase = costo * utilidadPorcentaje;

                                        // 2. Calcular subtotal (costo + utilidad)
                                        const subtotal = costo + utilidadBase;

                                        // 3. Calcular precio base (subtotal + comisión)
                                        const precioBase = subtotal / (1 - comisionPorcentaje);
                                        const comisionMonto = precioBase * comisionPorcentaje;

                                        // 4. Aplicar sobreprecio al precio base (reserva para descuentos)
                                        const sobreprecioMonto = precioBase * sobreprecioPorcentaje;
                                        const precioFinal = precioBase + sobreprecioMonto;

                                        return (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Costo base:</span>
                                                    <span>${costo.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Utilidad ({watchedValues.utilidad_producto}%):</span>
                                                    <span>${utilidadBase.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Subtotal:</span>
                                                    <span>${subtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Comisión ({watchedValues.comision_venta}%):</span>
                                                    <span>${comisionMonto.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Precio base:</span>
                                                    <span>${precioBase.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-zinc-400">Sobreprecio ({watchedValues.sobreprecio}%):</span>
                                                    <span>${sobreprecioMonto.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between font-medium border-t border-zinc-700 pt-1">
                                                    <span>Precio final:</span>
                                                    <span>${precioFinal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-xs text-blue-400">
                                                    <span>Descuento máximo:</span>
                                                    <span>{watchedValues.sobreprecio}% (${sobreprecioMonto.toFixed(2)})</span>
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </div>

                            {/* Ejemplo Paquete - ELIMINADO (no hay utilidad_paquete) */}
                        </div>
                    </CardContent>
                </Card>

                {/* Botón de Guardar */}
                <div className="flex justify-end pt-6 border-t border-zinc-700/50">
                    <Button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save className="mr-2 h-5 w-5" />
                        {isSubmitting || loading ? 'Guardando...' : 'Guardar Configuración'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
