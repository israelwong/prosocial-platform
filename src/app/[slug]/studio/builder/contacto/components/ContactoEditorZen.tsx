'use client';

import React, { useState, useEffect } from 'react';
import { ContactoData, Telefono, Horario, ZonaTrabajo } from '../types';
import { ZenButton, ZenInput, ZenTextarea, ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { Phone, MapPin, Clock, Plus, Trash2, Edit3, Info, GripVertical } from 'lucide-react';
import { TelefonoModal } from './TelefonoModal';
import { ZonaTrabajoModal } from './ZonaTrabajoModal';
import { obtenerHorariosStudio, toggleHorarioEstado, actualizarHorario } from '@/lib/actions/studio/config/horarios.actions';
import { actualizarContacto } from '@/lib/actions/studio/config/contacto.actions';
import {
    obtenerZonasTrabajoStudio,
    crearZonaTrabajo,
    actualizarZonaTrabajo,
    eliminarZonaTrabajo,
    reordenarZonasTrabajo
} from '@/lib/actions/studio/config/zonas-trabajo.actions';
import { toast } from 'sonner';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    useSortable,
    arrayMove,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ContactoEditorZenProps {
    data: ContactoData;
    onLocalUpdate: (data: unknown) => void;
    studioSlug: string;
}

export function ContactoEditorZen({ data, onLocalUpdate, studioSlug }: ContactoEditorZenProps) {
    const [formData, setFormData] = useState({
        descripcion: data.descripcion || '',
        direccion: data.direccion || '',
        google_maps_url: data.google_maps_url || '',
    });

    const [telefonos, setTelefonos] = useState<Telefono[]>(
        (data.telefonos || []).map(t => ({ ...t, is_active: t.is_active ?? true }))
    );
    const [horarios, setHorarios] = useState<Horario[]>(data.horarios || []);
    const [zonasTrabajo, setZonasTrabajo] = useState<ZonaTrabajo[]>(data.zonas_trabajo || []);
    const [loadingHorarios, setLoadingHorarios] = useState(false);
    const [loadingZonas, setLoadingZonas] = useState(false);
    const [isReorderingZonas, setIsReorderingZonas] = useState(false);
    const [isReorderingTelefonos, setIsReorderingTelefonos] = useState(false);
    const [updatingInfo, setUpdatingInfo] = useState(false);
    const [activeTab, setActiveTab] = useState('info');

    // Obtener studioId desde data
    const studioId = data.studio_id;

    // Cargar horarios desde el servidor
    useEffect(() => {
        const loadHorarios = async () => {
            try {
                setLoadingHorarios(true);
                const horariosData = await obtenerHorariosStudio(studioSlug);

                // Convertir formato del servidor al formato local
                const horariosConvertidos = horariosData.map((h: Record<string, unknown>): Horario => ({
                    id: typeof h.id === 'string' ? h.id : undefined,
                    dia: typeof h.day_of_week === 'string' ? h.day_of_week : 'monday',
                    apertura: typeof h.start_time === 'string' ? h.start_time : '09:00',
                    cierre: typeof h.end_time === 'string' ? h.end_time : '18:00',
                    cerrado: typeof h.is_active === 'boolean' ? !h.is_active : true,
                    order: typeof h.order === 'number' ? h.order : 0
                }));

                setHorarios(horariosConvertidos);
            } catch (error) {
                console.error('Error loading horarios:', error);
                toast.error('Error al cargar horarios');
            } finally {
                setLoadingHorarios(false);
            }
        };

        loadHorarios();
    }, [studioSlug]);

    // Cargar zonas de trabajo desde el servidor
    useEffect(() => {
        const loadZonasTrabajo = async () => {
            try {
                setLoadingZonas(true);
                const zonasData = await obtenerZonasTrabajoStudio(studioId);

                // Convertir formato del servidor al formato local
                const zonasConvertidas = zonasData.map((z: Record<string, unknown>): ZonaTrabajo => ({
                    id: typeof z.id === 'string' ? z.id : undefined,
                    nombre: typeof z.nombre === 'string' ? z.nombre : '',
                    color: typeof z.color === 'string' ? z.color : undefined
                }));

                setZonasTrabajo(zonasConvertidas);
            } catch (error) {
                console.error('Error loading zonas de trabajo:', error);
                toast.error('Error al cargar zonas de trabajo');
            } finally {
                setLoadingZonas(false);
            }
        };

        loadZonasTrabajo();
    }, [studioId]);

    // Modales
    const [telefonoModal, setTelefonoModal] = useState<{ open: boolean; telefono?: Telefono }>({ open: false });
    const [zonaModal, setZonaModal] = useState<{ open: boolean; zona?: ZonaTrabajo }>({ open: false });

    const handleInputChange = (field: string, value: string) => {
        const newData = { ...formData, [field]: value };
        setFormData(newData);
        onLocalUpdate({ ...data, ...newData });
    };

    const handleUpdateInfo = async () => {
        try {
            setUpdatingInfo(true);
            toast.loading('Actualizando información...', { id: 'update-info' });

            const result = await actualizarContacto(studioSlug, {
                descripcion: formData.descripcion,
                direccion: formData.direccion,
                google_maps_url: formData.google_maps_url
            });

            if (result.success) {
                toast.success('¡Información actualizada exitosamente!', { id: 'update-info' });
            } else {
                toast.error('Error al actualizar la información', { id: 'update-info' });
            }
        } catch (error) {
            console.error('Error updating info:', error);
            toast.error('Error al actualizar la información', { id: 'update-info' });
        } finally {
            setUpdatingInfo(false);
        }
    };

    const handleTelefonoSave = (telefono: Telefono) => {
        if (telefono.id) {
            // Editar
            const updated = telefonos.map(t => t.id === telefono.id ? { ...telefono, is_active: telefono.is_active ?? true } : t);
            setTelefonos(updated);
            onLocalUpdate({ ...data, telefonos: updated });
        } else {
            // Agregar
            const newTelefono = { ...telefono, id: Date.now().toString(), is_active: telefono.is_active ?? true };
            const updatedTelefonos = [...telefonos, newTelefono];
            setTelefonos(updatedTelefonos);
            onLocalUpdate({ ...data, telefonos: updatedTelefonos });
        }
    };

    const handleTelefonoDelete = (id: string) => {
        const updated = telefonos.filter(t => t.id !== id);
        setTelefonos(updated);
        onLocalUpdate({ ...data, telefonos: updated });
    };

    const handleTelefonoToggle = (id: string, is_active: boolean) => {
        const updated = telefonos.map(t =>
            t.id === id ? { ...t, is_active } : t
        );
        setTelefonos(updated);
        onLocalUpdate({ ...data, telefonos: updated });
        toast.success(`Teléfono ${is_active ? 'activado' : 'desactivado'} exitosamente`);
    };


    const handleHorarioUpdate = async (id: string, field: 'start_time' | 'end_time', value: string) => {
        try {
            const horario = horarios.find(h => h.id === id);
            if (!horario) return;

            const updateData = {
                day_of_week: horario.dia as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
                start_time: field === 'start_time' ? value : horario.apertura,
                end_time: field === 'end_time' ? value : horario.cierre,
                is_active: !horario.cerrado
            };

            await actualizarHorario(id, {
                id,
                studio_slug: studioSlug,
                ...updateData,
                order: horario.order || 0
            });

            // Actualizar estado local
            const updated = horarios.map(h =>
                h.id === id
                    ? {
                        ...h,
                        apertura: field === 'start_time' ? value : h.apertura,
                        cierre: field === 'end_time' ? value : h.cierre
                    }
                    : h
            );
            setHorarios(updated);
            onLocalUpdate({ ...data, horarios: updated });
        } catch (error) {
            console.error('Error updating horario:', error);
            toast.error('Error al actualizar horario');
        }
    };

    const handleHorarioToggle = async (id: string, cerrado: boolean) => {
        try {
            const horario = horarios.find(h => h.id === id);
            if (!horario) return;

            await toggleHorarioEstado(id, {
                id,
                studio_slug: studioSlug,
                is_active: !cerrado
            });

            // Actualizar estado local
            const updated = horarios.map(h =>
                h.id === id ? { ...h, cerrado } : h
            );
            setHorarios(updated);
            onLocalUpdate({ ...data, horarios: updated });

            toast.success(`Horario ${cerrado ? 'desactivado' : 'activado'} exitosamente`);
        } catch (error) {
            console.error('Error toggling horario:', error);
            toast.error('Error al cambiar estado del horario');
        }
    };


    const handleZonaSave = async (zona: ZonaTrabajo) => {
        try {
            if (zona.id) {
                // Editar zona existente
                const result = await actualizarZonaTrabajo(zona.id, { nombre: zona.nombre });
                if (result.success) {
                    setZonasTrabajo(prev => prev.map(z => z.id === zona.id ? zona : z));
                    toast.success('Zona de trabajo actualizada');
                } else {
                    toast.error(result.error || 'Error al actualizar la zona');
                }
            } else {
                // Crear nueva zona
                const result = await crearZonaTrabajo(studioId, { nombre: zona.nombre });
                if (result.success && result.zona) {
                    const nuevaZona = {
                        id: result.zona.id,
                        nombre: result.zona.nombre,
                        color: undefined
                    };
                    setZonasTrabajo(prev => [...prev, nuevaZona]);
                    toast.success('Zona de trabajo creada');
                } else {
                    toast.error(result.error || 'Error al crear la zona');
                }
            }
        } catch (error) {
            console.error('Error saving zona:', error);
            toast.error('Error al guardar la zona de trabajo');
        }
    };

    const handleZonaDelete = async (zonaId: string) => {
        try {
            const result = await eliminarZonaTrabajo(zonaId);
            if (result.success) {
                setZonasTrabajo(prev => prev.filter(z => z.id !== zonaId));
                toast.success('Zona de trabajo eliminada');
            } else {
                toast.error(result.error || 'Error al eliminar la zona');
            }
        } catch (error) {
            console.error('Error deleting zona:', error);
            toast.error('Error al eliminar la zona de trabajo');
        }
    };

    // Drag & Drop para zonas de trabajo
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleZonasDragEnd = async (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setIsReorderingZonas(true);
            toast.loading('Reordenando zonas...', { id: 'reorder-zonas' });

            const oldIndex = zonasTrabajo.findIndex((zona) => zona.id === active.id);
            const newIndex = zonasTrabajo.findIndex((zona) => zona.id === over.id);

            const reorderedZonas = arrayMove(zonasTrabajo, oldIndex, newIndex);
            setZonasTrabajo(reorderedZonas);

            // Actualizar orden en el servidor
            try {
                const zonasOrdenadas = reorderedZonas.map((zona: ZonaTrabajo, index: number) => ({
                    id: zona.id!,
                    orden: index
                }));

                const result = await reordenarZonasTrabajo(studioId, zonasOrdenadas);
                if (result.success) {
                    toast.success('Zonas reordenadas exitosamente', { id: 'reorder-zonas' });
                } else {
                    toast.error('Error al reordenar las zonas', { id: 'reorder-zonas' });
                    // Revertir cambios locales
                    setZonasTrabajo(zonasTrabajo);
                }
            } catch (error) {
                console.error('Error reordering zonas:', error);
                toast.error('Error al reordenar las zonas', { id: 'reorder-zonas' });
                // Revertir cambios locales
                setZonasTrabajo(zonasTrabajo);
            } finally {
                setIsReorderingZonas(false);
            }
        }
    };

    // Drag & Drop para teléfonos
    const handleTelefonosDragEnd = async (event: any) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setIsReorderingTelefonos(true);
            toast.loading('Reordenando teléfonos...', { id: 'reorder-telefonos' });

            const oldIndex = telefonos.findIndex((telefono) => telefono.id === active.id);
            const newIndex = telefonos.findIndex((telefono) => telefono.id === over.id);

            const reorderedTelefonos = arrayMove(telefonos, oldIndex, newIndex);
            setTelefonos(reorderedTelefonos);

            // Actualizar orden local (por ahora solo local, no hay campo orden en teléfonos)
            try {
                // Por ahora solo actualizamos el estado local
                // En el futuro se puede agregar un campo 'orden' a la tabla de teléfonos
                toast.success('Teléfonos reordenados exitosamente', { id: 'reorder-telefonos' });
            } catch (error) {
                console.error('Error reordering telefonos:', error);
                toast.error('Error al reordenar los teléfonos', { id: 'reorder-telefonos' });
                // Revertir cambios locales
                setTelefonos(telefonos);
            } finally {
                setIsReorderingTelefonos(false);
            }
        }
    };

    // Componente para zona de trabajo sortable
    interface SortableZonaItemProps {
        zona: ZonaTrabajo;
        onEdit: (zona: ZonaTrabajo) => void;
        onDelete: (zonaId: string) => void;
    }

    function SortableZonaItem({ zona, onEdit, onDelete }: SortableZonaItemProps) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: zona.id! });

        const style = {
            transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            transition,
            opacity: isDragging ? 0.5 : 1,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`flex items-center gap-2 py-2 border-b border-zinc-800 last:border-b-0 ${isDragging ? 'shadow-lg' : ''}`}
            >
                <div className="p-1 cursor-grab hover:bg-zinc-700 rounded transition-colors" {...attributes} {...listeners}>
                    <GripVertical className="h-4 w-4 text-zinc-500" />
                </div>
                <span className="text-sm text-zinc-300 flex-1">{zona.nombre}</span>
                <button
                    onClick={() => onEdit(zona)}
                    className="p-2 text-zinc-400 hover:text-blue-400 transition-colors"
                    title="Editar"
                >
                    <Edit3 className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onDelete(zona.id!)}
                    className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                    title="Eliminar"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        );
    }

    // Componente para teléfono sortable
    interface SortableTelefonoItemProps {
        telefono: Telefono;
        onToggle: (id: string, is_active: boolean) => void;
        onEdit: (telefono: Telefono) => void;
        onDelete: (id: string) => void;
    }

    function SortableTelefonoItem({ telefono, onToggle, onEdit, onDelete }: SortableTelefonoItemProps) {
        const {
            attributes,
            listeners,
            setNodeRef,
            transform,
            transition,
            isDragging,
        } = useSortable({ id: telefono.id! });

        const style = {
            transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
            transition,
            opacity: isDragging ? 0.5 : 1,
        };

        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`py-2 border-b border-zinc-800 last:border-b-0 ${isDragging ? 'shadow-lg' : ''} ${!telefono.is_active ? 'opacity-50' : ''}`}
            >
                {/* Fila 1: Icono drag | Teléfono | Switch | Iconos */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-1 cursor-grab hover:bg-zinc-700 rounded transition-colors" {...attributes} {...listeners}>
                            <GripVertical className="h-4 w-4 text-zinc-500" />
                        </div>
                        <p className="text-white font-medium text-lg">{telefono.numero}</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={telefono.is_active}
                                onChange={(e) => onToggle(telefono.id!, e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-9 h-5 bg-zinc-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                        </label>

                        <button
                            onClick={() => onEdit(telefono)}
                            className="p-2 text-zinc-400 hover:text-blue-400 transition-colors"
                            title="Editar"
                        >
                            <Edit3 className="h-4 w-4" />
                        </button>

                        <button
                            onClick={() => onDelete(telefono.id!)}
                            className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
                            title="Eliminar"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                </div>

                {/* Fila 2: Etiqueta | Badges de WhatsApp y Llamadas */}
                <div className="flex items-center gap-2 mt-2">
                    {telefono.etiqueta && (
                        <label className="text-xs text-zinc-400 ml-5 border border-zinc-600 px-2 py-1 rounded">
                            {telefono.etiqueta}
                        </label>
                    )}
                    {telefono.tipo === 'llamadas' && (
                        <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                            Llamadas
                        </span>
                    )}
                    {telefono.tipo === 'whatsapp' && (
                        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                            WhatsApp
                        </span>
                    )}
                    {telefono.tipo === 'ambos' && (
                        <>
                            <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">
                                Llamadas
                            </span>
                            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">
                                WhatsApp
                            </span>
                        </>
                    )}
                </div>
            </div>
        );
    }

    const tabs = [
        { id: 'info', label: 'Información', icon: Info },
        { id: 'telefonos', label: 'Teléfonos', icon: Phone },
        { id: 'horarios', label: 'Horarios', icon: Clock },
        { id: 'zonas', label: 'Zonas', icon: MapPin }
    ];

    return (
        <div className="space-y-6">
            {/* Tabs Navigation */}
            <div className="border-b border-zinc-800">
                <nav className="flex space-x-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                    ? 'border-blue-500 text-blue-400'
                                    : 'border-transparent text-zinc-400 hover:text-zinc-300 hover:border-zinc-600'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
                {activeTab === 'info' && (
                    <ZenCard variant="default" padding="none">
                        <ZenCardHeader className="border-b border-zinc-800">
                            <ZenCardTitle>Información Básica</ZenCardTitle>
                        </ZenCardHeader>
                        <ZenCardContent className="p-6 space-y-6">
                            <ZenTextarea
                                label="Descripción del Estudio"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => handleInputChange('descripcion', e.target.value)}
                                placeholder="Describe tu estudio, servicios y especialidades..."
                                rows={2}
                            />

                            <ZenTextarea
                                label="Dirección"
                                name="direccion"
                                value={formData.direccion}
                                onChange={(e) => handleInputChange('direccion', e.target.value)}
                                placeholder="Dirección completa del estudio"
                                rows={3}
                            />

                            <ZenInput
                                label="Enlace de Google Maps"
                                name="google_maps_url"
                                value={formData.google_maps_url}
                                onChange={(e) => handleInputChange('google_maps_url', e.target.value)}
                                placeholder="https://maps.google.com/..."
                                hint="Pega el enlace de Google Maps de tu ubicación"
                            />

                            <div className="flex justify-end pt-4">
                                <ZenButton
                                    onClick={handleUpdateInfo}
                                    loading={updatingInfo}
                                    loadingText="Actualizando..."
                                    variant="primary"
                                >
                                    Actualizar Información
                                </ZenButton>
                            </div>
                        </ZenCardContent>
                    </ZenCard>
                )}

                {activeTab === 'telefonos' && (
                    <ZenCard variant="default" padding="none">
                        <ZenCardHeader className="border-b border-zinc-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Phone className="h-5 w-5 text-green-400" />
                                    <ZenCardTitle>Teléfonos de Contacto</ZenCardTitle>
                                </div>
                                <ZenButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setTelefonoModal({ open: true })}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Teléfono
                                </ZenButton>
                            </div>
                        </ZenCardHeader>
                        <ZenCardContent className="p-6">
                            {telefonos.length === 0 ? (
                                <div className="text-center py-8 text-zinc-500">
                                    <Phone className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                                    <p>No hay teléfonos agregados</p>
                                    <p className="text-sm">Agrega al menos un número de contacto</p>
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleTelefonosDragEnd}
                                >
                                    <SortableContext
                                        items={telefonos.map(t => t.id!)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-3">
                                            {telefonos.map((telefono) => (
                                                <SortableTelefonoItem
                                                    key={telefono.id}
                                                    telefono={telefono}
                                                    onToggle={handleTelefonoToggle}
                                                    onEdit={(telefono) => setTelefonoModal({ open: true, telefono })}
                                                    onDelete={handleTelefonoDelete}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}

                            {/* Indicador de reordenamiento */}
                            {isReorderingTelefonos && (
                                <div className="flex items-center justify-center py-2">
                                    <div className="h-4 w-4 animate-spin mr-2 border-2 border-green-500 border-t-transparent rounded-full"></div>
                                    <span className="text-sm text-zinc-400">Actualizando orden...</span>
                                </div>
                            )}
                        </ZenCardContent>
                    </ZenCard>
                )}

                {activeTab === 'horarios' && (
                    <ZenCard variant="default" padding="none">
                        <ZenCardHeader className="border-b border-zinc-800">
                            <div className="flex items-center gap-3">
                                <Clock className="h-5 w-5 text-blue-400" />
                                <ZenCardTitle>Horarios de Atención</ZenCardTitle>
                            </div>
                        </ZenCardHeader>
                        <ZenCardContent className="p-6">
                            {loadingHorarios ? (
                                <div className="text-center py-8 text-zinc-500">
                                    <Clock className="h-12 w-12 mx-auto mb-4 text-zinc-600 animate-pulse" />
                                    <p>Cargando horarios...</p>
                                </div>
                            ) : horarios.length === 0 ? (
                                <div className="text-center py-8 text-zinc-500">
                                    <Clock className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                                    <p>No hay horarios configurados</p>
                                    <p className="text-sm">Agrega los horarios de atención</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {/* Header de la tabla */}
                                    <div className="grid grid-cols-4 gap-4 py-2 text-sm font-medium text-zinc-300 border-b border-zinc-700">
                                        <div>Día</div>
                                        <div>Hora Inicio</div>
                                        <div>Hora Fin</div>
                                        <div className="text-center">Activo</div>
                                    </div>

                                    {/* Lista de horarios */}
                                    {horarios.map((horario) => (
                                        <div key={horario.id} className="grid grid-cols-4 gap-4 py-3 items-center border-b border-zinc-800/50">
                                            <div className="font-medium capitalize text-zinc-200">
                                                {horario.dia === 'monday' ? 'Lunes' :
                                                    horario.dia === 'tuesday' ? 'Martes' :
                                                        horario.dia === 'wednesday' ? 'Miércoles' :
                                                            horario.dia === 'thursday' ? 'Jueves' :
                                                                horario.dia === 'friday' ? 'Viernes' :
                                                                    horario.dia === 'saturday' ? 'Sábado' :
                                                                        horario.dia === 'sunday' ? 'Domingo' : horario.dia}
                                            </div>

                                            <div>
                                                <input
                                                    type="time"
                                                    value={horario.apertura}
                                                    onChange={(e) => handleHorarioUpdate(horario.id!, 'start_time', e.target.value)}
                                                    className="w-full px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    disabled={horario.cerrado}
                                                />
                                            </div>

                                            <div>
                                                <input
                                                    type="time"
                                                    value={horario.cierre}
                                                    onChange={(e) => handleHorarioUpdate(horario.id!, 'end_time', e.target.value)}
                                                    className="w-full px-2 py-1 bg-zinc-700 border border-zinc-600 rounded text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    disabled={horario.cerrado}
                                                />
                                            </div>

                                            <div className="flex items-center justify-center">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={!horario.cerrado}
                                                        onChange={(e) => handleHorarioToggle(horario.id!, !e.target.checked)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className="w-11 h-6 bg-zinc-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ZenCardContent>
                    </ZenCard>
                )}

                {activeTab === 'zonas' && (
                    <ZenCard variant="default" padding="none">
                        <ZenCardHeader className="border-b border-zinc-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <MapPin className="h-5 w-5 text-purple-400" />
                                    <ZenCardTitle>Zonas de Trabajo</ZenCardTitle>
                                </div>
                                <ZenButton
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setZonaModal({ open: true })}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Zona
                                </ZenButton>
                            </div>
                        </ZenCardHeader>
                        <ZenCardContent className="p-6">
                            {loadingZonas ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="h-6 w-6 animate-spin border-2 border-purple-500 border-t-transparent rounded-full"></div>
                                    <span className="ml-2 text-zinc-400">Cargando zonas...</span>
                                </div>
                            ) : zonasTrabajo.length === 0 ? (
                                <div className="text-center py-8 text-zinc-500">
                                    <MapPin className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                                    <p>No hay zonas de trabajo</p>
                                    <p className="text-sm">Agrega las zonas donde trabajas</p>
                                </div>
                            ) : (
                                <DndContext
                                    sensors={sensors}
                                    collisionDetection={closestCenter}
                                    onDragEnd={handleZonasDragEnd}
                                >
                                    <SortableContext
                                        items={zonasTrabajo.map(z => z.id!)}
                                        strategy={verticalListSortingStrategy}
                                    >
                                        <div className="space-y-2">
                                            {zonasTrabajo.map((zona) => (
                                                <SortableZonaItem
                                                    key={zona.id}
                                                    zona={zona}
                                                    onEdit={(zona) => setZonaModal({ open: true, zona })}
                                                    onDelete={handleZonaDelete}
                                                />
                                            ))}
                                        </div>
                                    </SortableContext>
                                </DndContext>
                            )}

                            {/* Indicador de reordenamiento */}
                            {isReorderingZonas && (
                                <div className="flex items-center justify-center py-2">
                                    <div className="h-4 w-4 animate-spin mr-2 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                                    <span className="text-sm text-zinc-400">Actualizando orden...</span>
                                </div>
                            )}
                        </ZenCardContent>
                    </ZenCard>
                )}
            </div>

            {/* Modales */}
            <TelefonoModal
                isOpen={telefonoModal.open}
                onClose={() => setTelefonoModal({ open: false })}
                onSave={handleTelefonoSave}
                telefono={telefonoModal.telefono}
            />

            <ZonaTrabajoModal
                isOpen={zonaModal.open}
                onClose={() => setZonaModal({ open: false })}
                onSave={handleZonaSave}
                zona={zonaModal.zona}
            />
        </div>
    );
}
