'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Edit, Trash2, Eye, EyeOff, Search, GripVertical } from 'lucide-react';
import { toast } from 'sonner';

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

interface CanalesListProps {
    canales: CanalAdquisicion[];
    loading: boolean;
    onEdit: (canal: CanalAdquisicion) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string, isActive: boolean) => void;
    onToggleVisible: (id: string, isVisible: boolean) => void;
    onReorder: (canales: CanalAdquisicion[]) => void;
}


export default function CanalesList({
    canales,
    loading,
    onEdit,
    onDelete,
    onToggleActive,
    onToggleVisible,
    onReorder
}: CanalesListProps) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCanales = canales.filter(canal => {
        const matchesSearch = canal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            canal.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

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
        try {
            await onToggleActive(id, isActive);
            toast.success(`Canal ${isActive ? 'activado' : 'desactivado'} correctamente`);
        } catch (error) {
            toast.error('Error al cambiar el estado del canal');
        }
    };

    const handleToggleVisible = async (id: string, isVisible: boolean) => {
        try {
            await onToggleVisible(id, isVisible);
            toast.success(`Canal ${isVisible ? 'visible' : 'oculto'} para clientes`);
        } catch (error) {
            toast.error('Error al cambiar la visibilidad del canal');
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                            <div className="h-4 bg-zinc-700 rounded w-1/4 mb-2"></div>
                            <div className="h-3 bg-zinc-700 rounded w-1/2"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                    <Input
                        placeholder="Buscar canales..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Lista de canales */}
            <div className="space-y-2">
                {filteredCanales.map((canal) => (
                    <Card key={canal.id} className="bg-card border-border">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <GripVertical className="h-4 w-4 text-zinc-400 cursor-grab" />
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
                                    >
                                        {canal.isVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(canal)}
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleDelete(canal.id)}
                                        className="text-red-400 hover:text-red-300"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredCanales.length === 0 && (
                <div className="text-center py-8">
                    <p className="text-zinc-400">No se encontraron canales</p>
                </div>
            )}
        </div>
    );
}
