'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, RefreshCw, Tag } from 'lucide-react';
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
    const loadData = async () => {
        try {
            setLoading(true);
            const [personalData, statsData] = await Promise.all([
                obtenerPersonalStudio(slug, { type: 'PROVEEDOR' }),
                obtenerEstadisticasPersonal(slug),
            ]);

            setProveedores(personalData);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading proveedores:', error);
            toast.error('Error al cargar la información de proveedores');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [slug]);

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

    const handleRefresh = () => {
        loadData();
        toast.success('Información actualizada');
    };

    const navigateToPerfiles = () => {
        router.push(`/studio/${slug}/configuracion/negocio/personal/perfiles`);
    };

    return (
        <div className="space-y-6">
            {/* Header con estadísticas */}
            <PersonalStats stats={stats} loading={loading} />

            {/* Header de la sección */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader className="flex flex-row items-start justify-between">
                    <div>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Proveedores
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Gestiona la información de tus proveedores y colaboradores externos
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={navigateToPerfiles}
                            disabled={loading}
                            className="border-purple-600 text-purple-300 hover:bg-purple-800"
                        >
                            <Tag className="h-4 w-4 mr-2" />
                            Perfiles
                        </Button>
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={loading}
                            className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>
                        <Button
                            onClick={() => handleOpenModal()}
                            className="bg-green-600 hover:bg-green-700"
                            disabled={loading}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Proveedor
                        </Button>
                    </div>
                </CardHeader>
            </Card>

            {/* Lista de proveedores */}
            <PersonalListSimple
                personal={proveedores}
                onEdit={handleOpenModal}
                onDelete={handleDeleteProveedor}
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
            />
        </div>
    );
}