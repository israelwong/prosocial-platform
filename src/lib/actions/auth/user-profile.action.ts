"use server";

import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';

/**
 * Obtener el perfil del usuario actual desde la base de datos
 */
export async function getCurrentUserProfile() {
    try {
        // Verificar autenticación
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return {
                success: false,
                error: 'No autorizado'
            };
        }

        // Obtener usuario de la tabla users
        const dbUser = await prisma.users.findUnique({
            where: { supabase_id: user.id },
            select: {
                id: true,
                email: true,
                full_name: true,
                phone: true,
                is_active: true,
                created_at: true,
                updated_at: true,
            }
        });

        if (!dbUser) {
            return {
                success: false,
                error: 'Usuario no encontrado'
            };
        }

        // Obtener el avatar desde platform_leads (donde se almacena realmente)
        const leadProfile = await prisma.platform_leads.findFirst({
            where: {
                email: user.email
            },
            select: {
                avatar_url: true,
                name: true
            }
        });

        return {
            success: true,
            data: {
                id: dbUser.id,
                email: dbUser.email,
                fullName: leadProfile?.name || dbUser.full_name,
                avatarUrl: leadProfile?.avatar_url,
                phone: dbUser.phone,
                isActive: dbUser.is_active,
                createdAt: dbUser.created_at,
                updatedAt: dbUser.updated_at,
            }
        };

    } catch (error) {
        console.error('Error fetching user profile:', error);
        return {
            success: false,
            error: 'Error interno del servidor'
        };
    }
}
