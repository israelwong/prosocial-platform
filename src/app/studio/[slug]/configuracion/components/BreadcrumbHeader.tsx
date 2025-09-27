'use client';

import React from 'react';
import { usePathname, useParams } from 'next/navigation';
import { ZenSidebarTrigger } from '@/components/ui/zen';
import Link from 'next/link';

interface BreadcrumbItem {
    label: string;
    href?: string;
    active: boolean;
}

interface BreadcrumbHeaderProps {
    className?: string;
}

export function BreadcrumbHeader({ className }: BreadcrumbHeaderProps) {
    const pathname = usePathname();
    const params = useParams();
    const studioSlug = params.slug as string;

    // Función para generar breadcrumb basado en la ruta
    const generateBreadcrumb = (): BreadcrumbItem[] => {
        const segments = pathname.split('/').filter(Boolean);
        const breadcrumb: BreadcrumbItem[] = [];

        // Función para formatear segmentos automáticamente
        const formatSegment = (segment: string): string => {
            // Palabras que deben permanecer en minúsculas (excepto la primera)
            const lowercaseWords = ['de', 'y', 'en', 'con', 'para', 'por', 'del', 'la', 'el', 'los', 'las'];

            return segment
                .split('-')
                .map((word, index) => {
                    const lowerWord = word.toLowerCase();

                    // Si es la primera palabra o no está en la lista de minúsculas, capitalizar
                    if (index === 0 || !lowercaseWords.includes(lowerWord)) {
                        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                    }

                    // Mantener en minúsculas las palabras especiales
                    return lowerWord;
                })
                .join(' ');
        };

        // Encontrar el índice de 'configuracion' para empezar a construir el breadcrumb
        const configIndex = segments.findIndex(seg => seg === 'configuracion');

        if (configIndex !== -1) {
            // Siempre empezar con "Configuración"
            breadcrumb.push({
                label: 'Configuración',
                href: `/studio/${studioSlug}/configuracion`,
                active: false
            });

            // Procesar segmentos después de "configuracion"
            for (let i = configIndex + 1; i < segments.length; i++) {
                const segment = segments[i];
                const label = formatSegment(segment);
                const isLast = i === segments.length - 1;

                // Construir el href acumulativo
                const currentHrefSegments = segments.slice(0, i + 1);
                const currentHref = `/${currentHrefSegments.join('/')}`;

                breadcrumb.push({
                    label,
                    href: currentHref,
                    active: isLast
                });
            }
        } else {
            // Si no estamos en configuración, solo mostrar el segmento actual si existe
            if (segments.length > 0) {
                const lastSegment = segments[segments.length - 1];
                const label = formatSegment(lastSegment);
                breadcrumb.push({ label, active: true });
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
                    <React.Fragment key={item.label}>
                        {item.href && !item.active ? (
                            <Link href={item.href} className="hover:text-zinc-200 transition-colors">
                                {item.label}
                            </Link>
                        ) : (
                            <span className={item.active ? "text-white" : ""}>
                                {item.label}
                            </span>
                        )}
                        {index < breadcrumbItems.length - 1 && (
                            <span>/</span>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
