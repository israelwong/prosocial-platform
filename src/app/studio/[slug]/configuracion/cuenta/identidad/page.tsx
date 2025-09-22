'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import {
    obtenerIdentidadStudio,
    actualizarIdentidadBasica,
    actualizarPalabrasClave,
    actualizarLogo
} from '@/lib/actions/studio/config/identidad.actions';
import { IdentidadForm } from './components/IdentidadForm';
import { PalabrasClaveManager } from './components/PalabrasClaveManager';
import { LogoManager } from './components/LogoManager';
import { IdentidadData, IdentidadUpdate } from './types';

export default function IdentidadPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [identidadData, setIdentidadData] = useState<IdentidadData | null>(null);
    const [loading, setLoading] = useState(true);
    const [retryCount, setRetryCount] = useState(0);

    const loadData = useCallback(async () => {
        try {
            setLoading(true);
            const data = await obtenerIdentidadStudio(slug);
            setIdentidadData(data);
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
      throw error;
    }
  };

  // Función para actualizar el estado local
  const handleLocalUpdate = (updates: Partial<IdentidadData>) => {
    if (identidadData) {
      setIdentidadData(prev => prev ? { ...prev, ...updates } : null);
    }
  };

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
                </div>
            </div>
        );
    }

    if (!identidadData) {
        return (
            <div className="p-6 space-y-6">
                <div className="text-center py-8">
                    <p className="text-zinc-400">Error al cargar datos de identidad</p>
                    <button
                        onClick={loadData}
                        className="mt-2 text-blue-400 hover:text-blue-300"
                    >
                        Reintentar
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Información Básica */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Información Básica</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Datos fundamentales de tu estudio
                    </CardDescription>
                </CardHeader>
        <CardContent>
          <IdentidadForm 
            data={identidadData}
            onUpdate={handleUpdateIdentidad}
            onLocalUpdate={handleLocalUpdate}
            loading={loading}
          />
        </CardContent>
            </Card>

            {/* Palabras Clave */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">Palabras Clave</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Términos que describen tu negocio (SEO y búsquedas)
                    </CardDescription>
                </CardHeader>
        <CardContent>
          <PalabrasClaveManager 
            palabrasClave={identidadData.palabras_clave}
            onUpdate={handleUpdatePalabrasClave}
            onLocalUpdate={(palabras) => handleLocalUpdate({ palabras_clave: palabras })}
            loading={loading}
          />
        </CardContent>
            </Card>

            {/* Logos */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Logo Principal */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                        <CardTitle className="text-white">Logo Principal</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Logo completo con texto (header, tarjetas, documentos)
                        </CardDescription>
                    </CardHeader>
          <CardContent>
            <LogoManager 
              tipo="logo"
              url={identidadData.logoUrl}
              onUpdate={(url) => handleUpdateLogo('logo', url)}
              onLocalUpdate={(url) => handleLocalUpdate({ logoUrl: url })}
              loading={loading}
            />
          </CardContent>
                </Card>

                {/* Isotipo */}
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardHeader>
                        <CardTitle className="text-white">Isotipo</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Símbolo o ícono sin texto (favicon, redes sociales)
                        </CardDescription>
                    </CardHeader>
          <CardContent>
            <LogoManager 
              tipo="isotipo"
              url={identidadData.isotipo_url}
              onUpdate={(url) => handleUpdateLogo('isotipo', url)}
              onLocalUpdate={(url) => handleLocalUpdate({ isotipo_url: url })}
              loading={loading}
            />
          </CardContent>
                </Card>
            </div>

            {/* Información de uso */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">¿Dónde se usa esta información?</CardTitle>
                </CardHeader>
                <CardContent>
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
                </CardContent>
            </Card>
        </div>
    );
}