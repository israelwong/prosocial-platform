'use client';

import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Settings, Users } from 'lucide-react';
import {
    ZenButton,
    ZenBadge,
    ZenCard,
    ZenCardContent,
    ZenCardHeader,
    ZenCardTitle
} from '@/components/ui/zen';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import { PersonalItem } from './PersonalItem';
import { PersonalForm } from './PersonalForm';
import { CategoriasSheet } from './CategoriasSheet';
import { PerfilesSheet } from './PerfilesSheet';
import {
    obtenerPersonal,
    eliminarPersonal
} from '@/lib/actions/studio/config/personal.actions';
import type { PersonalData } from '@/lib/actions/schemas/personal-schemas';

interface PersonalListProps {
    studioSlug: string;
}

export function PersonalList({ studioSlug }: PersonalListProps) {
    const [personal, setPersonal] = useState<PersonalData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPersonal, setEditingPersonal] = useState<PersonalData | null>(null);

    const cargarPersonal = useCallback(async () => {
        try {
            setLoading(true);
            const result = await obtenerPersonal(studioSlug);

            if (result.success && result.data) {
                setPersonal(result.data);
            } else {
                toast.error(result.error || 'Error al cargar personal');
            }
        } catch (error) {
            console.error('Error al cargar personal:', error);
            toast.error('Error al cargar personal');
        } finally {
            setLoading(false);
        }
    }, [studioSlug]);

    useEffect(() => {
        cargarPersonal();
    }, [cargarPersonal]);

    const handleEliminar = async (personalId: string) => {
        try {
            const result = await eliminarPersonal(studioSlug, personalId);
            if (result.success) {
                toast.success('Personal eliminado exitosamente');
                cargarPersonal();
            } else {
                toast.error(result.error || 'Error al eliminar personal');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            toast.error('Error al eliminar personal');
        }
    };

    const handleEdit = (personal: PersonalData) => {
        setEditingPersonal(personal);
        setIsFormOpen(true);
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setEditingPersonal(null);
        cargarPersonal();
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingPersonal(null);
    };

    // Agrupar por categoría
    const personalAgrupado = personal.reduce((acc, persona) => {
        const categoriaNombre = persona.categoria.nombre;
        if (!acc[categoriaNombre]) {
            acc[categoriaNombre] = [];
        }
        acc[categoriaNombre].push(persona);
        return acc;
    }, {} as Record<string, PersonalData[]>);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="text-zinc-400">Cargando personal...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header principal */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Users className="h-6 w-6 text-blue-400" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Personal del Estudio</h1>
                        <p className="text-zinc-400">Gestiona tu equipo y colaboradores</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Botón Gestionar Categorías */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <ZenButton variant="outline" className="flex items-center gap-2">
                                <Settings className="h-4 w-4" />
                                Gestionar Categorías
                            </ZenButton>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-96 bg-zinc-900 border-zinc-800">
                            <SheetHeader className="border-b border-zinc-800 pb-4">
                                <SheetTitle className="text-white flex items-center gap-2">
                                    <Settings className="h-5 w-5 text-blue-400" />
                                    Gestionar Categorías
                                </SheetTitle>
                            </SheetHeader>
                            <div className="pt-4">
                                <CategoriasSheet studioSlug={studioSlug} />
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Botón Gestionar Perfiles */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <ZenButton variant="outline" className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Gestionar Perfiles
                            </ZenButton>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-96 bg-zinc-900 border-zinc-800">
                            <SheetHeader className="border-b border-zinc-800 pb-4">
                                <SheetTitle className="text-white flex items-center gap-2">
                                    <Users className="h-5 w-5 text-blue-400" />
                                    Gestionar Perfiles
                                </SheetTitle>
                            </SheetHeader>
                            <div className="pt-4">
                                <PerfilesSheet studioSlug={studioSlug} />
                            </div>
                        </SheetContent>
                    </Sheet>

                    {/* Botón Nuevo Personal */}
                    <ZenButton
                        variant="primary"
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Nuevo Personal
                    </ZenButton>
                </div>
            </div>

            {/* Lista de personal agrupado por categoría */}
            {Object.keys(personalAgrupado).length > 0 ? (
                <div className="space-y-6">
                    {Object.entries(personalAgrupado).map(([categoriaNombre, personalCategoria]) => (
                        <ZenCard key={categoriaNombre}>
                            <ZenCardHeader>
                                <ZenCardTitle className="flex items-center gap-2">
                                    {categoriaNombre}
                                    <ZenBadge variant="outline" className="text-xs">
                                        {personalCategoria.length} persona{personalCategoria.length !== 1 ? 's' : ''}
                                    </ZenBadge>
                                </ZenCardTitle>
                            </ZenCardHeader>
                            <ZenCardContent>
                                <div className="grid gap-3">
                                    {personalCategoria.map((persona) => (
                                        <PersonalItem
                                            key={persona.id}
                                            personal={persona}
                                            onEdit={handleEdit}
                                            onDelete={handleEliminar}
                                        />
                                    ))}
                                </div>
                            </ZenCardContent>
                        </ZenCard>
                    ))}
                </div>
            ) : (
                <ZenCard>
                    <ZenCardContent className="text-center py-12">
                        <Users className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No hay personal registrado</h3>
                        <p className="text-zinc-400 mb-6">Comienza agregando miembros a tu equipo</p>
                        <ZenButton
                            variant="primary"
                            onClick={() => setIsFormOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Agregar Primer Personal
                        </ZenButton>
                    </ZenCardContent>
                </ZenCard>
            )}

            {/* Modal de formulario */}
            <PersonalForm
                isOpen={isFormOpen}
                onClose={handleFormClose}
                onSuccess={handleFormSuccess}
                studioSlug={studioSlug}
                personal={editingPersonal}
            />
        </div>
    );
}
