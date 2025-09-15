import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rutas que requieren autenticación
  const protectedRoutes = ['/admin', '/agente', '/studio'];
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    const supabase = await createClient();

    // Verificar autenticación
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.log('🔒 Usuario no autenticado, redirigiendo a login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    console.log('🔒 Usuario autenticado:', user.email);
    console.log('🔒 User metadata:', user.user_metadata);

    // Obtener el rol del usuario desde user_metadata
    const userRole = user.user_metadata?.role;

    if (!userRole) {
      console.log('🔒 No se encontró rol en metadata, redirigiendo a login');
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    console.log('🔒 Rol del usuario:', userRole);
    console.log('🔒 Ruta solicitada:', pathname);

    // Verificar permisos según el rol
    const hasAccess = checkRouteAccess(userRole, pathname);

    if (!hasAccess) {
      console.log('🔒 Acceso denegado para rol:', userRole, 'a ruta:', pathname);
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    console.log('🔒 Acceso permitido para rol:', userRole, 'a ruta:', pathname);
  }

  // Rutas reservadas para marketing (no redirigir)
  const marketingRoutes = [
    '/about',
    '/pricing',
    '/contact',
    '/features',
    '/blog',
    '/auth',
    '/unauthorized'
  ];

  // Si es una ruta de marketing o ya tiene prefijo, permitir
  if (marketingRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si es /[slug] y no es una ruta reservada, redirigir a /studio/[slug]
  // Excluir rutas de autenticación y administración
  const reservedPaths = ['/admin', '/agente', '/auth', '/unauthorized'];
  if (pathname.match(/^\/[a-zA-Z0-9-]+$/) && pathname !== '/' && !reservedPaths.some(path => pathname.startsWith(path))) {
    const slug = pathname.slice(1);
    return NextResponse.redirect(new URL(`/studio/${slug}`, request.url));
  }

  return NextResponse.next();
}

function checkRouteAccess(userRole: string, pathname: string): boolean {
  console.log('🔍 Verificando acceso - Rol:', userRole, 'Ruta:', pathname);

  switch (userRole) {
    case 'super_admin':
      // Super admin puede acceder a todo
      return true;

    case 'agente':
      // Agente solo puede acceder a rutas de agente
      return pathname.startsWith('/agente');

    case 'suscriptor':
      // Suscriptor solo puede acceder a rutas de studio
      return pathname.startsWith('/studio/');

    default:
      console.log('🔍 Rol no reconocido:', userRole);
      return false;
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
