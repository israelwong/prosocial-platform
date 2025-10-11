'use client';

import React from 'react';
import {
    ZenSidebar, ZenSidebarContent, ZenSidebarHeader, ZenSidebarFooter, ZenSidebarMenu,
    ZenSidebarMenuItem, ZenButton, useZenSidebar
} from '@/components/ui/zen';
import { StudioHeaderModal } from '../../components/StudioHeaderModal';
import { ActiveLink } from '../../components/ActiveLink';
import { LogoutButton } from '@/components/auth/logout-button';
import {
    Star, Phone, Clock, Zap, HelpCircle, ShoppingCart, Search, Camera, X, Home, CreditCard, File, User, Rows2, ShoppingBag,
} from 'lucide-react';

interface StudioBuilderSidebarProps {
    className?: string;
    studioSlug: string;
}

export function StudioBuilderSidebar({ className, studioSlug }: StudioBuilderSidebarProps) {
    console.log('🔍 StudioBuilderSidebar - studioSlug recibido:', studioSlug);
    const { isOpen, toggleSidebar } = useZenSidebar();

    // Datos mock para el sidebar (en una implementación real, estos vendrían de props o context)
    const studio = {
        id: 'temp-id',
        studio_name: 'Mi Estudio',
        slug: studioSlug
    };

    // Configuración de navegación específica para Studio Builder
    const builderNavItems = [
        {
            id: 'studio',
            title: 'Studio',
            icon: Camera,
            items: [
                { id: 'identidad', name: 'Identidad', href: `/identidad`, icon: Star },
                { id: 'principal', name: 'Principal', href: `/principal`, icon: Home },
                //promociones hero
                // { id: 'faq', name: 'Preguntas frecuentes', href: `/faq`, icon: HelpCircle },
                // { id: 'ventajas', name: 'Ventajas competitivas', href: `/ventajas-competitivas`, icon: ShoppingCart },
                { id: 'promociones', name: 'Promociones', href: `/promociones`, icon: Zap },
                { id: 'portafolio', name: 'Portafolio', href: `/portafolio`, icon: Rows2 },
                { id: 'catalogo', name: 'Catálogo', href: `/catalogo`, icon: ShoppingBag },
                { id: 'contacto', name: 'Contacto', href: `/contacto`, icon: Phone },

                { id: 'zona-pago', name: 'Zona de pago', href: `/zona-pago`, icon: CreditCard },
                { id: 'cotizaciones', name: 'Cotizaciones', href: `/cotizaciones`, icon: File },
                { id: 'portal-cliente', name: 'Portal cliente', href: `/portal-cliente`, icon: User },

            ],
        },
    ];

    return (
        <ZenSidebar className={`${className} ${isOpen ? '' : 'hidden lg:block'}`}>
            <ZenSidebarHeader>
                <div className="flex items-center justify-between">
                    <StudioHeaderModal studioData={studio} />
                    <ZenButton
                        variant="ghost"
                        size="sm"
                        onClick={toggleSidebar}
                        className="lg:hidden p-2 text-zinc-400 hover:text-zinc-200"
                    >
                        <X className="h-4 w-4" />
                    </ZenButton>
                </div>
            </ZenSidebarHeader>

            <ZenSidebarContent className="px-4">
                <ZenSidebarMenu>
                    {/* Sección Studio Builder */}
                    <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Studio Builder</div>

                    {builderNavItems.map(group => (
                        <div key={group.id}>
                            {group.items.map(item => (
                                <ZenSidebarMenuItem key={item.id}>
                                    <ActiveLink href={`/${studioSlug}/studio/builder${item.href}`}>
                                        <item.icon className="w-4 h-4" />
                                        <span>{item.name}</span>
                                    </ActiveLink>
                                </ZenSidebarMenuItem>
                            ))}
                        </div>
                    ))}
                </ZenSidebarMenu>
            </ZenSidebarContent>

            <ZenSidebarFooter>
                <ZenSidebarMenu>
                    <ZenSidebarMenuItem>
                        <LogoutButton />
                    </ZenSidebarMenuItem>
                </ZenSidebarMenu>
            </ZenSidebarFooter>
        </ZenSidebar>
    );
}
