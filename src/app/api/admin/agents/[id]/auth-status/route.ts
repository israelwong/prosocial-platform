import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// GET /api/admin/agents/[id]/auth-status - Obtener estado de autenticación del agente
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Obtener información del usuario en Supabase Auth
        const { data: authUser, error } = await supabaseAdmin.auth.admin.getUserById(id);

        if (error) {
            return NextResponse.json({
                exists: false,
                error: error.message
            });
        }

        // Verificar si el usuario está baneado usando ban_duration
        const user = authUser.user as any; // Type assertion para acceder a ban_duration
        const isBanned = user.ban_duration && user.ban_duration !== 'none';

        return NextResponse.json({
            exists: true,
            user: {
                id: user.id,
                email: user.email,
                email_confirmed_at: user.email_confirmed_at,
                last_sign_in_at: user.last_sign_in_at,
                created_at: user.created_at,
                ban_duration: user.ban_duration,
                is_active: !isBanned
            }
        });
    } catch (error) {
        console.error('Error checking auth status:', error);
        return NextResponse.json(
            { error: 'Error al verificar el estado de autenticación' },
            { status: 500 }
        );
    }
}
