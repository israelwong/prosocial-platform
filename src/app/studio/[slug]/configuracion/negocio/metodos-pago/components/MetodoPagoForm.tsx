'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Modal } from '@/components/ui/modal';
import { Save, CreditCard, Percent, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import {
    crearMetodoPago,
    actualizarMetodoPago
} from '@/lib/actions/studio/config/metodos-pago.actions';
import { MetodoPagoSchema, type MetodoPagoForm as MetodoPagoFormType } from '@/lib/actions/schemas/metodos-pago-schemas';
import { MetodoPagoData } from '../types';

interface MetodoPagoFormProps {
    studioSlug: string;
    metodo?: MetodoPagoData | null;
    onClose: () => void;
    onSuccess?: (metodo: MetodoPagoData) => void; // Callback para actualización local
}

export function MetodoPagoForm({ studioSlug, metodo, onClose, onSuccess }: MetodoPagoFormProps) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!metodo;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<MetodoPagoFormType>({
        resolver: zodResolver(MetodoPagoSchema),
        defaultValues: {
            metodo_pago: '',
            comision_porcentaje_base: '',
            comision_fija_monto: '',
            payment_method: 'cash',
            tipo: 'manual',
            requiere_stripe: false,
            status: 'active',
            orden: 0,
        }
    });

    // Cargar datos si estamos editando
    useEffect(() => {
        if (metodo) {
            reset({
                metodo_pago: metodo.metodo_pago,
                comision_porcentaje_base: metodo.comision_porcentaje_base?.toString() || '',
                comision_fija_monto: metodo.comision_fija_monto?.toString() || '',
                payment_method: metodo.payment_method || 'cash',
                tipo: metodo.tipo,
                requiere_stripe: metodo.requiere_stripe,
                status: metodo.status,
                orden: metodo.orden,
            });
        }
    }, [metodo, reset]);

    const onSubmit = async (data: MetodoPagoFormType) => {
        setLoading(true);
        const loadingToast = toast.loading(
            isEditing ? 'Actualizando método de pago...' : 'Creando método de pago...'
        );

        try {
            let result;

            if (isEditing && metodo) {
                result = await actualizarMetodoPago(studioSlug, metodo.id, data);
            } else {
                result = await crearMetodoPago(studioSlug, data);
            }

            // Cerrar toast de loading
            toast.dismiss(loadingToast);

            if (result.success) {
                toast.success(
                    isEditing
                        ? 'Método de pago actualizado exitosamente'
                        : 'Método de pago creado exitosamente'
                );

                // Actualización local optimista
                if (onSuccess && result.data) {
                    onSuccess(result.data);
                }

                onClose();
            } else {
                const fieldErrors = result.error ? Object.values(result.error).flat() : [];
                const errorMessage = fieldErrors[0] || 'Hubo un error al guardar. Inténtalo de nuevo.';
                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error al guardar método:', error);
            // Cerrar toast de loading en caso de error
            toast.dismiss(loadingToast);
            toast.error('Error interno del servidor. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Observar cambios para preview
    const watchedValues = watch();

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={isEditing ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
            description={isEditing
                ? 'Modifica los detalles del método de pago'
                : 'Define un nuevo método de pago para tu negocio'
            }
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nombre del método */}
                <div className="space-y-2">
                    <Label htmlFor="metodo_pago">Nombre del Método *</Label>
                    <Input
                        id="metodo_pago"
                        {...register('metodo_pago')}
                        placeholder="Ej: Efectivo, Tarjeta de Crédito, SPEI"
                        className={errors.metodo_pago ? 'border-red-500' : ''}
                    />
                    {errors.metodo_pago && (
                        <p className="text-sm text-red-500">{errors.metodo_pago.message}</p>
                    )}
                </div>

                {/* Tipo de método */}
                <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Método</Label>
                    <Select
                        value={watchedValues.tipo}
                        onValueChange={(value) => setValue('tipo', value as 'manual' | 'stripe_automatico' | 'msi')}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="manual">Manual</SelectItem>
                            <SelectItem value="stripe_automatico">Stripe Automático</SelectItem>
                            <SelectItem value="msi">Meses Sin Intereses (MSI)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                    <Label htmlFor="payment_method">Método de Pago</Label>
                    <Select
                        value={watchedValues.payment_method || 'cash'}
                        onValueChange={(value) => setValue('payment_method', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona el método" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="cash">Efectivo</SelectItem>
                            <SelectItem value="card">Tarjeta</SelectItem>
                            <SelectItem value="spei_directo">SPEI Directo</SelectItem>
                            <SelectItem value="transferencia">Transferencia</SelectItem>
                            <SelectItem value="deposito">Depósito</SelectItem>
                            <SelectItem value="oxxo">OXXO</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Comisiones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Comisión Porcentaje */}
                    <div className="space-y-2">
                        <Label htmlFor="comision_porcentaje_base" className="flex items-center space-x-2">
                            <Percent className="h-4 w-4" />
                            <span>Comisión (%)</span>
                        </Label>
                        <Input
                            id="comision_porcentaje_base"
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            {...register('comision_porcentaje_base')}
                            placeholder="0"
                            className={errors.comision_porcentaje_base ? 'border-red-500' : ''}
                        />
                        {errors.comision_porcentaje_base && (
                            <p className="text-sm text-red-500">{errors.comision_porcentaje_base.message}</p>
                        )}
                    </div>

                    {/* Comisión Fija */}
                    <div className="space-y-2">
                        <Label htmlFor="comision_fija_monto" className="flex items-center space-x-2">
                            <DollarSign className="h-4 w-4" />
                            <span>Comisión Fija ($)</span>
                        </Label>
                        <Input
                            id="comision_fija_monto"
                            type="number"
                            min="0"
                            step="0.01"
                            {...register('comision_fija_monto')}
                            placeholder="0"
                            className={errors.comision_fija_monto ? 'border-red-500' : ''}
                        />
                        {errors.comision_fija_monto && (
                            <p className="text-sm text-red-500">{errors.comision_fija_monto.message}</p>
                        )}
                    </div>
                </div>

                {/* Requiere Stripe */}
                <div className="flex items-center space-x-3">
                    <Switch
                        id="requiere_stripe"
                        checked={watchedValues.requiere_stripe}
                        onCheckedChange={(checked) => setValue('requiere_stripe', checked)}
                    />
                    <Label htmlFor="requiere_stripe" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Requiere configuración de Stripe</span>
                    </Label>
                </div>

                {/* Estatus */}
                <div className="space-y-2">
                    <Label htmlFor="status">Estatus</Label>
                    <Select
                        value={watchedValues.status}
                        onValueChange={(value) => setValue('status', value as 'active' | 'inactive')}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona el estatus" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="active">Activo</SelectItem>
                            <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Preview */}
                {(watchedValues.comision_porcentaje_base || watchedValues.comision_fija_monto) && (
                    <div className="bg-zinc-800 rounded-lg p-4 space-y-2">
                        <h4 className="font-medium text-white">Vista Previa</h4>
                        <div className="text-sm text-zinc-300 space-y-1">
                            {watchedValues.comision_porcentaje_base && (
                                <p>
                                    <span className="text-blue-400">Comisión:</span> {watchedValues.comision_porcentaje_base}%
                                </p>
                            )}
                            {watchedValues.comision_fija_monto && (
                                <p>
                                    <span className="text-green-400">Comisión fija:</span> ${watchedValues.comision_fija_monto}
                                </p>
                            )}
                            {watchedValues.requiere_stripe && (
                                <p>
                                    <span className="text-orange-400">Requiere Stripe</span>
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
