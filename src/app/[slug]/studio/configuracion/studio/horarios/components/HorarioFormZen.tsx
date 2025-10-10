'use client';

import React, { useState } from 'react';
import { ZenButton } from '@/components/ui/zen';
import { ZenInput } from '@/components/ui/zen';
import { ZenSelect } from '@/components/ui/zen';
import { DIAS_SEMANA_OPTIONS } from '@/lib/actions/schemas/horarios-schemas';

interface HorarioFormZenProps {
    initialData?: {
        day_of_week: string;
        start_time: string;
        end_time: string;
        is_active: boolean;
    };
    onSubmit: (data: { day_of_week: string; start_time: string; end_time: string; is_active: boolean }) => Promise<void>;
    onCancel: () => void;
    submitLabel?: string;
    loading?: boolean;
}

export function HorarioFormZen({
    initialData,
    onSubmit,
    onCancel,
    submitLabel = "Guardar",
    loading = false
}: HorarioFormZenProps) {
    const [formData, setFormData] = useState({
        day_of_week: initialData?.day_of_week || 'monday',
        start_time: initialData?.start_time || '09:00',
        end_time: initialData?.end_time || '18:00',
        is_active: initialData?.is_active ?? true,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Validar horarios
        if (formData.start_time >= formData.end_time) {
            newErrors.end_time = 'La hora de fin debe ser posterior a la hora de inicio';
        }

        // Validar formato de horas
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        if (!timeRegex.test(formData.start_time)) {
            newErrors.start_time = 'Formato de hora inválido (HH:MM)';
        }
        if (!timeRegex.test(formData.end_time)) {
            newErrors.end_time = 'Formato de hora inválido (HH:MM)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await onSubmit(formData);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Día de la semana */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                        Día de la semana
                    </label>
                    <ZenSelect
                        value={formData.day_of_week}
                        onValueChange={(value) => handleInputChange('day_of_week', value)}
                        options={DIAS_SEMANA_OPTIONS}
                        placeholder="Selecciona un día"
                        error={errors.day_of_week}
                    />
                </div>

                {/* Estado */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                        Estado
                    </label>
                    <ZenSelect
                        value={formData.is_active ? 'active' : 'inactive'}
                        onValueChange={(value) => handleInputChange('is_active', value === 'active')}
                        options={[
                            { value: 'active', label: 'Activo' },
                            { value: 'inactive', label: 'Inactivo' },
                        ]}
                        placeholder="Selecciona estado"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hora de inicio */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                        Hora de inicio
                    </label>
                    <ZenInput
                        type="time"
                        value={formData.start_time}
                        onChange={(e) => handleInputChange('start_time', e.target.value)}
                        error={errors.start_time}
                        placeholder="09:00"
                    />
                </div>

                {/* Hora de fin */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-white">
                        Hora de fin
                    </label>
                    <ZenInput
                        type="time"
                        value={formData.end_time}
                        onChange={(e) => handleInputChange('end_time', e.target.value)}
                        error={errors.end_time}
                        placeholder="18:00"
                    />
                </div>
            </div>

            {/* Botones */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-700">
                <ZenButton
                    type="button"
                    onClick={onCancel}
                    variant="outline"
                    disabled={loading}
                >
                    Cancelar
                </ZenButton>
                <ZenButton
                    type="submit"
                    variant="primary"
                    loading={loading}
                    disabled={loading}
                >
                    {submitLabel}
                </ZenButton>
            </div>
        </form>
    );
}
