'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, Plus, GripVertical, Pencil, Trash2 } from 'lucide-react';
import {
    ZenButton,
    ZenInput,
    ZenCard,
    ZenCardContent,
} from '@/components/ui/zen';
import {
    obtenerCategorias,
    crearCategoria,
    actualizarCategoria,
    eliminarCategoria,
    actualizarOrdenCategorias,
    obtenerSecciones,
} from '@/lib/actions/studio/config/catalogo.actions';
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable,
    arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { CategoriaData, SeccionData } from '@/lib/actions/schemas/catalogo-schemas';

interface CategoriasModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    studioSlug: string;
    editingCategoria?: CategoriaData | null;
}

// Componente de item sortable
function CategoriaItem({
    categoria,
    onEdit,
    onDelete,
}: {
    categoria: CategoriaData;
    onEdit: (categoria: CategoriaData) => void;
    onDelete: (categoriaId: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: categoria.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const tieneServicios = categoria.servicios && categoria.servicios.length > 0;

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 p-3 bg-zinc-800 border border-zinc-700 rounded-md hover:border-zinc-600 transition-colors"
        >
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300"
            >
                <GripVertical className="h-5 w-5" />
            </button>

            <div className="flex-1 min-w-0">
                <div className="font-medium text-white truncate">{categoria.nombre}</div>
                <div className="text-xs text-zinc-400">
                    {categoria.servicios?.length || 0} servicio{categoria.servicios?.length !== 1 ? 's' : ''}
                </div>
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onEdit(categoria)}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
                    title="Editar"
                >
                    <Pencil className="h-4 w-4" />
                </button>

                {!tieneServicios && (
                    <button
                        onClick={() => onDelete(categoria.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-zinc-700 rounded"
                        title="Eliminar"
                    >
                        <Trash2 className="h-4 w-4" />
                    </button>
                )}
            </div>
        </div>
    );
}

export function CategoriasModal({
    isOpen,
    onClose,
    onSuccess,
    studioSlug,
    editingCategoria: editingCategoriaProp,
}: CategoriasModalProps) {
    const [categorias, setCategorias] = useState<CategoriaData[]>([]);
    const [secciones, setSecciones] = useState<SeccionData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editingCategoria, setEditingCategoria] = useState<CategoriaData | null>(null);
    const [nombre, setNombre] = useState('');
    const [seccionId, setSeccionId] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    // Cargar categorías y secciones
    useEffect(() => {
        if (isOpen) {
            cargarDatos();
        }
    }, [isOpen]);

    // Cargar datos de la categoría a editar
    useEffect(() => {
        if (editingCategoriaProp) {
            setEditingCategoria(editingCategoriaProp);
            setNombre(editingCategoriaProp.nombre);
            setSeccionId(editingCategoriaProp.seccionId || '');
            setIsCreating(true);
        }
    }, [editingCategoriaProp]);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [resultCategorias, resultSecciones] = await Promise.all([
                obtenerCategorias(studioSlug),
                obtenerSecciones(studioSlug),
            ]);

            if (resultCategorias.success && resultCategorias.data) {
                setCategorias(resultCategorias.data);
            }
            if (resultSecciones.success && resultSecciones.data) {
                setSecciones(resultSecciones.data);
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!nombre.trim()) {
            toast.error('El nombre es requerido');
            return;
        }

        if (!seccionId) {
            toast.error('Selecciona una sección');
            return;
        }

        setLoading(true);
        try {
            if (editingCategoria) {
                // Actualizar
                const result = await actualizarCategoria(studioSlug, editingCategoria.id, {
                    nombre,
                });
                if (result.success) {
                    toast.success('Categoría actualizada');
                    cargarDatos();
                    onSuccess();
                    resetForm();
                } else {
                    toast.error(result.error || 'Error al actualizar');
                }
            } else {
                // Crear
                const result = await crearCategoria(studioSlug, { nombre }, seccionId);
                if (result.success) {
                    toast.success('Categoría creada');
                    cargarDatos();
                    onSuccess();
                    resetForm();
                } else {
                    toast.error(result.error || 'Error al crear');
                }
            }
        } catch (error) {
            console.error('Error guardando categoría:', error);
            toast.error('Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (categoria: CategoriaData) => {
        setEditingCategoria(categoria);
        setNombre(categoria.nombre);
        setSeccionId(categoria.seccionId || '');
        setIsCreating(true);
    };

    const handleDelete = async (categoriaId: string) => {
        if (!confirm('¿Eliminar esta categoría?')) return;

        setLoading(true);
        try {
            const result = await eliminarCategoria(studioSlug, categoriaId);
            if (result.success) {
                toast.success('Categoría eliminada');
                cargarDatos();
                onSuccess();
            } else {
                toast.error(result.error || 'Error al eliminar');
            }
        } catch (error) {
            console.error('Error eliminando categoría:', error);
            toast.error('Error al eliminar');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = categorias.findIndex((c) => c.id === active.id);
        const newIndex = categorias.findIndex((c) => c.id === over.id);

        const newCategorias = arrayMove(categorias, oldIndex, newIndex);
        setCategorias(newCategorias);

        // Actualizar orden en backend
        try {
            const categoriasConOrden = newCategorias.map((c, index) => ({
                id: c.id,
                orden: index,
            }));

            await actualizarOrdenCategorias(studioSlug, { categorias: categoriasConOrden });
            onSuccess();
        } catch (error) {
            console.error('Error actualizando orden:', error);
            toast.error('Error al actualizar orden');
            cargarDatos(); // Recargar para revertir
        }
    };

    const resetForm = () => {
        setIsCreating(false);
        setEditingCategoria(null);
        setNombre('');
        setSeccionId('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <ZenCard className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-semibold text-white">Gestionar Categorías</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Contenido */}
                <ZenCardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                    {/* Formulario de creación/edición */}
                    {isCreating ? (
                        <div className="space-y-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                            <ZenInput
                                label="Nombre de la categoría"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Fotografía de sesión previa"
                                required
                            />

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-zinc-300">
                                    Sección <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={seccionId}
                                    onChange={(e) => setSeccionId(e.target.value)}
                                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Selecciona una sección</option>
                                    {secciones.map((seccion) => (
                                        <option key={seccion.id} value={seccion.id}>
                                            {seccion.nombre}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <ZenButton
                                    variant="primary"
                                    onClick={handleSave}
                                    loading={loading}
                                    disabled={loading}
                                >
                                    {editingCategoria ? 'Actualizar' : 'Crear'}
                                </ZenButton>
                                <ZenButton variant="ghost" onClick={resetForm}>
                                    Cancelar
                                </ZenButton>
                            </div>
                        </div>
                    ) : (
                        <ZenButton
                            variant="outline"
                            onClick={() => setIsCreating(true)}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Categoría
                        </ZenButton>
                    )}

                    {/* Lista de categorías */}
                    {loading && categorias.length === 0 ? (
                        <div className="text-center py-8 text-zinc-400">Cargando...</div>
                    ) : categorias.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={categorias.map((c) => c.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {categorias.map((categoria) => (
                                        <CategoriaItem
                                            key={categoria.id}
                                            categoria={categoria}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <div className="text-center py-8 text-zinc-400">
                            No hay categorías. Crea la primera.
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
