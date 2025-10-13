'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Home, Grid3X3, Store, Phone } from 'lucide-react';

interface ProfileHeaderProps {
    data?: {
        studio_name?: string;
        slogan?: string | null;
        logo_url?: string | null;
    };
    loading?: boolean;
    activeSection?: string;
}

/**
 * ProfileHeader - Componente unificado para header del perfil
 * Maneja transición fluida entre estado inicial (centrado) y compacto (horizontal)
 * 
 * Estados:
 * - Inicial: Logo centrado, nombre y slogan debajo, navegación completa
 * - Compacto: Logo + nombre + slogan horizontal, navegación solo iconos
 */
export function ProfileHeader({ data, loading = false, activeSection }: ProfileHeaderProps) {
    const [isCompact, setIsCompact] = useState(false);
    const studioData = data || {};

    // Detectar scroll para cambiar estado
    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            // Cambiar a compacto después de 100px de scroll
            setIsCompact(scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Solo mostrar header si hay datos reales o está cargando
    const hasData = studioData.studio_name || studioData.logo_url || loading;

    if (!hasData) {
        return null;
    }

    const navItems = [
        { id: 'inicio', label: 'Inicio', icon: Home },
        { id: 'portafolio', label: 'Portafolio', icon: Grid3X3 },
        { id: 'catalogo', label: 'Catálogo', icon: Store },
        { id: 'contacto', label: 'Contacto', icon: Phone }
    ];

    return (
        <div className={`sticky top-0 z-10 bg-zinc-900/80 backdrop-blur-md w-full transition-all duration-500 ease-in-out ${
            isCompact ? 'px-4 py-3' : 'px-4 py-6'
        }`}>
            {isCompact ? (
                // Estado compacto: Layout horizontal
                <div className="flex items-center justify-between">
                    {/* Logo + Info horizontal */}
                    <div className="flex items-center space-x-3">
                        {/* Logo compacto */}
                        <div className="w-10 h-10 bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 transition-all duration-300">
                            {loading ? (
                                <div className="w-5 h-5 bg-zinc-600 rounded-lg animate-pulse"></div>
                            ) : studioData.logo_url ? (
                                <Image
                                    src={studioData.logo_url}
                                    alt="Logo"
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-5 h-5 bg-zinc-500 rounded-lg"></div>
                            )}
                        </div>

                        {/* Info horizontal */}
                        <div className="flex flex-col">
                            {loading ? (
                                <>
                                    <div className="h-4 bg-zinc-700 rounded animate-pulse mb-1 w-24"></div>
                                    <div className="h-3 bg-zinc-700 rounded animate-pulse w-32"></div>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-white font-semibold text-sm transition-all duration-300">
                                        {studioData.studio_name}
                                    </h1>
                                    {studioData.slogan && (
                                        <p className="text-zinc-400 text-xs transition-all duration-300">
                                            {studioData.slogan}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Navegación compacta (solo iconos) */}
                    <nav className="flex items-center space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    className={`p-2 rounded-lg transition-all duration-300 ${
                                        isActive
                                            ? 'text-blue-400 bg-blue-400/10'
                                            : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
                                    }`}
                                >
                                    <Icon className="h-4 w-4" />
                                </button>
                            );
                        })}
                    </nav>
                </div>
            ) : (
                // Estado inicial: Layout centrado vertical
                <div className="flex flex-col items-center space-y-4">
                    {/* Logo centrado */}
                    <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 transition-all duration-500">
                        {loading ? (
                            <div className="w-8 h-8 bg-zinc-600 rounded-lg animate-pulse"></div>
                        ) : studioData.logo_url ? (
                            <Image
                                src={studioData.logo_url}
                                alt="Logo"
                                width={64}
                                height={64}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 bg-zinc-500 rounded-lg"></div>
                        )}
                    </div>

                    {/* Info centrada */}
                    <div className="text-center">
                        {loading ? (
                            <>
                                <div className="h-5 bg-zinc-700 rounded animate-pulse mb-2 w-40 mx-auto"></div>
                                <div className="h-4 bg-zinc-700 rounded animate-pulse w-32 mx-auto"></div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-white font-semibold text-xl mb-1 transition-all duration-500">
                                    {studioData.studio_name}
                                </h1>
                                {studioData.slogan && (
                                    <p className="text-zinc-400 text-sm transition-all duration-500">
                                        {studioData.slogan}
                                    </p>
                                )}
                            </>
                        )}
                    </div>

                    {/* Navegación completa */}
                    <nav className="flex w-full border-t border-zinc-800 pt-4">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;

                            return (
                                <div key={item.id} className={`
                                    flex-1 flex flex-col items-center justify-center gap-1 px-2 py-3 text-sm font-medium
                                    transition-all duration-300
                                    ${isActive
                                        ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5'
                                        : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
                                    }
                                `}>
                                    <Icon className="h-5 w-5" />
                                    <span className="text-xs">{item.label}</span>
                                </div>
                            );
                        })}
                    </nav>
                </div>
            )}
        </div>
    );
}
