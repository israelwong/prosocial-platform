import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ProSocial Platform",
  description: "Plataforma SaaS para estudios de fotografía y video",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" style={{ backgroundColor: '#18181b', color: '#ffffff' }}>
      <body 
        className={inter.className} 
        style={{ 
          backgroundColor: '#18181b', 
          color: '#ffffff',
          margin: 0,
          padding: 0,
          minHeight: '100vh'
        }}
      >
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
