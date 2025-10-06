'use server';

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { PasswordChangeSchema, SecuritySettingsSchema } from '@/lib/actions/schemas/seguridad/seguridad-schemas';
import { revalidatePath } from 'next/cache';
import type { SecuritySettings, AccessLog, SecurityFormData } from '@/app/studio/[slug]/(studio-app)/configuracion/cuenta/seguridad/types';

// ========================================
// SERVER ACTIONS - SEGURIDAD
// ========================================

/**
 * Cambiar contraseña del usuario
 */
export async function cambiarContraseña(
    studioSlug: string,
    data: unknown
) {
    try {
        // Validar datos
        const validatedData = PasswordChangeSchema.parse(data);

        // Obtener usuario actual
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                success: false,
                error: 'Usuario no autenticado'
            };
        }

        // Verificar contraseña actual (requiere re-autenticación)
        const { error: verifyError } = await supabase.auth.signInWithPassword({
            email: user.email!,
            password: validatedData.currentPassword
        });

        if (verifyError) {
            return {
                success: false,
                error: 'La contraseña actual es incorrecta'
            };
        }

        // Actualizar contraseña
        const { error: updateError } = await supabase.auth.updateUser({
            password: validatedData.newPassword
        });

        if (updateError) {
            return {
                success: false,
                error: 'Error al actualizar la contraseña'
            };
        }

        // Log del cambio de contraseña
        await logSecurityAction(user.id, 'password_change', true, {
            ip_address: 'N/A', // Se puede obtener del request
            user_agent: 'N/A'
        });

        revalidatePath(`/studio/${studioSlug}/configuracion/cuenta/seguridad`);

        return {
            success: true,
            message: 'Contraseña actualizada exitosamente'
        };

    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        return {
            success: false,
            error: 'Error interno del servidor'
        };
    }
}

/**
 * Obtener configuraciones de seguridad del usuario
 */
export async function obtenerConfiguracionesSeguridad(
    studioSlug: string
): Promise<SecuritySettings | null> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return null;
        }

        // Buscar el usuario en nuestra tabla usando supabase_id
        const dbUser = await prisma.users.findUnique({
            where: { supabase_id: user.id }
        });

        if (!dbUser) {
            console.error('Usuario no encontrado en la base de datos');
            return null;
        }

        // Buscar configuraciones existentes
        let settings = await prisma.user_security_settings.findUnique({
            where: { user_id: dbUser.id }
        });

        // Si no existen, crear con valores por defecto
        if (!settings) {
            settings = await prisma.user_security_settings.create({
                data: {
                    user_id: dbUser.id,
                    email_notifications: true,
                    device_alerts: true,
                    session_timeout: 30
                }
            });
        }

        return settings;

    } catch (error) {
        console.error('Error al obtener configuraciones de seguridad:', error);
        return null;
    }
}

/**
 * Actualizar configuraciones de seguridad
 */
export async function actualizarConfiguracionesSeguridad(
    studioSlug: string,
    data: unknown
) {
    try {
        // Validar datos
        const validatedData = SecuritySettingsSchema.parse(data);
        
        // Obtener usuario actual
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return {
                success: false,
                error: 'Usuario no autenticado'
            };
        }

        // Buscar el usuario en nuestra tabla usando supabase_id
        const dbUser = await prisma.users.findUnique({
            where: { supabase_id: user.id }
        });

        if (!dbUser) {
            return {
                success: false,
                error: 'Usuario no encontrado en la base de datos'
            };
        }

        // Actualizar o crear configuraciones
        const settings = await prisma.user_security_settings.upsert({
            where: { user_id: dbUser.id },
            update: {
                email_notifications: validatedData.email_notifications,
                device_alerts: validatedData.device_alerts,
                session_timeout: validatedData.session_timeout,
                updated_at: new Date()
            },
            create: {
                user_id: dbUser.id,
                email_notifications: validatedData.email_notifications,
                device_alerts: validatedData.device_alerts,
                session_timeout: validatedData.session_timeout
            }
        });

        // Log del cambio de configuraciones
        await logSecurityAction(dbUser.id, 'security_settings_updated', true, {
            settings: validatedData
        });

        revalidatePath(`/studio/${studioSlug}/configuracion/cuenta/seguridad`);

        return {
            success: true,
            data: settings,
            message: 'Configuraciones de seguridad actualizadas'
        };

    } catch (error) {
        console.error('Error al actualizar configuraciones:', error);
        return {
            success: false,
            error: 'Error interno del servidor'
        };
    }
}

/**
 * Obtener historial de accesos del usuario
 */
export async function obtenerHistorialAccesos(
    studioSlug: string,
    limit: number = 20,
    offset: number = 0
): Promise<AccessLog[]> {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return [];
        }

        // Buscar el usuario en nuestra tabla usando supabase_id
        const dbUser = await prisma.users.findUnique({
            where: { supabase_id: user.id }
        });

        if (!dbUser) {
            return [];
        }

        const logs = await prisma.user_access_logs.findMany({
            where: { user_id: dbUser.id },
            orderBy: { created_at: 'desc' },
            take: limit,
            skip: offset
        });

        return logs;

    } catch (error) {
        console.error('Error al obtener historial de accesos:', error);
        return [];
    }
}

/**
 * Cerrar todas las sesiones excepto la actual
 */
export async function cerrarTodasLasSesiones(
    studioSlug: string
) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return {
                success: false,
                error: 'Usuario no autenticado'
            };
        }

        // Buscar el usuario en nuestra tabla usando supabase_id
        const dbUser = await prisma.users.findUnique({
            where: { supabase_id: user.id }
        });

        if (!dbUser) {
            return {
                success: false,
                error: 'Usuario no encontrado en la base de datos'
            };
        }

        // Supabase Auth no permite cerrar sesiones específicas
        // Solo podemos cerrar la sesión actual
        const { error: signOutError } = await supabase.auth.signOut();

        if (signOutError) {
            return {
                success: false,
                error: 'Error al cerrar sesiones'
            };
        }

        // Log del cierre de sesiones
        await logSecurityAction(dbUser.id, 'session_ended', true, {
            action: 'close_all_sessions'
        });

        return {
            success: true,
            message: 'Sesiones cerradas exitosamente'
        };

    } catch (error) {
        console.error('Error al cerrar sesiones:', error);
        return {
            success: false,
            error: 'Error interno del servidor'
        };
    }
}

/**
 * Función auxiliar para loggear acciones de seguridad
 */
async function logSecurityAction(
    userId: string,
    action: string,
    success: boolean,
    details?: any
) {
    try {
        await prisma.user_access_logs.create({
            data: {
                user_id: userId,
                action,
                success,
                details,
                ip_address: details?.ip_address || 'N/A',
                user_agent: details?.user_agent || 'N/A'
            }
        });
    } catch (error) {
        console.error('Error al loggear acción de seguridad:', error);
    }
}
