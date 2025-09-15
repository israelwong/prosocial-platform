'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Edit,
    Trash2,
    Eye,
    EyeOff,
    Star,
    Building2,
    Users,
    DollarSign,
    Crown
} from 'lucide-react';
import { Plan } from '../types';

interface PlanCardProps {
    plan: Plan;
    onEdit: (plan: Plan) => void;
    onDelete: (planId: string) => void;
    onToggleActive: (planId: string) => void;
    onTogglePopular: (planId: string) => void;
}

export function PlanCard({
    plan,
    onEdit,
    onDelete,
    onToggleActive,
    onTogglePopular
}: PlanCardProps) {
    const formatPrice = (price: number | null) => {
        if (!price) return 'Gratis';
        return `$${price.toLocaleString()}`;
    };

    const formatFeatures = (features: any) => {
        if (!features) return [];
        if (Array.isArray(features)) return features;
        if (typeof features === 'string') {
            try {
                return JSON.parse(features);
            } catch {
                return [];
            }
        }
        return [];
    };

    const planFeatures = formatFeatures(plan.features);

    return (
        <Card className={`relative transition-all duration-200 hover:shadow-lg ${plan.popular ? 'ring-2 ring-yellow-500 shadow-yellow-500/20' : ''
            }`}>
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-yellow-500 text-yellow-900 hover:bg-yellow-600">
                        <Crown className="w-3 h-3 mr-1" />
                        Popular
                    </Badge>
                </div>
            )}

            <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-xl flex items-center gap-2">
                            {plan.name}
                            {!plan.active && (
                                <Badge variant="secondary" className="text-xs">
                                    Inactivo
                                </Badge>
                            )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {plan.description || 'Sin descripción'}
                        </p>
                        <div className="text-xs text-muted-foreground">
                            Slug: <code className="bg-muted px-1 rounded">{plan.slug}</code>
                        </div>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Precios */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Precio Mensual:</span>
                        <span className="text-lg font-bold text-green-600">
                            {formatPrice(plan.price_monthly)}
                        </span>
                    </div>
                    {plan.price_yearly && (
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Precio Anual:</span>
                            <span className="text-lg font-bold text-blue-600">
                                {formatPrice(plan.price_yearly)}
                            </span>
                        </div>
                    )}
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                    <div className="text-center">
                        <div className="flex items-center justify-center text-muted-foreground mb-1">
                            <Building2 className="w-4 h-4 mr-1" />
                        </div>
                        <div className="text-2xl font-bold">
                            {plan._count?.studios || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Estudios</div>
                    </div>
                    <div className="text-center">
                        <div className="flex items-center justify-center text-muted-foreground mb-1">
                            <Users className="w-4 h-4 mr-1" />
                        </div>
                        <div className="text-2xl font-bold">
                            {plan._count?.subscriptions || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">Suscripciones</div>
                    </div>
                </div>

                {/* Features Preview */}
                {planFeatures.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium">Características:</h4>
                        <div className="space-y-1">
                            {planFeatures.slice(0, 3).map((feature: any, index: number) => (
                                <div key={index} className="text-xs text-muted-foreground flex items-center">
                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2" />
                                    {typeof feature === 'string' ? feature : feature.name || 'Característica'}
                                </div>
                            ))}
                            {planFeatures.length > 3 && (
                                <div className="text-xs text-muted-foreground">
                                    +{planFeatures.length - 3} más...
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Stripe Info */}
                {(plan.stripe_product_id || plan.stripe_price_id) && (
                    <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t">
                        {plan.stripe_product_id && (
                            <div>Stripe Product: <code className="text-xs">{plan.stripe_product_id}</code></div>
                        )}
                        {plan.stripe_price_id && (
                            <div>Stripe Price: <code className="text-xs">{plan.stripe_price_id}</code></div>
                        )}
                    </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4 border-t space-x-2">
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onToggleActive(plan.id)}
                            title={plan.active ? 'Desactivar plan' : 'Activar plan'}
                        >
                            {plan.active ? (
                                <Eye className="h-4 w-4 text-green-500" />
                            ) : (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                            )}
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onTogglePopular(plan.id)}
                            title={plan.popular ? 'Quitar como popular' : 'Marcar como popular'}
                        >
                            <Star className={`h-4 w-4 ${plan.popular ? 'text-yellow-500 fill-current' : 'text-gray-500'}`} />
                        </Button>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(plan)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(plan.id)}
                            className="text-destructive hover:text-destructive"
                            disabled={!!plan._count && (plan._count.studios > 0 || plan._count.subscriptions > 0)}
                            title={
                                plan._count && (plan._count.studios > 0 || plan._count.subscriptions > 0)
                                    ? 'No se puede eliminar un plan con estudios o suscripciones activas'
                                    : 'Eliminar plan'
                            }
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
