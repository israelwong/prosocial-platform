'use client';

import React from 'react';

interface NavbarPreviewProps {
    activeSection?: string;
}

export function NavbarPreview({ activeSection }: NavbarPreviewProps) {
    const navItems = [
        { id: 'inicio', label: 'Inicio' },
        { id: 'portafolio', label: 'Portafolio' },
        { id: 'catalogo', label: 'Catálogo' },
        { id: 'contacto', label: 'Contacto' }
    ];

    return (
        <div className="border-t border-zinc-700 pt-4">
            <div className="flex justify-around">
                {navItems.map((item) => {
                    const isActive = activeSection === item.id;

                    return (
                        <div key={item.id} className="text-center">
                            <div className={`w-6 h-6 rounded mx-auto mb-1 ${isActive
                                    ? 'bg-blue-500'
                                    : 'bg-zinc-700'
                                }`}></div>
                            <span className={`text-xs ${isActive
                                    ? 'text-blue-400'
                                    : 'text-zinc-400'
                                }`}>
                                {item.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
