'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { ZenInput } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { ZenBadge } from '@/components/ui/zen';
import { ZenLabel } from '@/components/ui/zen';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
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
import {
    AlertTriangle,
    Calculator,
    TrendingUp,
    Save
} from 'lucide-react';

// Componente reutilizable para campos de porcentaje con ZEN
interface PorcentajeFieldZenProps {
    label: string;
    name: keyof ConfiguracionPreciosFormType;
    description: string;
    register: ReturnType<typeof useForm<ConfiguracionPreciosFormType>>['register'];
    errors: ReturnType<typeof useForm<ConfiguracionPreciosFormType>>['formState']['errors'];
    placeholder?: string;
}

function PorcentajeFieldZen({ label, name, description, register, errors, placeholder = "0" }: PorcentajeFieldZenProps) {
    return (
        <div className="space-y-2">
            <ZenLabel htmlFor={name}>
                {label} (%)
            </ZenLabel>
            <div className="relative">
                <ZenInput
                    {...register(name)}
                    type="number"
                    min="0"
                    max="100"
                    step="1"
                    placeholder={placeholder}
                    label="" // Added to satisfy ZenInputProps
                    className="pr-8"
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

interface ConfiguracionPreciosFormZenProps {
    studioSlug: string;
    initialData: ConfiguracionPreciosData;
    onUpdate?: (data: ConfiguracionPreciosData) => void;
}

export function ConfiguracionPreciosFormZen({
    studioSlug,
    initialData,
    onUpdate
}: ConfiguracionPreciosFormZenProps) {
    const [serviciosExistentes, setServiciosExistentes] = useState<ServiciosExistentes | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ConfiguracionPreciosFormType>({
        resolver: zodResolver(ConfiguracionPreciosSchema),
        defaultValues: {
            utilidad_servicio: initialData?.utilidad_servicio || '30',
            utilidad_producto: initialData?.utilidad_producto || '40',
            comision_venta: initialData?.comision_venta || '10',
            sobreprecio: initialData?.sobreprecio || '5',
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
        }
    };

    // Observar cambios en los campos para mostrar preview
    const watchedValues = watch();

    return (
        <div className="space-y-6">
            {/* Alerta de servicios existentes */}
            {serviciosExistentes?.requiere_actualizacion_masiva && (
                <ZenCard variant="default" padding="lg" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
                    <ZenCardContent className="pt-6">
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
                                    <ZenBadge variant="secondary" className="text-yellow-700 border-yellow-300">
                                        {serviciosExistentes.servicios_por_tipo.servicios} Servicios
                                    </ZenBadge>
                                    <ZenBadge variant="secondary" className="text-yellow-700 border-yellow-300">
                                        {serviciosExistentes.servicios_por_tipo.productos} Productos
                                    </ZenBadge>
                                    <ZenBadge variant="secondary" className="text-yellow-700 border-yellow-300">
                                        {serviciosExistentes.servicios_por_tipo.paquetes} Paquetes
                                    </ZenBadge>
                                </div>
                            </div>
                        </div>
                    </ZenCardContent>
                </ZenCard>
            )}

            <HeaderNavigation
                title="Configuración de Precios"
                description="Define los porcentajes de utilidad, comisiones y configuraciones de precios para tu negocio"
                actionButton={{
                    label: "Guardar Cambios",
                    onClick: () => handleSubmit(onSubmit)(),
                    icon: "Save"
                }}
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Configuración de Precios */}
                <ZenCard variant="default" padding="lg">
                    <ZenCardContent className="space-y-6">
                        {/* Porcentajes de Utilidad */}
                        <div>
                            <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Porcentajes de Utilidad
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PorcentajeFieldZen
                                    label="Utilidad en Servicios"
                                    name="utilidad_servicio"
                                    description="Margen de utilidad para servicios"
                                    register={register}
                                    errors={errors}
                                    placeholder="30"
                                />
                                <PorcentajeFieldZen
                                    label="Utilidad en Productos"
                                    name="utilidad_producto"
                                    description="Margen de utilidad para productos físicos"
                                    register={register}
                                    errors={errors}
                                    placeholder="40"
                                />
                            </div>
                        </div>

                        {/* Comisiones y Sobreprecio */}
                        <div>
                            <h4 className="text-lg font-medium text-white mb-3 flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Comisiones y Sobreprecio
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <PorcentajeFieldZen
                                    label="Comisión de Venta"
                                    name="comision_venta"
                                    description="Comisión aplicada sobre el precio final"
                                    register={register}
                                    errors={errors}
                                    placeholder="10"
                                />
                                <PorcentajeFieldZen
                                    label="Sobreprecio aplicado al precio final"
                                    name="sobreprecio"
                                    description="Porcentaje que se suma al precio final para crear una reserva de descuento (no se podrá aplicar un descuento mayor al sobreprecio)"
                                    register={register}
                                    errors={errors}
                                    placeholder="5"
                                />
                            </div>
                        </div>
                    </ZenCardContent>
                </ZenCard>

                {/* Preview de Cálculo */}
                <ZenCard variant="default" padding="lg">
                    <ZenCardHeader>
                        <ZenCardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            Preview de Cálculo
                        </ZenCardTitle>
                        <ZenCardDescription>
                            Ejemplo de cómo se calcularían los precios con la configuración actual
                        </ZenCardDescription>
                    </ZenCardHeader>
                    <ZenCardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Ejemplo Servicio */}
                            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
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
                            <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
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
                        </div>
                    </ZenCardContent>
                </ZenCard>
            </form>
        </div>
    );
}
