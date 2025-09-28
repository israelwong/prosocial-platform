'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, GripVertical, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import {
    ZenButton,
    ZenInput,
    ZenCard,
    ZenCardContent
} from '@/components/ui/zen';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/shadcn/dialog';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    obtenerCategoriasPersonal,
    crearCategoriaPersonal,
    actualizarCategoriaPersonal,
    eliminarCategoriaPersonal,
    actualizarOrdenCategoriasPersonal
} from '@/lib/actions/studio/config/personal.actions';
import type { CategoriaPersonalData } from '@/lib/actions/schemas/personal-schemas';

interface CategoriasSheetProps {
    studioSlug: string;
}

interface SortableCategoriaItemProps {
    categoria: CategoriaPersonalData;
    onEdit: (categoria: CategoriaPersonalData) => void;
    onDelete: (categoria: CategoriaPersonalData) => void;
    isEditing: boolean;
    editandoNombre: string;
    onEditChange: (nombre: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
}

function SortableCategoriaItem({
    categoria,
    onEdit,
    onDelete,
    isEditing,
    editandoNombre,
    onEditChange,
    onSaveEdit,
    onCancelEdit
}: SortableCategoriaItemProps) {
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

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="hover:bg-zinc-800/50 transition-colors border-zinc-700"
        >
            <ZenCard className="hover:bg-zinc-800/50 transition-colors border-zinc-700">
                <ZenCardContent className="p-3">
                    <div className="flex items-center gap-3">
                        {/* Drag handle */}
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab text-zinc-500 hover:text-zinc-300 p-1 rounded hover:bg-zinc-700"
                        >
                            <GripVertical className="h-4 w-4" />
                        </div>

                        {/* Contenido */}
                        <div className="flex-1">
                            {isEditing ? (
                                <div className="flex items-center gap-2">
                                    <ZenInput
                                        value={editandoNombre}
                                        onChange={(e) => onEditChange(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && onSaveEdit()}
                                        className="flex-1"
                                        autoFocus
                                    />
                                    <ZenButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={onSaveEdit}
                                        className="text-green-400 hover:text-green-300 hover:bg-green-900/20"
                                    >
                                        ✓
                                    </ZenButton>
                                    <ZenButton
                                        variant="ghost"
                                        size="sm"
                                        onClick={onCancelEdit}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                    >
                                        ✕
                                    </ZenButton>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <div>
                                        <span className="font-medium text-white">{categoria.nombre}</span>
                                        {categoria.esDefault && (
                                            <span className="ml-2 text-xs text-zinc-500 bg-zinc-700 px-2 py-1 rounded">Sistema</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ZenButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(categoria)}
                                            disabled={categoria.esDefault}
                                            className="hover:bg-zinc-700"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </ZenButton>
                                        {!categoria.esDefault && (
                                            <ZenButton
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => onDelete(categoria)}
                                                className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </ZenButton>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}

export function CategoriasSheet({ studioSlug }: CategoriasSheetProps) {
    const [categorias, setCategorias] = useState<CategoriaPersonalData[]>([]);
    const [loading, setLoading] = useState(true);
    const [nuevaCategoria, setNuevaCategoria] = useState('');
    const [editandoId, setEditandoId] = useState<string | null>(null);
    const [editandoNombre, setEditandoNombre] = useState('');
    const [eliminandoId, setEliminandoId] = useState<string | null>(null);
    const [eliminandoNombre, setEliminandoNombre] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const cargarCategorias = useCallback(async () => {
        try {
            setLoading(true);
            const result = await obtenerCategoriasPersonal(studioSlug);

            if (result.success && result.data) {
                setCategorias(result.data);
            } else {
                toast.error(result.error || 'Error al cargar categorías');
            }
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            toast.error('Error al cargar categorías');
        } finally {
            setLoading(false);
        }
    }, [studioSlug]);

    useEffect(() => {
        cargarCategorias();
    }, [cargarCategorias]);

    const handleCrearCategoria = async () => {
        if (!nuevaCategoria.trim()) {
            toast.error('El nombre de la categoría es requerido');
            return;
        }

        try {
            const result = await crearCategoriaPersonal(studioSlug, {
                nombre: nuevaCategoria.trim(),
                tipo: 'OPERATIVO', // Por defecto
                descripcion: '',
                esDefault: false,
                orden: categorias.length,
                isActive: true
            });

            if (result.success && result.data) {
                toast.success('Categoría creada exitosamente');
                setNuevaCategoria('');
                // Actualizar localmente sin recargar todo
                setCategorias(prev => [...prev, result.data!]);
            } else {
                toast.error(result.error || 'Error al crear categoría');
            }
        } catch (error) {
            console.error('Error al crear categoría:', error);
            toast.error('Error al crear categoría');
        }
    };

    const handleIniciarEdicion = (categoria: CategoriaPersonalData) => {
        setEditandoId(categoria.id);
        setEditandoNombre(categoria.nombre);
    };

    const handleGuardarEdicion = async (categoriaId: string) => {
        if (!editandoNombre.trim()) {
            toast.error('El nombre de la categoría es requerido');
            return;
        }

        try {
            const result = await actualizarCategoriaPersonal(studioSlug, categoriaId, {
                nombre: editandoNombre.trim()
            });

            if (result.success) {
                toast.success('Categoría actualizada exitosamente');
                setEditandoId(null);
                setEditandoNombre('');
                // Actualizar localmente
                setCategorias(prev => prev.map(cat =>
                    cat.id === categoriaId
                        ? { ...cat, nombre: editandoNombre.trim() }
                        : cat
                ));
            } else {
                toast.error(result.error || 'Error al actualizar categoría');
            }
        } catch (error) {
            console.error('Error al actualizar categoría:', error);
            toast.error('Error al actualizar categoría');
        }
    };

    const handleCancelarEdicion = () => {
        setEditandoId(null);
        setEditandoNombre('');
    };

    const handleIniciarEliminacion = (categoria: CategoriaPersonalData) => {
        setEliminandoId(categoria.id);
        setEliminandoNombre(categoria.nombre);
    };

    const handleConfirmarEliminacion = async () => {
        if (!eliminandoId) return;

        try {
            const result = await eliminarCategoriaPersonal(studioSlug, eliminandoId);
            if (result.success) {
                toast.success('Categoría eliminada exitosamente');
                // Actualizar localmente
                setCategorias(prev => prev.filter(cat => cat.id !== eliminandoId));
                setEliminandoId(null);
                setEliminandoNombre('');
            } else {
                toast.error(result.error || 'Error al eliminar categoría');
            }
        } catch (error) {
            console.error('Error al eliminar categoría:', error);
            toast.error('Error al eliminar categoría');
        }
    };

    const handleCancelarEliminacion = () => {
        setEliminandoId(null);
        setEliminandoNombre('');
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = categorias.findIndex(cat => cat.id === active.id);
            const newIndex = categorias.findIndex(cat => cat.id === over?.id);

            const newCategorias = arrayMove(categorias, oldIndex, newIndex);
            setCategorias(newCategorias);

            // Actualizar orden en el servidor
            try {
                const categoriasConOrden = newCategorias.map((cat, index) => ({
                    id: cat.id,
                    orden: index
                }));

                await actualizarOrdenCategoriasPersonal(studioSlug, {
                    categorias: categoriasConOrden
                });
            } catch (error) {
                console.error('Error al actualizar orden:', error);
                toast.error('Error al actualizar orden de categorías');
                // Revertir cambios locales
                cargarCategorias();
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-zinc-400">Cargando categorías...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-5">
            {/* Agregar nueva categoría */}
            <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <h3 className="font-medium text-white flex items-center gap-2 mb-3">
                    <Plus className="h-4 w-4 text-blue-400" />
                    Agregar Categoría
                </h3>
                <div className="flex items-center gap-2">
                    <ZenInput
                        placeholder="Nombre de la categoría"
                        value={nuevaCategoria}
                        onChange={(e) => setNuevaCategoria(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCrearCategoria()}
                        className="flex-1"
                    />
                    <ZenButton
                        variant="primary"
                        onClick={handleCrearCategoria}
                        disabled={!nuevaCategoria.trim()}
                    >
                        <Plus className="h-4 w-4" />
                    </ZenButton>
                </div>
            </div>

            {/* Lista de categorías */}
            <div className="space-y-3">
                <h3 className="font-medium text-white flex items-center gap-2">
                    Categorías Existentes
                </h3>

                {categorias.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400 bg-zinc-800/30 rounded-lg border border-zinc-700">
                        <GripVertical className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                        No hay categorías registradas
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={categorias.map(cat => cat.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {categorias.map((categoria) => (
                                    <SortableCategoriaItem
                                        key={categoria.id}
                                        categoria={categoria}
                                        onEdit={handleIniciarEdicion}
                                        onDelete={handleIniciarEliminacion}
                                        isEditing={editandoId === categoria.id}
                                        editandoNombre={editandoNombre}
                                        onEditChange={setEditandoNombre}
                                        onSaveEdit={() => handleGuardarEdicion(categoria.id)}
                                        onCancelEdit={handleCancelarEdicion}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>

            {/* Modal de confirmación de eliminación */}
            <Dialog open={!!eliminandoId} onOpenChange={handleCancelarEliminacion}>
                <DialogContent className="bg-zinc-900 border-zinc-800">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                            Confirmar Eliminación
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            ¿Estás seguro de que quieres eliminar la categoría &quot;{eliminandoNombre}&quot;?
                            Esta acción no se puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <ZenButton
                            variant="outline"
                            onClick={handleCancelarEliminacion}
                        >
                            Cancelar
                        </ZenButton>
                        <ZenButton
                            variant="destructive"
                            onClick={handleConfirmarEliminacion}
                        >
                            Eliminar
                        </ZenButton>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
