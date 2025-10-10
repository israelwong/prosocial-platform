'use client';

import React, { useEffect, useState } from 'react';
import { IdentidadEditorZen } from './components';
import { StudioMobilePreview } from '../components';
import { useParams } from 'next/navigation';
import { obtenerIdentidadStudio, actualizarLogo } from '@/lib/actions/studio/config/identidad.actions';
import { IdentidadData } from './types';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle, ZenCardDescription } from '@/components/ui/zen';
import { Image as ImageIcon, Type } from 'lucide-react';

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
    <div className="space-y-8">


      {/* Main Content Grid - Editor + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Columna 1 - Editor */}
        <div className="space-y-6">
          <ZenCard variant="default" padding="none">
            <ZenCardHeader className="border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600/20 rounded-lg">
                  <ImageIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <ZenCardTitle>Editor de Identidad</ZenCardTitle>
                  <ZenCardDescription>
                    Configura la información y elementos visuales
                  </ZenCardDescription>
                </div>
              </div>
            </ZenCardHeader>
            <ZenCardContent className="p-6">
              {loading ? (
                <div className="space-y-6">
                  <div className="h-12 bg-zinc-800/50 rounded-lg animate-pulse"></div>
                  <div className="h-12 bg-zinc-800/50 rounded-lg animate-pulse"></div>
                  <div className="h-24 bg-zinc-800/50 rounded-lg animate-pulse"></div>
                </div>
              ) : (
                <IdentidadEditorZen
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
                  onLocalUpdate={(data: unknown) => {
                    setIdentidadData(prev => {
                      if (!prev) return null;
                      const updateData = data as Partial<IdentidadData>;
                      return Object.assign({}, prev, updateData);
                    });
                  }}
                  onLogoUpdate={async (url: string) => {
                    try {
                      await actualizarLogo(studioSlug, { tipo: 'logo', url });
                    } catch (error) {
                      console.error('Error updating logo:', error);
                    }
                  }}
                  onLogoLocalUpdate={(url: string | null) => {
                    setIdentidadData(prev => {
                      if (!prev) return null;
                      return { ...prev, logo_url: url };
                    });
                  }}
                  studioSlug={studioSlug}
                />
              )}
            </ZenCardContent>
          </ZenCard>
        </div>

        {/* Columna 2 - Preview Mobile (solo desktop) */}
        <div className="hidden lg:block space-y-6">
          <ZenCard variant="default" padding="none">
            <ZenCardHeader className="border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-600/20 rounded-lg">
                  <Type className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <ZenCardTitle>Vista Previa Mobile</ZenCardTitle>
                  <ZenCardDescription>
                    Cómo se verá tu perfil digital
                  </ZenCardDescription>
                </div>
              </div>
            </ZenCardHeader>
            <ZenCardContent className="p-6">
              {loading ? (
                <div className="h-96 bg-zinc-800/50 rounded-lg animate-pulse flex items-center justify-center">
                  <span className="text-zinc-400">Cargando vista previa...</span>
                </div>
              ) : (
                <StudioMobilePreview
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
                />
              )}
            </ZenCardContent>
          </ZenCard>
        </div>
      </div>
    </div>
  );
}
