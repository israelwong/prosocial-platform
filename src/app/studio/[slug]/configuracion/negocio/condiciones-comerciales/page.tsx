'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { CondicionesComercialesList } from './components/CondicionesComercialesList';
import { CondicionesComercialesSkeletonZen } from './components/CondicionesComercialesSkeletonZen';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import { obtenerCondicionesComerciales } from '@/lib/actions/studio/config/condiciones-comerciales.actions';
import { CondicionComercialData } from './types';

export default function CondicionesComercialesPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [condiciones, setCondiciones] = useState<CondicionComercialData[]>([]);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);
        const result = await obtenerCondicionesComerciales(slug);
        if (result.success && result.data) {
          setCondiciones(result.data);
        }
      } catch (error) {
        console.error('Error cargando condiciones:', error);
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
        <CondicionesComercialesSkeletonZen />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
      <HeaderNavigation
        title="Condiciones Comerciales"
        description="Define los términos y condiciones comerciales de tu negocio, incluyendo descuentos y anticipos"
      />

      {/* Contenido principal con ZEN Design System */}
      <CondicionesComercialesList
        studioSlug={slug}
        initialCondiciones={condiciones}
        onCondicionesChange={setCondiciones}
      />
    </div>
  );
}
