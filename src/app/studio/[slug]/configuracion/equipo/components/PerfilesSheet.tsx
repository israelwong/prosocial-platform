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
    obtenerPerfilesPersonal,
    crearPerfilPersonal,
    actualizarPerfilPersonal,
    eliminarPerfilPersonal,
    actualizarOrdenPerfilesPersonal
} from '@/lib/actions/studio/config/personal.actions';
import type { PerfilPersonalData } from '@/lib/actions/schemas/personal-schemas';

interface PerfilesSheetProps {
    studioSlug: string;
}

interface SortablePerfilItemProps {
    perfil: PerfilPersonalData;
    onEdit: (perfil: PerfilPersonalData) => void;
    onDelete: (perfil: PerfilPersonalData) => void;
    isEditing: boolean;
    editandoNombre: string;
    onEditChange: (nombre: string) => void;
    onSaveEdit: () => void;
    onCancelEdit: () => void;
}

function SortablePerfilItem({
    perfil,
    onEdit,
    onDelete,
    isEditing,
    editandoNombre,
    onEditChange,
    onSaveEdit,
    onCancelEdit
}: SortablePerfilItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: perfil.id });

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
                                        <span className="font-medium text-white">{perfil.nombre}</span>
                                        {perfil.descripcion && (
                                            <p className="text-sm text-zinc-400">{perfil.descripcion}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <ZenButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(perfil)}
                                            className="hover:bg-zinc-700"
                                        >
                                            <Edit2 className="h-3 w-3" />
                                        </ZenButton>
                                        <ZenButton
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(perfil)}
                                            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </ZenButton>
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

