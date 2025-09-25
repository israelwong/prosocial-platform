'use client';

import React, { useEffect, useState } from 'react';
import { ConfiguracionPreciosForm } from './components/ConfiguracionPreciosForm';
import { obtenerConfiguracionPrecios } from '@/lib/actions/studio/config/configuracion-precios.actions';
import { useParams } from 'next/navigation';

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
    return (
      <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
        {/* Header Navigation Skeleton */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
          </div>
        </div>

        {/* Porcentajes de Utilidad Skeleton */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 bg-zinc-700 rounded"></div>
              <div className="h-6 bg-zinc-700 rounded w-1/3"></div>
            </div>
            <div className="h-4 bg-zinc-700 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
                <div className="h-10 bg-zinc-700 rounded"></div>
                <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
                <div className="h-10 bg-zinc-700 rounded"></div>
                <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Comisiones y Sobreprecio Skeleton */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 bg-zinc-700 rounded"></div>
              <div className="h-6 bg-zinc-700 rounded w-1/3"></div>
            </div>
            <div className="h-4 bg-zinc-700 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
                <div className="h-10 bg-zinc-700 rounded"></div>
                <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-zinc-700 rounded w-1/3"></div>
                <div className="h-10 bg-zinc-700 rounded"></div>
                <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview de Cálculo Skeleton */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 bg-zinc-700 rounded"></div>
              <div className="h-6 bg-zinc-700 rounded w-1/3"></div>
            </div>
            <div className="h-4 bg-zinc-700 rounded w-1/2 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ejemplo Servicio Skeleton */}
              <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="h-5 bg-zinc-700 rounded w-1/4 mb-2"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                  <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                  <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                  <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                  <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                  <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                  <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                </div>
              </div>
              {/* Ejemplo Producto Skeleton */}
              <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
                <div className="h-5 bg-zinc-700 rounded w-1/4 mb-2"></div>
                <div className="space-y-1">
                  <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                  <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                  <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                  <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                  <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                  <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                  <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                  <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
      {/* Formulario principal */}
      {initialData && (
        <ConfiguracionPreciosForm
          studioSlug={slug}
          initialData={initialData}
          onUpdate={(data) => {
            // Esta función se puede usar para actualizar el estado local si es necesario
            console.log('Configuración actualizada:', data);
          }}
        />
      )}
    </div>
  );
}
