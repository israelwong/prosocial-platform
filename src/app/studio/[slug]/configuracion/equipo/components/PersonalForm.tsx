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
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle
} from '@/components/ui/shadcn/dialog';
import {
    createPersonalSchema,
    updatePersonalSchema,
    type CreatePersonalData,
    type UpdatePersonalData,
    type PersonalData
} from '@/lib/actions/schemas/personal-schemas';
import {
    crearPersonal,
    actualizarPersonal
} from '@/lib/actions/studio/config/personal.actions';
import {
    obtenerCategoriasPersonal,
    obtenerPerfilesPersonal
} from '@/lib/actions/studio/config/personal.actions';
import type { CategoriaPersonalData, PerfilPersonalData } from '@/lib/actions/schemas/personal-schemas';

interface PersonalFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    studioSlug: string;
    personal?: PersonalData | null;
}

export function PersonalForm({
    isOpen,
    onClose,
    onSuccess,
    studioSlug,
    personal
}: PersonalFormProps) {
    const [loading, setLoading] = useState(false);
    const [categorias, setCategorias] = useState<CategoriaPersonalData[]>([]);
    const [perfiles, setPerfiles] = useState<PerfilPersonalData[]>([]);
    const [perfilesSeleccionados, setPerfilesSeleccionados] = useState<string[]>([]);
    const isEditing = !!personal;

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm<CreatePersonalData | UpdatePersonalData>({
        resolver: zodResolver(isEditing ? updatePersonalSchema : createPersonalSchema),
        defaultValues: isEditing ? {
            nombre: personal.nombre,
            email: personal.email || '',
            telefono: personal.telefono || '',
            tipo: personal.tipo,
            categoriaId: personal.categoriaId,
            status: personal.status,
            platformUserId: personal.platformUserId || '',
            honorarios_fijos: personal.honorarios_fijos || undefined,
            honorarios_variables: personal.honorarios_variables || undefined,
            notas: personal.notas || ''
        } : {
            tipo: 'OPERATIVO',
            status: 'activo'
        }
    });

    const tipoSeleccionado = watch('tipo');

    // Cargar categorías y perfiles
    useEffect(() => {
        if (isOpen) {
            cargarCategorias();
            cargarPerfiles();
        }
    }, [isOpen]);

    const cargarCategorias = async () => {
        try {
            const result = await obtenerCategoriasPersonal(studioSlug);
            if (result.success && result.data) {
                setCategorias(result.data);
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    };

    const cargarPerfiles = async () => {
        try {
            const result = await obtenerPerfilesPersonal(studioSlug);
            if (result.success && result.data) {
                setPerfiles(result.data);
            }
        } catch (error) {
            console.error('Error al cargar perfiles:', error);
        }
    };

    const onSubmit = async (data: CreatePersonalData | UpdatePersonalData) => {
        setLoading(true);
        const loadingToast = toast.loading(
            isEditing ? 'Actualizando personal...' : 'Creando personal...'
        );

        try {
            // Incluir perfiles seleccionados en los datos
            const dataConPerfiles = {
                ...data,
                perfilesIds: perfilesSeleccionados
            };

            let result;
            if (isEditing && personal?.id) {
                result = await actualizarPersonal(studioSlug, personal.id, dataConPerfiles);
            } else {
                result = await crearPersonal(studioSlug, dataConPerfiles);
            }

            if (result.success && result.data) {
                toast.dismiss(loadingToast);
                toast.success(
                    isEditing
                        ? 'Personal actualizado exitosamente'
                        : 'Personal creado exitosamente'
                );
                onSuccess();
            } else {
                toast.dismiss(loadingToast);
                toast.error(result.error || 'Error al guardar personal');
            }
        } catch (error) {
            console.error('Error al guardar personal:', error);
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

    // Filtrar categorías por tipo seleccionado
    const categoriasFiltradas = categorias.filter(c => c.tipo === tipoSeleccionado);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Personal' : 'Nuevo Personal'}
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Nombre */}
                        <div className="space-y-2">
                            <ZenInput
                                label="Nombre Completo"
                                placeholder="Ej: Juan Pérez"
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Email */}
                        <div className="space-y-2">
                            <ZenInput
                                label="Email"
                                type="email"
                                placeholder="juan@ejemplo.com"
                                error={errors.email?.message}
                                {...register('email')}
                            />
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <ZenInput
                                label="Teléfono"
                                placeholder="+52 55 1234 5678"
                                error={errors.telefono?.message}
                                {...register('telefono')}
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-zinc-300 mb-2">
                            Categoría
                        </label>
                        <select
                            {...register('categoriaId')}
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">Selecciona una categoría</option>
                            {categoriasFiltradas.map((categoria) => (
                                <option key={categoria.id} value={categoria.id}>
                                    {categoria.nombre} - {categoria.descripcion || 'Sin descripción'}
                                </option>
                            ))}
                        </select>
                        {errors.categoriaId && (
                            <p className="text-sm text-red-400">{errors.categoriaId.message}</p>
                        )}
                        {categoriasFiltradas.length === 0 && tipoSeleccionado && (
                            <p className="text-sm text-yellow-400">
                                No hay categorías disponibles para este tipo. Crea una categoría primero.
                            </p>
                        )}
                    </div>

                    {/* Estado */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-zinc-300">
                            Estado
                        </label>
                        <div className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                {...register('status')}
                                className="w-4 h-4 text-blue-600 bg-zinc-900 border-zinc-700 rounded focus:ring-blue-500"
                            />
                            <span className="text-sm text-zinc-300">Activo</span>
                        </div>
                    </div>

                    {/* Perfiles Asociados */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-zinc-300">
                            Perfiles Asociados
                        </label>
                        <p className="text-sm text-zinc-500">
                            Selecciona uno o más perfiles para este personal
                        </p>

                        {perfiles.length === 0 ? (
                            <div className="text-center py-4 text-zinc-500">
                                No hay perfiles disponibles. Crea perfiles primero.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {perfiles.map((perfil) => (
                                    <label
                                        key={perfil.id}
                                        className="flex items-center space-x-3 p-3 border border-zinc-700 rounded-lg hover:bg-zinc-800/50 cursor-pointer"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={perfilesSeleccionados.includes(perfil.id)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setPerfilesSeleccionados([...perfilesSeleccionados, perfil.id]);
                                                } else {
                                                    setPerfilesSeleccionados(perfilesSeleccionados.filter(id => id !== perfil.id));
                                                }
                                            }}
                                            className="w-4 h-4 text-blue-600 bg-zinc-900 border-zinc-700 rounded focus:ring-blue-500"
                                        />
                                        <div className="flex-1">
                                            <div className="font-medium text-white">{perfil.nombre}</div>
                                            {perfil.descripcion && (
                                                <div className="text-sm text-zinc-400">{perfil.descripcion}</div>
                                            )}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                        <ZenButton
                            type="button"
                            variant="outline"
                            onClick={onClose}
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
                            {isEditing ? 'Actualizar' : 'Crear'} Personal
                        </ZenButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
