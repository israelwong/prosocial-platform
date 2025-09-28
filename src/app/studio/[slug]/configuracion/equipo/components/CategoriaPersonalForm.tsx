'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Save, X } from 'lucide-react';
import {
    ZenButton,
    ZenInput,
    ZenTextarea,
    ZenCard,
    ZenCardContent
} from '@/components/ui/zen';
import {
    createCategoriaPersonalSchema,
    updateCategoriaPersonalSchema,
    type CreateCategoriaPersonalData,
    type UpdateCategoriaPersonalData,
    type CategoriaPersonalData
} from '@/lib/actions/schemas/personal-schemas';
import {
    crearCategoriaPersonal,
    actualizarCategoriaPersonal
} from '@/lib/actions/studio/config/personal.actions';

interface CategoriaPersonalFormProps {
    studioSlug: string;
    categoria?: CategoriaPersonalData | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export function CategoriaPersonalForm({
    studioSlug,
    categoria,
    onSuccess,
    onCancel
}: CategoriaPersonalFormProps) {
    const [loading, setLoading] = useState(false);
    const isEditing = !!categoria;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<CreateCategoriaPersonalData | UpdateCategoriaPersonalData>({
        resolver: zodResolver(isEditing ? updateCategoriaPersonalSchema : createCategoriaPersonalSchema),
        defaultValues: isEditing ? {
            nombre: categoria.nombre,
            descripcion: categoria.descripcion || '',
            tipo: categoria.tipo,
            color: categoria.color || '',
            icono: categoria.icono || '',
            esDefault: categoria.esDefault,
            orden: categoria.orden,
            isActive: categoria.isActive
        } : {
            tipo: 'OPERATIVO',
            esDefault: false,
            orden: 0,
            isActive: true
        }
    });

    const tipoSeleccionado = watch('tipo');

    const onSubmit = async (data: CreateCategoriaPersonalData | UpdateCategoriaPersonalData) => {
        setLoading(true);
        const loadingToast = toast.loading(
            isEditing ? 'Actualizando categoría...' : 'Creando categoría...'
        );

        try {
            let result;
            if (isEditing && categoria?.id) {
                result = await actualizarCategoriaPersonal(studioSlug, categoria.id, data);
            } else {
                result = await crearCategoriaPersonal(studioSlug, data);
            }

            if (result.success && result.data) {
                toast.dismiss(loadingToast);
                toast.success(
                    isEditing
                        ? 'Categoría actualizada exitosamente'
                        : 'Categoría creada exitosamente'
                );
                onSuccess();
            } else {
                toast.dismiss(loadingToast);
                toast.error(result.error || 'Error al guardar categoría');
            }
        } catch (error) {
            console.error('Error al guardar categoría:', error);
            toast.dismiss(loadingToast);
            toast.error('Error interno del servidor. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const tipoOptions = [
        { value: 'OPERATIVO', label: 'Operativo', description: 'Fotógrafos, camarógrafos, operadores' },
        { value: 'ADMINISTRATIVO', label: 'Administrativo', description: 'Recepcionistas, administradores' },
        { value: 'PROVEEDOR', label: 'Proveedor', description: 'Servicios externos, proveedores' }
    ];

    const iconosSugeridos = {
        OPERATIVO: ['camera', 'video', 'drone', 'camera-off', 'film'],
        ADMINISTRATIVO: ['user-check', 'calendar', 'film', 'settings', 'users'],
        PROVEEDOR: ['printer', 'cake', 'flower', 'truck', 'package']
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div className="space-y-2">
                    <ZenInput
                        label="Nombre de la Categoría"
                        placeholder="Ej: Fotógrafo Principal"
                        required
                        error={errors.nombre?.message}
                        {...register('nombre')}
                    />
                </div>

                {/* Tipo */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-zinc-300 mb-2">
                        Tipo de Personal
                    </label>
                    <select
                        {...register('tipo')}
                        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        {tipoOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label} - {option.description}
                            </option>
                        ))}
                    </select>
                    {errors.tipo && (
                        <p className="text-sm text-red-400">{errors.tipo.message}</p>
                    )}
                </div>
            </div>

            {/* Descripción */}
            <div className="space-y-2">
                <ZenTextarea
                    label="Descripción"
                    placeholder="Describe las responsabilidades de esta categoría..."
                    maxLength={200}
                    minRows={3}
                    error={errors.descripcion?.message}
                    {...register('descripcion')}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Color */}
                <div className="space-y-2">
                    <ZenInput
                        label="Color (Hex)"
                        placeholder="#3B82F6"
                        error={errors.color?.message}
                        {...register('color')}
                    />
                    <p className="text-xs text-zinc-500">
                        Código hexadecimal para el color de la categoría
                    </p>
                </div>

                {/* Icono */}
                <div className="space-y-2">
                    <ZenInput
                        label="Icono (Lucide)"
                        placeholder="camera"
                        error={errors.icono?.message}
                        {...register('icono')}
                    />
                    <p className="text-xs text-zinc-500">
                        Nombre del icono de Lucide React
                    </p>
                    {tipoSeleccionado && (
                        <div className="mt-2">
                            <p className="text-xs text-zinc-400 mb-1">Sugerencias:</p>
                            <div className="flex flex-wrap gap-1">
                                {iconosSugeridos[tipoSeleccionado as keyof typeof iconosSugeridos]?.map((icono) => (
                                    <button
                                        key={icono}
                                        type="button"
                                        onClick={() => reset({ ...watch(), icono })}
                                        className="px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-600 text-zinc-300"
                                    >
                                        {icono}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Configuraciones avanzadas */}
            <ZenCard>
                <ZenCardContent className="p-4">
                    <h4 className="font-medium text-white mb-4">Configuraciones Avanzadas</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Orden */}
                        <div className="space-y-2">
                            <ZenInput
                                label="Orden"
                                type="number"
                                min="0"
                                error={errors.orden?.message}
                                {...register('orden', { valueAsNumber: true })}
                            />
                            <p className="text-xs text-zinc-500">
                                Orden de visualización (menor número = primero)
                            </p>
                        </div>

                        {/* Estado */}
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-zinc-300 mb-2">
                                Estado
                            </label>
                            <select
                                {...register('isActive')}
                                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="true">Activo</option>
                                <option value="false">Inactivo</option>
                            </select>
                        </div>
                    </div>
                </ZenCardContent>
            </ZenCard>

            {/* Botones */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <ZenButton
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                </ZenButton>

                <ZenButton
                    type="submit"
                    variant="primary"
                    loading={loading}
                    disabled={loading}
                >
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? 'Actualizar' : 'Crear'} Categoría
                </ZenButton>
            </div>
        </form>
    );
}
