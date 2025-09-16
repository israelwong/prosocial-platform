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
    const userRole = user.user_metadata?.role

    if (!userRole) {
        console.log('🔍 Redirect - No se encontró rol en metadata, redirigiendo a login')
        redirect('/login?error=no-role')
    }

    console.log('🔍 Redirect - Rol encontrado:', userRole)

    // Redirigir según el rol del usuario
    const redirectPath = getDefaultRoute(userRole)
    console.log('🔍 Redirect - Redirigiendo a:', redirectPath)
    redirect(redirectPath)
}
