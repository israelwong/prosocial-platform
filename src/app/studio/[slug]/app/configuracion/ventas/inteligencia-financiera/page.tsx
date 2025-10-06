'use client';

import React, { useEffect, useState } from 'react';
import { ConfiguracionPreciosFormZen } from './components/ConfiguracionPreciosFormZen';
import { PreciosSkeleton } from './components/PreciosSkeleton';
import { obtenerConfiguracionPrecios } from '@/lib/actions/studio/config/configuracion-precios.actions';
import { type ConfiguracionPreciosData } from './types';
import { useParams } from 'next/navigation';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';

export default function ConfiguracionPreciosPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [initialData, setInitialData] = useState<{
    id: string;
    nombre: string;
    slug: string;
    utilidad_servicio: string;
    utilidad_producto: string;
    comision_venta: string;
    sobreprecio: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar configuración inicial
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await obtenerConfiguracionPrecios(slug);
        setInitialData(data);
      } catch (error) {
        console.error('Error cargando configuración:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    }
  }, [slug]);

  if (loading) {
    return <PreciosSkeleton />;
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
      {/* Formulario principal */}
      {initialData && (
        <>
          <HeaderNavigation
            title="Configuración de Precios"
            description="Define los porcentajes de utilidad, comisiones y configuraciones de precios para tu negocio"
          />

          <ConfiguracionPreciosFormZen
            studioSlug={slug}
            initialData={initialData}
            onUpdate={(data: ConfiguracionPreciosData) => {
              // Esta función se puede usar para actualizar el estado local si es necesario
              console.log('Configuración actualizada:', data);
            }}
          />

        </>
      )}
    </div>
  );
}
