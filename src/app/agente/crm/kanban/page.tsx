'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
    closestCorners,
    pointerWithin,
    getFirstCollision,
    CollisionDetection,
} from '@dnd-kit/core';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DraggableLeadCard } from './components/DraggableLeadCard';
import { DroppableColumn } from './components/DroppableColumn';
import { Lead, KanbanColumn } from './types';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Plus,
    Search,
} from 'lucide-react';

export default function AgentKanbanPage() {
    const [columns, setColumns] = useState<KanbanColumn[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStudio, setFilterStudio] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeLead, setActiveLead] = useState<Lead | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    // Configuración de sensores para drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Estrategia de colisiones personalizada para soportar columnas vacías
    const collisionDetection: CollisionDetection = (args) => {
        const pointerIntersections = pointerWithin(args);

        if (pointerIntersections.length > 0) {
            const overId = getFirstCollision(pointerIntersections, 'id');
            if (overId != null) {
                return [{ id: overId }];
            }
        }
        // Fallback a closestCorners (más estable que closestCenter para layouts irregulares)
        return closestCorners(args);
    };

    const fetchKanbanData = useCallback(async () => {
        const supabase = createClient();

        try {
            setError(null);
            setLoading(true);
            console.log('🔍 Cargando datos del Kanban...');

            // Verificar autenticación (temporalmente opcional ya que RLS está deshabilitado)
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            console.log('🔍 Estado de autenticación:', { user: user?.email, authError });

            if (authError) {
                console.warn('⚠️ Error de autenticación (continuando sin autenticación):', authError);
            }

            if (!user) {
                console.warn('⚠️ Usuario no autenticado (continuando sin autenticación)');
            }

            // Obtener pipeline stages
            console.log('📋 Obteniendo pipeline stages...');
            const { data: stages, error: stagesError } = await supabase
                .from('prosocial_pipeline_stages')
                .select('*')
                .eq('isActive', true)
                .order('orden', { ascending: true });

            if (stagesError) {
                console.error('❌ Error obteniendo stages:', stagesError);
                setError('Error al cargar las etapas del pipeline');
                setLoading(false);
                return;
            }

            console.log('✅ Pipeline stages obtenidos:', stages?.length || 0);

            // Obtener leads con sus etapas
            console.log('📋 Obteniendo leads...');
            const { data: leads, error: leadsError } = await supabase
                .from('prosocial_leads')
                .select(`
                    id,
                    nombre,
                    email,
                    telefono,
                    nombreEstudio,
                    fechaUltimoContacto,
                    planInteres,
                    presupuestoMensual,
                    puntaje,
                    prioridad,
                    createdAt,
                    etapaId,
                    canalAdquisicionId,
                    agentId,
                    prosocial_canales_adquisicion (
                        id,
                        nombre
                    ),
                    prosocial_agents (
                        id,
                        nombre
                    )
                `)
                .order('createdAt', { ascending: false });

            if (leadsError) {
                console.error('❌ Error obteniendo leads:', leadsError);
                setError('Error al cargar los leads');
                setLoading(false);
                return;
            }

            console.log('✅ Leads obtenidos:', leads?.length || 0);

            // Mapear leads al formato esperado
            const mappedLeads: Lead[] = (leads || []).map(lead => ({
                id: lead.id,
                name: lead.nombre,
                email: lead.email,
                phone: lead.telefono,
                studio: lead.nombreEstudio || 'Sin estudio',
                stage: lead.etapaId || 'Sin etapa',
                value: lead.presupuestoMensual ? Number(lead.presupuestoMensual) : 0,
                priority: lead.prioridad === 'alta' ? 'high' : lead.prioridad === 'media' ? 'medium' : 'low',
                lastActivity: lead.fechaUltimoContacto ? new Date(lead.fechaUltimoContacto).toLocaleDateString() : 'Sin actividad',
                assignedAgent: (lead.prosocial_agents as unknown as { nombre: string } | null)?.nombre || (lead.agentId ? 'Agente asignado' : 'Sin asignar'),
                source: (lead.prosocial_canales_adquisicion as unknown as { nombre: string } | null)?.nombre || 'Sin canal',
                notes: `Lead con ${lead.planInteres || 'plan no especificado'}`,
                etapaId: lead.etapaId
            }));

            // Crear columnas del Kanban
            const kanbanColumns: KanbanColumn[] = (stages || []).map(stage => ({
                id: stage.id,
                title: stage.nombre,
                color: stage.color || '#3B82F6',
                stage: stage,
                leads: mappedLeads.filter(lead => lead.etapaId === stage.id)
            }));

            // Agregar columna para leads sin etapa asignada
            const leadsWithoutStage = mappedLeads.filter(lead => !lead.etapaId);
            if (leadsWithoutStage.length > 0) {
                kanbanColumns.unshift({
                    id: 'sin-etapa',
                    title: 'Sin Etapa',
                    color: '#6B7280',
                    stage: {
                        id: 'sin-etapa',
                        nombre: 'Sin Etapa',
                        descripcion: 'Leads sin etapa asignada',
                        color: '#6B7280',
                        orden: -1,
                        isActive: true
                    },
                    leads: leadsWithoutStage
                });
            }

            setColumns(kanbanColumns);
            console.log('✅ Kanban configurado con', kanbanColumns.length, 'columnas');

        } catch (error) {
            console.error('❌ Error inesperado:', error);
            setError('Error inesperado al cargar los datos del Kanban');
        } finally {
            setLoading(false);
        }
    }, []);

    // Función para actualizar la etapa de un lead usando API route
    const updateLeadStage = useCallback(async (leadId: string, newStageId: string | undefined, oldStageId?: string) => {
        try {
            setIsUpdating(true);
            console.log(`🔄 Actualizando lead ${leadId} de etapa ${oldStageId} a etapa ${newStageId}`);

            // Llamar a la API route
            const response = await fetch(`/api/leads/${leadId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    etapaId: newStageId || null,
                    oldStageId: oldStageId
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al actualizar el lead');
            }

            const updatedLead = await response.json();
            console.log('✅ Lead actualizado exitosamente:', updatedLead);

        } catch (error) {
            console.error('❌ Error actualizando lead:', error);
            throw error;
        } finally {
            setIsUpdating(false);
        }
    }, []);

    useEffect(() => {
        fetchKanbanData();
    }, [fetchKanbanData]);

    // Función para manejar el inicio del drag
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const lead = columns
            .flatMap(col => col.leads)
            .find(lead => lead.id === active.id);

        if (lead) {
            setActiveLead(lead);
        }
    };

    // Función para manejar el final del drag
    const handleDragEnd = async (event: DragEndEvent) => {
        setActiveLead(null);
        const { active, over } = event;

        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        if (activeId === overId) return;

        const findContainer = (id: string) => {
            // Primero verificar si el ID es directamente una etapa/columna
            const columnExists = columns.find(col => col.id === id);
            if (columnExists) {
                return id;
            }

            // Finalmente, buscar en qué columna está el lead
            for (const column of columns) {
                if (column.leads.some(lead => lead.id === id)) {
                    return column.id;
                }
            }
            return null;
        };

        const activeContainer = findContainer(activeId);
        let overContainer: string | null = null;

        // Determinar el contenedor de destino usando la información de data si está disponible
        if (over.data?.current?.type === 'column') {
            overContainer = over.data.current.etapaId;
        } else {
            overContainer = findContainer(overId);
        }

        // Si no se encontró contenedor, verificar si overId es directamente una etapa
        if (!overContainer) {
            const esEtapaValida = columns.some(col => col.id === overId);
            if (esEtapaValida) {
                overContainer = overId;
            }
        }

        console.log('🔍 Drag End Debug:');
        console.log('activeId:', activeId);
        console.log('overId:', overId);
        console.log('activeContainer:', activeContainer);
        console.log('overContainer:', overContainer);

        if (!activeContainer || !overContainer) {
            console.log('❌ No se encontraron contenedores válidos');
            return;
        }

        // Si el lead se mueve a la misma columna, no hacer nada
        if (activeContainer === overContainer) return;

        try {
            // ACTUALIZACIÓN OPTIMISTA: Actualizar el estado local inmediatamente
            setColumns(prevColumns => {
                const newColumns = [...prevColumns];

                // Encontrar las columnas de origen y destino
                const sourceColumnIndex = newColumns.findIndex(col => col.id === activeContainer);
                const targetColumnIndex = newColumns.findIndex(col => col.id === overContainer);

                if (sourceColumnIndex === -1 || targetColumnIndex === -1) return prevColumns;

                const sourceColumn = newColumns[sourceColumnIndex];
                const targetColumn = newColumns[targetColumnIndex];

                // Remover el lead de la columna de origen
                const leadToMove = sourceColumn.leads.find(lead => lead.id === activeId);
                if (!leadToMove) return prevColumns;

                newColumns[sourceColumnIndex] = {
                    ...sourceColumn,
                    leads: sourceColumn.leads.filter(lead => lead.id !== activeId)
                };

                // Agregar el lead a la columna de destino
                newColumns[targetColumnIndex] = {
                    ...targetColumn,
                    leads: [...targetColumn.leads, { ...leadToMove, etapaId: overContainer }]
                };

                return newColumns;
            });

            // Actualizar en la base de datos (sin actualización optimista adicional)
            await updateLeadStage(
                activeId,
                overContainer === 'sin-etapa' ? undefined : overContainer,
                activeContainer === 'sin-etapa' ? undefined : activeContainer
            );

        } catch (error) {
            console.error('❌ Error moviendo lead:', error);

            // REVERTIR CAMBIOS: Si falla la API, revertir al estado anterior
            setColumns(prevColumns => {
                const newColumns = [...prevColumns];

                // Encontrar las columnas de origen y destino
                const sourceColumnIndex = newColumns.findIndex(col => col.id === overContainer);
                const targetColumnIndex = newColumns.findIndex(col => col.id === activeContainer);

                if (sourceColumnIndex === -1 || targetColumnIndex === -1) return prevColumns;

                const sourceColumn = newColumns[sourceColumnIndex];
                const targetColumn = newColumns[targetColumnIndex];

                // Remover el lead de la columna de destino (donde se movió optimísticamente)
                const leadToRevert = sourceColumn.leads.find(lead => lead.id === activeId);
                if (!leadToRevert) return prevColumns;

                newColumns[sourceColumnIndex] = {
                    ...sourceColumn,
                    leads: sourceColumn.leads.filter(lead => lead.id !== activeId)
                };

                // Devolver el lead a la columna de origen
                newColumns[targetColumnIndex] = {
                    ...targetColumn,
                    leads: [...targetColumn.leads, { ...leadToRevert, etapaId: activeContainer }]
                };

                return newColumns;
            });
        }
    };


    const filteredColumns = columns.map(column => ({
        ...column,
        leads: column.leads.filter(lead => {
            const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.studio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStudio = filterStudio === 'all' || lead.studio === filterStudio;
            const matchesPriority = filterPriority === 'all' || lead.priority === filterPriority;

            return matchesSearch && matchesStudio && matchesPriority;
        })
    }));

    const studios = Array.from(new Set(columns.flatMap(col => col.leads.map(lead => lead.studio))));

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">CRM Kanban</h1>
                        <p className="text-muted-foreground">Gestiona tus leads de manera visual</p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <div className="text-muted-foreground">Cargando CRM...</div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">CRM Kanban</h1>
                        <p className="text-muted-foreground">Gestiona tus leads de manera visual</p>
                    </div>
                </div>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 text-xl">⚠️</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-red-600">Error al cargar CRM</h3>
                                <p className="text-muted-foreground mt-2">{error}</p>
                            </div>
                            <Button
                                onClick={() => {
                                    setError(null);
                                    setLoading(true);
                                    fetchKanbanData();
                                }}
                                variant="outline"
                            >
                                Reintentar
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">CRM Kanban</h1>
                    <p className="text-muted-foreground">Gestiona tus leads de manera visual</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Lead
                </Button>
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar leads por nombre, estudio o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={filterStudio} onValueChange={setFilterStudio}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filtrar por estudio" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estudios</SelectItem>
                                {studios.map(studio => (
                                    <SelectItem key={studio} value={studio}>{studio}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filtrar por prioridad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las prioridades</SelectItem>
                                <SelectItem value="high">Alta prioridad</SelectItem>
                                <SelectItem value="medium">Media prioridad</SelectItem>
                                <SelectItem value="low">Baja prioridad</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Kanban Board */}
            <DndContext
                sensors={sensors}
                collisionDetection={collisionDetection}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {filteredColumns.map((column) => (
                        <DroppableColumn
                            key={column.id}
                            column={column}
                            isUpdating={isUpdating}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeLead ? (
                        <DraggableLeadCard lead={activeLead} isUpdating={false} />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Resumen */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Resumen del Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {filteredColumns.map((column) => {
                            const totalValue = column.leads.reduce((sum, lead) => sum + lead.value, 0);
                            return (
                                <div key={column.id} className="text-center">
                                    <div className="text-2xl font-bold">{column.leads.length}</div>
                                    <div className="text-sm text-muted-foreground">{column.title}</div>
                                    <div className="text-xs text-green-600 font-medium">
                                        ${totalValue.toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}