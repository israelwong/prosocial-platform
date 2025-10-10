'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ContactoStatsZen } from './components/ContactoStatsZen';
import { ContactoListZenDnd } from './components/ContactoListZenDnd';
import { ContactoModalZen } from './components/ContactoModalZen';
import { ContactoSkeleton } from './components/ContactoSkeleton';
import { Telefono, TelefonoCreate, ContactoData } from './types';
import {
  obtenerContactoStudio,
  crearTelefono,
  actualizarTelefono,
  eliminarTelefono,
  toggleTelefonoEstado,
  actualizarContactoData,
  reordenarTelefonos
} from '@/lib/actions/studio/config/contacto.actions';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';

/**
 * ContactoPageZen - Página refactorizada usando ZEN Design System
 * 
 * Mejoras sobre la versión original:
 * - ✅ ZenCard unificados en lugar de Card de Shadcn
 * - ✅ Consistencia visual con tema ZEN
 * - ✅ Componentes refactorizados con ZEN
 * - ✅ Espaciado consistente con design tokens
 * - ✅ Mejor organización de componentes
 */
export default function ContactoPageZen() {
  const params = useParams();
  const slug = params.slug as string;

  const [telefonos, setTelefonos] = useState<Telefono[]>([]);
  const [contactoData, setContactoData] = useState<ContactoData>({
    direccion: '',
    website: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTelefono, setEditingTelefono] = useState<Telefono | null>(null);

  useEffect(() => {
    if (slug && slug !== 'undefined') {
      loadData();
    }
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
        setError(null);
        setRetryCount(0);
      }

      if (!slug || slug === 'undefined') {
        throw new Error('Slug no disponible');
      }

      const data = await obtenerContactoStudio(slug);

      const telefonosConTipos = (data.telefonos || []).map(telefono => ({
        id: telefono.id,
        studio_id: telefono.studio_id,
        number: telefono.number, // Actualizado: numero → number
        type: telefono.type, // Actualizado: tipo → type
        is_active: telefono.is_active, // Actualizado: activo → is_active
        order: telefono.order,
        created_at: telefono.created_at,
        updated_at: telefono.updated_at
      }));

      setTelefonos(telefonosConTipos);
      setContactoData(data.contactoData || { direccion: '', website: '' });
    } catch (err) {
      console.error('❌ Error loading contacto data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los datos de contacto';

      if (retryCount < 3 && (errorMessage.includes('conexión') || errorMessage.includes('database') || errorMessage.includes('server'))) {
        setRetryCount(prev => prev + 1);
        setTimeout(() => {
          loadData(true);
        }, 2000 * retryCount);
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

  const handleOpenModal = (telefono?: Telefono) => {
    setEditingTelefono(telefono || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTelefono(null);
  };

  const handleSaveTelefono = async (data: TelefonoCreate, editingTelefono?: Telefono) => {
    try {
      if (editingTelefono) {
        const telefonoActualizado = await actualizarTelefono(editingTelefono.id, {
          id: editingTelefono.id,
          ...data,
        });

        setTelefonos(prev => prev.map(t =>
          t.id === editingTelefono.id ? {
            ...telefonoActualizado,
            type: telefonoActualizado.type // Actualizado: tipo → type
          } : t
        ));

        toast.success('Teléfono actualizado exitosamente');
      } else {
        const nuevoTelefono = await crearTelefono(slug, {
          ...data,
          is_active: data.is_active ?? true, // Actualizado: activo → is_active
        });
        setTelefonos(prev => [...prev, {
          ...nuevoTelefono,
          type: nuevoTelefono.type // Actualizado: tipo → type
        }]);
        toast.success('Teléfono agregado exitosamente');
      }

      handleCloseModal();
    } catch (err) {
      console.error('Error saving telefono:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar teléfono';
      toast.error(errorMessage);
    }
  };

  const handleDeleteTelefono = async (id: string) => {
    try {
      await eliminarTelefono(id);
      setTelefonos(prev => prev.filter(t => t.id !== id));
      toast.success('Teléfono eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting telefono:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar teléfono';
      toast.error(errorMessage);
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      setTelefonos(prev => prev.map(t =>
        t.id === id ? { ...t, is_active } : t
      ));

      const telefonoActualizado = await toggleTelefonoEstado(id, { id, is_active }); // Actualizado: activo → is_active

      setTelefonos(prev => prev.map(t =>
        t.id === id ? {
          ...telefonoActualizado,
          type: telefonoActualizado.type // Actualizado: tipo → type
        } : t
      ));

      toast.success(`Teléfono ${is_active ? 'activado' : 'desactivado'} exitosamente`);
    } catch (err) {
      console.error('Error toggling telefono:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado del teléfono';
      toast.error(errorMessage);

      setTelefonos(prev => prev.map(t =>
        t.id === id ? { ...t, is_active: !is_active } : t
      ));
    }
  };

  const handleUpdateContactoData = async (field: keyof ContactoData, value: string) => {
    try {
      setContactoData(prev => ({ ...prev, [field]: value }));
    } catch (err) {
      console.error('Error updating contacto data:', err);
      toast.error('Error al actualizar información');
    }
  };

  const handleSaveContactoData = async (field: keyof ContactoData, value: string) => {
    try {
      const dataActualizada = await actualizarContactoData(slug, { field, value });
      setContactoData(prev => ({ ...prev, ...dataActualizada }));
    } catch (err) {
      console.error('Error saving contacto data:', err);
      throw err;
    }
  };

  const handleReorderTelefonos = async (telefonosReordenados: Telefono[]) => {
    try {
      const telefonosConOrden = telefonosReordenados.map((telefono, index) => ({
        id: telefono.id,
        order: index
      }));

      await reordenarTelefonos(slug, telefonosConOrden);

      // Actualizar el estado local con el nuevo orden
      setTelefonos(telefonosReordenados);
    } catch (err) {
      console.error('Error reordering telefonos:', err);
      throw err;
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
    return <ContactoSkeleton />;
  }

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
      <HeaderNavigation
        title="Contacto"
        description="Gestiona los datos de contacto de tu estudio"
      />

      {/* Estadísticas */}
      <ContactoStatsZen
        telefonos={telefonos}
        contactoData={contactoData}
        loading={loading}
      />

      {/* Lista de contacto con Drag & Drop */}
      <ContactoListZenDnd
        telefonos={telefonos}
        contactoData={contactoData}
        onAddTelefono={() => handleOpenModal()}
        onEditTelefono={handleOpenModal}
        onDeleteTelefono={handleDeleteTelefono}
        onToggleActive={handleToggleActive}
        onUpdateContactoData={handleUpdateContactoData}
        onSaveContactoData={handleSaveContactoData}
        onReorderTelefonos={handleReorderTelefonos}
        loading={loading}
      />

      {/* Modal para crear/editar teléfonos */}
      <ContactoModalZen
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTelefono}
        editingTelefono={editingTelefono}
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
                <li>• Footer con información de contacto</li>
                <li>• Formularios de contacto</li>
                <li>• Botones de WhatsApp</li>
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