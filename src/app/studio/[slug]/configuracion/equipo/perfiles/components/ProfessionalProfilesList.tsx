'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Badge } from '@/components/ui/shadcn/badge';
import { Input } from '@/components/ui/shadcn/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/shadcn/alert-dialog';
import {
    MoreHorizontal,
    Edit,
    Trash2,
    Users,
    Star,
    Search,
    Settings,
    Copy,
} from 'lucide-react';
import { ProfessionalProfileModal } from './ProfessionalProfileModal';
import { toast } from 'sonner';

interface ProfessionalProfile {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    isActive: boolean;
    isDefault: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
    _count?: {
        userProfiles: number;
    };
}

interface ProfessionalProfilesListProps {
    perfiles: ProfessionalProfile[];
}

export function ProfessionalProfilesList({ perfiles }: ProfessionalProfilesListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [perfilToDelete, setPerfilToDelete] = useState<ProfessionalProfile | null>(null);
    const [editingPerfil, setEditingPerfil] = useState<ProfessionalProfile | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    const filteredPerfiles = perfiles.filter(perfil => {
        const matchesSearch = searchTerm
            ? (perfil.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                perfil.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                perfil.slug.toLowerCase().includes(searchTerm.toLowerCase()))
            : true;

        return matchesSearch;
    });

    const handleEdit = (perfil: ProfessionalProfile) => {
        setEditingPerfil(perfil);
    };

    const handleDelete = (perfil: ProfessionalProfile) => {
        setPerfilToDelete(perfil);
        setShowDeleteDialog(true);
    };

    const confirmDelete = async () => {
        if (!perfilToDelete) return;

        try {
            // TODO: Implementar eliminación
            toast.success(`Perfil "${perfilToDelete.name}" eliminado exitosamente`);
            setPerfilToDelete(null);
            setShowDeleteDialog(false);
        } catch {
            toast.error('Error al eliminar el perfil');
        }
    };

    const handleDuplicate = () => {
        // TODO: Implementar duplicación
        toast.info('Función de duplicar próximamente disponible');
    };

    const getIconComponent = (iconName: string | null) => {
        // Mapeo básico de iconos - en una implementación real usarías un sistema más robusto
        const iconMap: Record<string, React.ComponentType<Record<string, never>>> = {
            Camera: () => <div className="w-4 h-4 bg-blue-500 rounded" />,
            Video: () => <div className="w-4 h-4 bg-green-500 rounded" />,
            Scissors: () => <div className="w-4 h-4 bg-purple-500 rounded" />,
            Palette: () => <div className="w-4 h-4 bg-yellow-500 rounded" />,
            Zap: () => <div className="w-4 h-4 bg-red-500 rounded" />,
            User: () => <div className="w-4 h-4 bg-gray-500 rounded" />,
            Users: () => <div className="w-4 h-4 bg-indigo-500 rounded" />,
        };

        const IconComponent = iconName ? iconMap[iconName] : null;
        return IconComponent ? <IconComponent /> : <div className="w-4 h-4 bg-zinc-500 rounded" />;
    };

    return (
        <div className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Buscar perfiles por nombre, descripción o slug..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-blue-500"
                    />
                </div>
                <Button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Nuevo Perfil
                </Button>
            </div>

            {/* Lista de perfiles */}
            {filteredPerfiles.length === 0 ? (
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-8 text-center">
                        <Star className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            {searchTerm ? 'No se encontraron perfiles' : 'No hay perfiles profesionales'}
                        </h3>
                        <p className="text-zinc-400">
                            {searchTerm
                                ? 'Intenta con otros términos de búsqueda'
                                : 'Comienza creando tu primer perfil profesional'
                            }
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {filteredPerfiles.map((perfil) => (
                        <Card key={perfil.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        {/* Icono */}
                                        <div
                                            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
                                            style={{ backgroundColor: perfil.color || '#6B7280' }}
                                        >
                                            {getIconComponent(perfil.icon)}
                                        </div>

                                        {/* Información del perfil */}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-white font-medium">{perfil.name}</h3>
                                                {perfil.isDefault && (
                                                    <Badge variant="outline" className="text-xs border-yellow-500 text-yellow-300">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Sistema
                                                    </Badge>
                                                )}
                                                {!perfil.isActive && (
                                                    <Badge variant="destructive" className="text-xs">
                                                        Inactivo
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-zinc-400 mb-1">
                                                {perfil.description || 'Sin descripción'}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs text-zinc-500">
                                                <span>Slug: {perfil.slug}</span>
                                                {perfil._count && (
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {perfil._count.userProfiles} asignaciones
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleEdit(perfil)}
                                            className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Editar
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-zinc-800 border-zinc-700">
                                                <DropdownMenuItem onClick={() => handleEdit(perfil)}>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={handleDuplicate}>
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Duplicar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Settings className="h-4 w-4 mr-2" />
                                                    Configurar
                                                </DropdownMenuItem>
                                                {!perfil.isDefault && (
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(perfil)}
                                                        className="text-red-400 focus:text-red-400"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Eliminar
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Modal de creación/edición */}
            <ProfessionalProfileModal
                mode={editingPerfil ? "edit" : "create"}
                perfil={editingPerfil}
                open={showCreateModal || !!editingPerfil}
                onOpenChange={(open) => {
                    if (!open) {
                        setShowCreateModal(false);
                        setEditingPerfil(null);
                    }
                }}
            />

            {/* Diálogo de confirmación de eliminación */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent className="bg-zinc-900 border-zinc-700 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Confirmar Eliminación</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            ¿Estás seguro de que quieres eliminar el perfil <span className="font-semibold text-white">{perfilToDelete?.name}</span>?
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
