'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { DollarSign, Info } from 'lucide-react';
import {
    ZenButton,
    ZenInput,
    ZenCard,
    ZenCardHeader,
    ZenCardTitle,
    ZenCardContent
} from '@/components/ui/zen';
import {
    obtenerConfiguracionPrecios,
    actualizarConfiguracionPrecios
} from '@/lib/actions/studio/builder/catalogo/utilidad.actions';
import type {
    ConfiguracionPreciosForm,
} from '@/lib/actions/schemas/configuracion-precios-schemas';

interface UtilidadTabProps {
    studioSlug: string;
}

export function UtilidadTab({ studioSlug }: UtilidadTabProps) {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Estado del formulario (valores decimales 0.0-1.0)
    const [config, setConfig] = useState<ConfiguracionPreciosForm>({
        utilidad_servicio: '0.30',
        utilidad_producto: '0.40',
        comision_venta: '0.10',
        sobreprecio: '0.05'
    });

    // Cargar configuración inicial
    useEffect(() => {
        cargarConfiguracion();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [studioSlug]);

    const cargarConfiguracion = async () => {
        try {
            setLoading(true);

            const configResult = await obtenerConfiguracionPrecios(studioSlug);

            if (configResult) {
                setConfig({
                    utilidad_servicio: configResult.utilidad_servicio,
                    utilidad_producto: configResult.utilidad_producto,
                    comision_venta: configResult.comision_venta,
                    sobreprecio: configResult.sobreprecio
                });
            }
        } catch (error) {
            console.error('Error cargando configuración:', error);
            toast.error('Error al cargar la configuración');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setSubmitting(true);

            const result = await actualizarConfiguracionPrecios(studioSlug, config);

            if (result.success) {
                toast.success('Configuración actualizada exitosamente');
            } else {
                toast.error(result.error || 'Error al actualizar la configuración');
            }
        } catch (error) {
            console.error('Error actualizando configuración:', error);
            toast.error('Error al actualizar la configuración');
        } finally {
            setSubmitting(false);
        }
    };

    const handleInputChange = (field: keyof ConfiguracionPreciosForm, value: string) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-zinc-800/50 rounded animate-pulse"></div>
                <div className="h-64 bg-zinc-800/50 rounded animate-pulse"></div>
                <div className="h-32 bg-zinc-800/50 rounded animate-pulse"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header informativo */}
            <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-blue-400 font-medium mb-1">
                        Configuración de Márgenes de Utilidad
                    </h3>
                    <p className="text-sm text-zinc-400">
                        Estos valores decimales (0.0 a 1.0) se aplican automáticamente a todos los servicios y productos
                        del catálogo. Los cambios recalculan los precios en tiempo real y afectan
                        nuevas cotizaciones (las existentes mantienen sus precios originales).
                    </p>
                </div>
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <ZenCard variant="outlined">
                    <ZenCardHeader className="border-b border-zinc-800">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-green-400" />
                            <ZenCardTitle>Configuración de Utilidad</ZenCardTitle>
                        </div>
                    </ZenCardHeader>

                    <ZenCardContent className="p-6 space-y-4">
                        {/* Utilidad de Servicios */}
                        <ZenInput
                            label="Utilidad de Servicios"
                            type="number"
                            value={config.utilidad_servicio}
                            onChange={(e) => handleInputChange('utilidad_servicio', e.target.value)}
                            min="0"
                            max="1"
                            step="0.01"
                            required
                            hint="Margen de utilidad aplicado a servicios (ej: 0.30 = 30% = $1000 costo → $300 utilidad)"
                        />

                        {/* Utilidad de Productos */}
                        <ZenInput
                            label="Utilidad de Productos"
                            type="number"
                            value={config.utilidad_producto}
                            onChange={(e) => handleInputChange('utilidad_producto', e.target.value)}
                            min="0"
                            max="1"
                            step="0.01"
                            required
                            hint="Margen de utilidad aplicado a productos (ej: 0.40 = 40% = $1000 costo → $400 utilidad)"
                        />

                        {/* Comisión de Venta */}
                        <ZenInput
                            label="Comisión de Venta"
                            type="number"
                            value={config.comision_venta}
                            onChange={(e) => handleInputChange('comision_venta', e.target.value)}
                            min="0"
                            max="1"
                            step="0.01"
                            required
                            hint="Comisión deducida del precio público (ej: 0.10 = 10% comisión)"
                        />

                        {/* Sobreprecio */}
                        <ZenInput
                            label="Sobreprecio / Margen de Descuento"
                            type="number"
                            value={config.sobreprecio}
                            onChange={(e) => handleInputChange('sobreprecio', e.target.value)}
                            min="0"
                            max="1"
                            step="0.01"
                            required
                            hint="Margen adicional para aplicar descuentos sin comprometer la utilidad base (ej: 0.05 = 5% margen)"
                        />
                    </ZenCardContent>
                </ZenCard>

                {/* Botón de guardar */}
                <ZenButton
                    type="submit"
                    variant="primary"
                    loading={submitting}
                    loadingText="Actualizando configuración..."
                    className="w-full"
                    disabled={submitting}
                >
                    Guardar Configuración
                </ZenButton>
            </form>

            {/* Nota adicional */}
            <div className="text-xs text-zinc-500 text-center">
                Los precios se recalculan automáticamente. Las cotizaciones existentes
                mantienen sus precios originales.
            </div>
        </div>
    );
}
