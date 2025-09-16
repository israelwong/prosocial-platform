import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDefaultRoute } from '@/types/auth'

export default async function RedirectPage() {
    const supabase = await createClient()

    // Obtener el usuario autenticado
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        redirect('/login')
    }

    console.log('🔍 Redirect - Usuario ID:', user.id)
    console.log('🔍 Redirect - User metadata:', user.user_metadata)

    // Obtener el rol del usuario desde user_metadata
    let userRole = user.user_metadata?.role

    // Si no hay rol, intentar detectar por email (fallback para super admin)
    if (!userRole) {
        console.log('🔍 Redirect - No se encontró rol en metadata, verificando por email...')
        
        // Lista de emails de super admin (fallback)
        const superAdminEmails = ['admin@prosocial.mx']
        
        if (superAdminEmails.includes(user.email || '')) {
            console.log('🔍 Redirect - Detectado super admin por email:', user.email)
            userRole = 'super_admin'
        } else {
            console.log('🔍 Redirect - No se pudo determinar el rol, redirigiendo a login')
            redirect('/login?error=no-role')
        }
    }

    console.log('🔍 Redirect - Rol encontrado:', userRole)

    // Redirigir según el rol del usuario
    const redirectPath = getDefaultRoute(userRole)
    console.log('🔍 Redirect - Redirigiendo a:', redirectPath)
    redirect(redirectPath)
}
