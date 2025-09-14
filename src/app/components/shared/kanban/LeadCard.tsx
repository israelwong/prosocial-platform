'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Eye,
    MessageSquare,
    Clock,
    DollarSign
} from 'lucide-react';
import { Lead } from '@/types/lead';
import { LeadAssignmentStatus } from '@/components/shared/LeadAssignmentStatus';

interface LeadCardProps {
    lead: Lead;
    onView: (leadId: string) => void;
    onAssign: (leadId: string, agentId: string) => void;
    currentAgentId?: string;
    showAssignButton?: boolean;
}

export function LeadCard({
    lead,
    onView,
    onAssign,
    currentAgentId,
    showAssignButton = true
}: LeadCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: lead.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const formatDate = (date: Date | string) => {
        return new Date(date).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit'
        });
    };

    const getPriorityColor = (prioridad: string) => {
        switch (prioridad) {
            case 'alta': return 'bg-red-100 text-red-800';
            case 'media': return 'bg-yellow-100 text-yellow-800';
            case 'baja': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const isAssignedToCurrentAgent = lead.agentId === currentAgentId;
    const canTakeLead = !lead.agentId && showAssignButton;

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`${isDragging ? 'opacity-50' : ''} cursor-grab active:cursor-grabbing`}
        >
            <Card className="mb-3 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                    <div className="space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-gray-900 truncate">
                                    {lead.nombre}
                                </h4>
                                <p className="text-xs text-gray-500 truncate">
                                    {lead.nombreEstudio || 'Sin estudio'}
                                </p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <Badge className={`text-xs ${getPriorityColor(lead.prioridad)}`}>
                                    {lead.prioridad}
                                </Badge>
                                <LeadAssignmentStatus
                                    agentId={lead.agentId}
                                    agentName={lead.agent?.nombre}
                                    variant="dot"
                                />
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{lead.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Phone className="h-3 w-3" />
                                <span>{lead.telefono}</span>
                            </div>
                        </div>

                        {/* Plan & Budget */}
                        {lead.planInteres && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <DollarSign className="h-3 w-3" />
                                <span>{lead.planInteres}</span>
                                {lead.presupuestoMensual && (
                                    <span className="font-medium">
                                        ${Number(lead.presupuestoMensual).toLocaleString()}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Dates */}
                        <div className="space-y-1">
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>Creado: {formatDate(lead.createdAt)}</span>
                            </div>
                            {lead.fechaUltimoContacto && (
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    <span>Último contacto: {formatDate(lead.fechaUltimoContacto)}</span>
                                </div>
                            )}
                        </div>

                        {/* Agent Assignment */}
                        {lead.agent && (
                            <div className="flex items-center gap-2 text-xs text-gray-600">
                                <User className="h-3 w-3" />
                                <span className="truncate">{lead.agent.nombre}</span>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-xs h-7"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onView(lead.id);
                                }}
                            >
                                <Eye className="h-3 w-3 mr-1" />
                                Ver
                            </Button>

                            {canTakeLead && (
                                <Button
                                    size="sm"
                                    className="flex-1 text-xs h-7 bg-blue-600 hover:bg-blue-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (currentAgentId) {
                                            onAssign(lead.id, currentAgentId);
                                        }
                                    }}
                                >
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Tomar
                                </Button>
                            )}

                            {isAssignedToCurrentAgent && (
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="flex-1 text-xs h-7 border-green-200 text-green-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onView(lead.id);
                                    }}
                                >
                                    <MessageSquare className="h-3 w-3 mr-1" />
                                    Gestionar
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
