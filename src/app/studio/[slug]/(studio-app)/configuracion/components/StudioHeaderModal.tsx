'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ChevronDown, LayoutDashboard, Settings, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ZenSidebarMenuButton } from '@/components/ui/zen';
import { useStudioData } from '@/hooks/useStudioData';

interface StudioHeaderModalProps {
    className?: string;
}

export function StudioHeaderModal({ className }: StudioHeaderModalProps) {
    // className is used for potential future styling
    const params = useParams();
    const slug = params.slug as string;

    // Usar hook para datos del studio
    const {
        identidadData,
        loading,
        error
    } = useStudioData({
        studioSlug: slug,
        onUpdate: (data) => {
            console.log('🎯 [STUDIO_HEADER] Updated with new studio data:', data);
        }
    });


    // Función para renderizar el logo/isotipo
    const renderLogo = () => {
        if (loading) {
            return (
                <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center animate-pulse">
                    <span className="text-zinc-400 text-xs">...</span>
                </div>
            );
        }

        // Si hay isotipo, mostrarlo
        if (identidadData?.isotipo_url) {
            return (
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                        src={identidadData.isotipo_url}
                        alt="Isotipo"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            // Fallback si falla la carga de imagen
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) {
                                fallback.classList.remove('hidden');
                                fallback.classList.add('flex');
                            }
                        }}
                    />
                    <div className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center hidden">
                        <span className="text-white font-bold text-sm">
                            {identidadData.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
            );
        }

        // Si hay logo, usar la primera letra del nombre
        if (identidadData?.logoUrl) {
            return (
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                    <Image
                        src={identidadData.logoUrl}
                        alt="Logo"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                            // Fallback si falla la carga de imagen
                            e.currentTarget.style.display = 'none';
                            const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                            if (fallback) {
                                fallback.classList.remove('hidden');
                                fallback.classList.add('flex');
                            }
                        }}
                    />
                    <div className="w-8 h-8 bg-blue-600 rounded-lg items-center justify-center hidden">
                        <span className="text-white font-bold text-sm">
                            {identidadData.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                </div>
            );
        }

        // Fallback: usar la primera letra del nombre
        return (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                    {identidadData?.name?.charAt(0).toUpperCase() || 'S'}
                </span>
            </div>
        );
    };

    // Función para renderizar el nombre del studio
    const renderStudioName = () => {
        if (loading) {
            return (
                <div className="space-y-1">
                    <div className="h-4 w-24 bg-zinc-700 rounded animate-pulse"></div>
                    <div className="h-3 w-16 bg-zinc-700 rounded animate-pulse"></div>
                </div>
            );
        }

        return (
            <div className="text-left">
                <div className="text-sm font-semibold text-white">
                    {identidadData?.name || 'Studio'}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-zinc-400">Personal</span>
                    <div
                        className={`w-2 h-2 rounded-full ${loading ? 'bg-yellow-500' : error ? 'bg-red-500' : 'bg-green-500'
                            }`}
                        title={
                            loading
                                ? 'Cargando datos...'
                                : error
                                    ? 'Error al cargar datos'
                                    : 'Datos cargados correctamente'
                        }
                    />
                </div>
            </div>
        );
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <ZenSidebarMenuButton className="w-full justify-start gap-3 p-3 hover:bg-zinc-800">
                    {renderLogo()}
                    {renderStudioName()}
                    <ChevronDown className="ml-auto h-4 w-4 text-zinc-400" />
                </ZenSidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-56 bg-zinc-800 border-zinc-700"
                align="start"
                side="right"
            >
                <div className="px-2 py-1.5">
                    <div className="text-xs font-medium text-zinc-400">Teams</div>
                </div>
                <DropdownMenuSeparator className="bg-zinc-700" />

                <DropdownMenuItem asChild>
                    <Link
                        href={`/${slug}/dashboard`}
                        className="flex items-center gap-3 px-2 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700"
                    >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                    <Link
                        href={`/${slug}/configuracion`}
                        className="flex items-center gap-3 px-2 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700"
                    >
                        <Settings className="h-4 w-4" />
                        Configurar
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="bg-zinc-700" />

                <DropdownMenuItem className="flex items-center gap-3 px-2 py-1.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-700">
                    <LogOut className="h-4 w-4" />
                    Cerrar Sesión
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
