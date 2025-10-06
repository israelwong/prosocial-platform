import { createClient } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request, NextResponse.next())
  
  // Verificar si el usuario está autenticado
  const { data: { user }, error } = await supabase.auth.getUser()

  // Rutas que requieren autenticación
  const protectedRoutes = [
    '/admin',
    '/agente', 
    '/studio'
  ]

  // Rutas de autenticación (no requieren login)
  const authRoutes = [
    '/login',
    '/forgot-password',
    '/reset-password'
  ]

  const { pathname } = request.nextUrl

  // Si es una ruta de autenticación, permitir acceso
  if (authRoutes.some(route => pathname.startsWith(route))) {
    return response
  }

  // Si es una ruta protegida y no hay usuario, redirigir al login
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (error || !user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
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