'use client';

import React, { useEffect, useState } from 'react';
import { Palette } from 'lucide-react';
import { IdentidadFormZen, LogoManagerZen, IdentidadSkeletonZen } from './components';
import { useParams } from 'next/navigation';
import { obtenerIdentidadStudio, actualizarLogo } from '@/lib/actions/studio/config/identidad.actions';
import { IdentidadData } from './types';

export default function IdentidadPage() {
  const params = useParams();
  const studioSlug = params.slug as string;
  const [identidadData, setIdentidadData] = useState<IdentidadData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadIdentidadData = async () => {
      try {
        const result = await obtenerIdentidadStudio(studioSlug);
        if (result.success !== false) {
          setIdentidadData(result as unknown as IdentidadData);
        }
      } catch (error) {
        console.error('Error loading identidad data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadIdentidadData();
  }, [studioSlug]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Palette className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold text-white">Identidad Visual</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          Configura la identidad visual de tu estudio fotográfico. Personaliza tu marca, logo y elementos visuales.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Logo Management */}
        <div className="space-y-6">
          {loading ? (
            <IdentidadSkeletonZen />
          ) : (
            <LogoManagerZen
              tipo="logo"
              url={identidadData?.logo_url}
              onUpdate={async (url: string) => {
                try {
                  await actualizarLogo(studioSlug, { tipo: 'logo', url });
                  setIdentidadData(prev => prev ? { ...prev, logo_url: url } : null);
                } catch (error) {
                  console.error('Error updating logo:', error);
                }
              }}
              onLocalUpdate={(url: string | null) => {
                setIdentidadData(prev => prev ? { ...prev, logo_url: url } : null);
              }}
              studioSlug={studioSlug}
            />
          )}

          {loading ? (
            <IdentidadSkeletonZen />
          ) : (
            <LogoManagerZen
              tipo="isotipo"
              url={identidadData?.isotipo_url}
              onUpdate={async (url: string) => {
                try {
                  await actualizarLogo(studioSlug, { tipo: 'isotipo', url });
                  setIdentidadData(prev => prev ? { ...prev, isotipo_url: url } : null);
                } catch (error) {
                  console.error('Error updating isotipo:', error);
                }
              }}
              onLocalUpdate={(url: string | null) => {
                setIdentidadData(prev => prev ? { ...prev, isotipo_url: url } : null);
              }}
              studioSlug={studioSlug}
            />
          )}
        </div>

        {/* Identity Form */}
        <div className="space-y-6">
          {loading ? (
            <IdentidadSkeletonZen />
          ) : (
            <IdentidadFormZen
              data={identidadData || {
                id: 'temp-id',
                studio_name: 'Mi Estudio',
                slug: studioSlug,
                slogan: null,
                descripcion: null,
                palabras_clave: [],
                logo_url: null,
                isotipo_url: null,
              }}
              onUpdate={async (data: unknown) => {
                // TODO: Implement identity update
                console.log('Identity updated:', data);
              }}
              onLocalUpdate={(data: unknown) => {
                // TODO: Implement local update
                console.log('Local identity update:', data);
              }}
            />
          )}
        </div>
      </div>


    </div>
  );
}
