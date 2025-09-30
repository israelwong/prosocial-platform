import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";
import { DynamicMetadata } from "@/components/platform/DynamicMetadata";
// import { PlatformConfigDebug } from "@/components/platform/PlatformConfigDebug";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zen Universe",
  description: "Plataforma SaaS multi-tenant para gestión de estudios de fotografía con sistema de leads, campañas y agentes comerciales",
  keywords: ["CRM para estudios"],
  authors: [{ name: "Israel Wong" }],
  icons: {
    icon: "https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg",
    shortcut: "https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg",
    apple: "https://fhwfdwrrnwkbnwxabkcq.supabase.co/storage/v1/object/public/ProSocialPlatform/platform/isotipo.svg",
  },
  openGraph: {
    title: "Zen Universe",
    description: "Plataforma SaaS multi-tenant para gestión de estudios de fotografía",
    siteName: "Zen Universe",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Zen Universe",
    description: "Plataforma SaaS multi-tenant para gestión de estudios de fotografía",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <DynamicMetadata />
            {children}
            {/* <PlatformConfigDebug /> */}
          </AuthProvider>
          <Toaster
            position="top-right"
            expand={false}
            richColors
            closeButton
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
