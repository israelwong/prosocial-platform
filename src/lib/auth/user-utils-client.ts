"use client";

import { createClient } from '@/lib/supabase/client';
import { getCurrentUserProfile } from '@/lib/actions/auth/user-profile.action';

/**
 * Obtener el usuario actual con su perfil (versión cliente)
 */
export async function getCurrentUserClient() {
    try {
        const supabase = createClient();

        // Obtener usuario de Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return null;
        }

        // Obtener perfil del usuario desde Server Action
        const profileResult = await getCurrentUserProfile();

        if (!profileResult.success || !profileResult.data) {
            return null;
        }

        return {
            id: user.id,
            email: user.email!,
            profile: profileResult.data,
        };
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}
