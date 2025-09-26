'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Modal } from '@/components/ui/modal';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import {
    crearMetodoPago,
    actualizarMetodoPago
} from '@/lib/actions/studio/config/metodos-pago.actions';
import { MetodoPagoData } from '../types';
import { type MetodoPagoForm } from '@/lib/actions/schemas/metodos-pago-schemas';

// Schema simplificado - solo nombre
const MetodoPagoSimpleSchema = z.object({
    metodo_pago: z.string().min(1, 'El nombre del método es requerido'),
});

type MetodoPagoSimpleForm = z.infer<typeof MetodoPagoSimpleSchema>;

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
        reset
    } = useForm<MetodoPagoSimpleForm>({
        resolver: zodResolver(MetodoPagoSimpleSchema),
        defaultValues: {
            metodo_pago: '',
        }
    });

    // Cargar datos si estamos editando
    useEffect(() => {
        if (metodo) {
            reset({
                metodo_pago: metodo.metodo_pago,
            });
        }
    }, [metodo, reset]);

    const onSubmit = async (data: MetodoPagoSimpleForm) => {
        setLoading(true);
        const loadingToast = toast.loading(
            isEditing ? 'Actualizando método de pago...' : 'Creando método de pago...'
        );

        try {
            // Preparar datos con valores por defecto (formato correcto para las acciones)
            const metodoData: MetodoPagoForm = {
                metodo_pago: data.metodo_pago,
                comision_porcentaje_base: '',
                comision_fija_monto: '',
                payment_method: 'cash',
                status: 'active',
                orden: 0,
            };

            let result;

            if (isEditing && metodo) {
                result = await actualizarMetodoPago(studioSlug, metodo.id, metodoData);
            } else {
                result = await crearMetodoPago(studioSlug, metodoData);
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

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={isEditing ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
            description={isEditing
                ? 'Modifica el nombre del método de pago'
                : 'Agrega un nuevo método de pago para tu negocio'
            }
            maxWidth="sm"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Nombre del método */}
                <div className="space-y-2">
                    <Label htmlFor="metodo_pago">Nombre del Método *</Label>
                    <Input
                        id="metodo_pago"
                        {...register('metodo_pago')}
                        placeholder="Ej: Efectivo, Tarjeta de Crédito, SPEI, Transferencia"
                        className={errors.metodo_pago ? 'border-red-500' : ''}
                    />
                    {errors.metodo_pago && (
                        <p className="text-sm text-red-500">{errors.metodo_pago.message}</p>
                    )}
                </div>

                {/* Información adicional */}
                {/* <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-4">
                    <h4 className="font-medium text-white mb-2">Configuración Automática</h4>
                    <div className="text-sm text-zinc-300 space-y-1">
                        <p>• Método de pago: Efectivo</p>
                        <p>• Comisiones: Sin configurar</p>
                        <p>• Estado: Activo</p>
                        <p>• Orden: 0 (se ajusta automáticamente)</p>
                    </div>
                    <p className="text-xs text-zinc-500 mt-2">
                        Los métodos se configuran automáticamente con valores por defecto.
                        Puedes editar la configuración avanzada después de crear el método.
                    </p>
                </div> */}

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