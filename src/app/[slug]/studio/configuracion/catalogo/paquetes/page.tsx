'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { PaquetesList } from './components';
import { obtenerPaquetes } from '@/lib/actions/studio/config/paquetes.actions';
// import type { PaqueteFromDB } from '@/lib/actions/schemas/paquete-schemas';

export default function PaquetesPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [loading, setLoading] = useState(true);
  const [paquetes, setPaquetes] = useState<Array<{
    id: string;
    studio_id: string;
    event_type_id: string;
    name: string;
    cost?: number | null;
    expense?: number | null;
    utilidad?: number | null;
    precio?: number | null;
    status: string;
    position: number;
    created_at: Date;
    updated_at: Date;
  }>>([]);

  // Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true);

        // Cargar paquetes
        const resultPaquetes = await obtenerPaquetes(slug);
        if (resultPaquetes.success && resultPaquetes.data) {
          setPaquetes(resultPaquetes.data);
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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Paquetes</h1>
            <p className="text-zinc-400 mt-1">
              Gestiona los paquetes de servicios para tus eventos
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-zinc-800 rounded-lg p-6">
                <div className="h-4 bg-zinc-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-zinc-700 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-zinc-700 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Paquetes</h1>
          <p className="text-zinc-400 mt-1">
            Gestiona los paquetes de servicios para tus eventos
          </p>
        </div>
      </div>

      {/* Contenido principal con PaquetesList */}
      <PaquetesList
        studioSlug={slug}
        initialPaquetes={paquetes}
        onPaquetesChange={setPaquetes}
      />
    </div>
  );
}