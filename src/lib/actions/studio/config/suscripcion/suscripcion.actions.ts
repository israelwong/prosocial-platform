"use server";

import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { SuscripcionData, Plan, Subscription } from '@/app/studio/[slug]/(studio-app)/configuracion/cuenta/suscripcion/types';

/**
 * Obtener datos de suscripción del usuario
 */
export async function obtenerDatosSuscripcion(studioSlug: string) {
    try {
        // Obtener usuario actual
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return {
                success: false,
                error: 'Usuario no autenticado'
            };
        }

        // Buscar el studio del usuario
        const userStudioRole = await prisma.user_studio_roles.findFirst({
            where: { 
                user_id: user.id,
                role: 'OWNER'
            },
            include: { studio: true }
        });

        if (!userStudioRole) {
            return {
                success: false,
                error: 'Usuario no tiene rol OWNER en ningún studio'
            };
        }

        const studio = userStudioRole.studio;

        // Obtener suscripción actual
        const subscription = await prisma.subscriptions.findFirst({
            where: { studio_id: studio.id },
            include: {
                plan: true,
                items: {
                    where: { deactivated_at: null }, // Solo items activos
                    include: { plan: true }
                }
            }
        });

        if (!subscription) {
            return {
                success: false,
                error: 'No se encontró suscripción para este studio'
            };
        }

        // Obtener límites del plan
        const limits = await prisma.plan_limits.findMany({
            where: { plan_id: subscription.plan_id }
        });

        // Obtener historial de facturación (simulado por ahora)
        const billing_history = [
            {
                id: 'demo_bill_1',
                subscription_id: subscription.id,
                amount: subscription.plan.price_monthly,
                currency: 'MXN',
                status: 'paid' as const,
                description: `Factura ${subscription.plan.name} - ${new Date().toLocaleDateString('es-ES')}`,
                created_at: new Date()
            }
        ];

        const data: SuscripcionData = {
            subscription,
            plan: subscription.plan,
            limits,
            items: subscription.items,
            billing_history
        };

        return {
            success: true,
            data
        };

    } catch (error) {
        console.error('Error al obtener datos de suscripción:', error);
        return {
            success: false,
            error: 'Error interno del servidor'
        };
    }
}

/**
 * Obtener todos los planes disponibles
 */
export async function obtenerPlanesDisponibles() {
    try {
        const plans = await prisma.platform_plans.findMany({
            where: { active: true },
            orderBy: { orden: 'asc' }
        });

        return {
            success: true,
            data: plans
        };

    } catch (error) {
        console.error('Error al obtener planes:', error);
        return {
            success: false,
            error: 'Error interno del servidor'
        };
    }
}

/**
 * Cambiar plan de suscripción (simulado - sin Stripe)
 */
export async function cambiarPlan(
    studioSlug: string,
    planId: string,
    billingCycle: 'monthly' | 'yearly'
) {
    try {
        // Obtener usuario actual
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return {
                success: false,
                error: 'Usuario no autenticado'
            };
        }

        // Buscar el studio del usuario
        const userStudioRole = await prisma.user_studio_roles.findFirst({
            where: { 
                user_id: user.id,
                role: 'OWNER'
            },
            include: { studio: true }
        });

        if (!userStudioRole) {
            return {
                success: false,
                error: 'Usuario no tiene rol OWNER en ningún studio'
            };
        }

        const studio = userStudioRole.studio;

        // Verificar que el plan existe
        const newPlan = await prisma.platform_plans.findUnique({
            where: { id: planId }
        });

        if (!newPlan) {
            return {
                success: false,
                error: 'Plan no encontrado'
            };
        }

        // Obtener suscripción actual
        const currentSubscription = await prisma.subscriptions.findFirst({
            where: { studio_id: studio.id }
        });

        if (!currentSubscription) {
            return {
                success: false,
                error: 'No se encontró suscripción actual'
            };
        }

        // Actualizar suscripción (simulado - sin Stripe)
        const updatedSubscription = await prisma.subscriptions.update({
            where: { id: currentSubscription.id },
            data: {
                plan_id: planId,
                updated_at: new Date()
            }
        });

        // Desactivar items anteriores
        await prisma.subscription_items.updateMany({
            where: { 
                subscription_id: currentSubscription.id,
                deactivated_at: null
            },
            data: { deactivated_at: new Date() }
        });

        // Crear nuevo item para el plan
        const price = billingCycle === 'yearly' ? newPlan.price_yearly : newPlan.price_monthly;
        
        await prisma.subscription_items.create({
            data: {
                subscription_id: currentSubscription.id,
                item_type: 'PLAN',
                plan_id: planId,
                unit_price: price,
                quantity: 1,
                subtotal: price,
                activated_at: new Date()
            }
        });

        // Log del cambio de plan
        await prisma.user_access_logs.create({
            data: {
                user_id: user.id,
                action: 'plan_changed',
                ip_address: 'N/A',
                user_agent: 'N/A',
                success: true,
                details: {
                    old_plan: currentSubscription.plan_id,
                    new_plan: planId,
                    billing_cycle: billingCycle
                }
            }
        });

        revalidatePath(`/studio/${studioSlug}/configuracion/cuenta/suscripcion`);

        return {
            success: true,
            message: `Plan cambiado a ${newPlan.name} exitosamente`,
            data: updatedSubscription
        };

    } catch (error) {
        console.error('Error al cambiar plan:', error);
        return {
            success: false,
            error: 'Error interno del servidor'
        };
    }
}

/**
 * Cancelar suscripción (simulado - sin Stripe)
 */
export async function cancelarSuscripcion(studioSlug: string) {
    try {
        // Obtener usuario actual
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return {
                success: false,
                error: 'Usuario no autenticado'
            };
        }

        // Buscar el studio del usuario
        const userStudioRole = await prisma.user_studio_roles.findFirst({
            where: { 
                user_id: user.id,
                role: 'OWNER'
            },
            include: { studio: true }
        });

        if (!userStudioRole) {
            return {
                success: false,
                error: 'Usuario no tiene rol OWNER en ningún studio'
            };
        }

        const studio = userStudioRole.studio;

        // Obtener suscripción actual
        const subscription = await prisma.subscriptions.findFirst({
            where: { studio_id: studio.id }
        });

        if (!subscription) {
            return {
                success: false,
                error: 'No se encontró suscripción actual'
            };
        }

        // Actualizar suscripción a CANCELLED
        await prisma.subscriptions.update({
            where: { id: subscription.id },
            data: {
                status: 'CANCELLED',
                updated_at: new Date()
            }
        });

        // Log de la cancelación
        await prisma.user_access_logs.create({
            data: {
                user_id: user.id,
                action: 'subscription_cancelled',
                ip_address: 'N/A',
                user_agent: 'N/A',
                success: true,
                details: {
                    plan_id: subscription.plan_id,
                    cancelled_at: new Date()
                }
            }
        });

        revalidatePath(`/studio/${studioSlug}/configuracion/cuenta/suscripcion`);

        return {
            success: true,
            message: 'Suscripción cancelada exitosamente'
        };

    } catch (error) {
        console.error('Error al cancelar suscripción:', error);
        return {
            success: false,
            error: 'Error interno del servidor'
        };
    }
}
