'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import {
  ZenCard,
  ZenCardHeader,
  ZenCardTitle,
  ZenCardDescription,
  ZenCardContent
} from '@/components/ui/zen';
import {
  obtenerIdentidadStudio,
  actualizarIdentidadBasica,
  actualizarPalabrasClave,
  actualizarLogo
} from '@/lib/actions/studio/config/identidad.actions';
import { IdentidadFormZen } from './components/IdentidadFormZen';
import { PalabrasClaveManagerZen } from './components/PalabrasClaveManagerZen';
import { LogoManagerZen } from './components/LogoManagerZen';
import { IdentidadData, IdentidadUpdate } from './types';

/**
 * IdentidadPageZen - Página refactorizada usando ZEN Design System
 * 
 * Mejoras sobre la versión original:
 * - ✅ ZenCard unificados en lugar de Card de Shadcn
 * - ✅ Consistencia visual con tema ZEN
 * - ✅ Formulario refactorizado con componentes ZEN
 * - ✅ Espaciado consistente con design tokens
 * - ✅ Mejor organización de componentes
 */
export default function IdentidadPageZen() {
  const params = useParams();
  const slug = params.slug as string;

  const [identidadData, setIdentidadData] = useState<IdentidadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await obtenerIdentidadStudio(slug);

      // Verificar si es un error response
      if ('success' in response && response.success === false) {
        throw new Error(response.error || 'Error al cargar datos');
      }

      // Asumir que es IdentidadData y hacer type assertion
      setIdentidadData(response as IdentidadData);
      setRetryCount(0);
    } catch (error) {
      console.error('Error loading identidad data:', error);
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => loadData(), 1000 * retryCount);
      } else {
        toast.error('Error al cargar datos de identidad');
      }
    } finally {
      setLoading(false);
    }
  }, [slug, retryCount]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleUpdateIdentidad = async (data: IdentidadUpdate) => {
    try {
      await actualizarIdentidadBasica(slug, data);
      // No recargar datos - la actualización optimista ya actualizó la UI
    } catch (error) {
      console.error('Error updating identidad:', error);
      throw error;
    }
  };

  const handleUpdatePalabrasClave = async (palabras: string[]) => {
    try {
      await actualizarPalabrasClave(slug, palabras);
      // No recargar datos - la actualización optimista ya actualizó la UI
    } catch (error) {
      console.error('Error updating palabras clave:', error);
      throw error;
    }
  };

  const handleUpdateLogo = async (tipo: 'logo' | 'isotipo', url: string) => {
    try {
      await actualizarLogo(slug, { tipo, url });
      // No recargar datos - la actualización optimista ya actualizó la UI
    } catch (error) {
      console.error('Error updating logo:', error);
      // Recargar datos en caso de error para sincronizar con la base de datos
      await loadData();
      throw error;
    }
  };

  // Función para actualizar el estado local
  const handleLocalUpdate = (updates: Partial<IdentidadData>) => {
    if (identidadData) {
      setIdentidadData(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  // Loading state con ZEN Cards
  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
        {/* Header Navigation Skeleton */}
        <ZenCard variant="default" padding="md">
          <div className="animate-pulse">
            <div className="h-8 bg-zinc-700 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
          </div>
        </ZenCard>

        {/* Información Básica Skeleton */}
        <ZenCard variant="default" padding="md">
          <div className="animate-pulse">
            <div className="h-6 bg-zinc-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-zinc-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-3">
              <div className="h-10 bg-zinc-700 rounded"></div>
              <div className="h-10 bg-zinc-700 rounded"></div>
              <div className="h-20 bg-zinc-700 rounded"></div>
            </div>
          </div>
        </ZenCard>

        {/* Palabras Clave Skeleton */}
        <ZenCard variant="default" padding="md">
          <div className="animate-pulse">
            <div className="h-6 bg-zinc-700 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-zinc-700 rounded w-1/2 mb-4"></div>
            <div className="flex flex-wrap gap-2 mb-4">
              <div className="h-8 bg-zinc-700 rounded w-20"></div>
              <div className="h-8 bg-zinc-700 rounded w-24"></div>
              <div className="h-8 bg-zinc-700 rounded w-16"></div>
            </div>
            <div className="h-10 bg-zinc-700 rounded"></div>
          </div>
        </ZenCard>

        {/* Logos Skeleton */}
        <div className="grid gap-6 md:grid-cols-2">
          <ZenCard variant="default" padding="md">
            <div className="animate-pulse">
              <div className="h-6 bg-zinc-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-zinc-700 rounded w-2/3 mb-4"></div>
              <div className="h-32 bg-zinc-700 rounded mb-4"></div>
              <div className="h-10 bg-zinc-700 rounded"></div>
            </div>
          </ZenCard>
          <ZenCard variant="default" padding="md">
            <div className="animate-pulse">
              <div className="h-6 bg-zinc-700 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-zinc-700 rounded w-2/3 mb-4"></div>
              <div className="h-32 bg-zinc-700 rounded mb-4"></div>
              <div className="h-10 bg-zinc-700 rounded"></div>
            </div>
          </ZenCard>
        </div>
      </div>
    );
  }

  // Error state
  if (!identidadData) {
    return (
      <div className="p-6 space-y-6">
        <ZenCard variant="default" padding="lg">
          <div className="text-center py-8">
            <p className="text-zinc-400 mb-4">Error al cargar datos de identidad</p>
            <button
              onClick={loadData}
              className="text-blue-400 hover:text-blue-300 underline"
            >
              Reintentar
            </button>
          </div>
        </ZenCard>
      </div>
    );
  }

  return (
    <div className="p-6 pb-12 space-y-6 max-w-screen-lg mx-auto">
      {/* Header Navigation - Mantener Shadcn por ahora */}
      <HeaderNavigation
        title="Identidad del Estudio"
        description="Define la identidad visual y la información básica de tu estudio"
      />

      {/* Información Básica - REFACTORIZADO CON ZEN */}
      <ZenCard variant="default" padding="none">
        <ZenCardHeader>
          <ZenCardTitle>Información Básica</ZenCardTitle>
          <ZenCardDescription>
            Datos fundamentales de tu estudio que aparecerán en tu perfil público
          </ZenCardDescription>
        </ZenCardHeader>
        <ZenCardContent>
          <IdentidadFormZen
            data={identidadData}
            onUpdate={handleUpdateIdentidad}
            onLocalUpdate={handleLocalUpdate}
            loading={loading}
          />
        </ZenCardContent>
      </ZenCard>

      {/* Palabras Clave - ZEN CARD */}
      <ZenCard variant="default" padding="none">
        <ZenCardHeader>
          <ZenCardTitle>Palabras Clave</ZenCardTitle>
          <ZenCardDescription>
            Términos que describen tu negocio para SEO y búsquedas
          </ZenCardDescription>
        </ZenCardHeader>
        <ZenCardContent>
          <PalabrasClaveManagerZen
            palabrasClave={identidadData.palabras_clave}
            onUpdate={handleUpdatePalabrasClave}
            onLocalUpdate={(palabras) => handleLocalUpdate({ palabras_clave: palabras })}
            loading={loading}
          />
        </ZenCardContent>
      </ZenCard>

      {/* Logos - ZEN CARDS */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Logo Principal */}
        <ZenCard variant="default" padding="none">
          <ZenCardHeader>
            <ZenCardTitle>Logo Principal</ZenCardTitle>
            <ZenCardDescription>
              Logo completo con texto para header, tarjetas y documentos
            </ZenCardDescription>
          </ZenCardHeader>
          <ZenCardContent>
            <LogoManagerZen
              tipo="logo"
              url={identidadData.logoUrl}
              onUpdate={(url) => handleUpdateLogo('logo', url)}
              onLocalUpdate={(url) => handleLocalUpdate({ logoUrl: url })}
              studioSlug={slug}
              loading={loading}
            />
          </ZenCardContent>
        </ZenCard>

        {/* Isotipo */}
        <ZenCard variant="default" padding="none">
          <ZenCardHeader>
            <ZenCardTitle>Isotipo</ZenCardTitle>
            <ZenCardDescription>
              Símbolo o ícono sin texto para favicon y redes sociales
            </ZenCardDescription>
          </ZenCardHeader>
          <ZenCardContent>
            <LogoManagerZen
              tipo="isotipo"
              url={identidadData.isotipo_url}
              onUpdate={(url) => handleUpdateLogo('isotipo', url)}
              onLocalUpdate={(url) => handleLocalUpdate({ isotipo_url: url })}
              studioSlug={slug}
              loading={loading}
            />
          </ZenCardContent>
        </ZenCard>
      </div>

      {/* Información de uso - ZEN CARD */}
      <ZenCard variant="default" padding="none" className="mb-14">
        <ZenCardHeader>
          <ZenCardTitle>¿Dónde se usa esta información?</ZenCardTitle>
        </ZenCardHeader>
        <ZenCardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-white font-medium">Landing Page</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Header con logo y nombre</li>
                <li>• Footer con información de contacto</li>
                <li>• Meta tags para SEO</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-medium">Portales y Comunicación</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Cotizaciones y propuestas</li>
                <li>• Emails y notificaciones</li>
                <li>• Documentos oficiales</li>
              </ul>
            </div>
          </div>
        </ZenCardContent>
      </ZenCard>
    </div>
  );
}
