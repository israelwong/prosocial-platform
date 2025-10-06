import { createClient } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  console.log('🔍 MIDDLEWARE EJECUTÁNDOSE para:', request.nextUrl.pathname)

  const { supabase, response } = createClient(request, NextResponse.next())
  const { pathname } = request.nextUrl

  // Rutas públicas (no requieren autenticación)
  const publicRoutes = [
    '/',
    '/login',
    '/forgot-password',
    '/reset-password',
    '/redirect'
  ]

  // Si es una ruta pública, permitir acceso
  if (publicRoutes.includes(pathname)) {
    console.log('🔍 Ruta pública, permitiendo acceso')
    return response
  }

  // Verificar si es una ruta de studio (después de reescritura)
  // Las rutas /studio/[slug] son públicas (páginas de studio)
  if (pathname.startsWith('/studio/') && !pathname.includes('/dashboard') && !pathname.includes('/configuracion') && !pathname.includes('/manager')) {
    console.log('🔍 Ruta pública de studio, permitiendo acceso')
    return response
  }

  // Verificar autenticación para rutas protegidas
  // Rutas que requieren autenticación: /studio/[slug]/dashboard, /studio/[slug]/configuracion, etc.
  if (pathname.startsWith('/studio/') && (pathname.includes('/dashboard') || pathname.includes('/configuracion') || pathname.includes('/manager'))) {
    console.log('🔍 Verificando autenticación para ruta protegida del studio')

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      console.log('🔍 Usuario no autenticado, redirigiendo a login')
      return NextResponse.redirect(new URL('/login', request.url))
    }

    console.log('🔍 Usuario autenticado, permitiendo acceso')
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}