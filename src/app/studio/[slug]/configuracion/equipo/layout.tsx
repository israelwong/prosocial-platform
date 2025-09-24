'use client';

import React from 'react';
import { SectionNavigation } from '@/components/ui/section-navigation';
import { Users, Building2 } from 'lucide-react';
import { useParams } from 'next/navigation';

interface PersonalLayoutProps {
    children: React.ReactNode;
}

export default function PersonalLayout({ children }: PersonalLayoutProps) {
    const params = useParams();
    const slug = params.slug as string;

    // Subsecciones de navegación
    const navigationItems = [
        {
            name: 'Empleados',
            href: `/studio/${slug}/configuracion/negocio/personal/empleados`,
            icon: Users,
            description: 'Administra tu equipo de trabajo'
        },
        {
            name: 'Proveedores',
            href: `/studio/${slug}/configuracion/negocio/personal/proveedores`,
            icon: Building2,
            description: 'Gestiona tus proveedores y colaboradores'
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header con navegación de subsecciones */}
            <SectionNavigation
                title="Configuración Personal"
                description="Gestiona empleados y proveedores de tu estudio"
                navigationItems={navigationItems}
            />

            {/* Contenido de las subsecciones */}
            {children}
        </div>
    );
}
