'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

interface PalabrasClaveManagerProps {
  palabrasClave: string[];
  onUpdate: (palabras: string[]) => Promise<void>;
  onLocalUpdate: (palabras: string[]) => void;
  loading?: boolean;
}

export function PalabrasClaveManager({
  palabrasClave,
  onUpdate,
  onLocalUpdate,
  loading = false
}: PalabrasClaveManagerProps) {
  const [nuevaPalabra, setNuevaPalabra] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleAddPalabra = async () => {
    if (!nuevaPalabra.trim()) return;

    const palabraTrimmed = nuevaPalabra.trim();
    if (palabrasClave.includes(palabraTrimmed)) {
      toast.error('Esta palabra clave ya existe');
      return;
    }

    const nuevasPalabras = [...palabrasClave, palabraTrimmed];
    setUpdating(true);

    // Actualización optimista - actualizar UI inmediatamente
    onLocalUpdate(nuevasPalabras);
    setNuevaPalabra('');

    try {
      await onUpdate(nuevasPalabras);
      toast.success('Palabra clave agregada');
    } catch (error) {
      // Revertir cambios en caso de error
      onLocalUpdate(palabrasClave);
      setNuevaPalabra(palabraTrimmed);
      toast.error('Error al agregar palabra clave');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemovePalabra = async (palabra: string) => {
    const nuevasPalabras = palabrasClave.filter(p => p !== palabra);
    setUpdating(true);

    // Actualización optimista - actualizar UI inmediatamente
    onLocalUpdate(nuevasPalabras);

    try {
      await onUpdate(nuevasPalabras);
      toast.success('Palabra clave eliminada');
    } catch (error) {
      // Revertir cambios en caso de error
      onLocalUpdate(palabrasClave);
      toast.error('Error al eliminar palabra clave');
    } finally {
      setUpdating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddPalabra();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {palabrasClave.map((palabra, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-zinc-800 text-zinc-300"
          >
            {palabra}
            <button
              onClick={() => handleRemovePalabra(palabra)}
              className="ml-2 hover:text-red-400 disabled:opacity-50"
              disabled={updating || loading}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>

      <div className="flex space-x-2">
        <Input
          value={nuevaPalabra}
          onChange={(e) => setNuevaPalabra(e.target.value)}
          placeholder="Agregar palabra clave"
          onKeyPress={handleKeyPress}
          disabled={updating || loading}
        />
        <Button
          onClick={handleAddPalabra}
          variant="outline"
          size="sm"
          disabled={!nuevaPalabra.trim() || updating || loading}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
