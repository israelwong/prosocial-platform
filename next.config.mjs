/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "@supabase/supabase-js"],
  images: {
    domains: [
      "bgtapcutchryzhzooony.supabase.co",
      "fhwfdwrrnwkbnwxabkcq.supabase.co",
      "zen.pro",
    ],
  },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    NEXT_PUBLIC_DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  async rewrites() {
    return [
      // Reescritura para páginas públicas de studios
      // /demo-studio -> /studio/demo-studio
      {
        source: "/:slug",
        destination: "/studio/:slug",
        has: [
          {
            type: "header",
            key: "accept",
            value: "text/html.*",
          },
        ],
      },
      // Reescritura para rutas protegidas de studios
      // /demo-studio/dashboard -> /studio/demo-studio/dashboard
      {
        source: "/:slug/dashboard",
        destination: "/studio/:slug/dashboard",
      },
      // /demo-studio/configuracion -> /studio/demo-studio/configuracion
      {
        source: "/:slug/configuracion/:path*",
        destination: "/studio/:slug/configuracion/:path*",
      },
      // /demo-studio/manager -> /studio/demo-studio/manager
      {
        source: "/:slug/manager/:path*",
        destination: "/studio/:slug/manager/:path*",
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
