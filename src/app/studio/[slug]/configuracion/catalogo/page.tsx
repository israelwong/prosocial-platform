'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CatalogoList, CatalogoSkeleton } from './components';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import { obtenerCatalogo } from '@/lib/actions/studio/config/catalogo.actions';
import type { SeccionData } from '@/lib/actions/schemas/catalogo-schemas';

export default function CatalogoPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [catalogo, setCatalogo] = useState<SeccionData[]>([]);

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const result = await obtenerCatalogo(slug);
                if (result.success && result.data) {
                    setCatalogo(result.data);
                }
            } catch (error) {
                console.error('Error cargando catálogo:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            cargarDatos();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="p-6 space-y-6 max-w-screen-xl mx-auto mb-16">
                <HeaderNavigation
                    title="Catálogo de Servicios"
                    description="Gestiona tu catálogo de servicios organizados por secciones y categorías"
                />
                <CatalogoSkeleton />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto mb-16">
            <HeaderNavigation
                title="Catálogo de Servicios"
                description="Gestiona tu catálogo de servicios organizados por secciones y categorías"
            />

            {/* Contenido principal con ZEN Design System */}
            <CatalogoList
                studioSlug={slug}
                initialCatalogo={catalogo}
                onCatalogoChange={setCatalogo}
            />
        </div>
    );
}