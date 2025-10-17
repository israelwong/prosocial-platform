'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { X, Plus, GripVertical, Pencil, Trash2 } from 'lucide-react';
import {
    ZenButton,
    ZenInput,
    ZenTextarea,
    ZenCard,
    ZenCardContent,
} from '@/components/ui/zen';
import {
    obtenerSecciones,
    crearSeccion,
    actualizarSeccion,
    eliminarSeccion,
    actualizarOrdenSecciones,
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
import type { SeccionData } from '@/lib/actions/schemas/catalogo-schemas';

interface SeccionesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    studioSlug: string;
    editingSeccion?: SeccionData | null;
}

// Componente de item sortable
function SeccionItem({
    seccion,
    onEdit,
    onDelete,
}: {
    seccion: SeccionData;
    onEdit: (seccion: SeccionData) => void;
    onDelete: (seccionId: string) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: seccion.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const tieneCategorias = seccion.categorias && seccion.categorias.length > 0;

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
                <div className="font-medium text-white truncate">{seccion.nombre}</div>
                {seccion.descripcion && (
                    <div className="text-sm text-zinc-400 truncate">
                        {seccion.descripcion}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1">
                <button
                    onClick={() => onEdit(seccion)}
                    className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-700 rounded"
                    title="Editar"
                >
                    <Pencil className="h-4 w-4" />
                </button>

                {!tieneCategorias && (
                    <button
                        onClick={() => onDelete(seccion.id)}
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

export function SeccionesModal({
    isOpen,
    onClose,
    onSuccess,
    studioSlug,
    editingSeccion: editingSeccionProp,
}: SeccionesModalProps) {
    const [secciones, setSecciones] = useState<SeccionData[]>([]);
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [editingSeccion, setEditingSeccion] = useState<SeccionData | null>(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        })
    );

    // Cargar secciones
    useEffect(() => {
        if (isOpen) {
            cargarSecciones();
        }
    }, [isOpen]);

    // Cargar datos de la sección a editar
    useEffect(() => {
        if (editingSeccionProp) {
            setEditingSeccion(editingSeccionProp);
            setNombre(editingSeccionProp.nombre);
            setDescripcion(editingSeccionProp.descripcion || '');
            setIsCreating(true);
        }
    }, [editingSeccionProp]);

    const cargarSecciones = async () => {
        setLoading(true);
        try {
            const result = await obtenerSecciones(studioSlug);
            if (result.success && result.data) {
                setSecciones(result.data);
            }
        } catch (error) {
            console.error('Error cargando secciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!nombre.trim()) {
            toast.error('El nombre es requerido');
            return;
        }

        setLoading(true);
        try {
            if (editingSeccion) {
                // Actualizar
                const result = await actualizarSeccion(studioSlug, editingSeccion.id, {
                    nombre,
                    descripcion,
                });
                if (result.success) {
                    toast.success('Sección actualizada');
                    cargarSecciones();
                    onSuccess();
                    resetForm();
                } else {
                    toast.error(result.error || 'Error al actualizar');
                }
            } else {
                // Crear
                const result = await crearSeccion(studioSlug, { nombre, descripcion });
                if (result.success) {
                    toast.success('Sección creada');
                    cargarSecciones();
                    onSuccess();
                    resetForm();
                } else {
                    toast.error(result.error || 'Error al crear');
                }
            }
        } catch (error) {
            console.error('Error guardando sección:', error);
            toast.error('Error al guardar');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (seccion: SeccionData) => {
        setEditingSeccion(seccion);
        setNombre(seccion.nombre);
        setDescripcion(seccion.descripcion || '');
        setIsCreating(true);
    };

    const handleDelete = async (seccionId: string) => {
        if (!confirm('¿Eliminar esta sección?')) return;

        setLoading(true);
        try {
            const result = await eliminarSeccion(studioSlug, seccionId);
            if (result.success) {
                toast.success('Sección eliminada');
                cargarSecciones();
                onSuccess();
            } else {
                toast.error(result.error || 'Error al eliminar');
            }
        } catch (error) {
            console.error('Error eliminando sección:', error);
            toast.error('Error al eliminar');
        } finally {
            setLoading(false);
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        const oldIndex = secciones.findIndex((s) => s.id === active.id);
        const newIndex = secciones.findIndex((s) => s.id === over.id);

        const newSecciones = arrayMove(secciones, oldIndex, newIndex);
        setSecciones(newSecciones);

        // Actualizar orden en backend
        try {
            const seccionesConOrden = newSecciones.map((s, index) => ({
                id: s.id,
                orden: index,
            }));

            await actualizarOrdenSecciones(studioSlug, { secciones: seccionesConOrden });
            onSuccess();
        } catch (error) {
            console.error('Error actualizando orden:', error);
            toast.error('Error al actualizar orden');
            cargarSecciones(); // Recargar para revertir
        }
    };

    const resetForm = () => {
        setIsCreating(false);
        setEditingSeccion(null);
        setNombre('');
        setDescripcion('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <ZenCard className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <h2 className="text-xl font-semibold text-white">Gestionar Secciones</h2>
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
                                label="Nombre de la sección"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Ej: Experiencias previas al evento"
                                required
                            />

                            <ZenTextarea
                                label="Descripción (opcional)"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                placeholder="Breve descripción de la sección"
                                maxLength={500}
                                minRows={2}
                            />

                            <div className="flex items-center gap-2">
                                <ZenButton
                                    variant="primary"
                                    onClick={handleSave}
                                    loading={loading}
                                    disabled={loading}
                                >
                                    {editingSeccion ? 'Actualizar' : 'Crear'}
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
                            Nueva Sección
                        </ZenButton>
                    )}

                    {/* Lista de secciones */}
                    {loading && secciones.length === 0 ? (
                        <div className="text-center py-8 text-zinc-400">Cargando...</div>
                    ) : secciones.length > 0 ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={secciones.map((s) => s.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-2">
                                    {secciones.map((seccion) => (
                                        <SeccionItem
                                            key={seccion.id}
                                            seccion={seccion}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <div className="text-center py-8 text-zinc-400">
                            No hay secciones. Crea la primera.
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
