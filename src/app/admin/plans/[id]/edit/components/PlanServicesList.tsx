'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
    Save, 
    Loader2,
    CheckCircle,
    XCircle,
    Infinity
} from 'lucide-react';
import { toast } from 'sonner';
import { 
    ServiceWithPlanConfig, 
    UnidadMedida, 
    UNIDAD_MEDIDA_LABELS,
    formatLimite 
} from '../../../types/plan-services';

interface PlanServicesListProps {
    planId: string;
    isEdit?: boolean;
}

export function PlanServicesList({ planId, isEdit = true }: PlanServicesListProps) {
    const [services, setServices] = useState<ServiceWithPlanConfig[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [saving, setSaving] = useState<string | null>(null);

    useEffect(() => {
        if (isEdit) {
            fetchPlanServices();
        } else {
            fetchAllServices();
        }
    }, [planId, isEdit]);

    const fetchAllServices = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching all services for new plan');
            
            const response = await fetch('/api/services');
            if (!response.ok) {
                throw new Error('Error al cargar servicios');
            }
            
            const allServices = await response.json();
            console.log('Received all services:', allServices);
            
            // Convertir a formato ServiceWithPlanConfig con planService null
            const servicesWithConfig = allServices.map((service: any) => ({
                ...service,
                planService: null
            }));
            
            setServices(servicesWithConfig);
        } catch (error) {
            console.error('Error fetching all services:', error);
            toast.error('Error al cargar servicios');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchPlanServices = async () => {
        try {
            setIsLoading(true);
            console.log('Fetching services for plan:', planId);
            
            const response = await fetch(`/api/plans/${planId}/services`);
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (response.ok) {
                const data = await response.json();
                console.log('Received data:', data);
                setServices(data);
            } else {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (jsonError) {
                    console.error('Error parsing JSON response:', jsonError);
                    errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
                }
                console.error('API Error:', errorData);
                console.error('Response status:', response.status);
                console.error('Response headers:', Object.fromEntries(response.headers.entries()));
                throw new Error(errorData.error || `Error al cargar servicios del plan (${response.status})`);
            }
        } catch (error) {
            console.error('Error fetching plan services:', error);
            if (error instanceof Error && error.message.includes('404')) {
                toast.error('Plan no encontrado. Por favor, crea un plan primero.');
            } else {
                toast.error('Error al cargar servicios del plan');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const updateServiceConfig = async (serviceId: string, updates: any) => {
        if (!isEdit) {
            toast.error('Guarda el plan primero para configurar los servicios');
            return;
        }
        
        try {
            setSaving(serviceId);
            
            const response = await fetch(`/api/plans/${planId}/services`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    service_id: serviceId,
                    ...updates
                }),
            });

            if (!response.ok) {
                throw new Error('Error al actualizar configuración');
            }

            const updatedPlanService = await response.json();
            
            // Actualizar estado local
            setServices(prev => prev.map(service => 
                service.id === serviceId 
                    ? { ...service, planService: updatedPlanService }
                    : service
            ));

            toast.success('Configuración actualizada');
        } catch (error) {
            console.error('Error updating service config:', error);
            toast.error('Error al actualizar configuración');
        } finally {
            setSaving(null);
        }
    };

    const handleToggleActive = async (serviceId: string, active: boolean) => {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;

        const updates = {
            active,
            limite: active ? (service.planService?.limite ?? null) : null,
            unidad: active ? (service.planService?.unidad ?? null) : null
        };

        await updateServiceConfig(serviceId, updates);
    };

    const handleLimiteChange = async (serviceId: string, limite: string) => {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;

        const limiteValue = limite === '' ? null : parseInt(limite);
        
        await updateServiceConfig(serviceId, {
            active: service.planService?.active ?? false,
            limite: limiteValue,
            unidad: service.planService?.unidad ?? null
        });
    };

    const handleUnidadChange = async (serviceId: string, unidad: UnidadMedida | null) => {
        const service = services.find(s => s.id === serviceId);
        if (!service) return;

        await updateServiceConfig(serviceId, {
            active: service.planService?.active ?? false,
            limite: service.planService?.limite ?? null,
            unidad
        });
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Servicios del Plan</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        <span>Cargando servicios...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Si no hay servicios y no está cargando, mostrar mensaje apropiado
    if (services.length === 0 && !isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Servicios del Plan</CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                    <div className="text-muted-foreground">
                        <p className="text-sm mb-2">No se pudieron cargar los servicios del plan.</p>
                        <p className="text-xs">Verifica que el plan existe y tiene una configuración válida.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Servicios del Plan</CardTitle>
                <p className="text-sm text-muted-foreground">
                    {isEdit 
                        ? "Configura qué servicios están disponibles en este plan y sus límites"
                        : "Vista previa de los servicios disponibles. Guarda el plan para configurar los límites."
                    }
                </p>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {services.map((service) => {
                        const isActive = service.planService?.active ?? false;
                        const isSaving = saving === service.id;

                        return (
                            <div
                                key={service.id}
                                className={`p-4 border rounded-lg transition-all ${
                                    isActive 
                                        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20' 
                                        : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900/20'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold">{service.name}</h3>
                                            <Badge variant="outline" className="text-xs">
                                                {service.slug}
                                            </Badge>
                                        </div>
                                        {service.description && (
                                            <p className="text-sm text-muted-foreground">
                                                {service.description}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={isActive}
                                            onCheckedChange={(checked) => handleToggleActive(service.id, checked)}
                                            disabled={isSaving || !isEdit}
                                        />
                                        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                                    </div>
                                </div>

                                {isActive && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div>
                                            <Label htmlFor={`limite-${service.id}`}>Límite</Label>
                                            <Input
                                                id={`limite-${service.id}`}
                                                type="number"
                                                placeholder="Dejar vacío para ilimitado"
                                                value={service.planService?.limite ?? ''}
                                                onChange={(e) => handleLimiteChange(service.id, e.target.value)}
                                                disabled={isSaving || !isEdit}
                                            />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Dejar vacío = ilimitado, 0 = sin acceso
                                            </p>
                                        </div>
                                        <div>
                                            <Label htmlFor={`unidad-${service.id}`}>Unidad de Medida</Label>
                                            <Select
                                                value={service.planService?.unidad ?? ''}
                                                onValueChange={(value) => handleUnidadChange(service.id, value as UnidadMedida || null)}
                                                disabled={isSaving || !isEdit}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Seleccionar unidad" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.entries(UNIDAD_MEDIDA_LABELS).map(([value, label]) => (
                                                        <SelectItem key={value} value={value}>
                                                            {label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                )}

                                {isActive && service.planService && (
                                    <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded border">
                                        <div className="flex items-center gap-2 text-sm">
                                            <span className="text-muted-foreground">Configuración actual:</span>
                                            <Badge variant="secondary">
                                                {formatLimite(service.planService.limite, service.planService.unidad)}
                                            </Badge>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
