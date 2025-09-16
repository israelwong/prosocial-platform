'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CanalFormModal, CanalesList, CanalModal } from './components';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

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

export default function CanalesPage() {
    const [canales, setCanales] = useState<CanalAdquisicion[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCanal, setEditingCanal] = useState<CanalAdquisicion | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        fetchCanales();
    }, []);

    const fetchCanales = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/canales');
            if (!response.ok) {
                throw new Error('Error al cargar los canales');
            }
            const data = await response.json();
            setCanales(data);
        } catch (error) {
            console.error('Error fetching canales:', error);
            toast.error('Error al cargar los canales');
        } finally {
            setLoading(false);
        }
    };

    const handleCanalSubmit = async (canalData: Omit<CanalAdquisicion, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
            // Validar datos requeridos
            if (!canalData.nombre.trim()) {
                toast.error('El nombre del canal es requerido');
                throw new Error('Nombre requerido');
            }

            const url = editingCanal ? `/api/canales/${editingCanal.id}` : '/api/canales';
            const method = editingCanal ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(canalData),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || errorData.message || 'Error al guardar el canal';
                throw new Error(errorMessage);
            }

            if (editingCanal) {
                // Actualización optimista para edición
                setCanales(prevCanales =>
                    prevCanales.map(c =>
                        c.id === editingCanal.id ? { ...c, ...canalData } : c
                    )
                );
                setEditingCanal(null);
                setIsEditModalOpen(false);
                toast.success('Canal actualizado correctamente');
            } else {
                // Para creación, agregar el nuevo canal a la lista
                const newCanal = await response.json();
                setCanales(prevCanales => [...prevCanales, newCanal]);
                toast.success('Canal creado correctamente');
            }
        } catch (error) {
            console.error('Error saving canal:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error al guardar el canal';
            toast.error(errorMessage);
            throw error;
        }
    };

    const handleEdit = (canal: CanalAdquisicion) => {
        setEditingCanal(canal);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/canales/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el canal');
            }

            toast.success('Canal eliminado correctamente');
            fetchCanales();
        } catch (error) {
            console.error('Error deleting canal:', error);
            toast.error('Error al eliminar el canal');
            throw error;
        }
    };

    const handleToggleActive = async (id: string, isActive: boolean) => {
        try {
            const canal = canales.find(c => c.id === id);
            if (!canal) return;

            // Actualización optimista en el estado local
            setCanales(prevCanales =>
                prevCanales.map(c =>
                    c.id === id ? { ...c, isActive } : c
                )
            );

            const response = await fetch(`/api/canales/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...canal, isActive }),
            });

            if (!response.ok) {
                // Revertir cambio en caso de error
                setCanales(prevCanales =>
                    prevCanales.map(c =>
                        c.id === id ? { ...c, isActive: !isActive } : c
                    )
                );
                throw new Error('Error al actualizar el canal');
            }

            toast.success(`Canal ${isActive ? 'activado' : 'desactivado'} correctamente`);
        } catch (error) {
            console.error('Error updating canal:', error);
            toast.error('Error al actualizar el canal');
            throw error;
        }
    };

    const handleToggleVisible = async (id: string, isVisible: boolean) => {
        try {
            const canal = canales.find(c => c.id === id);
            if (!canal) return;

            // Actualización optimista en el estado local
            setCanales(prevCanales =>
                prevCanales.map(c =>
                    c.id === id ? { ...c, isVisible } : c
                )
            );

            const response = await fetch(`/api/canales/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...canal, isVisible }),
            });

            if (!response.ok) {
                // Revertir cambio en caso de error
                setCanales(prevCanales =>
                    prevCanales.map(c =>
                        c.id === id ? { ...c, isVisible: !isVisible } : c
                    )
                );
                throw new Error('Error al actualizar el canal');
            }

            toast.success(`Canal ${isVisible ? 'visible' : 'oculto'} para clientes`);
        } catch (error) {
            console.error('Error updating canal:', error);
            toast.error('Error al actualizar el canal');
            throw error;
        }
    };

    const handleReorder = async (reorderedCanales: CanalAdquisicion[]) => {
        try {
            setIsReordering(true);

            // Actualizar el orden en el estado local primero
            setCanales(reorderedCanales);

            // Enviar actualizaciones al servidor con el orden correcto (0-based)
            const updatePromises = reorderedCanales.map((canal, index) =>
                fetch(`/api/canales/${canal.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ 
                        ...canal, 
                        orden: index // Usar índice 0-based correctamente
                    }),
                })
            );

            const results = await Promise.allSettled(updatePromises);
            
            // Verificar si alguna actualización falló
            const failedUpdates = results.filter(result => result.status === 'rejected');
            if (failedUpdates.length > 0) {
                console.error('Algunas actualizaciones fallaron:', failedUpdates);
                throw new Error('Error al actualizar el orden de algunos canales');
            }

            toast.success('Orden actualizado correctamente');
        } catch (error) {
            console.error('Error reordering canales:', error);
            toast.error('Error al actualizar el orden');
            // Revertir cambios en caso de error
            fetchCanales();
        } finally {
            setIsReordering(false);
        }
    };

    const handleCancel = () => {
        setEditingCanal(null);
        setIsEditModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Canales de Adquisición</h1>
                    <p className="text-zinc-400">Gestiona los canales de adquisición de leads</p>
                </div>
                <CanalFormModal
                    onCanalSubmit={handleCanalSubmit}
                    editingCanal={editingCanal}
                    onEdit={handleEdit}
                    onCancel={handleCancel}
                />
            </div>

            <Card className="bg-card border-border">
                <CardHeader>
                    <CardTitle className="text-white">Lista de Canales</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Organiza y gestiona todos los canales de adquisición
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <CanalesList
                        canales={canales}
                        loading={loading}
                        isReordering={isReordering}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                        onToggleVisible={handleToggleVisible}
                        onReorder={handleReorder}
                    />
                </CardContent>
            </Card>

            {/* Modal de edición */}
            <CanalModal
                isOpen={isEditModalOpen}
                onClose={handleCancel}
                canal={editingCanal}
                onSave={handleCanalSubmit}
            />
        </div>
    );
}