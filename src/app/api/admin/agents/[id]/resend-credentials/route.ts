import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { prisma } from '@/lib/prisma';

// POST /api/admin/agents/[id]/resend-credentials - Reenviar credenciales al agente
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Obtener datos del agente
        const agent = await prisma.proSocialAgent.findUnique({
            where: { id }
        });

        if (!agent) {
            return NextResponse.json(
                { error: 'Agente no encontrado' },
                { status: 404 }
            );
        }

        // Generar nueva contraseña temporal
        const newTempPassword = `Agente${Math.random().toString(36).slice(-8)}!`;

        // Actualizar contraseña en Supabase Auth
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(id, {
            password: newTempPassword
        });

        if (updateError) {
            console.error('Error updating password:', updateError);
            return NextResponse.json(
                { error: 'Error al actualizar la contraseña' },
                { status: 500 }
            );
        }

        // TODO: Enviar email con las nuevas credenciales
        // En producción, aquí se enviaría un email al agente con:
        // - Email: agent.email
        // - Contraseña temporal: newTempPassword
        // - Link de acceso: /agente

        return NextResponse.json({
            message: 'Credenciales actualizadas exitosamente',
            agent: {
                email: agent.email,
                tempPassword: newTempPassword // En producción esto se enviaría por email
            }
        });
    } catch (error) {
        console.error('Error resending credentials:', error);
        return NextResponse.json(
            { error: 'Error al reenviar credenciales' },
            { status: 500 }
        );
    }
}
