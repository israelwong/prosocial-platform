'use client';

import React, { useState, useEffect } from 'react';
// Imports removidos - ahora se usan a través de HeaderNavigation
import { HeaderNavigation } from '@/components/ui/header-navigation';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import { PersonalModal } from '../components/PersonalModal';
import { PersonalListSimple } from '../components/PersonalListSimple';
import { PersonalStats } from '../components/PersonalStats';
import {
    obtenerPersonalStudio,
    crearPersonal,
    actualizarPersonal,
    eliminarPersonal,
    obtenerEstadisticasPersonal,
} from '@/lib/actions/studio/config/personal.actions';
import {
    type PersonalCreateForm,
    type PersonalUpdateForm,
} from '@/lib/actions/schemas/personal-schemas';
import type { Personal, PersonalStats as PersonalStatsType } from '../types';

export default function ProveedoresPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [proveedores, setProveedores] = useState<Personal[]>([]);
    const [stats, setStats] = useState<PersonalStatsType>({
        totalEmpleados: 0,
        totalProveedores: 0,
        totalPersonal: 0,
        totalActivos: 0,
        totalInactivos: 0,
        perfilesProfesionales: {},
    });
    const [loading, setLoading] = useState(true);
    const [modalLoading, setModalLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProveedor, setEditingProveedor] = useState<Personal | null>(null);

    // Cargar proveedores y estadísticas
    const loadData = React.useCallback(async () => {
        try {
            setLoading(true);
            const [personalData, statsData] = await Promise.all([
                obtenerPersonalStudio(slug, { type: 'PROVEEDOR' }),
                obtenerEstadisticasPersonal(slug),
            ]);

            // La API devuelve una estructura compatible con Personal
            setProveedores(personalData as Personal[]);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading proveedores:', error);
            toast.error('Error al cargar la información de proveedores');
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    // Funciones del modal
    const handleOpenModal = (proveedor?: Personal) => {
        setEditingProveedor(proveedor || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProveedor(null);
    };

    const handleSaveProveedor = async (data: PersonalCreateForm | PersonalUpdateForm) => {
        setModalLoading(true);

        try {
            if (editingProveedor) {
                // Actualizar proveedor existente
                const proveedorActualizado = await actualizarPersonal(
                    slug,
                    editingProveedor.id,
                    data as PersonalUpdateForm
                );

                setProveedores(prev =>
                    prev.map(prov =>
                        prov.id === editingProveedor.id ? { ...proveedorActualizado, createdAt: prov.createdAt } : prov
                    )
                );
                toast.success('Proveedor actualizado exitosamente');
            } else {
                // Crear nuevo proveedor
                const nuevoProveedor = await crearPersonal(slug, {
                    ...data as PersonalCreateForm,
                    type: 'PROVEEDOR', // Forzar tipo proveedor
                });

                setProveedores(prev => [nuevoProveedor, ...prev]);
                toast.success('Proveedor creado exitosamente');
            }

            // Recargar estadísticas
            const newStats = await obtenerEstadisticasPersonal(slug);
            setStats(newStats);

            handleCloseModal();
        } catch (error) {
            console.error('Error saving proveedor:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            toast.error(errorMessage);
            throw error; // Re-throw para que el modal maneje el error
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteProveedor = async (proveedorId: string, proveedorName: string) => {
        try {
            const result = await eliminarPersonal(slug, proveedorId);

            if (result.deleted) {
                setProveedores(prev => prev.filter(prov => prov.id !== proveedorId));
                toast.success(`${proveedorName} ha sido eliminado exitosamente`);
            } else if (result.deactivated) {
                setProveedores(prev =>
                    prev.map(prov =>
                        prov.id === proveedorId ? { ...prov, isActive: false } : prov
                    )
                );
                toast.success(
                    `${proveedorName} ha sido desactivado debido a registros asociados (${result.relatedDataCount} registros)`
                );
            }

            // Recargar estadísticas
            const newStats = await obtenerEstadisticasPersonal(slug);
            setStats(newStats);

        } catch (error) {
            console.error('Error al eliminar proveedor:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el proveedor';
            toast.error(errorMessage);
        }
    };


    const navigateToPerfiles = () => {
        router.push(`/${slug}/configuracion/negocio/personal/perfiles`);
    };

    const handleToggleActive = async (proveedorId: string, isActive: boolean) => {
        try {
            // TODO: Implementar toggle de estado en el backend
            // Por ahora, solo actualizar localmente
            setProveedores(prev =>
                prev.map(prov =>
                    prov.id === proveedorId ? { ...prov, isActive } : prov
                )
            );
            toast.success(`Proveedor ${isActive ? 'activado' : 'desactivado'} exitosamente`);
        } catch (error) {
            console.error('Error al cambiar estado del proveedor:', error);
            toast.error('Error al cambiar el estado del proveedor');
        }
    };

    return (
        <div className="space-y-6 mt-16 max-w-screen-lg mx-auto mb-16">


            {/* Header de la sección */}
            <HeaderNavigation
                title="Proveedores"
                description="Gestiona la información de tus proveedores y colaboradores externos"
                actionButton={{
                    label: "Crear Proveedor",
                    icon: "Plus",
                    onClick: () => handleOpenModal()
                }}
                secondaryButtons={[
                    {
                        label: "Perfiles",
                        icon: "Tag",
                        onClick: navigateToPerfiles,
                        variant: "outline",
                        className: "border-purple-600 text-purple-300 hover:bg-purple-800"
                    }
                ]}
            />

            {/* Lista de proveedores */}
            <PersonalListSimple
                personal={proveedores}
                onEdit={handleOpenModal}
                onDelete={handleDeleteProveedor}
                onToggleActive={handleToggleActive}
                loading={loading}
                filterType="PROVEEDOR"
            />

            {/* Modal para crear/editar proveedor */}
            <PersonalModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveProveedor}
                personal={editingProveedor}
                loading={modalLoading}
                defaultType="PROVEEDOR"
                studioSlug={slug}
            />
        </div>
    );
}