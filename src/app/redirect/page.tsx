import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function RedirectPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  try {
    // Buscar el usuario en nuestra tabla usando supabase_id
    const dbUser = await prisma.users.findUnique({
      where: { supabase_id: user.id }
    })

    if (!dbUser) {
      // Si no existe en nuestra BD, redirigir al login
      redirect('/login')
    }

    // Buscar el rol del usuario
    const userStudioRole = await prisma.user_studio_roles.findFirst({
      where: { 
        user_id: dbUser.id,
        is_active: true
      },
      include: { studio: true }
    })

    if (!userStudioRole) {
      // Si no tiene roles, redirigir al login
      redirect('/login')
    }

    // Redirigir basado en el rol
    switch (userStudioRole.role) {
      case 'SUPER_ADMIN':
        redirect('/admin')
      case 'AGENT':
        redirect('/agente')
      case 'OWNER':
        redirect(`/studio/${userStudioRole.studio.slug}`)
      default:
        redirect('/login')
    }

  } catch (error) {
    console.error('Error en redirect:', error)
    redirect('/login')
  } finally {
    await prisma.$disconnect()
  }
}
