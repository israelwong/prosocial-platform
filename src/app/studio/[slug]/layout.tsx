'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Kanban,
    Calendar,
    Users,
    DollarSign,
    Settings,
    User,
    CreditCard,
    Building2,
    Package,
    Gift,
    UserCheck,
    Wallet,
    Zap,
    Bell,
    ChevronDown
} from 'lucide-react';

// Datos demo hardcodeados
const demoStudio = {
    id: 'demo-studio',
    name: 'Studio Demo',
    slug: 'demo-studio',
    logo: '/logo-demo.png'
};

const navigationItems = [
    {
        title: 'DASHBOARD',
        items: [
            { name: 'Dashboard', href: '/studio/demo-studio/dashboard', icon: LayoutDashboard },
            { name: 'Kanban', href: '/studio/demo-studio/kanban', icon: Kanban },
            { name: 'Agenda', href: '/studio/demo-studio/agenda', icon: Calendar },
            { name: 'Contactos', href: '/studio/demo-studio/contactos', icon: Users },
            { name: 'Finanzas', href: '/studio/demo-studio/finanzas', icon: DollarSign }
        ]
    },
    {
        title: 'CONFIGURACIÓN',
        items: [
            { name: 'Cuenta', href: '/studio/demo-studio/configuracion/cuenta', icon: User },
            { name: 'Suscripción', href: '/studio/demo-studio/configuracion/suscripcion', icon: CreditCard },
            { name: 'Negocio', href: '/studio/demo-studio/configuracion/negocio', icon: Building2 },
            { name: 'Catálogo', href: '/studio/demo-studio/configuracion/catalogo', icon: Package },
            { name: 'Paquetes', href: '/studio/demo-studio/configuracion/paquetes', icon: Gift },
            { name: 'Personal', href: '/studio/demo-studio/configuracion/personal', icon: UserCheck },
            { name: 'Pagos', href: '/studio/demo-studio/configuracion/pagos', icon: Wallet },
            { name: 'Integraciones', href: '/studio/demo-studio/configuracion/integraciones', icon: Zap }
        ]
    }
];

export default function StudioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const isActiveLink = (href: string) => {
        if (!pathname) return false;
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <div className="min-h-screen bg-zinc-950">
            {/* Navbar Superior */}
            <nav className="bg-zinc-900 border-b border-zinc-800 px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo + Nombre Estudio */}
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">S</span>
                        </div>
                        <h1 className="text-xl font-bold text-white">{demoStudio.name}</h1>
                    </div>

                    {/* Notificaciones + Usuario Menu */}
                    <div className="flex items-center space-x-4">
                        {/* Notificaciones */}
                        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
                            <Bell className="h-5 w-5" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                        </button>

                        {/* Usuario Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                className="flex items-center space-x-2 p-2 text-zinc-400 hover:text-white transition-colors"
                            >
                                <div className="w-8 h-8 bg-zinc-700 rounded-full flex items-center justify-center">
                                    <User className="h-4 w-4" />
                                </div>
                                <span className="text-sm">Usuario Demo</span>
                                <ChevronDown className="h-4 w-4" />
                            </button>

                            {/* Dropdown Menu */}
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50">
                                    <div className="py-1">
                                        <Link
                                            href="/studio/demo-studio/dashboard"
                                            className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                        >
                                            <LayoutDashboard className="h-4 w-4 mr-3" />
                                            Dashboard
                                        </Link>
                                        <Link
                                            href="/studio/demo-studio/configuracion/cuenta"
                                            className="flex items-center px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white"
                                        >
                                            <Settings className="h-4 w-4 mr-3" />
                                            Configurar
                                        </Link>
                                        <hr className="my-1 border-zinc-700" />
                                        <button className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700 hover:text-white">
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex">
                {/* Sidebar Lateral */}
                <aside className="w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen">
                    <div className="p-4">
                        {navigationItems.map((section) => (
                            <div key={section.title} className="mb-6">
                                <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                                    {section.title}
                                </h3>
                                <nav className="space-y-1">
                                    {section.items.map((item) => {
                                        const isActive = isActiveLink(item.href);
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={cn(
                                                    "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                                                    isActive
                                                        ? "bg-blue-600 text-white"
                                                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                                )}
                                            >
                                                <item.icon className="h-4 w-4 mr-3" />
                                                {item.name}
                                            </Link>
                                        );
                                    })}
                                </nav>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Contenido Principal */}
                <main className="flex-1 p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}