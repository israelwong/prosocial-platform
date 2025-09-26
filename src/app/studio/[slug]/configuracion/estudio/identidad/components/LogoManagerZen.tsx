'use client';

import React, { useState, useRef } from 'react';
import { ZenButton } from '@/components/ui/zen/base/ZenButton';
import { ZenInput } from '@/components/ui/zen/base/ZenInput';
import { ZenLabel } from '@/components/ui/zen/base/ZenLabel';
import { ZenBadge } from '@/components/ui/zen/base/ZenBadge';
import { Upload, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useFileUpload } from '@/hooks/useFileUpload';
import { ALLOWED_MIME_TYPES } from '@/lib/actions/schemas/media-schemas';
import { Dropzone } from '@/components/ui/shadcn/dropzone';
import { FilePreview } from '@/components/ui/shadcn/file-preview';

interface LogoManagerZenProps {
  tipo: 'logo' | 'isotipo';
  url?: string | null | undefined;
  onUpdate: (url: string) => Promise<void>;
  onLocalUpdate: (url: string | null) => void;
  studioSlug: string;
  loading?: boolean;
}

export function LogoManagerZen({
  tipo,
  url,
  onUpdate,
  onLocalUpdate,
  studioSlug,
  loading = false
}: LogoManagerZenProps) {
  const [nuevaUrl, setNuevaUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook para upload de archivos
  const { uploading, progress, error, uploadFile, deleteFile } = useFileUpload({
    studioSlug,
    category: 'identidad',
    subcategory: tipo === 'logo' ? 'logos' : 'isotipos',
    allowedMimeTypes: ALLOWED_MIME_TYPES.image, // PNG, SVG
    maxSize: 5, // 5MB
    onSuccess: (newUrl) => {
      onLocalUpdate(newUrl);
      onUpdate(newUrl);
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  const handleFileSelect = async (file: File) => {
    // Validar tipo de archivo
    if (!ALLOWED_MIME_TYPES.image.includes(file.type as "image/png" | "image/svg+xml")) {
      toast.error('Tipo de archivo no permitido. Solo se permiten PNG y SVG.');
      return;
    }

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 5MB permitido.');
      return;
    }

    // Actualización optimista
    onLocalUpdate(URL.createObjectURL(file));

    try {
      const result = await uploadFile(file);
      if (result.success && result.publicUrl) {
        await onUpdate(result.publicUrl);
        toast.success(`${tipo === 'logo' ? 'Logo' : 'Isotipo'} subido exitosamente`);
      } else {
        // Revertir cambios en caso de error
        onLocalUpdate(url || null);
        toast.error(result.error || 'Error al subir archivo');
      }
    } catch {
      // Revertir cambios en caso de error
      onLocalUpdate(url || null);
      toast.error('Error al subir archivo');
    }
  };

  const handleUpdateUrl = async () => {
    if (!nuevaUrl.trim()) return;

    const urlTrimmed = nuevaUrl.trim();

    // Actualización optimista - actualizar UI inmediatamente
    onLocalUpdate(urlTrimmed);
    setNuevaUrl('');
    setShowUrlInput(false);

    try {
      await onUpdate(urlTrimmed);
      toast.success(`${tipo === 'logo' ? 'Logo' : 'Isotipo'} actualizado`);
    } catch {
      // Revertir cambios en caso de error
      onLocalUpdate(url || null);
      setNuevaUrl(urlTrimmed);
      setShowUrlInput(true);
      toast.error(`Error al actualizar ${tipo === 'logo' ? 'logo' : 'isotipo'}`);
    }
  };

  const handleRemoveUrl = async () => {
    // Guardar la URL original para rollback
    const originalUrl = url ?? null;

    // Actualización optimista - actualizar UI inmediatamente
    onLocalUpdate(null);

    try {
      if (originalUrl) {
        await deleteFile(originalUrl);
      }
      await onUpdate('');
      toast.success(`${tipo === 'logo' ? 'Logo' : 'Isotipo'} eliminado`);
    } catch (error) {
      // Revertir cambios en caso de error
      onLocalUpdate(originalUrl);
      toast.error(`Error al eliminar ${tipo === 'logo' ? 'logo' : 'isotipo'}`);
      console.error('Error al eliminar archivo:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUpdateUrl();
    }
  };

  const titulo = tipo === 'logo' ? 'Logo Principal' : 'Isotipo';

  return (
    <div className="space-y-4">
      {url ? (
        <div className="space-y-3">
          {/* Previsualización del archivo con ZEN styling */}
          <div className="relative group">
            <FilePreview
              file={url}
              onRemove={handleRemoveUrl}
              onView={() => window.open(url, '_blank')}
              showActions={true}
            />

            {/* Badge de estado */}
            <div className="absolute top-2 right-2">
              <ZenBadge variant="success" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                Activo
              </ZenBadge>
            </div>
          </div>

          {/* Botón para cambiar archivo con ZEN */}
          <ZenButton
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            loading={uploading}
            disabled={uploading || loading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Cambiar {titulo}
          </ZenButton>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Dropzone personalizado con ZEN styling */}
          <div className="relative">
            <Dropzone
              onFileSelect={handleFileSelect}
              acceptedFileTypes={{
                'image/png': ['.png'],
                'image/svg+xml': ['.svg']
              }}
              maxSize={5}
              maxFiles={1}
              disabled={uploading || loading}
              className="h-44 border-2 border-dashed border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/20 transition-all duration-300 rounded-xl group cursor-pointer relative overflow-hidden"
            >
              {/* Efecto de gradiente sutil */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-zinc-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="text-center p-8 relative z-10">
                {/* Icono principal con animación */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-zinc-800/50 flex items-center justify-center group-hover:bg-zinc-700/50 transition-colors duration-300">
                    <Upload className="h-8 w-8 text-zinc-500 group-hover:text-zinc-300 transition-colors duration-300" />
                  </div>
                  {/* Indicador de estado activo */}
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                </div>

                {/* Texto principal */}
                <h3 className="text-zinc-200 text-base font-semibold mb-2 group-hover:text-white transition-colors duration-300">
                  Subir {titulo}
                </h3>

                {/* Especificaciones técnicas */}
                <div className="mb-4">
                  <p className="text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors duration-300">
                    PNG, SVG (máx. 5MB)
                  </p>
                </div>

                {/* Instrucciones de uso */}
                <div className="flex items-center justify-center gap-3 text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors duration-300">
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 bg-zinc-500 rounded-full" />
                    <span>Arrastra y suelta</span>
                  </div>
                  <div className="w-1 h-1 bg-zinc-600 rounded-full" />
                  <div className="flex items-center gap-1">
                    <span>o haz clic para seleccionar</span>
                  </div>
                </div>
              </div>
            </Dropzone>

            {/* Indicador de estado de carga */}
            {uploading && (
              <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-20">
                <div className="text-center p-6">
                  <div className="relative mb-4">
                    <div className="animate-spin h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full mx-auto" />
                    <div className="absolute inset-0 animate-ping h-8 w-8 border border-blue-400 rounded-full mx-auto opacity-20" />
                  </div>
                  <p className="text-zinc-200 text-sm font-medium mb-1">Subiendo archivo...</p>
                  <p className="text-zinc-400 text-xs">Por favor espera</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Input de archivo oculto para compatibilidad */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.svg,image/png,image/svg+xml"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileSelect(file);
        }}
        className="hidden"
      />

      {/* Barra de progreso con ZEN styling */}
      {uploading && (
        <div className="space-y-3 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
              <span className="text-zinc-300 font-medium">Subiendo archivo...</span>
            </div>
            <span className="text-blue-400 font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-zinc-500 text-center">
            Por favor espera mientras se procesa tu archivo...
          </div>
        </div>
      )}

      {/* Mostrar error si existe con ZEN styling */}
      {error && (
        <div className="p-3 bg-red-900/20 border border-red-800/30 rounded-md">
          <div className="flex items-center">
            <div className="h-2 w-2 bg-red-400 rounded-full mr-2" />
            <span className="text-red-400 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Input de URL con ZEN components */}
      {showUrlInput && (
        <div className="space-y-3 p-4 bg-zinc-900/50 rounded-lg border border-zinc-800">
          <ZenLabel htmlFor={`url-${tipo}`}>
            URL del {titulo}
          </ZenLabel>
          <div className="flex space-x-2">
            <ZenInput
              id={`url-${tipo}`}
              label=""
              value={nuevaUrl}
              onChange={(e) => setNuevaUrl(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
              onKeyPress={handleKeyPress}
              disabled={uploading || loading}
              className="flex-1"
            />
            <ZenButton
              onClick={handleUpdateUrl}
              size="sm"
              loading={uploading}
              disabled={!nuevaUrl.trim() || uploading || loading}
            >
              Guardar
            </ZenButton>
            <ZenButton
              variant="outline"
              size="sm"
              onClick={() => {
                setShowUrlInput(false);
                setNuevaUrl('');
              }}
              disabled={uploading || loading}
            >
              Cancelar
            </ZenButton>
          </div>
        </div>
      )}

      {/* Botón para agregar URL si no hay archivo */}
      {!url && !showUrlInput && (
        <div className="mt-4">
          <ZenButton
            variant="outline"
            size="sm"
            onClick={() => setShowUrlInput(true)}
            disabled={uploading || loading}
            className="w-full hover:bg-zinc-800/50 transition-colors duration-200"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Agregar URL
          </ZenButton>
          <p className="text-xs text-zinc-500 text-center mt-2">
            O proporciona una URL directa a tu imagen
          </p>
        </div>
      )}
    </div>
  );
}
