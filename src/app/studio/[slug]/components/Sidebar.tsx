'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Kanban,
    Calendar,
    Users,
    DollarSign,
    User,
    CreditCard,
    Package,
    Gift,
    UserCheck,
    Wallet,
    Zap,
    Building2,
    Settings,
    Bell,
    Shield,
    FileText,
    Percent,
    Users2,
    CreditCard as BankIcon,
    Clock,
    Star,
    Zap as IntegrationsIcon
} from 'lucide-react';

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface NavigationSection {
    title: string;
    items: NavigationItem[];
}

interface SidebarProps {
    className?: string;
}

export function Sidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const params = useParams();
    const slug = params.slug as string;

    // Generar rutas dinámicas basadas en el slug
    const navigationItems: NavigationSection[] = [
        {
            title: 'DASHBOARD',
            items: [
                { name: 'Dashboard', href: `/studio/${slug}/dashboard`, icon: LayoutDashboard },
                { name: 'Kanban', href: `/studio/${slug}/kanban`, icon: Kanban },
                { name: 'Agenda', href: `/studio/${slug}/agenda`, icon: Calendar },
                { name: 'Contactos', href: `/studio/${slug}/contactos`, icon: Users },
                { name: 'Finanzas', href: `/studio/${slug}/finanzas`, icon: DollarSign }
            ]
        },
        {
            title: 'NEGOCIO',
            items: [
                { name: 'Identidad', href: `/studio/${slug}/configuracion/negocio/identidad`, icon: Building2 },
                { name: 'Contacto', href: `/studio/${slug}/configuracion/negocio/contacto`, icon: User },
                { name: 'Redes Sociales', href: `/studio/${slug}/configuracion/negocio/redes-sociales`, icon: Zap },
                { name: 'Horarios', href: `/studio/${slug}/configuracion/negocio/horarios`, icon: Clock },
                { name: 'Condiciones', href: `/studio/${slug}/configuracion/negocio/condiciones-comerciales`, icon: FileText },
                { name: 'Precios', href: `/studio/${slug}/configuracion/negocio/configuracion-precios`, icon: Percent },
                { name: 'Personal', href: `/studio/${slug}/configuracion/negocio/personal`, icon: Users2 },
                { name: 'Cuentas Bancarias', href: `/studio/${slug}/configuracion/negocio/cuentas-bancarias`, icon: BankIcon }
            ]
        },
        {
            title: 'CUENTA',
            items: [
                { name: 'Perfil', href: `/studio/${slug}/configuracion/cuenta/perfil`, icon: User },
                { name: 'Suscripción', href: `/studio/${slug}/configuracion/cuenta/suscripcion`, icon: CreditCard },
                { name: 'Notificaciones', href: `/studio/${slug}/configuracion/cuenta/notificaciones`, icon: Bell },
                { name: 'Seguridad', href: `/studio/${slug}/configuracion/cuenta/seguridad`, icon: Shield }
            ]
        },
        {
            title: 'CATÁLOGO',
            items: [
                { name: 'Servicios', href: `/studio/${slug}/configuracion/catalogo/servicios`, icon: Package },
                { name: 'Tipos de Evento', href: `/studio/${slug}/configuracion/catalogo/tipos-evento`, icon: Star },
                { name: 'Paquetes', href: `/studio/${slug}/configuracion/catalogo/paquetes`, icon: Gift },
                { name: 'Precios', href: `/studio/${slug}/configuracion/catalogo/precios`, icon: DollarSign }
            ]
        },
        {
            title: 'INTEGRACIONES',
            items: [
                { name: 'Stripe', href: `/studio/${slug}/configuracion/integraciones/stripe`, icon: CreditCard },
                { name: 'ManyChat', href: `/studio/${slug}/configuracion/integraciones/manychat`, icon: Zap },
                { name: 'Webhooks', href: `/studio/${slug}/configuracion/integraciones/webhooks`, icon: IntegrationsIcon }
            ]
        }
    ];

    const isActiveLink = (href: string) => {
        if (!pathname) return false;
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <aside className={`w-64 bg-zinc-900 border-r border-zinc-800 min-h-screen ${className || ''}`}>
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
    );
}
