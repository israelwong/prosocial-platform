'use client';

import { useEffect, useState } from 'react';
import { obtenerIdentidadStudio } from '@/lib/actions/studio/config/identidad.actions';
import type { IdentidadData } from '@/app/studio/[slug]/configuracion/cuenta/identidad/types';

interface UseStudioDataOptions {
  studioSlug: string;
  onUpdate?: (data: IdentidadData) => void;
}

export function useStudioData({ studioSlug, onUpdate }: UseStudioDataOptions) {
  const [identidadData, setIdentidadData] = useState<IdentidadData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales
  useEffect(() => {
    if (!studioSlug) return;

    const loadStudioData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔄 [STUDIO_DATA] Cargando datos del studio:', studioSlug);
        
        const data = await obtenerIdentidadStudio(studioSlug);
        console.log('📊 [STUDIO_DATA] Datos recibidos:', data);
        
        setIdentidadData(data);
        onUpdate?.(data);
        console.log('✅ [STUDIO_DATA] Datos cargados exitosamente:', { name: data.name });
      } catch (err) {
        console.error('❌ [STUDIO_DATA] Error loading studio data:', err);
        setError('Error al cargar datos del estudio');
        
        // Fallback a datos por defecto
        const fallbackData: IdentidadData = {
          id: studioSlug,
          name: 'Studio',
          slug: studioSlug,
          slogan: null,
          descripcion: null,
          palabras_clave: [],
          logoUrl: null,
          isotipo_url: null
        };
        
        setIdentidadData(fallbackData);
        onUpdate?.(fallbackData);
        console.log('⚠️ [STUDIO_DATA] Usando datos de fallback:', fallbackData);
      } finally {
        setLoading(false);
        console.log('🏁 [STUDIO_DATA] Loading completado');
      }
    };

    loadStudioData();
  }, [studioSlug]); // Solo depender de studioSlug

  // Función para recargar datos
  const refetch = async () => {
    if (!studioSlug) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 [STUDIO_DATA] Recargando datos del studio:', studioSlug);
      
      const data = await obtenerIdentidadStudio(studioSlug);
      console.log('📊 [STUDIO_DATA] Datos recargados:', data);
      
      setIdentidadData(data);
      onUpdate?.(data);
      console.log('✅ [STUDIO_DATA] Datos recargados exitosamente:', { name: data.name });
    } catch (err) {
      console.error('❌ [STUDIO_DATA] Error reloading studio data:', err);
      setError('Error al recargar datos del estudio');
    } finally {
      setLoading(false);
      console.log('🏁 [STUDIO_DATA] Reload completado');
    }
  };

  return {
    identidadData,
    loading,
    error,
    refetch
  };
}
