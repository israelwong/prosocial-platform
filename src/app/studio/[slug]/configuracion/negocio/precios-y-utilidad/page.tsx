'use client';

import React, { useEffect, useState } from 'react';
import { ConfiguracionPreciosForm } from './components/ConfiguracionPreciosForm';
import { obtenerConfiguracionPrecios } from '@/lib/actions/studio/config/configuracion-precios.actions';
import { Percent } from 'lucide-react';
import { useParams } from 'next/navigation';
import { HeaderNavigation } from '@/components/ui/header-navigation';

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

  // Sin subsecciones - configuración simple

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
          </div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-zinc-700 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-zinc-700 rounded"></div>
              <div className="h-10 bg-zinc-700 rounded"></div>
              <div className="h-10 bg-zinc-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-16 max-w-screen-lg mx-auto mb-16">

      <HeaderNavigation
        title="Configuración de Precios"
        description="Define los porcentajes de utilidad, comisiones y configuraciones de precios para tu negocio"
      />

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
