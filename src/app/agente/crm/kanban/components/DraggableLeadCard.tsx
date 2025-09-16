'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import {
    Phone,
    Mail,
    MessageSquare,
    Calendar,
    DollarSign,
    MoreVertical,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';
import { Lead } from '../types';

interface DraggableLeadCardProps {
    lead: Lead;
    isUpdating: boolean;
}

export function DraggableLeadCard({ lead, isUpdating }: DraggableLeadCardProps) {
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
        opacity: isDragging ? 0.5 : 1,
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high': return 'Alta';
            case 'medium': return 'Media';
            case 'low': return 'Baja';
            default: return 'Sin prioridad';
        }
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            className={`p-4 hover:shadow-md transition-shadow cursor-pointer ${isUpdating ? 'opacity-50 pointer-events-none' : ''
                }`}
            {...attributes}
            {...listeners}
        >
            <div className="space-y-3">
                {/* Header del lead */}
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <h4 className="font-medium text-sm">{lead.name}</h4>
                        <p className="text-xs text-muted-foreground">{lead.studio}</p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreVertical className="h-3 w-3" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Eye className="h-4 w-4 mr-2" />
                                Ver detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Eliminar
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Información del lead */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <span>{lead.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium text-green-600">${lead.value.toLocaleString()}</span>
                    </div>
                </div>

                {/* Prioridad y fuente */}
                <div className="flex items-center justify-between">
                    <Badge variant="outline" className={getPriorityColor(lead.priority)}>
                        {getPriorityLabel(lead.priority)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{lead.source}</span>
                </div>

                {/* Notas */}
                {lead.notes && (
                    <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                        {lead.notes}
                    </div>
                )}

                {/* Próximo seguimiento */}
                {lead.nextFollowUp && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>
                            Próximo: {new Date(lead.nextFollowUp).toLocaleDateString()}
                        </span>
                    </div>
                )}

                {/* Última actividad */}
                <div className="text-xs text-muted-foreground">
                    {lead.lastActivity}
                </div>

                {/* Acciones rápidas */}
                <div className="flex gap-1 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        Llamar
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Chat
                    </Button>
                </div>
            </div>
        </Card>
    );
}
