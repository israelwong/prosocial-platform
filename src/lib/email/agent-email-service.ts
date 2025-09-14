import { render } from '@react-email/components';
import { AgentCredentialsEmail } from '@/emails/templates/AgentCredentialsEmail';
import { sendEmail } from './resend-client';

export interface AgentCredentialsData {
    agentName: string;
    email: string;
    temporaryPassword: string;
    isNewAgent?: boolean;
}

/**
 * Envía email con credenciales a un agente
 */
export async function sendAgentCredentialsEmail(data: AgentCredentialsData) {
    try {
        // Generar URL de login
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://prosocial-platform.vercel.app';
        const loginUrl = `${baseUrl}/auth/login`;

        // Renderizar el template de React a HTML
        const emailHtml = render(
            AgentCredentialsEmail({
                agentName: data.agentName,
                email: data.email,
                temporaryPassword: data.temporaryPassword,
                loginUrl,
                isNewAgent: data.isNewAgent || false,
            })
        );

        // Enviar el email
        const result = await sendEmail({
            to: data.email,
            subject: data.isNewAgent
                ? '🎉 Bienvenido a ProSocial Platform - Credenciales de Acceso'
                : '🔑 Credenciales Actualizadas - ProSocial Platform',
            html: emailHtml,
            text: generatePlainTextVersion(data, loginUrl),
        });

        if (result.success) {
            console.log(`✅ Credenciales enviadas a ${data.email} (ID: ${result.id})`);
            return { success: true, emailId: result.id };
        } else {
            console.error(`❌ Error enviando credenciales a ${data.email}:`, result.error);
            return { success: false, error: result.error };
        }
    } catch (error) {
        console.error('❌ Error en sendAgentCredentialsEmail:', error);
        return { success: false, error };
    }
}

/**
 * Genera versión en texto plano del email
 */
function generatePlainTextVersion(data: AgentCredentialsData, loginUrl: string): string {
    const welcomeText = data.isNewAgent
        ? '¡Bienvenido a ProSocial Platform!'
        : 'Credenciales Actualizadas';

    const introText = data.isNewAgent
        ? 'Te damos la bienvenida al equipo de ProSocial Platform. Aquí están tus credenciales de acceso:'
        : 'Tus credenciales de acceso han sido actualizadas. Aquí están tus nuevos datos de acceso:';

    return `
${welcomeText}

Hola ${data.agentName},

${introText}

CREDENCIALES DE ACCESO:
Email: ${data.email}
Contraseña Temporal: ${data.temporaryPassword}
URL de Acceso: ${loginUrl}

IMPORTANTE:
• Esta contraseña es temporal y debe ser cambiada en tu primer inicio de sesión
• Guarda estas credenciales en un lugar seguro
• No compartas esta información por canales no seguros
• Si tienes problemas para acceder, contacta al administrador del sistema

Si necesitas ayuda o tienes alguna pregunta, no dudes en contactarnos.

Saludos,
Equipo ProSocial Platform

© 2024 ProSocial Platform. Todos los derechos reservados.
Sitio Web: https://prosocialmx.com
Soporte: soporte@prosocialmx.com
`.trim();
}

/**
 * Validar configuración de email
 */
export function validateEmailConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!process.env.RESEND_API_KEY) {
        errors.push('RESEND_API_KEY no está configurada');
    }

    if (!process.env.NEXT_PUBLIC_APP_URL) {
        errors.push('NEXT_PUBLIC_APP_URL no está configurada');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
