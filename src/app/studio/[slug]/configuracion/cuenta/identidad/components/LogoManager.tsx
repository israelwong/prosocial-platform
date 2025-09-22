'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface LogoManagerProps {
  tipo: 'logo' | 'isotipo';
  url?: string | null;
  onUpdate: (url: string) => Promise<void>;
  loading?: boolean;
}

export function LogoManager({ 
  tipo, 
  url, 
  onUpdate, 
  loading = false 
}: LogoManagerProps) {
  const [nuevaUrl, setNuevaUrl] = useState('');
  const [updating, setUpdating] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleUpdateUrl = async () => {
    if (!nuevaUrl.trim()) return;
    
    setUpdating(true);
    try {
      await onUpdate(nuevaUrl.trim());
      setNuevaUrl('');
      setShowUrlInput(false);
      toast.success(`${tipo === 'logo' ? 'Logo' : 'Isotipo'} actualizado`);
    } catch (error) {
      toast.error(`Error al actualizar ${tipo === 'logo' ? 'logo' : 'isotipo'}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveUrl = async () => {
    setUpdating(true);
    try {
      await onUpdate('');
      toast.success(`${tipo === 'logo' ? 'Logo' : 'Isotipo'} eliminado`);
    } catch (error) {
      toast.error(`Error al eliminar ${tipo === 'logo' ? 'logo' : 'isotipo'}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleUpdateUrl();
    }
  };

  const titulo = tipo === 'logo' ? 'Logo Principal' : 'Isotipo';
  const descripcion = tipo === 'logo' 
    ? 'Logo completo con texto (header, tarjetas, documentos)'
    : 'Símbolo o ícono sin texto (favicon, redes sociales)';

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
              onClick={() => setShowUrlInput(true)}
              disabled={updating || loading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Cambiar {titulo}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRemoveUrl}
              disabled={updating || loading}
            >
              {updating ? (
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
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => setShowUrlInput(true)}
            disabled={updating || loading}
          >
            <Upload className="h-4 w-4 mr-2" />
            Seleccionar Archivo
          </Button>
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
              disabled={updating || loading}
            />
            <Button
              onClick={handleUpdateUrl}
              size="sm"
              disabled={!nuevaUrl.trim() || updating || loading}
            >
              {updating ? (
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
              disabled={updating || loading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
