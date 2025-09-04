import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Skip middleware for API routes, static files, and auth pages
    if (
        pathname.startsWith("/api/") ||
        pathname.startsWith("/_next/") ||
        pathname.startsWith("/auth/") ||
        pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    // Extract studio slug from path: /[studioSlug]/...
    const studioSlugMatch = pathname.match(/^\/([^\/]+)/);
    const studioSlug = studioSlugMatch?.[1];

    // Root path - redirect to landing
    if (pathname === "/") {
        return NextResponse.next();
    }

    // Platform admin routes
    if (pathname.startsWith("/platform/")) {
        return NextResponse.next();
    }

    // Studio routes - validate studio exists
    if (studioSlug) {
        try {
            // TODO: Add studio validation logic here
            // const studio = await getStudioBySlug(studioSlug)
            // if (!studio) return NextResponse.redirect(new URL('/', request.url))

            // Add studio context to headers
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set("x-studio-slug", studioSlug);

            return NextResponse.next({
                request: {
                    headers: requestHeaders,
                },
            });
        } catch {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
