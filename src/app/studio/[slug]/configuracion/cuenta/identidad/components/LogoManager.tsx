'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useFileUpload } from '@/hooks/useFileUpload';
import { ALLOWED_MIME_TYPES } from '@/lib/actions/schemas/media-schemas';

interface LogoManagerProps {
  tipo: 'logo' | 'isotipo';
  url?: string | null;
  onUpdate: (url: string) => Promise<void>;
  onLocalUpdate: (url: string | null) => void;
  studioSlug: string;
  loading?: boolean;
}

export function LogoManager({ 
  tipo, 
  url, 
  onUpdate, 
  onLocalUpdate,
  studioSlug,
  loading = false 
}: LogoManagerProps) {
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

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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
    // Actualización optimista - actualizar UI inmediatamente
    onLocalUpdate(null);
    
    try {
      if (url) {
        await deleteFile(url);
      }
      await onUpdate('');
      toast.success(`${tipo === 'logo' ? 'Logo' : 'Isotipo'} eliminado`);
    } catch {
      // Revertir cambios en caso de error
      onLocalUpdate(url || null);
      toast.error(`Error al eliminar ${tipo === 'logo' ? 'logo' : 'isotipo'}`);
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
          <div className="w-full h-32 bg-zinc-800 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-700">
            <ImageIcon className="h-8 w-8 text-zinc-500" />
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || loading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Cambiar {titulo}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRemoveUrl}
              disabled={uploading || loading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-full h-32 bg-zinc-800 rounded-lg flex items-center justify-center border-2 border-dashed border-zinc-700">
            <div className="text-center">
              <Upload className="h-8 w-8 text-zinc-500 mx-auto mb-2" />
              <p className="text-zinc-500 text-sm">Subir {titulo}</p>
              <p className="text-zinc-600 text-xs mt-1">PNG, SVG (máx. 5MB)</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || loading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Seleccionar Archivo
          </Button>
        </div>
      )}

      {/* Input de archivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".png,.svg,image/png,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Barra de progreso */}
      {uploading && (
        <div className="w-full bg-zinc-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Mostrar error si existe */}
      {error && (
        <div className="text-red-400 text-sm">
          {error}
        </div>
      )}

      {showUrlInput && (
        <div className="space-y-2">
          <Label htmlFor={`url-${tipo}`} className="text-zinc-300">
            URL del {titulo}
          </Label>
          <div className="flex space-x-2">
            <Input
              id={`url-${tipo}`}
              value={nuevaUrl}
              onChange={(e) => setNuevaUrl(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
              placeholder="https://ejemplo.com/imagen.jpg"
              onKeyPress={handleKeyPress}
              disabled={uploading || loading}
            />
            <Button
              onClick={handleUpdateUrl}
              size="sm"
              disabled={!nuevaUrl.trim() || uploading || loading}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Guardar'
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowUrlInput(false);
                setNuevaUrl('');
              }}
              disabled={uploading || loading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
