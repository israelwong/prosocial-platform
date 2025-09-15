'use client';

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState<string[]>(['Gestión', 'Configuración']); // Gestión y Configuración expandidos por defecto

    const toggleMenu = (menuName: string) => {
        setExpandedMenus(prev =>
            prev.includes(menuName)
                ? prev.filter(name => name !== menuName)
                : [...prev, menuName]
        );
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Navbar superior */}
            <div>
                <Navbar onMenuClick={() => setSidebarOpen(true)} />
            </div>

            {/* Contenido principal con sidebar */}
            <div className="flex flex-1 min-h-0">
                <Sidebar
                    isOpen={sidebarOpen}
                    onClose={() => setSidebarOpen(false)}
                    expandedMenus={expandedMenus}
                    onToggleMenu={toggleMenu}
                />

                {/* Main content */}
                <main className="flex-1 bg-zinc-950">
                    <div className="p-4 lg:p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}