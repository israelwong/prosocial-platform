'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Plus,
    Settings,
    Users,
    DollarSign,
    Calendar,
    MessageSquare,
    Palette,
    Server,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { Service, ServiceCategory, ServiceWithCategory } from '../types';
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
    DragOverEvent,
    DragOverlay,
    useDroppable,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';

// Mapeo de iconos
const iconMap: Record<string, React.ComponentType<any>> = {
    Users,
    DollarSign,
    Calendar,
    MessageSquare,
    Palette,
    Server,
    AlertTriangle,
};

interface ServicesByCategoryClientProps {
    onServiceUpdate?: (service: Service) => void;
}

export function ServicesByCategoryClient({ onServiceUpdate }: ServicesByCategoryClientProps) {
    const [categories, setCategories] = useState<ServiceCategory[]>([]);
    const [services, setServices] = useState<ServiceWithCategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);
    const [isReordering, setIsReordering] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    // Configurar sensores para drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);

            // Fetch categories and services in parallel
            const [categoriesResponse, servicesResponse] = await Promise.all([
                fetch('/api/service-categories'),
                fetch('/api/services')
            ]);

            if (!categoriesResponse.ok || !servicesResponse.ok) {
                throw new Error('Error al cargar datos');
            }

            const [categoriesData, servicesData] = await Promise.all([
                categoriesResponse.json(),
                servicesResponse.json()
            ]);

            setCategories(categoriesData);
            setServices(servicesData);
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Error al cargar datos');
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
                prev.map(s => s.id === service.id ? { ...s, ...updatedService } : s)
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
                prev.map(s => s.id === savedService.id ? { ...s, ...savedService } : s)
            );
            toast.success('Servicio actualizado exitosamente');
        } else {
            // Agregar nuevo servicio al principio de la lista
            setServices(prev => [savedService as ServiceWithCategory, ...prev]);
            toast.success('Servicio creado exitosamente');
        }
        setShowModal(false);
        setEditingService(null);
    };

    // Función para actualizar la posición de un servicio
    const updateServicePosition = useCallback(async (serviceId: string, newPosition: number, newCategoryId?: string | null) => {
        try {
            console.log(`Updating service ${serviceId} to position ${newPosition}${newCategoryId ? ` in category ${newCategoryId}` : ' without category'}`);

            const response = await fetch(`/api/services/${serviceId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    posicion: newPosition,
                    ...(newCategoryId !== undefined && { categoryId: newCategoryId })
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
        const { active, over } = event;

        if (!over || !active) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        if (activeId === overId) return;

        const activeService = services.find(s => s.id === activeId);
        if (!activeService) return;

        // Verificar si se está arrastrando a una categoría vacía
        const isDroppingOnEmptyCategory = overId.startsWith('category-');
        let targetCategoryId = null;
        let overService = null;

        if (isDroppingOnEmptyCategory) {
            // Extraer el ID de la categoría del ID del drop zone
            targetCategoryId = overId.replace('category-', '');
        } else {
            overService = services.find(s => s.id === overId);
            if (!overService) return;
            targetCategoryId = overService.categoryId;
        }

        console.log('🔍 Debug drag end:', {
            activeId,
            overId,
            isDroppingOnEmptyCategory,
            activeService: activeService.name,
            overService: overService?.name,
            targetCategoryId
        });

        // Determinar si es reordenamiento dentro de la misma categoría
        const isReordering = activeService.categoryId === targetCategoryId ||
            (!activeService.categoryId && !targetCategoryId);

        let newIndex = 0;

        if (isReordering) {
            // Reordenamiento dentro de la misma categoría
            const categoryServices = services.filter(s =>
                s.categoryId === activeService.categoryId ||
                (!s.categoryId && !activeService.categoryId)
            );

            const activeIndex = categoryServices.findIndex(s => s.id === activeId);
            const overIndex = categoryServices.findIndex(s => s.id === overId);

            if (activeIndex === -1 || overIndex === -1) return;

            newIndex = overIndex;

            console.log('📁 Reordenamiento en misma categoría:', {
                activeIndex,
                overIndex,
                newIndex,
                categoryServices: categoryServices.length
            });
        } else {
            // Movimiento entre categorías
            const targetCategoryServices = services.filter(s => s.categoryId === targetCategoryId);

            if (isDroppingOnEmptyCategory) {
                // Si se suelta en una categoría vacía, insertar al final
                newIndex = targetCategoryServices.length;
            } else {
                // Si se suelta sobre un servicio, insertar en su posición
                const overIndex = targetCategoryServices.findIndex(s => s.id === overId);
                newIndex = overIndex === -1 ? targetCategoryServices.length : overIndex;
            }

            console.log('📁 Movimiento entre categorías:', {
                fromCategory: activeService.categoryId,
                toCategory: targetCategoryId,
                newIndex,
                targetCategoryServices: targetCategoryServices.length
            });
        }

        // Guardar estado original para revertir en caso de error
        const originalServices = [...services];

        // Actualizar estado local inmediatamente (optimistic update)
        setServices(currentServices => {
            const newServices = [...currentServices];

            // Remover el servicio de su posición actual
            const activeIndex = newServices.findIndex(s => s.id === activeId);
            if (activeIndex === -1) return currentServices;

            const [movedService] = newServices.splice(activeIndex, 1);

            // Actualizar la categoría del servicio movido
            movedService.categoryId = targetCategoryId;
            movedService.category = targetCategoryId ? categories.find(c => c.id === targetCategoryId) || null : null;

            // Encontrar la nueva posición de inserción
            const targetCategoryServices = newServices.filter(s => s.categoryId === targetCategoryId);
            const insertIndex = Math.min(newIndex, targetCategoryServices.length);

            // Insertar en la nueva posición
            newServices.splice(insertIndex, 0, movedService);

            // Reindexar posiciones en ambas categorías
            const sourceCategoryServices = newServices.filter(s =>
                s.categoryId === activeService.categoryId ||
                (!s.categoryId && !activeService.categoryId)
            );
            const finalTargetCategoryServices = newServices.filter(s => s.categoryId === targetCategoryId);

            // Actualizar posiciones en categoría origen
            sourceCategoryServices.forEach((service, index) => {
                service.posicion = index + 1;
            });

            // Actualizar posiciones en categoría destino
            finalTargetCategoryServices.forEach((service, index) => {
                service.posicion = index + 1;
            });

            return newServices;
        });

        try {
            setIsReordering(true);

            // Actualizar en el backend
            await updateServicePosition(activeId, newIndex + 1, targetCategoryId);

            toast.success(isReordering ? 'Orden actualizado exitosamente' : 'Servicio movido exitosamente');
        } catch (error) {
            console.error('Error updating service position:', error);
            toast.error('Error al actualizar la posición del servicio');
            // Revertir cambios
            setServices(originalServices);
        } finally {
            setIsReordering(false);
        }
    }, [services, categories, updateServicePosition]);

    const handleDragStart = (event: any) => {
        setActiveId(event.active.id);
    };

    // Componente para categorías vacías droppables
    const EmptyCategoryDropZone = ({ category }: { category: ServiceCategory }) => {
        const { setNodeRef, isOver } = useDroppable({
            id: `category-${category.id}`,
        });

        return (
            <div
                ref={setNodeRef}
                className={`text-center py-8 min-h-[100px] flex items-center justify-center border-2 border-dashed rounded-lg m-4 transition-colors ${isOver
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-zinc-700 bg-zinc-800/30'
                    }`}
            >
                <div className="text-center">
                    <div className="text-zinc-500 mb-2">
                        <Plus className="h-8 w-8 mx-auto" />
                    </div>
                    <p className="text-sm text-zinc-400">
                        {isOver ? 'Suelta aquí para agregar a esta categoría' : 'Arrastra servicios aquí para agregarlos a esta categoría'}
                    </p>
                </div>
            </div>
        );
    };

    const filteredServices = services.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    // Agrupar servicios por categoría
    const servicesByCategory = categories
        .filter(category => category.active)
        .map(category => ({
            ...category,
            services: filteredServices
                .filter(service => service.categoryId === category.id)
                .sort((a, b) => a.posicion - b.posicion)
        }))
        .filter(category => category.services.length > 0 || searchTerm === '');

    // Agregar servicios sin categoría
    const servicesWithoutCategory = filteredServices
        .filter(service => !service.categoryId || !service.category)
        .sort((a, b) => a.posicion - b.posicion);

    if (servicesWithoutCategory.length > 0) {
        servicesByCategory.push({
            id: 'no-category',
            name: 'Sin Categoría',
            description: 'Servicios que no han sido asignados a ninguna categoría',
            icon: 'AlertTriangle',
            posicion: 999,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            services: servicesWithoutCategory
        });
    }

    if (isLoading) {
        return (
            <Card className="border border-border bg-card shadow-sm">
                <CardHeader className="border-b border-zinc-800">
                    <CardTitle className="text-lg font-semibold text-white">Servicios por Categoría</CardTitle>
                    <div className="text-sm text-zinc-400">
                        Cargando servicios...
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="divide-y divide-zinc-800">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center justify-between p-4 animate-pulse">
                                <div className="flex items-center space-x-4">
                                    <div className="h-4 w-4 bg-zinc-700 rounded"></div>
                                    <div className="h-4 w-6 bg-zinc-700 rounded"></div>
                                    <div className="h-4 w-4 bg-zinc-700 rounded-full"></div>
                                    <div className="h-4 bg-zinc-700 rounded w-32"></div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <div className="h-6 w-16 bg-zinc-700 rounded"></div>
                                    <div className="h-6 w-16 bg-zinc-700 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
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

            {/* Lista de Servicios por Categoría */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={filteredServices.map(service => service.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-6">
                        {servicesByCategory.map((category) => {
                            const IconComponent = iconMap[category.icon] || Settings;

                            return (
                                <Card key={category.id} className="border border-border bg-card shadow-sm">
                                    <CardHeader className="border-b border-zinc-800">
                                        <div className="flex items-center space-x-4">
                                            <div className="p-2 bg-blue-600/20 rounded-lg">
                                                <IconComponent className="h-6 w-6 text-blue-400" />
                                            </div>
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-semibold text-white">
                                                    {category.name}
                                                </CardTitle>
                                                <div className="text-sm text-zinc-400">
                                                    {category.description}
                                                </div>
                                            </div>
                                            <Badge variant="outline" className="text-xs">
                                                {category.services.length} servicios
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-0">
                                        {category.services.length === 0 ? (
                                            <EmptyCategoryDropZone category={category} />
                                        ) : (
                                            <SortableContext
                                                items={category.services.map(service => service.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className={`divide-y divide-zinc-800 ${isReordering ? 'pointer-events-none opacity-50' : ''}`}>
                                                    {category.services.map((service) => (
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
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeId ? (
                        <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-4 shadow-lg">
                            <p className="text-white font-medium">
                                {services.find(s => s.id === activeId)?.name}
                            </p>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {servicesByCategory.length === 0 && !isLoading && (
                <Card className="border border-border bg-card shadow-sm">
                    <CardContent className="text-center py-12">
                        <Settings className="h-12 w-12 text-zinc-400 mx-auto mb-4" />
                        <p className="text-lg font-medium mb-2 text-white">
                            {searchTerm ? 'No se encontraron servicios' : 'No hay servicios creados'}
                        </p>
                        <p className="text-zinc-400 mb-4">
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
                    </CardContent>
                </Card>
            )}

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
                categories={categories}
            />
        </div>
    );
}
