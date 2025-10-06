'use client';

import React, { useState, useRef } from 'react';
import { ZenButton } from '@/components/ui/zen/base/ZenButton';
import { ZenInput } from '@/components/ui/zen/base/ZenInput';
import { ZenLabel } from '@/components/ui/zen/base/ZenLabel';
import { Upload, ExternalLink, User } from 'lucide-react';
import { toast } from 'sonner';
import { useFileUpload } from '@/hooks/useFileUpload';
import { Dropzone } from '@/components/ui/shadcn/dropzone';
import { FilePreview } from '@/components/ui/shadcn/file-preview';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/shadcn/avatar';

interface AvatarManagerZenProps {
  url?: string | null | undefined;
  onUpdate: (url: string) => Promise<void>;
  onLocalUpdate: (url: string | null) => void;
  studioSlug: string;
  loading?: boolean;
}

export function AvatarManagerZen({
  url,
  onUpdate,
  onLocalUpdate,
  studioSlug,
  loading = false
}: AvatarManagerZenProps) {
  const [nuevaUrl, setNuevaUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hook para upload de archivos
  const { uploading, progress, error, uploadFile, deleteFile } = useFileUpload({
    studioSlug,
    category: 'identidad',
    subcategory: 'avatars',
    allowedMimeTypes: ['image/jpeg', 'image/png'], // Solo JPG y PNG
    maxSize: 2, // 2MB (después de optimización)
    onSuccess: (newUrl) => {
      onLocalUpdate(newUrl);
      onUpdate(newUrl);
    },
    onError: (error) => {
      toast.error(error);
    }
  });

  // Función para optimizar imagen
  const optimizeImage = (file: File, maxSize: number = 2 * 1024 * 1024): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Redimensionar a 400x400 máximo manteniendo aspect ratio
        const maxDimension = 400;
        let { width, height } = img;

        if (width > height) {
          if (width > maxDimension) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          }
        } else {
          if (height > maxDimension) {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);

        // Convertir a blob con calidad 0.8
        canvas.toBlob((blob) => {
          if (blob) {
            const optimizedFile = new File([blob], file.name, { type: 'image/jpeg' });
            resolve(optimizedFile);
          } else {
            resolve(file);
          }
        }, 'image/jpeg', 0.8);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    // Validar tipo de archivo
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      toast.error('Solo se permiten archivos JPG y PNG para tu foto de perfil.');
      return;
    }

    // Validar tamaño inicial (10MB máximo antes de optimizar)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('La imagen es demasiado grande. Por favor selecciona una imagen más pequeña.');
      return;
    }

    // Actualización optimista
    onLocalUpdate(URL.createObjectURL(file));

    try {
      // Optimizar imagen antes de subir
      const optimizedFile = await optimizeImage(file);

      const result = await uploadFile(optimizedFile);
      if (result.success && result.publicUrl) {
        await onUpdate(result.publicUrl);
        toast.success('¡Perfecto! Tu foto de perfil se ha actualizado correctamente');
      } else {
        // Revertir cambios en caso de error
        onLocalUpdate(url || null);
        toast.error(result.error || 'No pudimos subir tu foto. Inténtalo de nuevo.');
      }
    } catch (error) {
      // Revertir cambios en caso de error
      onLocalUpdate(url || null);
      toast.error('Ocurrió un problema al subir tu foto. Por favor inténtalo de nuevo.');
      console.error('Error al subir archivo:', error);
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
      toast.success('¡Excelente! Tu foto de perfil se ha actualizado');
    } catch {
      // Revertir cambios en caso de error
      onLocalUpdate(url || null);
      setNuevaUrl(urlTrimmed);
      setShowUrlInput(true);
      toast.error('No pudimos actualizar tu foto. Verifica que la URL sea correcta');
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
      toast.success('Tu foto de perfil se ha eliminado');
    } catch (error) {
      // Revertir cambios en caso de error
      onLocalUpdate(originalUrl);
      toast.error('No pudimos eliminar tu foto. Inténtalo de nuevo');
      console.error('Error al eliminar archivo:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUpdateUrl();
    }
  };

  return (
    <div className="space-y-4">
      {url ? (
        <div className="space-y-4">
          {/* Previsualización del avatar grande minimalista */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-48 h-48">
              <AvatarImage
                src={url}
                alt="Avatar"
                className="object-cover object-center"
              />
              <AvatarFallback>
                <User className="h-16 w-16" />
              </AvatarFallback>
            </Avatar>

            {/* Botones minimalistas */}
            <div className="flex gap-3">
              <ZenButton
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                loading={uploading}
                disabled={uploading || loading}
                className="text-zinc-300 hover:text-white border-zinc-600 hover:border-zinc-500"
              >
                <Upload className="h-4 w-4 mr-2" />
                Cambiar foto
              </ZenButton>

              <ZenButton
                variant="outline"
                size="sm"
                onClick={handleRemoveUrl}
                disabled={uploading || loading}
                className="text-red-400 hover:text-red-300 border-red-600 hover:border-red-500"
              >
                Eliminar
              </ZenButton>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Dropzone personalizado con ZEN styling */}
          <div className="relative">
            <Dropzone
              onFileSelect={handleFileSelect}
              acceptedFileTypes={{
                'image/jpeg': ['.jpg', '.jpeg'],
                'image/png': ['.png']
              }}
              maxSize={10}
              maxFiles={1}
              disabled={uploading || loading}
              className="h-44 border border-dashed border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900/20 transition-all duration-300 rounded-lg group cursor-pointer relative overflow-hidden"
            >
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                {/* Icono principal */}
                <div className="w-12 h-12 mb-3 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-zinc-700 transition-colors duration-200">
                  <User className="h-6 w-6 text-zinc-400 group-hover:text-zinc-300 transition-colors duration-200" />
                </div>

                {/* Texto principal */}
                <h3 className="text-zinc-200 text-sm font-medium mb-1">
                  Subir Avatar
                </h3>

                {/* Especificaciones técnicas */}
                <p className="text-zinc-400 text-xs mb-3">
                  JPG, PNG (hasta 10MB, se optimizará automáticamente)
                </p>

                {/* Instrucciones de uso */}
                <p className="text-zinc-500 text-xs">
                  Arrastra y suelta o haz clic para seleccionar
                </p>
              </div>
            </Dropzone>

            {/* Indicador de estado de carga */}
            {uploading && (
              <div className="absolute inset-0 bg-zinc-900/90 backdrop-blur-sm rounded-lg flex items-center justify-center z-20">
                <div className="text-center">
                  <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-2" />
                  <p className="text-zinc-200 text-sm">Subiendo...</p>
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
        accept=".jpg,.jpeg,.png,image/jpeg,image/png"
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
          <ZenLabel htmlFor="url-avatar">
            URL del Avatar
          </ZenLabel>
          <div className="flex space-x-2">
            <ZenInput
              id="url-avatar"
              label=""
              value={nuevaUrl}
              onChange={(e) => setNuevaUrl(e.target.value)}
              placeholder="https://ejemplo.com/avatar.jpg"
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
