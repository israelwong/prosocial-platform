'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { ZenButton, ZenInput, ZenTextarea } from '@/components/ui/zen';
import { IdentidadData, IdentidadUpdate } from '../types';

interface IdentidadFormZenProps {
  data: IdentidadData;
  onUpdate: (data: IdentidadUpdate) => Promise<void>;
  onLocalUpdate: (data: Partial<IdentidadData>) => void;
  loading?: boolean;
}

/**
 * IdentidadFormZen - Formulario refactorizado usando ZEN Design System
 * 
 * Mejoras sobre la versión original:
 * - ✅ Componentes ZEN unificados (ZenInput, ZenTextarea, ZenButton)
 * - ✅ Labels integrados en los inputs
 * - ✅ Estados de error y loading consistentes
 * - ✅ Tema oscuro zinc unificado
 * - ✅ Accesibilidad mejorada
 * - ✅ Espaciado consistente con design tokens
 */
export function IdentidadFormZen({
  data,
  onUpdate,
  onLocalUpdate,
  loading = false
}: IdentidadFormZenProps) {
  const [formData, setFormData] = useState({
    nombre: data.studio_name || '',
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

    // Actualización optimista - actualizar UI inmediatamente
    onLocalUpdate({
      studio_name: formData.nombre,
      slogan: formData.slogan || null,
      descripcion: formData.descripcion || null,
    });

    try {
      await onUpdate(formData);
      toast.success('Información básica actualizada');
    } catch (error) {
      // Revertir cambios en caso de error
      onLocalUpdate({
        studio_name: data.studio_name,
        slogan: data.slogan,
        descripcion: data.descripcion,
      });
      toast.error('Error al actualizar información');
    } finally {
      setSaving(false);
    }
  };

  const hasChanges =
    formData.nombre !== data.studio_name ||
    formData.slogan !== (data.slogan || '') ||
    formData.descripcion !== (data.descripcion || '');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Grid de campos básicos */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Nombre del negocio */}
        <ZenInput
          label="Nombre del Negocio"
          required
          value={formData.nombre}
          onChange={(e) => handleInputChange('nombre', e.target.value)}
          placeholder="Ej: Studio Fotografía María"
          disabled={saving || loading}
          hint="Este nombre aparecerá en tu perfil público y documentos"
        />

        {/* Slogan */}
        <ZenInput
          label="Slogan"
          value={formData.slogan}
          onChange={(e) => handleInputChange('slogan', e.target.value)}
          placeholder="Ej: Capturando momentos únicos"
          disabled={saving || loading}
          hint="Frase corta que describe tu estudio"
        />
      </div>

      {/* Descripción */}
      <ZenTextarea
        label="Descripción"
        value={formData.descripcion}
        onChange={(e) => handleInputChange('descripcion', e.target.value)}
        placeholder="Describe tu estudio, servicios y experiencia..."
        disabled={saving || loading}
        minRows={4}
        maxLength={500}
        hint="Esta descripción aparecerá en tu landing page y cotizaciones"
      />

      {/* Botón de guardar */}
      <div className="flex justify-end pt-4">
        <ZenButton
          type="submit"
          variant="primary"
          size="md"
          disabled={!formData.nombre.trim() || !hasChanges || loading}
          loading={saving}
          loadingText="Guardando..."
        >
          Guardar Cambios
        </ZenButton>
      </div>
    </form>
  );
}
