'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { HeaderNavigation } from '@/components/ui/header-navigation';
import { User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { obtenerPerfil } from '@/lib/actions/studio/config/perfil.actions';
import { PerfilData } from './types';
import { PerfilFormSimple, PerfilSkeleton } from './components';

export default function PerfilPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [perfil, setPerfil] = useState<PerfilData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarPerfil = useCallback(async () => {
    try {
      setLoading(true);
      const result = await obtenerPerfil(slug);

      if (result.success && result.data) {
        setPerfil(result.data);
        setError(null);
      } else {
        const errorMessage = typeof result.error === 'string' ? result.error : 'Error al cargar el perfil';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
      setError('Error interno del servidor');
      toast.error('Error al cargar el perfil');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    cargarPerfil();
  }, [slug, cargarPerfil]);

  const handlePerfilUpdate = (updatedPerfil: PerfilData) => {
    setPerfil(updatedPerfil);
  };

  if (loading) {
    return <PerfilSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-screen-lg mx-auto">
        <HeaderNavigation
          title="Perfil"
          description="Gestiona tu información personal y de contacto"
        />
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-red-400" />
              <h3 className="text-lg font-medium text-white mb-2">
                Error al cargar el perfil
              </h3>
              <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                {error}
              </p>
              <button
                onClick={cargarPerfil}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Reintentar
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="space-y-6 max-w-screen-lg mx-auto">
        <HeaderNavigation
          title="Perfil"
          description="Gestiona tu información personal y de contacto"
        />
        
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <User className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
              <h3 className="text-lg font-medium text-white mb-2">
                No se encontró información del perfil
              </h3>
              <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                No se pudo cargar la información de tu perfil. Contacta al soporte si el problema persiste.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-screen-lg mx-auto">
      <HeaderNavigation
        title="Perfil"
        description="Gestiona tu información personal y de contacto"
        actionButton={{
          label: "Guardar Cambios",
          icon: "User",
          variant: "primary"
        }}
      />

      <PerfilFormSimple
        studioSlug={slug}
        perfil={perfil}
        onPerfilUpdate={handlePerfilUpdate}
      />
    </div>
  );
}