export function PerfilesSheet({ studioSlug }: PerfilesSheetProps) {
    const [perfiles, setPerfiles] = useState<PerfilPersonalData[]>([]);
    const [loading, setLoading] = useState(true);
    const [nuevoPerfil, setNuevoPerfil] = useState('');
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

    const cargarPerfiles = useCallback(async () => {
        try {
            setLoading(true);
            const result = await obtenerPerfilesPersonal(studioSlug);

            if (result.success && result.data) {
                setPerfiles(result.data);
            } else {
                toast.error(result.error || 'Error al cargar perfiles');
            }
        } catch (error) {
            console.error('Error al cargar perfiles:', error);
            toast.error('Error al cargar perfiles');
        } finally {
            setLoading(false);
        }
    }, [studioSlug]);

    useEffect(() => {
        cargarPerfiles();
    }, [cargarPerfiles]);

    const handleCrearPerfil = async () => {
        if (!nuevoPerfil.trim()) {
            toast.error('El nombre del perfil es requerido');
            return;
        }

        try {
            const result = await crearPerfilPersonal(studioSlug, {
                nombre: nuevoPerfil.trim(),
                descripcion: '',
                orden: perfiles.length,
                isActive: true
            });

            if (result.success && result.data) {
                toast.success('Perfil creado exitosamente');
                setNuevoPerfil('');
                // Actualizar localmente sin recargar todo
                setPerfiles(prev => [...prev, result.data!]);
            } else {
                toast.error(result.error || 'Error al crear perfil');
            }
        } catch (error) {
            console.error('Error al crear perfil:', error);
            toast.error('Error al crear perfil');
        }
    };

    const handleIniciarEdicion = (perfil: PerfilPersonalData) => {
        setEditandoId(perfil.id);
        setEditandoNombre(perfil.nombre);
    };

    const handleGuardarEdicion = async (perfilId: string) => {
        if (!editandoNombre.trim()) {
            toast.error('El nombre del perfil es requerido');
            return;
        }

        try {
            const result = await actualizarPerfilPersonal(studioSlug, perfilId, {
                nombre: editandoNombre.trim()
            });

            if (result.success) {
                toast.success('Perfil actualizado exitosamente');
                setEditandoId(null);
                setEditandoNombre('');
                // Actualizar localmente
                setPerfiles(prev => prev.map(perfil =>
                    perfil.id === perfilId
                        ? { ...perfil, nombre: editandoNombre.trim() }
                        : perfil
                ));
            } else {
                toast.error(result.error || 'Error al actualizar perfil');
            }
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            toast.error('Error al actualizar perfil');
        }
    };

    const handleCancelarEdicion = () => {
        setEditandoId(null);
        setEditandoNombre('');
    };

    const handleIniciarEliminacion = (perfil: PerfilPersonalData) => {
        setEliminandoId(perfil.id);
        setEliminandoNombre(perfil.nombre);
    };

    const handleConfirmarEliminacion = async () => {
        if (!eliminandoId) return;

        try {
            const result = await eliminarPerfilPersonal(studioSlug, eliminandoId);
            if (result.success) {
                toast.success('Perfil eliminado exitosamente');
                // Actualizar localmente
                setPerfiles(prev => prev.filter(perfil => perfil.id !== eliminandoId));
                setEliminandoId(null);
                setEliminandoNombre('');
            } else {
                toast.error(result.error || 'Error al eliminar perfil');
            }
        } catch (error) {
            console.error('Error al eliminar perfil:', error);
            toast.error('Error al eliminar perfil');
        }
    };

    const handleCancelarEliminacion = () => {
        setEliminandoId(null);
        setEliminandoNombre('');
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = perfiles.findIndex(perfil => perfil.id === active.id);
            const newIndex = perfiles.findIndex(perfil => perfil.id === over?.id);

            const newPerfiles = arrayMove(perfiles, oldIndex, newIndex);
            setPerfiles(newPerfiles);

            // Actualizar orden en el servidor
            try {
                const perfilesConOrden = newPerfiles.map((perfil, index) => ({
                    id: perfil.id,
                    orden: index
                }));

                await actualizarOrdenPerfilesPersonal(studioSlug, {
                    perfiles: perfilesConOrden
                });
            } catch (error) {
                console.error('Error al actualizar orden:', error);
                toast.error('Error al actualizar orden de perfiles');
                // Revertir cambios locales
                cargarPerfiles();
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-zinc-400">Cargando perfiles...</div>
            </div>
        );
    }

    return (
        <div className="space-y-4 p-5">
            {/* Agregar nuevo perfil */}
            <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                <h3 className="font-medium text-white flex items-center gap-2 mb-3">
                    <Plus className="h-4 w-4 text-blue-400" />
                    Agregar Perfil
                </h3>
                <div className="flex items-center gap-2">
                    <ZenInput
                        placeholder="Nombre del perfil"
                        value={nuevoPerfil}
                        onChange={(e) => setNuevoPerfil(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleCrearPerfil()}
                        className="flex-1"
                    />
                    <ZenButton
                        variant="primary"
                        onClick={handleCrearPerfil}
                        disabled={!nuevoPerfil.trim()}
                    >
                        <Plus className="h-4 w-4" />
                    </ZenButton>
                </div>
            </div>

            {/* Lista de perfiles */}
            <div className="space-y-3">
                <h3 className="font-medium text-white flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-blue-400" />
                    Perfiles Existentes
                </h3>

                {perfiles.length === 0 ? (
                    <div className="text-center py-8 text-zinc-400 bg-zinc-800/30 rounded-lg border border-zinc-700">
                        <GripVertical className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                        No hay perfiles registrados
                    </div>
                ) : (
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={perfiles.map(perfil => perfil.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {perfiles.map((perfil) => (
                                    <SortablePerfilItem
                                        key={perfil.id}
                                        perfil={perfil}
                                        onEdit={handleIniciarEdicion}
                                        onDelete={handleIniciarEliminacion}
                                        isEditing={editandoId === perfil.id}
                                        editandoNombre={editandoNombre}
                                        onEditChange={setEditandoNombre}
                                        onSaveEdit={() => handleGuardarEdicion(perfil.id)}
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
                            ¿Estás seguro de que quieres eliminar el perfil &quot;{eliminandoNombre}&quot;?
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
