'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ZenButton,
    ZenInput
} from '@/components/ui/zen';
import { Switch } from '@/components/ui/shadcn/switch';
import { Modal } from '@/components/ui/shadcn/modal';
import { Save, CreditCard, Building2, User, Hash } from 'lucide-react';
import { toast } from 'sonner';
import {
    crearCuentaBancaria,
    actualizarCuentaBancaria
} from '@/lib/actions/studio/config/cuentas-bancarias/cuentas-bancarias.actions';
import { CuentaBancariaSchema, type CuentaBancariaForm as CuentaBancariaFormType } from '@/lib/actions/schemas/cuentas-bancarias-schemas';
import { CuentaBancariaData } from '../types';

interface CuentaBancariaFormProps {
    studioSlug: string;
    cuenta?: CuentaBancariaData | null;
    onClose: () => void;
    onSuccess?: (cuenta: CuentaBancariaData) => void;
}

export function CuentaBancariaForm({ studioSlug, cuenta, onClose, onSuccess }: CuentaBancariaFormProps) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!cuenta;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<CuentaBancariaFormType>({
        resolver: zodResolver(CuentaBancariaSchema),
        defaultValues: {
            banco: '',
            numeroCuenta: '',
            titular: '',
            activo: true,
        }
    });

    // Cargar datos si estamos editando
    useEffect(() => {
        if (cuenta) {
            reset({
                banco: cuenta.banco,
                numeroCuenta: cuenta.numeroCuenta,
                titular: cuenta.titular,
                activo: cuenta.activo,
            });
        }
    }, [cuenta, reset]);

    const onSubmit = async (data: CuentaBancariaFormType) => {
        setLoading(true);
        const loadingToast = toast.loading(
            isEditing ? 'Actualizando cuenta bancaria...' : 'Creando cuenta bancaria...'
        );

        try {
            let result;

            if (isEditing && cuenta) {
                result = await actualizarCuentaBancaria(studioSlug, cuenta.id, data);
            } else {
                result = await crearCuentaBancaria(studioSlug, data);
            }

            toast.dismiss(loadingToast);

            if (result.success) {
                toast.success(
                    isEditing
                        ? 'Cuenta bancaria actualizada exitosamente'
                        : 'Cuenta bancaria creada exitosamente'
                );

                if (onSuccess && result.data) {
                    onSuccess(result.data);
                }

                onClose();
            } else {
                // Manejar diferentes tipos de errores
                let errorMessage = 'Hubo un error al guardar. Inténtalo de nuevo.';

                if (typeof result.error === 'string') {
                    // Error simple (como CLABE duplicada)
                    errorMessage = result.error;
                } else if (result.error && typeof result.error === 'object') {
                    // Errores de campo (validación Zod)
                    const fieldErrors = Object.values(result.error).flat();
                    errorMessage = fieldErrors[0] || errorMessage;
                }

                toast.error(errorMessage);
            }
        } catch (error) {
            console.error('Error al guardar cuenta:', error);
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
            title={isEditing ? 'Editar Cuenta Bancaria' : 'Nueva Cuenta Bancaria'}
            description={isEditing
                ? 'Modifica los detalles de la cuenta bancaria'
                : 'Agrega una nueva cuenta bancaria para tu negocio'
            }
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Banco */}
                <ZenInput
                    label="Banco *"
                    id="banco"
                    {...register('banco')}
                    placeholder="Ej: Banco Santander, BBVA, etc."
                    error={errors.banco?.message}
                />

                {/* Número de Cuenta */}
                <ZenInput
                    label="CLABE (18 dígitos) *"
                    id="numeroCuenta"
                    {...register('numeroCuenta')}
                    placeholder="123456789012345678"
                    maxLength={18}
                    onChange={(e) => {
                        // Solo permitir números y máximo 18 dígitos
                        const value = e.target.value.replace(/\D/g, '').slice(0, 18);
                        e.target.value = value;
                        register('numeroCuenta').onChange(e);
                    }}
                    error={errors.numeroCuenta?.message}
                    hint="Ingresa la CLABE de 18 dígitos (solo números)"
                />

                {/* Titular */}
                <ZenInput
                    label="Titular *"
                    id="titular"
                    {...register('titular')}
                    placeholder="Nombre del titular de la cuenta"
                    error={errors.titular?.message}
                />

                {/* Estado Activo */}
                <div className="flex items-center space-x-3">
                    <Switch
                        id="activo"
                        checked={watchedValues.activo}
                        onCheckedChange={(checked) => setValue('activo', checked)}
                    />
                    <div className="flex items-center space-x-2">
                        <span>Cuenta activa</span>
                        {watchedValues.activo ? (
                            <span className="text-green-400 text-sm">(Activa)</span>
                        ) : (
                            <span className="text-zinc-500 text-sm">(Inactiva)</span>
                        )}
                    </div>
                </div>

                {/* Preview */}
                {(watchedValues.banco || watchedValues.numeroCuenta || watchedValues.titular) && (
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 space-y-3">
                        <h4 className="font-medium text-white flex items-center space-x-2">
                            <CreditCard className="h-4 w-4" />
                            <span>Vista Previa</span>
                        </h4>

                        <div className="text-sm text-zinc-300 space-y-2">
                            {watchedValues.banco && (
                                <div className="flex items-center justify-between">
                                    <span className="text-blue-400">Banco:</span>
                                    <span className="font-medium">{watchedValues.banco}</span>
                                </div>
                            )}
                            {watchedValues.numeroCuenta && (
                                <div className="flex items-center justify-between">
                                    <span className="text-green-400">CLABE:</span>
                                    <span className="font-medium font-mono">{watchedValues.numeroCuenta}</span>
                                </div>
                            )}
                            {watchedValues.titular && (
                                <div className="flex items-center justify-between">
                                    <span className="text-orange-400">Titular:</span>
                                    <span className="font-medium">{watchedValues.titular}</span>
                                </div>
                            )}
                        </div>

                        {/* Estados */}
                        <div className="flex items-center space-x-4 text-xs">
                            {watchedValues.activo && (
                                <span className="bg-green-600/20 text-green-400 px-2 py-1 rounded">
                                    Activa
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Botones */}
                <div className="flex justify-end space-x-3 pt-4">
                    <ZenButton type="button" variant="outline" onClick={onClose}>
                        Cancelar
                    </ZenButton>
                    <ZenButton
                        type="submit"
                        variant="primary"
                        loading={loading}
                    >
                        <Save className="mr-2 h-4 w-4" />
                        {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear')}
                    </ZenButton>
                </div>
            </form>
        </Modal>
    );
}
