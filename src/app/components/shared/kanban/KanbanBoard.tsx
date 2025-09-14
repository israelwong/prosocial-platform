'use client';

import React, { useState } from 'react';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Eye,
    MessageSquare,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { LeadCard } from './LeadCard';
import { Lead } from '@/types/lead';

interface KanbanColumn {
    id: string;
    title: string;
    leads: Lead[];
    color: string;
    bgColor: string;
}

interface KanbanBoardProps {
    leads: Lead[];
    onLeadUpdate: (leadId: string, newStage: string) => void;
    onLeadAssign: (leadId: string, agentId: string) => void;
    onLeadView: (leadId: string) => void;
    currentAgentId?: string;
    showAssignButton?: boolean;
}

const STAGES = [
    { id: 'nuevo', title: 'Nuevos', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { id: 'seguimiento', title: 'En Seguimiento', color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    { id: 'promesa', title: 'Promesa', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { id: 'suscrito', title: 'Suscritos', color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'cancelado', title: 'Cancelados', color: 'text-red-600', bgColor: 'bg-red-50' },
    { id: 'perdido', title: 'Perdidos', color: 'text-gray-600', bgColor: 'bg-gray-50' },
];

export function KanbanBoard({
    leads,
    onLeadUpdate,
    onLeadAssign,
    onLeadView,
    currentAgentId,
    showAssignButton = true
}: KanbanBoardProps) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    // Organizar leads por etapa
    const columns: KanbanColumn[] = STAGES.map(stage => ({
        ...stage,
        leads: leads.filter(lead => lead.etapa === stage.id)
    }));

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
        const lead = leads.find(l => l.id === event.active.id);
        setSelectedLead(lead || null);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over) return;

        const leadId = active.id as string;
        const newStage = over.id as string;

        // Verificar que el stage sea válido
        if (STAGES.some(stage => stage.id === newStage)) {
            onLeadUpdate(leadId, newStage);
        }

        setActiveId(null);
        setSelectedLead(null);
    };

    const getStageIcon = (stageId: string) => {
        switch (stageId) {
            case 'nuevo': return <AlertCircle className="h-4 w-4" />;
            case 'seguimiento': return <Clock className="h-4 w-4" />;
            case 'promesa': return <MessageSquare className="h-4 w-4" />;
            case 'suscrito': return <CheckCircle className="h-4 w-4" />;
            case 'cancelado': return <XCircle className="h-4 w-4" />;
            case 'perdido': return <XCircle className="h-4 w-4" />;
            default: return <AlertCircle className="h-4 w-4" />;
        }
    };

    return (
        <div className="p-6">
            <DndContext
                sensors={sensors}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
                    {columns.map((column) => (
                        <div key={column.id} className="flex flex-col">
                            <Card className="mb-4">
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            {getStageIcon(column.id)}
                                            <span className={column.color}>{column.title}</span>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {column.leads.length}
                                        </Badge>
                                    </CardTitle>
                                </CardHeader>
                            </Card>

                            <div className={`flex-1 min-h-[400px] p-3 rounded-lg ${column.bgColor}`}>
                                <SortableContext
                                    items={column.leads.map(lead => lead.id)}
                                    strategy={verticalListSortingStrategy}
                                >
                                    <div className="space-y-3">
                                        {column.leads.map((lead) => (
                                            <LeadCard
                                                key={lead.id}
                                                lead={lead}
                                                onView={onLeadView}
                                                onAssign={onLeadAssign}
                                                currentAgentId={currentAgentId}
                                                showAssignButton={showAssignButton}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </div>
                        </div>
                    ))}
                </div>

                <DragOverlay>
                    {activeId && selectedLead ? (
                        <div className="opacity-50">
                            <LeadCard
                                lead={selectedLead}
                                onView={onLeadView}
                                onAssign={onLeadAssign}
                                currentAgentId={currentAgentId}
                                showAssignButton={showAssignButton}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
