'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { obtenerCatalogo } from '@/lib/actions/studio/builder/catalogo/items.actions';
import { obtenerConfiguracionPrecios } from '@/lib/actions/studio/builder/catalogo/utilidad.actions';
import { ItemsList } from './ItemsList';
import { CatalogoSkeleton } from './CatalogoSkeleton';
import type { SeccionData } from '@/lib/actions/schemas/catalogo-schemas';
import type { ConfiguracionPrecios } from '@/lib/utils/calcular-precio';

interface ItemsTabProps {
    studioSlug: string;
}

export function ItemsTab({ studioSlug }: ItemsTabProps) {
    const [loading, setLoading] = useState(true);
    const [catalogo, setCatalogo] = useState<SeccionData[]>([]);
    const [studioConfig, setStudioConfig] = useState<ConfiguracionPrecios | null>(null);

    useEffect(() => {
        cargarDatos();
    }, [studioSlug]);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            // Cargar catálogo y configuración en paralelo
            const [resultCatalogo, config] = await Promise.all([
                obtenerCatalogo(studioSlug),
                obtenerConfiguracionPrecios(studioSlug),
            ]);

            if (resultCatalogo.success && resultCatalogo.data) {
                setCatalogo(resultCatalogo.data);
            }

            if (config) {
                // El action retorna decimales como strings (ej: "0.30" para 30%)
                // Convertir a número decimal directamente
                setStudioConfig({
                    utilidad_servicio: Number(config.utilidad_servicio),
                    utilidad_producto: Number(config.utilidad_producto),
                    sobreprecio: Number(config.sobreprecio),
                    comision_venta: Number(config.comision_venta),
                });
            }
        } catch (error) {
            console.error('Error cargando datos:', error);
            toast.error('Error al cargar el catálogo');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <CatalogoSkeleton />;
    }

    if (!studioConfig) {
        return (
            <div className="text-center py-12">
                <p className="text-zinc-400">Error al cargar la configuración de precios</p>
                <button
                    onClick={cargarDatos}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Reintentar
                </button>
            </div>
        );
    }

    return (
        <ItemsList
            studioSlug={studioSlug}
            initialCatalogo={catalogo}
            onCatalogoChange={setCatalogo}
            studioConfig={studioConfig}
        />
    );
}
