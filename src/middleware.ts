import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Función para verificar rutas reservadas
function isReservedPath(path: string): boolean {
  const reservedPaths = [
    "/admin", "/agente", "/api", "/login", "/sign-up", "/signin", "/signup",
    "/forgot-password", "/update-password", "/error", "/redirect", "/sign-up-success",
    "/complete-profile", "/confirm", "/unauthorized", "/protected", "/about",
    "/pricing", "/contact", "/features", "/blog", "/help", "/docs", "/demo",
    "/terms", "/privacy", "/_next", "/favicon.ico", "/robots.txt", "/sitemap.xml"
  ];

  return reservedPaths.some((reserved) => {
    if (reserved === "/demo") {
      return path === "/demo" || path.startsWith("/demo/");
    }
    return path.startsWith(reserved);
  });
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rutas que requieren autenticación
  const protectedRoutes = ["/admin", "/agente"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Verificar si es una ruta de studio dinámica [slug]/studio
  const isStudioRoute = pathname.match(/^\/([a-zA-Z0-9-]+)\/studio(\/.*)?$/);
  const isStudioProtected = isStudioRoute && !isReservedPath(pathname);

  // Verificar si es una ruta de cliente dinámica [slug]/cliente
  const isClienteRoute = pathname.match(/^\/([a-zA-Z0-9-]+)\/cliente(\/.*)?$/);
  const isClienteProtected = isClienteRoute && !isReservedPath(pathname);

  if (isProtectedRoute || isStudioProtected || isClienteProtected) {
    const supabase = await createClient();

    // Verificar autenticación
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Obtener el rol del usuario desde user_metadata
    const userRole = user.user_metadata?.role;

    if (!userRole) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Verificar permisos según el rol
    const hasAccess = checkRouteAccess(userRole, pathname);

    if (!hasAccess) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    // Para rutas de cliente, verificar autenticación específica
    if (isClienteProtected) {
      const hasClienteAccess = await checkClienteAccess(user, pathname, request);
      if (!hasClienteAccess) {
        // Redirigir a página de login de cliente específica del studio
        const studioSlug = pathname.match(/^\/([a-zA-Z0-9-]+)\/cliente/)?.[1];
        const loginUrl = new URL(`/${studioSlug}/cliente/login?redirect=${encodeURIComponent(pathname)}`, request.url);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // Rutas reservadas para marketing (no redirigir)
  const marketingRoutes = [
    "/about",
    "/pricing",
    "/contact",
    "/features",
    "/blog",
    "/login",
    "/sign-up",
    "/signin",
    "/signup",
    "/forgot-password",
    "/update-password",
    "/error",
    "/redirect",
    "/sign-up-success",
    "/complete-profile",
    "/confirm",
    "/unauthorized",
  ];

  // Si es una ruta de marketing, permitir
  if (marketingRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }


  // Solo reescribir si es una ruta que no existe y no es reservada
  // NO reescribir /[slug] (página pública) ni /[slug]/studio (ya existe)
  const slugMatch = pathname.match(/^\/([a-zA-Z0-9-]+)(\/.*)?$/);
  if (slugMatch && pathname !== "/" && !isReservedPath(pathname)) {
    const [, slug, subPath = ""] = slugMatch;

    // No reescribir rutas que ya existen:
    // - /[slug] (página pública del studio)
    // - /[slug]/studio (panel privado del studio)  
    // - /[slug]/cliente (portal de clientes)
    if (!subPath || subPath.startsWith('/studio') || subPath.startsWith('/cliente')) {
      return NextResponse.next();
    }

    // Solo reescribir si es una subruta que no existe
    const studioPath = `/${slug}/studio${subPath}`;
    console.log(`🔄 [ZEN.PRO] Rewriting ${pathname} to ${studioPath}`);
    return NextResponse.rewrite(new URL(studioPath, request.url));
  }

  return NextResponse.next();
}

function checkRouteAccess(userRole: string, pathname: string): boolean {
  switch (userRole) {
    case "super_admin":
      // Super admin puede acceder a todo
      return true;

    case "agente":
      // Agente solo puede acceder a rutas de agente
      return pathname.startsWith("/agente");

    case "suscriptor":
      // Suscriptor puede acceder a rutas de studio dinámicas [slug]/studio
      return pathname.match(/^\/([a-zA-Z0-9-]+)\/studio(\/.*)?$/) !== null;

    default:
      return false;
  }
}

async function checkClienteAccess(user: any, pathname: string, request: NextRequest): Promise<boolean> {
  try {
    // Extraer el slug del studio de la ruta
    const slugMatch = pathname.match(/^\/([a-zA-Z0-9-]+)\/cliente(\/.*)?$/);
    if (!slugMatch) return false;

    const studioSlug = slugMatch[1];

    // Verificar si el usuario tiene acceso a este studio específico
    // Esto se puede hacer verificando:
    // 1. Si el usuario es el propietario del studio (suscriptor)
    // 2. Si el usuario es un cliente con código de acceso válido
    // 3. Si el usuario tiene un token de acceso específico

    // Por ahora, implementar lógica básica
    // TODO: Implementar verificación real de acceso de cliente

    // Verificar si el usuario tiene metadata de cliente para este studio
    const clienteData = user.user_metadata?.cliente_access;
    if (clienteData && clienteData.studio_slug === studioSlug) {
      return true;
    }

    // Verificar si es el propietario del studio
    if (user.user_metadata?.role === 'suscriptor' && user.user_metadata?.studio_slug === studioSlug) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking cliente access:', error);
    return false;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};