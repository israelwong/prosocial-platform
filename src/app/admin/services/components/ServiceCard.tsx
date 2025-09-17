'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    Edit, 
    Trash2, 
    Eye,
    EyeOff,
    GripVertical
} from 'lucide-react';
import { Service } from '../types';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ServiceCardProps {
    service: Service;
    onEdit: (service: Service) => void;
    onDelete: (serviceId: string) => void;
    onToggleActive: (service: Service) => void;
}

export function ServiceCard({ 
    service, 
    onEdit, 
    onDelete, 
    onToggleActive 
}: ServiceCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: service.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors bg-zinc-900 border-zinc-800"
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-1 hover:bg-zinc-800 rounded"
                        title="Arrastrar para reordenar"
                    >
                        <GripVertical className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold mb-1">{service.name}</h3>
                        <p className="text-sm text-muted-foreground font-mono mb-2">
                            {service.slug}
                        </p>
                        {service.description && (
                            <p className="text-sm text-muted-foreground">
                                {service.description}
                            </p>
                        )}
                    </div>
                </div>
                <Badge variant={service.active ? "default" : "secondary"}>
                    {service.active ? "Activo" : "Inactivo"}
                </Badge>
            </div>

            <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                    Creado: {new Date(service.createdAt).toLocaleDateString()}
                </div>
                <div className="flex gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onToggleActive(service)}
                        title={service.active ? "Desactivar" : "Activar"}
                    >
                        {service.active ? (
                            <Eye className="h-4 w-4" />
                        ) : (
                            <EyeOff className="h-4 w-4" />
                        )}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(service)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(service.id)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
