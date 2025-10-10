'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { HorariosStatsZen } from './components/HorariosStatsZen';
import { HorariosListZen } from './components/HorariosListZen';
import { HorariosSkeletonZen } from './components/HorariosSkeletonZen';

// Tipo local para evitar problemas de cache de TypeScript
type Horario = {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  order: number;
  created_at: Date;
  updated_at: Date;
};
import {
  obtenerHorariosStudio,
  toggleHorarioEstado,
  actualizarHorario,
  crearHorario,
  inicializarHorariosPorDefecto
} from '@/lib/actions/studio/config/horarios.actions';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';

/**
 * HorariosPage - Página de configuración de horarios usando ZEN Design System
 * 
 * Características:
 * - ✅ ZenCard unificados en lugar de Card de Shadcn
 * - ✅ Consistencia visual con tema ZEN
 * - ✅ Componentes refactorizados con ZEN
 * - ✅ Espaciado consistente con design tokens
 * - ✅ Mejor organización de componentes
 * - ✅ Usa el nuevo schema studio_business_hours
 */
export default function HorariosPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadData();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
        setError(null);
        setRetryCount(0);
      }

      // Cargar horarios usando Server Actions
      const horariosData = await obtenerHorariosStudio(slug);

      // Si no hay horarios, inicializar con valores por defecto
      if (horariosData.length === 0) {
        await inicializarHorariosPorDefecto(slug);
        const horariosInicializados = await obtenerHorariosStudio(slug);
        setHorarios(horariosInicializados as Horario[]);
      } else {
        setHorarios(horariosData as Horario[]);
      }
    } catch (err) {
      console.error('❌ Error loading horarios data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los datos de horarios';

      // Si es un error de conexión y no hemos reintentado mucho, intentar de nuevo
      if (retryCount < 3 && (errorMessage.includes('conexión') || errorMessage.includes('database') || errorMessage.includes('server'))) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          loadData(true);
        }, 2000 * retryCount); // Reintento con delay incremental
        return;
      }

      setError(errorMessage);
      if (!isRetry) {
        toast.error(errorMessage);
      }
    } finally {
      if (!isRetry) {
        setLoading(false);
      }
    }
  };

  const handleToggleHorario = async (id: string, is_active: boolean) => {
    try {
      // Actualizar optimísticamente
      setHorarios(prev => prev.map(h =>
        h.id === id ? { ...h, is_active } : h
      ));

      // Llamar Server Action
      await toggleHorarioEstado(id, { id, studio_slug: slug, is_active });

      toast.success(`Horario ${is_active ? 'activado' : 'desactivado'} exitosamente`);
    } catch (err) {
      console.error('Error toggling horario:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado del horario';
      toast.error(errorMessage);

      // Revertir cambio optimístico
      setHorarios(prev => prev.map(h =>
        h.id === id ? { ...h, is_active: !is_active } : h
      ));
    }
  };

  const handleUpdateHorario = async (id: string, data: { day_of_week: string; start_time: string; end_time: string }) => {
    try {
      // Obtener el horario actual para mantener is_active y order
      const horarioActual = horarios.find(h => h.id === id);
      if (!horarioActual) return;

      // Actualizar optimísticamente
      setHorarios(prev => prev.map(h =>
        h.id === id ? { ...h, ...data } as Horario : h
      ));

      // Llamar Server Action con todos los campos requeridos
      await actualizarHorario(id, {
        id,
        studio_slug: slug,
        ...data,
        is_active: horarioActual.is_active,
        order: horarioActual.order
      } as Parameters<typeof actualizarHorario>[1]);

      toast.success('Horario actualizado exitosamente');
    } catch (err) {
      console.error('Error updating horario:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar horario';
      toast.error(errorMessage);

      // Revertir cambio optimístico
      loadData();
    }
  };

  const handleAddHorario = async (data: { day_of_week: string; start_time: string; end_time: string; is_active: boolean }) => {
    try {
      // Crear nuevo horario con order por defecto
      const nuevoHorario = await crearHorario(slug, {
        ...data,
        order: horarios.length // Usar la longitud actual como order
      } as Parameters<typeof crearHorario>[1]);
      setHorarios(prev => [...prev, nuevoHorario as Horario]);
      toast.success('Horario agregado exitosamente');
    } catch (err) {
      console.error('Error creating horario:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al crear horario';
      toast.error(errorMessage);
    }
  };

  if (error && !loading) {
    return (
      <div className="p-6">
        <ZenCard variant="default" padding="lg">
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <ZenButton
              onClick={() => loadData(false)}
              variant="outline"
              disabled={retryCount >= 3}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              {retryCount >= 3 ? 'Máximo de reintentos alcanzado' : 'Reintentar'}
            </ZenButton>
          </div>
        </ZenCard>
      </div>
    );
  }

  if (loading) {
    return <HorariosSkeletonZen />;
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
      <HeaderNavigation
        title="Horarios de Atención"
        description="Configura los horarios de atención de tu estudio"
      />

      {/* Estadísticas */}
      <HorariosStatsZen
        horarios={horarios}
        loading={loading}
      />

      {/* Lista de horarios */}
      <HorariosListZen
        horarios={horarios}
        onToggleHorario={handleToggleHorario}
        onUpdateHorario={handleUpdateHorario}
        onAddHorario={handleAddHorario}
        loading={loading}
      />

      {/* Información de uso */}
      <ZenCard variant="default" padding="lg">
        <ZenCardHeader>
          <ZenCardTitle>¿Dónde se usa esta información?</ZenCardTitle>
        </ZenCardHeader>
        <ZenCardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="text-white font-medium">Landing Page</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Sección de horarios de atención</li>
                <li>• Información de contacto</li>
                <li>• Footer con horarios</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-white font-medium">Portales y Comunicación</h4>
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>• Perfil público del estudio</li>
                <li>• Formularios de contacto</li>
                <li>• Integración con CRM</li>
              </ul>
            </div>
          </div>
        </ZenCardContent>
      </ZenCard>
    </div>
  );
}
