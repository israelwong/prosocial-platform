"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Gift,
    Users,
    BarChart3,
    Settings,
    Home
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DescuentosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const menuItems = [
        {
            title: "Dashboard",
            url: "/admin/descuentos",
            icon: Home,
        },
        {
            title: "Códigos Generales",
            url: "/admin/descuentos/general",
            icon: Gift,
        },
        {
            title: "Códigos de Agentes",
            url: "/admin/descuentos/agentes",
            icon: Users,
        },
        {
            title: "Reportes",
            url: "/admin/descuentos/reportes",
            icon: BarChart3,
        },
        {
            title: "Configuración",
            url: "/admin/descuentos/configuracion",
            icon: Settings,
        },
    ];

    const isActiveLink = (href: string) => {
        if (!pathname) return false;
        if (href === '/admin/descuentos') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Header de navegación */}
            <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white">Descuentos</h1>
                        <p className="text-zinc-400 text-sm">Gestiona códigos de descuento y promociones</p>
                    </div>
                </div>

                {/* Navegación horizontal */}
                <div className="flex gap-1 mt-4">
                    {menuItems.map((item) => {
                        const isActive = isActiveLink(item.url);
                        return (
                            <Link
                                key={item.title}
                                href={item.url}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-blue-600 text-white"
                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                )}
                            >
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Contenido principal */}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
