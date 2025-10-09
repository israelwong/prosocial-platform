'use client';

import React, { useEffect, useState } from 'react';
import { Palette, Zap } from 'lucide-react';
import { IdentidadFormZen, LogoManagerZen, IdentidadSkeletonZen } from './components';
import { useParams } from 'next/navigation';
import { obtenerIdentidadStudio } from '@/lib/actions/studio/config/identidad.actions';
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
          setIdentidadData(result as IdentidadData);
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
                // TODO: Implement logo update
                console.log('Logo updated:', url);
              }}
              onLocalUpdate={(url: string | null) => {
                // TODO: Implement local update
                console.log('Local logo update:', url);
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
                // TODO: Implement isotipo update
                console.log('Isotipo updated:', url);
              }}
              onLocalUpdate={(url: string | null) => {
                // TODO: Implement local update
                console.log('Local isotipo update:', url);
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

      {/* Quick Actions */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="h-5 w-5 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Acciones Rápidas</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <h4 className="font-medium text-white mb-2">Generar Palabras Clave</h4>
            <p className="text-sm text-zinc-400 mb-3">
              Usa IA para generar palabras clave relevantes para tu estudio.
            </p>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Generar con IA →
            </button>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <h4 className="font-medium text-white mb-2">Plantillas de Slogan</h4>
            <p className="text-sm text-zinc-400 mb-3">
              Explora plantillas profesionales para tu slogan.
            </p>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Ver Plantillas →
            </button>
          </div>
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <h4 className="font-medium text-white mb-2">Vista Previa</h4>
            <p className="text-sm text-zinc-400 mb-3">
              Ve cómo se ve tu identidad en diferentes contextos.
            </p>
            <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
              Vista Previa →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
