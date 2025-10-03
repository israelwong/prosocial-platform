'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, User, Settings, LogOut } from 'lucide-react';
import { BreadcrumbHeader } from './BreadcrumbHeader';
import { ZenButton, ZenAvatar, ZenAvatarFallback } from '@/components/ui/zen';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';

interface AppHeaderProps {
    studioSlug: string;
}

export function AppHeader({ studioSlug }: AppHeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-zinc-900/50 px-6 backdrop-blur-sm">
            <div className="flex items-center">
                <BreadcrumbHeader studioSlug={studioSlug} />
            </div>
            <div className="flex items-center gap-4">
                <ZenButton variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notificaciones</span>
                </ZenButton>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <ZenButton
                            variant="ghost"
                            className="relative h-8 w-8 rounded-full"
                        >
                            <ZenAvatar className="h-8 w-8">
                                <ZenAvatarFallback>UD</ZenAvatarFallback>
                            </ZenAvatar>
                        </ZenButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">Usuario Demo</p>
                                <p className="text-xs leading-none text-zinc-400">
                                    owner@demo-studio.com
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href={`/${studioSlug}/configuracion/global/cuenta/perfil`}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Configuración de Perfil</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Cerrar Sesión</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
