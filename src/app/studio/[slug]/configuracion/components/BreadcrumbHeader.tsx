'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { ZenSidebarTrigger } from '@/components/ui/zen';

interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

interface BreadcrumbHeaderProps {
    className?: string;
}

export function BreadcrumbHeader({ className }: BreadcrumbHeaderProps) {
    const pathname = usePathname();

    // Función para generar breadcrumb basado en la ruta
    const generateBreadcrumb = (): BreadcrumbItem[] => {
        const segments = pathname.split('/').filter(Boolean);
        const breadcrumb: BreadcrumbItem[] = [];

        // Siempre empezar con "Configuración"
        breadcrumb.push({
            label: 'Configuración',
            href: `/studio/${segments[1]}/configuracion`,
            active: false
        });

        // Mapear segmentos a labels legibles
        const segmentMap: Record<string, string> = {
            'estudio': 'Estudio',
            'identidad': 'Identidad',
            'contacto': 'Contacto',
            'ubicacion': 'Ubicación',
            'catalogo': 'Catálogo',
            'servicios': 'Servicios',
            'paquetes': 'Paquetes',
            'especialidades': 'Especialidades',
            'cuenta': 'Cuenta',
            'perfil': 'Perfil',
            'suscripcion': 'Suscripción',
            'notificaciones': 'Notificaciones',
            'avanzado': 'Avanzado',
            'integraciones': 'Integraciones',
            'seguridad': 'Seguridad',
            'preferencias': 'Preferencias'
        };

        // Procesar segmentos después de "configuracion"
        const configIndex = segments.findIndex(seg => seg === 'configuracion');
        if (configIndex !== -1) {
            for (let i = configIndex + 1; i < segments.length; i++) {
                const segment = segments[i];
                const label = segmentMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
                const isLast = i === segments.length - 1;

                breadcrumb.push({
                    label,
                    active: isLast
                });
            }
        }

        return breadcrumb;
    };

    const breadcrumbItems = generateBreadcrumb();

    return (
        <div className={`flex items-center gap-4 mb-4 ${className}`}>
            <ZenSidebarTrigger />
            <div className="flex items-center gap-2 text-sm text-zinc-400">
                {breadcrumbItems.map((item, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <span>/</span>}
                        <span className={item.active ? 'text-white' : 'text-zinc-400'}>
                            {item.label}
                        </span>
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
