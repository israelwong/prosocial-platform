'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    ZenButton,
    ZenInput,
    ZenTextarea
} from '@/components/ui/zen';
import { Switch } from '@/components/ui/shadcn/switch';
import { Modal } from '@/components/ui/shadcn/modal';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { z } from 'zod';
import { ReglaAgendamientoData } from '../types';
import {
    crearReglaAgendamiento,
    actualizarReglaAgendamiento
} from '@/lib/actions/studio/config/reglas-agendamiento.actions';

// Schema de validación
const ReglaAgendamientoSchema = z.object({
    nombre: z.string().min(1, 'El nombre es requerido'),
    descripcion: z.string().optional(),
    recurrencia: z.enum(['por_dia', 'por_hora']),
    capacidadOperativa: z.number().min(1, 'La capacidad operativa debe ser al menos 1'),
    status: z.enum(['active', 'inactive']),
    orden: z.number()
});

type ReglaAgendamientoFormData = z.infer<typeof ReglaAgendamientoSchema>;

interface ReglaAgendamientoFormProps {
    studioSlug: string;
    regla?: ReglaAgendamientoData | null;
    onClose: () => void;
    onSuccess?: (regla: ReglaAgendamientoData) => void;
}

export function ReglaAgendamientoForm({ studioSlug, regla, onClose, onSuccess }: ReglaAgendamientoFormProps) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!regla;

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<ReglaAgendamientoFormData>({
        resolver: zodResolver(ReglaAgendamientoSchema),
        defaultValues: {
            nombre: '',
            descripcion: '',
            recurrencia: 'por_hora',
            capacidadOperativa: 1,
            status: 'active',
            orden: 0,
        }
    });

    // Cargar datos si estamos editando
    useEffect(() => {
        if (regla) {
            reset({
                nombre: regla.nombre,
                descripcion: regla.descripcion || '',
                recurrencia: regla.recurrencia,
                capacidadOperativa: regla.capacidadOperativa,
                status: regla.status,
                orden: regla.orden,
            });
        }
    }, [regla, reset]);

    const onSubmit = async (data: ReglaAgendamientoFormData) => {
        setLoading(true);
        const loadingToast = toast.loading(
            isEditing ? 'Actualizando regla de agendamiento...' : 'Creando regla de agendamiento...'
        );

        try {
            let result;
            if (isEditing && regla?.id) {
                result = await actualizarReglaAgendamiento(studioSlug, regla.id, data);
            } else {
                result = await crearReglaAgendamiento(studioSlug, data);
            }

            if (result.success && result.data) {
                toast.dismiss(loadingToast);
                toast.success(
                    isEditing
                        ? 'Regla de agendamiento actualizada exitosamente'
                        : 'Regla de agendamiento creada exitosamente'
                );

                if (onSuccess) {
                    onSuccess(result.data);
                }
                onClose();
            } else {
                toast.dismiss(loadingToast);
                toast.error(result.error || 'Error al guardar regla de agendamiento');
            }

        } catch (error) {
            console.error('Error al guardar regla:', error);
            toast.dismiss(loadingToast);
            toast.error('Error interno del servidor. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const watchedValues = watch();

    return (
        <Modal
            isOpen={true}
            onClose={onClose}
            title={isEditing ? 'Editar Regla de Agendamiento' : 'Nueva Regla de Agendamiento'}
            description={isEditing
                ? 'Modifica los detalles de la regla de agendamiento'
                : 'Define una nueva regla para los tipos de servicios que se pueden agendar'
            }
            maxWidth="2xl"
        >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <ZenInput
                            label="Nombre *"
                            id="nombre"
                            {...register('nombre')}
                            placeholder="Ej: Cobertura de Evento, Sesión en Estudio"
                            error={errors.nombre?.message}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-300 mb-2 block">
                            Recurrencia *
                        </label>
                        <select
                            {...register('recurrencia')}
                            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="por_dia">Por Día</option>
                            <option value="por_hora">Por Hora</option>
                        </select>
                        {errors.recurrencia && (
                            <p className="text-sm text-red-500">{errors.recurrencia.message}</p>
                        )}
                    </div>
                </div>

                <ZenTextarea
                    label="Descripción"
                    id="descripcion"
                    {...register('descripcion')}
                    placeholder="Describe el tipo de servicio y sus características"
                    minRows={3}
                />

                {/* Capacidad Operativa */}
                <ZenInput
                    label="Capacidad Operativa *"
                    id="capacidadOperativa"
                    type="number"
                    min="1"
                    {...register('capacidadOperativa', { valueAsNumber: true })}
                    placeholder="1"
                    error={errors.capacidadOperativa?.message}
                    hint="Cuántos eventos puede cubrir simultáneamente"
                />

                {/* Estado */}
                <div className="flex items-center space-x-3">
                    <Switch
                        id="status"
                        checked={watchedValues.status === 'active'}
                        onCheckedChange={(checked) => setValue('status', checked ? 'active' : 'inactive')}
                    />
                    <div className="flex items-center space-x-2">
                        <span>Regla activa</span>
                        {watchedValues.status === 'active' ? (
                            <span className="text-green-400 text-sm">(Activa)</span>
                        ) : (
                            <span className="text-zinc-500 text-sm">(Inactiva)</span>
                        )}
                    </div>
                </div>

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