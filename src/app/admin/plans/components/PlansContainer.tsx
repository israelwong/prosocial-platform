'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Search,
    Filter,
    Plus,
    SortAsc,
    SortDesc
} from 'lucide-react';
import { PlanCard } from './PlanCard';
import { Plan } from '../types';
import { toast } from 'sonner';

interface PlansContainerProps {
    plans: Plan[];
    onPlanDelete: (planId: string) => void;
    onPlanUpdate: (updatedPlan: Plan) => void;
}

type FilterType = 'all' | 'active' | 'inactive' | 'popular';
type SortType = 'name' | 'price' | 'studios' | 'orden';

export function PlansContainer({
    plans,
    onPlanDelete,
    onPlanUpdate
}: PlansContainerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<FilterType>('all');
    const [sortBy, setSortBy] = useState<SortType>('orden');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Filtrar y ordenar planes
    const filteredAndSortedPlans = useMemo(() => {
        let filtered = plans.filter(plan => {
            // Filtro de búsqueda
            const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                plan.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase()));

            if (!matchesSearch) return false;

            // Filtro por estado
            switch (filter) {
                case 'active':
                    return plan.active;
                case 'inactive':
                    return !plan.active;
                case 'popular':
                    return plan.popular;
                default:
                    return true;
            }
        });

        // Ordenar
        filtered.sort((a, b) => {
            let aValue: any, bValue: any;

            switch (sortBy) {
                case 'name':
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                    break;
                case 'price':
                    aValue = a.price_monthly || 0;
                    bValue = b.price_monthly || 0;
                    break;
                case 'studios':
                    aValue = a._count?.studios || 0;
                    bValue = b._count?.studios || 0;
                    break;
                case 'orden':
                default:
                    aValue = a.orden;
                    bValue = b.orden;
                    break;
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }, [plans, searchTerm, filter, sortBy, sortOrder]);

    const handleEdit = (plan: Plan) => {
        // TODO: Abrir modal de edición
        toast.info('Función de edición próximamente disponible');
    };

    const handleDelete = async (planId: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este plan?')) {
            return;
        }

        try {
            const response = await fetch(`/api/plans/${planId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al eliminar el plan');
            }

            onPlanDelete(planId);
            toast.success('Plan eliminado exitosamente');
        } catch (error) {
            console.error('Error deleting plan:', error);
            toast.error(error instanceof Error ? error.message : 'Error al eliminar el plan');
        }
    };

    const handleToggleActive = async (planId: string) => {
        const plan = plans.find(p => p.id === planId);
        if (!plan) return;

        try {
            const response = await fetch(`/api/plans/${planId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...plan,
                    active: !plan.active
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al actualizar el plan');
            }

            const updatedPlan = await response.json();
            onPlanUpdate(updatedPlan);
            toast.success(`Plan ${updatedPlan.active ? 'activado' : 'desactivado'} exitosamente`);
        } catch (error) {
            console.error('Error toggling plan active status:', error);
            toast.error(error instanceof Error ? error.message : 'Error al actualizar el plan');
        }
    };

    const handleTogglePopular = async (planId: string) => {
        const plan = plans.find(p => p.id === planId);
        if (!plan) return;

        try {
            const response = await fetch(`/api/plans/${planId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...plan,
                    popular: !plan.popular
                }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al actualizar el plan');
            }

            const updatedPlan = await response.json();
            onPlanUpdate(updatedPlan);
            toast.success(`Plan ${updatedPlan.popular ? 'marcado como popular' : 'desmarcado como popular'} exitosamente`);
        } catch (error) {
            console.error('Error toggling plan popular status:', error);
            toast.error(error instanceof Error ? error.message : 'Error al actualizar el plan');
        }
    };

    const toggleSort = (newSortBy: SortType) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(newSortBy);
            setSortOrder('asc');
        }
    };

    return (
        <div className="space-y-6">
            {/* Filtros y Búsqueda */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros y Búsqueda</CardTitle>
                    <CardDescription>
                        Encuentra planes específicos usando los filtros
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        {/* Búsqueda */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nombre, slug o descripción..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>

                        {/* Filtros */}
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                variant={filter === 'all' ? 'default' : 'outline'}
                                onClick={() => setFilter('all')}
                                size="sm"
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Todos ({plans.length})
                            </Button>
                            <Button
                                variant={filter === 'active' ? 'default' : 'outline'}
                                onClick={() => setFilter('active')}
                                size="sm"
                            >
                                Activos ({plans.filter(p => p.active).length})
                            </Button>
                            <Button
                                variant={filter === 'inactive' ? 'default' : 'outline'}
                                onClick={() => setFilter('inactive')}
                                size="sm"
                            >
                                Inactivos ({plans.filter(p => !p.active).length})
                            </Button>
                            <Button
                                variant={filter === 'popular' ? 'default' : 'outline'}
                                onClick={() => setFilter('popular')}
                                size="sm"
                            >
                                Populares ({plans.filter(p => p.popular).length})
                            </Button>
                        </div>
                    </div>

                    {/* Ordenamiento */}
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                        <span className="text-sm font-medium text-muted-foreground mr-2">Ordenar por:</span>
                        {[
                            { key: 'orden' as SortType, label: 'Orden' },
                            { key: 'name' as SortType, label: 'Nombre' },
                            { key: 'price' as SortType, label: 'Precio' },
                            { key: 'studios' as SortType, label: 'Estudios' }
                        ].map((sort) => (
                            <Button
                                key={sort.key}
                                variant={sortBy === sort.key ? 'default' : 'ghost'}
                                size="sm"
                                onClick={() => toggleSort(sort.key)}
                                className="text-xs"
                            >
                                {sort.label}
                                {sortBy === sort.key && (
                                    sortOrder === 'asc' ?
                                        <SortAsc className="ml-1 h-3 w-3" /> :
                                        <SortDesc className="ml-1 h-3 w-3" />
                                )}
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Lista de Planes */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Lista de Planes</CardTitle>
                            <CardDescription>
                                Gestiona todos los planes de la plataforma
                            </CardDescription>
                        </div>
                        <Badge variant="outline">
                            {filteredAndSortedPlans.length} planes
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredAndSortedPlans.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-muted-foreground mb-4">
                                {searchTerm || filter !== 'all' ?
                                    'No se encontraron planes con los filtros aplicados' :
                                    'No hay planes creados aún'
                                }
                            </div>
                            {!searchTerm && filter === 'all' && (
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear primer plan
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {filteredAndSortedPlans.map((plan) => (
                                <PlanCard
                                    key={plan.id}
                                    plan={plan}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                    onToggleActive={handleToggleActive}
                                    onTogglePopular={handleTogglePopular}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
