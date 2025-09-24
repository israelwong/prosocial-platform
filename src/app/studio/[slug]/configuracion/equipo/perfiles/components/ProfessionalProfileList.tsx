'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import {
    Edit,
    Trash2,
    Search,
    Tag,
    Users,
    Settings,
    Plus,
    Crown
} from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ProfessionalProfile } from '../types';

interface ProfessionalProfileListProps {
    perfiles: ProfessionalProfile[];
    onEdit: (perfil: ProfessionalProfile) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string, isActive: boolean) => void;
    loading?: boolean;
    stats?: Record<string, number>;
}

export function ProfessionalProfileList({
    perfiles,
    onEdit,
    onDelete,
    onToggleActive,
    loading = false,
    stats = {}
}: ProfessionalProfileListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const filteredPerfiles = perfiles.filter(perfil =>
        perfil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        perfil.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (deletingId) {
            setDeleting(true);
            try {
                await onDelete(deletingId);
                setShowDeleteModal(false);
            } catch (error) {
                // El error ya se maneja en la función padre
            } finally {
                setDeleting(false);
                setDeletingId(null);
            }
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setDeletingId(null);
    };

    const handleToggleActive = (id: string, currentActive: boolean) => {
        onToggleActive(id, !currentActive);
    };

    if (loading) {
        return (
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Perfiles Profesionales
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-16 bg-zinc-700 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (perfiles.length === 0) {
        return (
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Perfiles Profesionales
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Tag className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            No hay perfiles configurados
                        </h3>
                        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                            Crea perfiles profesionales como "Fotógrafo", "Editor", "Coordinador", etc.
                            para organizar mejor tu equipo.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Primer Perfil
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <>
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            Perfiles Profesionales
                            <Badge variant="secondary" className="bg-zinc-700 text-zinc-200">
                                {perfiles.length} perfiles
                            </Badge>
                        </CardTitle>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Barra de búsqueda */}
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                placeholder="Buscar por nombre o slug..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 bg-zinc-800 border-zinc-600 text-white"
                            />
                        </div>
                    </div>

                    {/* Lista de perfiles */}
                    <div className="space-y-3">
                        {filteredPerfiles.map((perfil) => {
                            const asignaciones = stats[perfil.id] || 0;
                            return (
                                <div
                                    key={perfil.id}
                                    className="p-4 bg-zinc-800 rounded-lg border border-zinc-700"
                                >
                                    <div className="flex items-center justify-between">
                                        {/* Información del perfil */}
                                        <div className="flex items-center space-x-4">
                                            <div className="flex-shrink-0">
                                                <div
                                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold"
                                                    style={{ backgroundColor: perfil.color || '#6B7280' }}
                                                >
                                                    {perfil.icon ? (
                                                        <Tag className="h-5 w-5" />
                                                    ) : (
                                                        perfil.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2 mb-1">
                                                    <h4 className="text-white text-base font-semibold truncate">
                                                        {perfil.name}
                                                    </h4>
                                                    {perfil.isDefault && (
                                                        <Badge variant="secondary" className="bg-yellow-600 text-white text-xs px-2 py-0.5">
                                                            <Crown className="h-3 w-3 mr-1" />
                                                            Sistema
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center space-x-2 text-zinc-400 text-xs mb-1">
                                                    <span>Slug: {perfil.slug}</span>
                                                    {asignaciones > 0 && (
                                                        <span>• {asignaciones} asignaciones</span>
                                                    )}
                                                </div>
                                                {perfil.description && (
                                                    <p className="text-zinc-400 text-xs truncate">
                                                        {perfil.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Controles de acción */}
                                        <div className="flex items-center space-x-3">
                                            {/* Switch para activar/desactivar */}
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    checked={perfil.isActive}
                                                    onCheckedChange={() => handleToggleActive(perfil.id, perfil.isActive)}
                                                    className="data-[state=checked]:bg-green-600"
                                                />
                                                <span className="text-xs text-zinc-400">
                                                    {perfil.isActive ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </div>

                                            {/* Botones de acción */}
                                            <div className="flex items-center space-x-1">
                                                {/* Botón de editar */}
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => onEdit(perfil)}
                                                    className="h-8 w-8 p-0 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                                                    title="Editar perfil"
                                                >
                                                    <Edit className="h-3 w-3" />
                                                </Button>

                                                {/* Botón de eliminar (solo si no es del sistema) */}
                                                {!perfil.isDefault && (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDeleteClick(perfil.id)}
                                                        className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-900/20"
                                                        title="Eliminar perfil"
                                                    >
                                                        <Trash2 className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {filteredPerfiles.length === 0 && searchTerm && (
                        <div className="text-center py-8">
                            <Search className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                            <p className="text-zinc-400">No se encontraron perfiles que coincidan con "{searchTerm}"</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Modal de confirmación de eliminación */}
            <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Eliminar perfil profesional</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que quieres eliminar este perfil? Esta acción no se puede deshacer.
                            Si el perfil tiene asignaciones activas, será desactivado en lugar de eliminado.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleDeleteCancel}>
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                            disabled={deleting}
                        >
                            {deleting ? 'Eliminando...' : 'Eliminar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
