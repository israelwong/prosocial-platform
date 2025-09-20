'use client';

import React from 'react';
import { SectionLayout } from '@/components/layouts/section-layout';
import { NavigationItem } from '@/components/ui/section-navigation';
import { useParams } from 'next/navigation';
import {
    User,
    Phone,
    Clock,
    Share2,
    Save
} from 'lucide-react';

const navigationItems: NavigationItem[] = [
    {
        name: 'Identidad',
        href: '/studio/[slug]/configuracion/cuenta/identidad',
        icon: User,
        description: 'Información general del negocio, logos y branding'
    },
    {
        name: 'Contacto',
        href: '/studio/[slug]/configuracion/cuenta/contacto',
        icon: Phone,
        description: 'Teléfonos, dirección y página web'
    },
    {
        name: 'Horarios',
        href: '/studio/[slug]/configuracion/cuenta/horarios',
        icon: Clock,
        description: 'Horarios de atención al cliente'
    },
    {
        name: 'Redes Sociales',
        href: '/studio/[slug]/configuracion/cuenta/redes-sociales',
        icon: Share2,
        description: 'Enlaces a tus redes sociales'
    }
];

export default function CuentaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const params = useParams();
    const slug = params.slug as string;

    // Reemplazar [slug] con el slug real en las rutas
    const navigationItemsWithSlug = navigationItems.map(item => ({
        ...item,
        href: item.href.replace('[slug]', slug)
    }));

    const handleSave = () => {
        // TODO: Implementar guardado global
        console.log('Guardando configuración de cuenta');
    };

    return (
        <SectionLayout
            title="Cuenta"
            description="Configuración de identidad y contacto del estudio"
            navigationItems={navigationItemsWithSlug}
            actionButton={{
                label: "Guardar Cambios",
                onClick: handleSave,
                icon: Save
            }}
        >
            {children}
        </SectionLayout>
    );
}
