'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    Plus,
    Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { Service } from '../types';
import { ServiceModal } from './ServiceModal';
import { ServiceCard } from './ServiceCard';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';


export function ServicesPageClient() {
    const [services, setServices] = useState<Service[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isReordering, setIsReordering] = useState(false);

    // Configurar sensores para drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/services');
            if (response.ok) {
                const data = await response.json();
                setServices(data);
            } else {
                throw new Error('Error al cargar servicios');
            }
        } catch (error) {
            console.error('Error fetching services:', error);
            toast.error('Error al cargar servicios');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingService(null);
        setShowModal(true);
    };

    const handleEdit = (service: Service) => {
        setEditingService(service);
        setShowModal(true);
    };

    const handleDelete = async (serviceId: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
            return;
        }

        try {
            const response = await fetch(`/api/services/${serviceId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar servicio');
            }

            setServices(prev => prev.filter(s => s.id !== serviceId));
            toast.success('Servicio eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting service:', error);
            toast.error('Error al eliminar servicio');
        }
    };

    const handleToggleActive = async (service: Service) => {
        try {
            const response = await fetch(`/api/services/${service.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    active: !service.active
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar servicio');
            }

            const updatedService = await response.json();
            setServices(prev =>
                prev.map(s => s.id === service.id ? updatedService : s)
            );
            toast.success(`Servicio ${updatedService.active ? 'activado' : 'desactivado'} exitosamente`);
        } catch (error) {
            console.error('Error toggling service:', error);
            toast.error('Error al actualizar servicio');
        }
    };

    const handleModalSave = (savedService: Service) => {
        if (editingService) {
            // Actualizar servicio existente localmente
            setServices(prev => 
                prev.map(s => s.id === savedService.id ? savedService : s)
            );
            toast.success('Servicio actualizado exitosamente');
        } else {
            // Agregar nuevo servicio al principio de la lista
            setServices(prev => [savedService, ...prev]);
            toast.success('Servicio creado exitosamente');
        }
        setShowModal(false);
        setEditingService(null);
    };

    // Función para actualizar la posición de un servicio
    const updateServicePosition = useCallback(async (serviceId: string, newPosition: number) => {
        try {
            console.log(`Updating service ${serviceId} to position ${newPosition}`);

            const response = await fetch(`/api/services/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    posicion: newPosition
                }),
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error:', errorData);
                throw new Error(errorData.error || 'Error al actualizar posición del servicio');
            }

            const result = await response.json();
            console.log('Service position updated successfully:', result);
            return result;
        } catch (error) {
            console.error('Error updating service position:', error);
            throw error;
        }
    }, []);

    // Función para manejar el reordenamiento
    const handleDragEnd = useCallback(async (event: DragEndEvent) => {
        if (isReordering) return; // Prevenir múltiples operaciones

        const { active, over } = event;

        if (!over || active.id === over.id) {
            return;
        }

        const oldIndex = services.findIndex(service => service.id === active.id);
        const newIndex = services.findIndex(service => service.id === over.id);

        if (oldIndex === -1 || newIndex === -1) {
            return;
        }

        // Actualizar estado local inmediatamente para feedback visual
        const reorderedServices = arrayMove(services, oldIndex, newIndex);
        setServices(reorderedServices);

        try {
            setIsReordering(true);

            // Actualizar posiciones secuencialmente para evitar saturar la BD
            for (let i = 0; i < reorderedServices.length; i++) {
                const service = reorderedServices[i];
                const newPosition = i + 1; // Posiciones empiezan en 1

                if (service.posicion !== newPosition) {
                    await updateServicePosition(service.id, newPosition);
                }
            }

            toast.success('Orden de servicios actualizado exitosamente');
        } catch (error) {
            console.error('Error reordering services:', error);
            toast.error('Error al actualizar el orden de los servicios');

            // Revertir cambios locales si falla
            setServices(services);
        } finally {
            setIsReordering(false);
        }
    }, [services, isReordering, updateServicePosition]);

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Cargando servicios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filtros */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros y Búsqueda</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, slug o descripción..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Servicios */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Servicios de la Plataforma</CardTitle>
                        <Button onClick={handleCreate}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Servicio
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredServices.length === 0 ? (
                        <div className="text-center py-12">
                            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <p className="text-lg font-medium mb-2">
                                {searchTerm ? 'No se encontraron servicios' : 'No hay servicios creados'}
                            </p>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm
                                    ? 'Intenta con otros términos de búsqueda'
                                    : 'Crea tu primer servicio para comenzar'
                                }
                            </p>
                            {!searchTerm && (
                                <Button onClick={handleCreate}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Crear Primer Servicio
                                </Button>
                            )}
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={filteredServices.map(service => service.id)}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className={`space-y-4 ${isReordering ? 'pointer-events-none opacity-50' : ''}`}>
                                    {isReordering && (
                                        <div className="text-center py-2">
                                            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                                                Actualizando orden...
                                            </div>
                                        </div>
                                    )}
                                    {filteredServices.map((service) => (
                                        <ServiceCard
                                            key={service.id}
                                            service={service}
                                            onEdit={handleEdit}
                                            onDelete={handleDelete}
                                            onToggleActive={handleToggleActive}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </CardContent>
            </Card>

            {/* Modal */}
            <ServiceModal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingService(null);
                }}
                service={editingService}
                onSave={handleModalSave}
                existingServices={services}
            />
        </div>
    );
}
