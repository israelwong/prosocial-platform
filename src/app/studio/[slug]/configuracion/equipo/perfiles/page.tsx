'use client';

import React, { useState, useEffect } from 'react';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { ProfessionalProfileModal } from './components/ProfessionalProfileModal';
import { ProfessionalProfileList } from './components/ProfessionalProfileList';
import { ProfessionalProfileStats } from './components/ProfessionalProfileStats';
import {
    obtenerPerfilesProfesionalesStudio,
    crearPerfilProfesional,
    actualizarPerfilProfesional,
    eliminarPerfilProfesional,
    obtenerEstadisticasPerfilesProfesionales,
    togglePerfilProfesionalEstado,
    inicializarPerfilesSistema,
} from '@/lib/actions/studio/config/professional-profiles.actions';
import {
    type ProfessionalProfileCreateForm,
} from '@/lib/actions/studio/config/professional-profiles.actions';
import type { ProfessionalProfile, ProfessionalProfileStats as ProfessionalProfileStatsType } from './types';

export default function ProfessionalProfilesPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [perfiles, setPerfiles] = useState<ProfessionalProfile[]>([]);
    const [stats, setStats] = useState<ProfessionalProfileStatsType>({
        totalPerfiles: 0,
        perfilesActivos: 0,
        totalInactivos: 0,
        asignacionesPorPerfil: {},
    });
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPerfil, setEditingPerfil] = useState<ProfessionalProfile | null>(null);

    // Cargar perfiles y estadísticas
    const loadData = React.useCallback(async () => {
        try {
            setLoading(true);
            const [perfilesData, statsData] = await Promise.all([
                obtenerPerfilesProfesionalesStudio(slug),
                obtenerEstadisticasPerfilesProfesionales(slug),
            ]);

            setPerfiles(perfilesData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading perfiles:', error);
            toast.error('Error al cargar la información de perfiles');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Funciones del modal
    const handleOpenModal = (perfil?: ProfessionalProfile) => {
        setEditingPerfil(perfil || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingPerfil(null);
    };

    const handleSavePerfil = async (data: { name: string }) => {
        setModalLoading(true);

        try {
            if (editingPerfil) {
                // Actualizar perfil existente
                const perfilActualizado = await actualizarPerfilProfesional(
                    slug,
                    editingPerfil.id,
                    { id: editingPerfil.id, ...data }
                );

                setPerfiles(prev =>
                    prev.map(perfil =>
                        perfil.id === editingPerfil.id ? perfilActualizado : perfil
                    )
                );
                toast.success('Perfil actualizado exitosamente');
            } else {
                // Crear nuevo perfil
                const nuevoPerfil = await crearPerfilProfesional(slug, {
                    ...data,
                    slug: data.name.toLowerCase().replace(/\s+/g, '-'),
                    isActive: true,
                    order: 0
                });

                setPerfiles(prev => [nuevoPerfil, ...prev]);
                toast.success('Perfil creado exitosamente');
            }

            // Recargar estadísticas
            const newStats = await obtenerEstadisticasPerfilesProfesionales(slug);
            setStats(newStats);

            handleCloseModal();
        } catch (error) {
            console.error('Error saving perfil:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            toast.error(errorMessage);
            throw error; // Re-throw para que el modal maneje el error
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeletePerfil = async (perfilId: string) => {
        try {
            const result = await eliminarPerfilProfesional(slug, perfilId);

            if (result.deleted) {
                setPerfiles(prev => prev.filter(perfil => perfil.id !== perfilId));
                toast.success(result.message);
            } else if (result.deactivated) {
                setPerfiles(prev =>
                    prev.map(perfil =>
                        perfil.id === perfilId ? { ...perfil, isActive: false } : perfil
                    )
                );
                toast.success(result.message);
            }

            // Recargar estadísticas
            const newStats = await obtenerEstadisticasPerfilesProfesionales(slug);
            setStats(newStats);

        } catch (error) {
            console.error('Error al eliminar perfil:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el perfil';
            toast.error(errorMessage);
        }
    };

    const handleToggleActive = async (perfilId: string, isActive: boolean) => {
        try {
            const perfilActualizado = await togglePerfilProfesionalEstado(slug, perfilId);

            setPerfiles(prev =>
                prev.map(perfil =>
                    perfil.id === perfilId ? perfilActualizado : perfil
                )
            );

            // Recargar estadísticas
            const newStats = await obtenerEstadisticasPerfilesProfesionales(slug);
            setStats(newStats);

            toast.success(`Perfil ${isActive ? 'desactivado' : 'activado'} exitosamente`);
        } catch (error) {
            console.error('Error al cambiar estado del perfil:', error);
            toast.error('Error al cambiar el estado del perfil');
        }
    };

    const handleRefresh = () => {
        loadData();
        toast.success('Información actualizada');
    };

    const handleInicializarSistema = async () => {
        try {
            const result = await inicializarPerfilesSistema(slug);
            toast.success(`${result.count} perfiles del sistema inicializados`);
            loadData(); // Recargar datos
        } catch (error) {
            console.error('Error al inicializar perfiles del sistema:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al inicializar perfiles';
            toast.error(errorMessage);
        }
    };

    return (
        <div className="space-y-6 mt-16 max-w-screen-lg mx-auto mb-16">
            {/* Header */}
            <HeaderNavigation
                title="Perfiles Profesionales"
                description="Gestiona los perfiles profesionales de tu equipo como etiquetas personalizables"
                actionButton={{
                    label: "Nuevo Perfil",
                    icon: "Plus",
                    onClick: () => handleOpenModal()
                }}
            />

            {/* Estadísticas */}
            <ProfessionalProfileStats stats={stats} loading={loading} />

            {/* Lista de perfiles */}
            <ProfessionalProfileList
                perfiles={perfiles}
                onEdit={handleOpenModal}
                onDelete={handleDeletePerfil}
                onToggleActive={handleToggleActive}
                loading={loading}
                stats={stats.asignacionesPorPerfil}
            />

            {/* Modal para crear/editar perfil */}
            <ProfessionalProfileModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSavePerfil}
                perfil={editingPerfil}
                loading={modalLoading}
            />
        </div>
    );
}
