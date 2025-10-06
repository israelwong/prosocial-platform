'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CatalogoList, CatalogoSkeleton } from '../components';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import { obtenerCatalogo } from '@/lib/actions/studio/config/catalogo.actions';
import { obtenerConfiguracionPrecios } from '@/lib/actions/studio/config/configuracion-precios.actions';
import type { SeccionData } from '@/lib/actions/schemas/catalogo-schemas';
import type { PricingConfig } from '@/lib/utils/pricing';

export default function CatalogoPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [catalogo, setCatalogo] = useState<SeccionData[]>([]);
    const [studioConfig, setStudioConfig] = useState<PricingConfig | null>(null);

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);

                // Cargar catálogo
                const resultCatalogo = await obtenerCatalogo(slug);
                if (resultCatalogo.success && resultCatalogo.data) {
                    setCatalogo(resultCatalogo.data);
                }

                // Cargar configuración de pricing
                const config = await obtenerConfiguracionPrecios(slug);
                if (config) {
                    const studioConfigData = {
                        utilidad_servicio: Number(config.utilidad_servicio),
                        utilidad_producto: Number(config.utilidad_producto),
                        sobreprecio: Number(config.sobreprecio),
                        comision_venta: Number(config.comision_venta),
                    };
                    setStudioConfig(studioConfigData);
                }
            } catch (error) {
                console.error('Error cargando datos:', error);
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
                title="Servicios"
                description="Gestiona tu catálogo de servicios organizados por secciones y categorías"
            />

            {/* Contenido principal con ZEN Design System */}
            {studioConfig ? (
                <CatalogoList
                    studioSlug={slug}
                    initialCatalogo={catalogo}
                    onCatalogoChange={setCatalogo}
                    studioConfig={studioConfig}
                />
            ) : (
                <div className="text-center py-12">
                    <p className="text-zinc-400">Error al cargar la configuración de precios</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Recargar
                    </button>
                </div>
            )}
        </div>
    );
}
