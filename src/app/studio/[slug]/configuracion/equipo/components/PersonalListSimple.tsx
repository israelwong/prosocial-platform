'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Edit,
    Trash2,
    Mail,
    Phone,
    Search,
    User,
    Building2,
    Users
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
import {
    PERSONNEL_TYPE_LABELS,
    // PERSONNEL_PROFILE_LABELS, // Removido porque no existe
    type PersonnelType,
} from '@/lib/actions/schemas/personal-schemas';
import type { Personal } from '../types';

interface PersonalListSimpleProps {
    personal: Personal[];
    onEdit: (personal: Personal) => void;
    onDelete: (personalId: string, personalName: string) => void;
    loading?: boolean;
    filterType?: PersonnelType;
}

export function PersonalListSimple({
    personal,
    onEdit,
    onDelete,
    loading = false,
    filterType
}: PersonalListSimpleProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteDialog, setDeleteDialog] = useState<{
        isOpen: boolean;
        personalId: string;
        personalName: string;
    }>({
        isOpen: false,
        personalId: '',
        personalName: '',
    });

    // Filtrar personal por búsqueda y tipo
    const filteredPersonal = personal.filter((person) => {
        // Filtro por tipo (si se especifica)
        if (filterType && person.type !== filterType) {
            return false;
        }

        // Filtro por búsqueda
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matchesName = person.fullName?.toLowerCase().includes(searchLower);
            const matchesEmail = person.email.toLowerCase().includes(searchLower);
            const matchesPhone = person.phone?.toLowerCase().includes(searchLower);

            if (!matchesName && !matchesEmail && !matchesPhone) {
                return false;
            }
        }

        return true;
    });

    const handleDeleteConfirm = () => {
        onDelete(deleteDialog.personalId, deleteDialog.personalName);
        setDeleteDialog({ isOpen: false, personalId: '', personalName: '' });
    };

    const openDeleteDialog = (personalId: string, personalName: string) => {
        setDeleteDialog({
            isOpen: true,
            personalId,
            personalName,
        });
    };

    if (loading) {
        return (
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i} className="bg-zinc-900 border-zinc-800 animate-pulse">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-zinc-700 rounded-full"></div>
                                    <div>
                                        <div className="h-4 bg-zinc-700 rounded w-32 mb-2"></div>
                                        <div className="h-3 bg-zinc-700 rounded w-24"></div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="h-8 bg-zinc-700 rounded w-16"></div>
                                    <div className="h-8 bg-zinc-700 rounded w-16"></div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <>
            {/* Búsqueda simple */}
            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        placeholder="Buscar por nombre, email o teléfono..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-zinc-800 border-zinc-700 text-white pl-10"
                    />
                </div>
            </div>

            {/* Lista simplificada */}
            <div className="space-y-3">
                {filteredPersonal.length === 0 ? (
                    <Card className="bg-zinc-900 border-zinc-800">
                        <CardContent className="p-8 text-center">
                            <div className="text-zinc-400">
                                {personal.length === 0 ? (
                                    <div>
                                        <Users className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                                        <p className="text-lg font-medium mb-2">No hay personal registrado</p>
                                        <p className="text-sm">Comienza agregando empleados o proveedores a tu equipo</p>
                                    </div>
                                ) : (
                                    <div>
                                        <Search className="h-12 w-12 mx-auto mb-4 text-zinc-600" />
                                        <p className="text-lg font-medium mb-2">No se encontraron resultados</p>
                                        <p className="text-sm">Intenta ajustar el término de búsqueda</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    filteredPersonal.map((person) => (
                        <Card key={person.id} className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Avatar/Icono */}
                                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                                            {person.type === 'EMPLEADO' ? (
                                                <User className="h-5 w-5 text-blue-400" />
                                            ) : (
                                                <Building2 className="h-5 w-5 text-green-400" />
                                            )}
                                        </div>

                                        {/* Información principal */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="text-white font-medium truncate">
                                                    {person.fullName || 'Sin nombre'}
                                                </h3>
                                                <Badge
                                                    variant={person.type === 'EMPLEADO' ? 'default' : 'secondary'}
                                                    className={`text-xs ${person.type === 'EMPLEADO' ? 'bg-blue-600' : 'bg-green-600'}`}
                                                >
                                                    {person.type ? PERSONNEL_TYPE_LABELS[person.type] : 'Sin tipo'}
                                                </Badge>
                                                {!person.isActive && (
                                                    <Badge variant="destructive" className="text-xs bg-red-600">
                                                        Inactivo
                                                    </Badge>
                                                )}
                                            </div>

                                            {/* Información de contacto */}
                                            <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate">{person.email}</span>
                                                </div>
                                                {person.phone && (
                                                    <div className="flex items-center gap-1">
                                                        <Phone className="h-3 w-3" />
                                                        <span>{person.phone}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Perfiles profesionales */}
                                            {person.professional_profiles.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {person.professional_profiles
                                                        .filter(profile => profile.isActive)
                                                        .slice(0, 3) // Mostrar máximo 3 perfiles
                                                        .map((profile) => (
                                                            <Badge
                                                                key={profile.id}
                                                                variant="outline"
                                                                className="text-xs border-zinc-600 text-zinc-300"
                                                            >
                                                                {profile.profile}
                                                            </Badge>
                                                        ))}
                                                    {person.professional_profiles.filter(p => p.isActive).length > 3 && (
                                                        <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-300">
                                                            +{person.professional_profiles.filter(p => p.isActive).length - 3} más
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Botones de acción */}
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(person)}
                                            className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openDeleteDialog(person.id, person.fullName || person.email)}
                                            className="border-zinc-600 text-red-400 hover:bg-red-900/20 hover:border-red-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Dialog de confirmación para eliminar */}
            <AlertDialog open={deleteDialog.isOpen} onOpenChange={(open) =>
                setDeleteDialog(prev => ({ ...prev, isOpen: open }))
            }>
                <AlertDialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                            ¿Estás seguro de que quieres eliminar a <strong>{deleteDialog.personalName}</strong>?
                            <br />
                            <br />
                            Si esta persona tiene registros asociados (agenda, eventos, gastos, etc.),
                            solo se desactivará. Si no tiene registros, se eliminará permanentemente.
                            <br />
                            <br />
                            Esta acción no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700">
                            Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
