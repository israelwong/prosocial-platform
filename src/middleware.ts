import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Rutas reservadas para marketing (no redirigir)
  const marketingRoutes = [
    '/about',
    '/pricing',
    '/contact',
    '/features',
    '/blog',
    '/auth',
    '/admin',
    '/agente',
    '/studio'
  ];

  // Si es una ruta de marketing o ya tiene prefijo, permitir
  if (marketingRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Si es /[slug] y no es una ruta reservada, redirigir a /studio/[slug]
  if (pathname.match(/^\/[a-zA-Z0-9-]+$/) && pathname !== '/') {
    const slug = pathname.slice(1);
    return NextResponse.redirect(new URL(`/studio/${slug}`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
