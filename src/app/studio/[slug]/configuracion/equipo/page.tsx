'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PersonalList, PersonalSkeletonZen } from './components';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import { obtenerPersonal } from '@/lib/actions/studio/config/personal.actions';
import type { PersonalData } from '@/lib/actions/schemas/personal-schemas';

export default function EquipoPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [personal, setPersonal] = useState<PersonalData[]>([]);

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const result = await obtenerPersonal(slug);
                if (result.success && result.data) {
                    setPersonal(result.data);
                }
            } catch (error) {
                console.error('Error cargando personal:', error);
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
            <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
                <HeaderNavigation
                    title="Personal del Estudio"
                    description="Gestiona tu equipo y colaboradores por categorías"
                />
                <PersonalSkeletonZen />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
            <HeaderNavigation
                title="Personal del Estudio"
                description="Gestiona tu equipo y colaboradores por categorías"
            />

            {/* Contenido principal con ZEN Design System */}
            <PersonalList
                studioSlug={slug}
                initialPersonal={personal}
                onPersonalChange={setPersonal}
            />
        </div>
    );
}
