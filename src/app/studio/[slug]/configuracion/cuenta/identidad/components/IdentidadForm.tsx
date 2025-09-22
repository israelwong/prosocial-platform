'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { IdentidadData, IdentidadUpdate } from '../types';

interface IdentidadFormProps {
  data: IdentidadData;
  onUpdate: (data: IdentidadUpdate) => Promise<void>;
  loading?: boolean;
}

export function IdentidadForm({ 
  data, 
  onUpdate, 
  loading = false 
}: IdentidadFormProps) {
  const [formData, setFormData] = useState({
    nombre: data.name || '',
    slogan: data.slogan || '',
    descripcion: data.descripcion || '',
  });
  const [saving, setSaving] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await onUpdate(formData);
      toast.success('Información básica actualizada');
    } catch (error) {
      toast.error('Error al actualizar información');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges = 
    formData.nombre !== data.name ||
    formData.slogan !== (data.slogan || '') ||
    formData.descripcion !== (data.descripcion || '');

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="nombre" className="text-zinc-300">
            Nombre del Negocio *
          </Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => handleInputChange('nombre', e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Ej: Studio Fotografía María"
            required
            disabled={saving || loading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slogan" className="text-zinc-300">
            Slogan
          </Label>
          <Input
            id="slogan"
            value={formData.slogan}
            onChange={(e) => handleInputChange('slogan', e.target.value)}
            className="bg-zinc-800 border-zinc-700 text-white"
            placeholder="Ej: Capturando momentos únicos"
            disabled={saving || loading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion" className="text-zinc-300">
          Descripción
        </Label>
        <Textarea
          id="descripcion"
          value={formData.descripcion}
          onChange={(e) => handleInputChange('descripcion', e.target.value)}
          className="bg-zinc-800 border-zinc-700 text-white min-h-[100px]"
          placeholder="Describe tu estudio, servicios y experiencia..."
          disabled={saving || loading}
        />
      </div>

      {hasChanges && (
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!formData.nombre.trim() || saving || loading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar Cambios'
            )}
          </Button>
        </div>
      )}
    </form>
  );
}
