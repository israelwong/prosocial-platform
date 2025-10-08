import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rutas que requieren autenticación
  const protectedRoutes = ["/admin", "/agente"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  
  // Verificar si es una ruta de studio dinámica [slug]
  const isStudioRoute = pathname.match(/^\/([a-zA-Z0-9-]+)(\/.*)?$/);
  const isStudioProtected = isStudioRoute && !isReservedPath(pathname);

  if (isProtectedRoute || isStudioProtected) {
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

  // Rutas reservadas para sistema
  const reservedPaths = [
    "/admin",
    "/agente",
    "/api",
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
    "/protected",
    "/about",
    "/pricing",
    "/contact",
    "/features",
    "/blog",
    "/help",
    "/docs",
    "/demo",
    "/terms",
    "/privacy",
    "/_next",
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
  ];

  // Función para verificar rutas reservadas
  const isReservedPath = (path: string) => {
    return reservedPaths.some((reserved) => {
      // Para rutas exactas como /demo, solo coincidir si es exacto o si empieza con /demo/
      if (reserved === "/demo") {
        return path === "/demo" || path.startsWith("/demo/");
      }
      return path.startsWith(reserved);
    });
  };

  // Si es /[slug] o /[slug]/[...path] y no es ruta reservada → Rewrite a /studio/[slug][...path]
  // IMPORTANTE: Evitar bucle infinito - NO reescribir si ya empieza con /studio/
  const slugMatch = pathname.match(/^\/([a-zA-Z0-9-]+)(\/.*)?$/);
  if (slugMatch && pathname !== "/" && !pathname.startsWith("/studio/") && !isReservedPath(pathname)) {
    const [, slug, subPath = ""] = slugMatch;
    const studioPath = `/studio/${slug}${subPath}`;
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
      // Suscriptor puede acceder a rutas de studio dinámicas [slug]
      // Verificar si es una ruta de studio (no reservada)
      const isStudioRoute = pathname.match(/^\/([a-zA-Z0-9-]+)(\/.*)?$/);
      const reservedPaths = ["/admin", "/agente", "/api", "/login", "/sign-up", "/signin", "/signup", "/forgot-password", "/update-password", "/error", "/redirect", "/sign-up-success", "/complete-profile", "/confirm", "/unauthorized", "/protected", "/about", "/pricing", "/contact", "/features", "/blog", "/help", "/docs", "/demo", "/terms", "/privacy", "/_next", "/favicon.ico", "/robots.txt", "/sitemap.xml"];
      const isReserved = reservedPaths.some(path => pathname.startsWith(path));
      return isStudioRoute && !isReserved;

    default:
      return false;
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};