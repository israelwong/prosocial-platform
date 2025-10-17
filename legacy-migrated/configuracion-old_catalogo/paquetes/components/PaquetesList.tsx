'use client';

import React, { useState } from 'react';
import { Plus, Package, Edit, Trash2, Copy, Eye } from 'lucide-react';
import { ZenButton, ZenCard, ZenInput, ZenBadge } from '@/components/ui/zen';
// import { PaqueteCard } from './PaqueteCard';
// import { PaqueteForm } from './PaqueteForm';
// import { PaqueteSkeleton } from './PaqueteSkeleton';
import {
    crearPaquete,
    actualizarPaquete,
    eliminarPaquete,
    duplicarPaquete
} from '@/lib/actions/studio/config/paquetes.actions';
import type { PaqueteFromDB, PaqueteFormData } from '@/lib/actions/schemas/paquete-schemas';
import type { EventTypeData } from '@/lib/actions/schemas/event-type-schemas';

interface PaquetesListProps {
    studioSlug: string;
    initialPaquetes: Array<{
        id: string;
        studio_id: string;
        event_type_id: string;
        name: string;
        cost?: number | null;
        expense?: number | null;
        utilidad?: number | null;
        precio?: number | null;
        status: string;
        position: number;
        created_at: Date;
        updated_at: Date;
    }>;
    onPaquetesChange: (paquetes: Array<{
        id: string;
        studio_id: string;
        event_type_id: string;
        name: string;
        cost?: number | null;
        expense?: number | null;
        utilidad?: number | null;
        precio?: number | null;
        status: string;
        position: number;
        created_at: Date;
        updated_at: Date;
    }>) => void;
}

export function PaquetesList({
    studioSlug,
    initialPaquetes,
    onPaquetesChange
}: PaquetesListProps) {
    const [paquetes, setPaquetes] = useState<Array<{
        id: string;
        studio_id: string;
        event_type_id: string;
        name: string;
        cost?: number | null;
        expense?: number | null;
        utilidad?: number | null;
        precio?: number | null;
        status: string;
        position: number;
        created_at: Date;
        updated_at: Date;
    }>>(initialPaquetes);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingPaquete, setEditingPaquete] = useState<{
        id: string;
        studio_id: string;
        event_type_id: string;
        name: string;
        cost?: number | null;
        expense?: number | null;
        utilidad?: number | null;
        precio?: number | null;
        status: string;
        position: number;
        created_at: Date;
        updated_at: Date;
    } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    // Filtrar paquetes
    const filteredPaquetes = paquetes.filter(paquete => {
        const matchesSearch = paquete.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Crear nuevo paquete
    const handleCreatePaquete = async (data: PaqueteFormData) => {
        try {
            setLoading(true);
            const result = await crearPaquete(studioSlug, data);

            if (result.success && result.data) {
                const newPaquetes = [...paquetes, result.data];
                setPaquetes(newPaquetes);
                onPaquetesChange(newPaquetes);
                setShowForm(false);
            } else {
                console.error('Error creando paquete:', result.error);
            }
        } catch (error) {
            console.error('Error creando paquete:', error);
        } finally {
            setLoading(false);
        }
    };

    // Actualizar paquete
    const handleUpdatePaquete = async (paqueteId: string, data: PaqueteFormData) => {
        try {
            setLoading(true);
            const result = await actualizarPaquete(paqueteId, studioSlug, data);

            if (result.success && result.data) {
                const updatedPaquetes = paquetes.map(p =>
                    p.id === paqueteId ? result.data! : p
                );
                setPaquetes(updatedPaquetes);
                onPaquetesChange(updatedPaquetes);
                setEditingPaquete(null);
            } else {
                console.error('Error actualizando paquete:', result.error);
            }
        } catch (error) {
            console.error('Error actualizando paquete:', error);
        } finally {
            setLoading(false);
        }
    };

    // Eliminar paquete
    const handleDeletePaquete = async (paqueteId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este paquete?')) {
            return;
        }

        try {
            setLoading(true);
            const result = await eliminarPaquete(paqueteId, studioSlug);

            if (result.success) {
                const updatedPaquetes = paquetes.filter(p => p.id !== paqueteId);
                setPaquetes(updatedPaquetes);
                onPaquetesChange(updatedPaquetes);
            } else {
                console.error('Error eliminando paquete:', result.error);
            }
        } catch (error) {
            console.error('Error eliminando paquete:', error);
        } finally {
            setLoading(false);
        }
    };

    // Duplicar paquete
    const handleDuplicatePaquete = async (paqueteId: string) => {
        try {
            setLoading(true);
            const result = await duplicarPaquete(paqueteId, studioSlug);

            if (result.success && result.data) {
                const newPaquetes = [...paquetes, result.data];
                setPaquetes(newPaquetes);
                onPaquetesChange(newPaquetes);
            } else {
                console.error('Error duplicando paquete:', result.error);
            }
        } catch (error) {
            console.error('Error duplicando paquete:', error);
        } finally {
            setLoading(false);
        }
    };

    // Editar paquete
    const handleEditPaquete = (paquete: PaqueteData) => {
        setEditingPaquete(paquete);
        setShowForm(true);
    };

    // Cancelar edición
    const handleCancelEdit = () => {
        setEditingPaquete(null);
        setShowForm(false);
    };

    return (
        <div className="space-y-6">
            {/* Header con controles */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div className="flex items-center gap-4">
                    <ZenButton
                        onClick={() => setShowForm(true)}
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nuevo Paquete
                    </ZenButton>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <ZenInput
                        placeholder="Buscar paquetes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full sm:w-64"
                    />

                    <select
                        value={filterEventType}
                        onChange={(e) => setFilterEventType(e.target.value)}
                        className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Todos los tipos</option>
                        {eventTypes.map(eventType => (
                            <option key={eventType.id} value={eventType.id}>
                                {eventType.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Formulario de creación/edición */}
            {showForm && (
                <PaqueteForm
                    paquete={editingPaquete}
                    eventTypes={eventTypes}
                    onSubmit={editingPaquete ?
                        (data) => handleUpdatePaquete(editingPaquete.id, data) :
                        handleCreatePaquete
                    }
                    onCancel={handleCancelEdit}
                    loading={loading}
                />
            )}

            {/* Lista de paquetes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading && paquetes.length === 0 ? (
                    // Skeleton mientras carga
                    Array.from({ length: 6 }).map((_, index) => (
                        <PaqueteSkeleton key={index} />
                    ))
                ) : filteredPaquetes.length > 0 ? (
                    filteredPaquetes.map(paquete => (
                        <PaqueteCard
                            key={paquete.id}
                            paquete={paquete}
                            eventTypes={eventTypes}
                            onEdit={handleEditPaquete}
                            onDelete={handleDeletePaquete}
                            onDuplicate={handleDuplicatePaquete}
                            loading={loading}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <Package className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            {searchTerm || filterEventType !== 'all' ? 'No se encontraron paquetes' : 'No hay paquetes'}
                        </h3>
                        <p className="text-zinc-400 mb-4">
                            {searchTerm || filterEventType !== 'all'
                                ? 'Intenta ajustar los filtros de búsqueda'
                                : 'Crea tu primer paquete para comenzar'
                            }
                        </p>
                        {!searchTerm && filterEventType === 'all' && (
                            <ZenButton
                                onClick={() => setShowForm(true)}
                                variant="primary"
                                className="flex items-center gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Crear Paquete
                            </ZenButton>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}