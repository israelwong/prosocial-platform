'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ZenButton, ZenCard, ZenCardHeader, ZenCardTitle, ZenCardDescription, ZenCardContent } from '@/components/ui/zen';
import { Plus } from 'lucide-react';
import { TiposEventoList } from './components/TiposEventoList';
import { obtenerTiposEvento } from '@/lib/actions/studio/negocio/tipos-evento.actions';
import type { TipoEventoData } from '@/lib/actions/schemas/tipos-evento-schemas';
import { toast } from 'sonner';

export default function TiposEventoPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [tiposEvento, setTiposEvento] = useState<TipoEventoData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTiposEvento = React.useCallback(async () => {
    try {
      setLoading(true);
      const result = await obtenerTiposEvento(slug);
      if (result.success && result.data) {
        setTiposEvento(result.data);
      } else {
        toast.error(result.error || 'Error al cargar tipos de evento');
      }
    } catch (error) {
      console.error('Error loading tipos evento:', error);
      toast.error('Error al cargar tipos de evento');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadTiposEvento();
  }, [loadTiposEvento]);

  const handleEdit = (tipo: TipoEventoData) => {
    // TODO: Implementar edición
    console.log('Editar tipo:', tipo);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tipos de Evento</h1>
          <p className="text-zinc-400 mt-1">
            Configura los tipos de eventos que ofrece tu estudio
          </p>
        </div>
        <ZenButton variant="primary" icon={Plus} iconPosition="left">
          Nuevo Tipo de Evento
        </ZenButton>
      </div>

      {/* Lista de Tipos de Evento */}
      <ZenCard variant="default" padding="none">
        <ZenCardHeader>
          <ZenCardTitle>Tipos de Evento</ZenCardTitle>
          <ZenCardDescription>
            Gestiona y organiza los diferentes tipos de eventos que ofreces
          </ZenCardDescription>
        </ZenCardHeader>
        <ZenCardContent>
          {loading ? (
            <div className="text-center py-8 text-zinc-400">
              Cargando tipos de evento...
            </div>
          ) : tiposEvento.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-400 mb-4">No hay tipos de evento configurados</p>
              <ZenButton variant="primary" icon={Plus} iconPosition="left">
                Crear Primer Tipo de Evento
              </ZenButton>
            </div>
          ) : (
            <TiposEventoList
              tiposEvento={tiposEvento}
              onEdit={handleEdit}
              onTiposChange={setTiposEvento}
              studioSlug={slug}
            />
          )}
        </ZenCardContent>
      </ZenCard>

      {/* Información Adicional */}
      <ZenCard variant="default" padding="none">
        <ZenCardHeader>
          <ZenCardTitle>Información</ZenCardTitle>
        </ZenCardHeader>
        <ZenCardContent>
          <div className="space-y-4 text-sm text-zinc-400">
            <p>
              Los tipos de eventos te permiten categorizar tus servicios y crear paquetes específicos para cada uno.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li><strong>Organización:</strong> Arrastra y suelta para reordenar</li>
              <li><strong>Estado:</strong> Activa o desactiva tipos según necesites</li>
              <li><strong>Paquetes:</strong> Cada tipo puede tener múltiples paquetes asociados</li>
              <li><strong>Edición:</strong> Modifica nombre y configuración en cualquier momento</li>
            </ul>
          </div>
        </ZenCardContent>
      </ZenCard>
    </div>
  );
}
