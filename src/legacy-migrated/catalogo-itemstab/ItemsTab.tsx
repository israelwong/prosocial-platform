'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { obtenerSeccionesConStats } from '@/lib/actions/studio/builder/catalogo';
import { obtenerConfiguracionPrecios } from '@/lib/actions/studio/builder/catalogo/utilidad.actions';
import { CatalogoContainer, CatalogoTabSkeletonContainer } from '../CatalogoTab';
import type { ConfiguracionPrecios } from '@/lib/actions/studio/builder/catalogo/calcular-precio';

interface ItemsTabProps {
    studioSlug: string;
    onNavigateToUtilidad?: () => void;
}

interface Categoria {
    id: string;
    nombre: string;
    servicios?: Servicio[];
}

interface Servicio {
    id: string;
    nombre: string;
    costo: number;
}

interface Seccion {
    id: string;
    name: string;
    order: number;
    createdAt: Date;
    categories?: Categoria[];
    items?: number;
    mediaSize?: number;
}

export function ItemsTab({ studioSlug, onNavigateToUtilidad }: ItemsTabProps) {
    const [loading, setLoading] = useState(true);
    const [secciones, setSecciones] = useState<Seccion[]>([]);
    const [studioConfig, setStudioConfig] = useState<ConfiguracionPrecios | null>(null);

    const cargarDatos = useCallback(async () => {
        try {
            setLoading(true);

            // Cargar secciones y configuración en paralelo
            const [resultSecciones, config] = await Promise.all([
                obtenerSeccionesConStats(studioSlug),
                obtenerConfiguracionPrecios(studioSlug),
            ]);

            if (resultSecciones.success && resultSecciones.data) {
                // Transformar datos de secciones al formato esperado
                const seccionesTransformadas = resultSecciones.data.map((seccion: {
                    id: string;
                    name: string;
                    order: number;
                    createdAt: Date;
                    totalCategorias?: number;
                    totalItems?: number;
                    mediaSize?: number;
                }) => ({
                    id: seccion.id,
                    name: seccion.name,
                    order: seccion.order,
                    createdAt: seccion.createdAt,
                    categories: seccion.totalCategorias ? Array(seccion.totalCategorias).fill(null) : [],
                    items: seccion.totalItems ?? 0,
                    mediaSize: seccion.mediaSize ?? 0,
                }));
                setSecciones(seccionesTransformadas);
            }

            if (config) {
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
    }, [studioSlug]);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    if (loading) {
        return <CatalogoTabSkeletonContainer />;
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
        <CatalogoContainer
            studioSlug={studioSlug}
            secciones={secciones}
            onNavigateToUtilidad={onNavigateToUtilidad}
        />
    );
}
