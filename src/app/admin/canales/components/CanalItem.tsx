'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, EyeOff, GripVertical } from 'lucide-react';
import { toast } from 'sonner';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface CanalAdquisicion {
    id: string;
    nombre: string;
    descripcion: string | null;
    color: string | null;
    icono: string | null;
    isActive: boolean;
    isVisible: boolean;
    orden: number;
    createdAt: Date;
    updatedAt: Date;
}

interface CanalItemProps {
    canal: CanalAdquisicion;
    onEdit: (canal: CanalAdquisicion) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string, isActive: boolean) => Promise<void>;
    onToggleVisible: (id: string, isVisible: boolean) => Promise<void>;
}

export default function CanalItem({
    canal,
    onEdit,
    onDelete,
    onToggleActive,
    onToggleVisible
}: CanalItemProps) {
    const [isUpdating, setIsUpdating] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: canal.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este canal?')) {
            try {
                await onDelete(id);
                toast.success('Canal eliminado correctamente');
            } catch (error) {
                toast.error('Error al eliminar el canal');
            }
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        if (isUpdating) return;
        
        setIsUpdating(true);
        try {
            await onToggleActive(id, isActive);
        } catch (error) {
            // El error ya se maneja en la función padre
        } finally {
            setIsUpdating(false);
        }
    };

    const handleToggleVisible = async (id: string, isVisible: boolean) => {
        if (isUpdating) return;
        
        setIsUpdating(true);
        try {
            await onToggleVisible(id, isVisible);
        } catch (error) {
            // El error ya se maneja en la función padre
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Card 
            ref={setNodeRef}
            style={style}
            className={`bg-card border-border ${isDragging ? 'shadow-lg' : ''}`}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div
                            {...attributes}
                            {...listeners}
                            className="cursor-grab active:cursor-grabbing"
                        >
                            <GripVertical className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: canal.color || '#3B82F6' }}
                        />
                        <div>
                            <h4 className="font-medium text-white">{canal.nombre}</h4>
                            {canal.descripcion && (
                                <p className="text-sm text-zinc-400">{canal.descripcion}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Badge 
                            variant={canal.isActive ? "default" : "secondary"}
                            className={canal.isActive ? "bg-green-600" : "bg-zinc-600"}
                        >
                            {canal.isActive ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Badge 
                            variant={canal.isVisible ? "default" : "secondary"}
                            className={canal.isVisible ? "bg-blue-600" : "bg-zinc-600"}
                        >
                            {canal.isVisible ? 'Visible' : 'Oculto'}
                        </Badge>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleVisible(canal.id, !canal.isVisible)}
                            disabled={isUpdating}
                        >
                            {canal.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(canal)}
                            disabled={isUpdating}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(canal.id)}
                            disabled={isUpdating}
                            className="text-red-400 hover:text-red-300"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
