'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { Label } from '@/components/ui/shadcn/label';
import { Textarea } from '@/components/ui/shadcn/textarea';
import { Switch } from '@/components/ui/shadcn/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { Loader2, Tag, Palette, Type, Hash } from 'lucide-react';
import { ProfessionalProfile, ProfessionalProfileCreateForm, ProfessionalProfileUpdateForm } from '../types';

interface ProfessionalProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { name: string }) => Promise<void>;
    perfil?: ProfessionalProfile | null;
    loading?: boolean;
}

const COLORES_PREDEFINIDOS = [
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#10B981', // Green
    '#F59E0B', // Yellow
    '#EF4444', // Red
    '#06B6D4', // Cyan
    '#84CC16', // Lime
    '#F97316', // Orange
];

const ICONOS_PREDEFINIDOS = [
    'Camera', 'Edit', 'User', 'Users', 'Video', 'Image', 'Settings', 'Star',
    'Heart', 'Zap', 'Target', 'Award', 'Shield', 'Book', 'Code', 'Palette',
    'Film', 'Monitor', 'Headphones', 'Mic', 'Lightbulb', 'Scissors', 'Brush'
];

export function ProfessionalProfileModal({
    isOpen,
    onClose,
    onSave,
    perfil,
    loading = false
}: ProfessionalProfileModalProps) {
    const [formData, setFormData] = useState<ProfessionalProfileCreateForm>({
        name: '',
    });
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Reset form cuando cambia el perfil o se abre/cierra
    useEffect(() => {
        if (isOpen) {
            if (perfil) {
                // Modo edición
                setFormData({
                    name: perfil.name,
                });
            } else {
                // Modo creación
                setFormData({
                    name: '',
                });
            }
            setErrors({});
        }
    }, [isOpen, perfil]);

    const handleInputChange = (field: keyof ProfessionalProfileCreateForm, value: string | boolean | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Limpiar error del campo
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            console.error('Error saving perfil:', error);
        } finally {
            setSaving(false);
        }
    };

    const isFormValid = formData.name.trim() && !saving && !loading;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        {perfil ? 'Editar Perfil Profesional' : 'Crear Perfil Profesional'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {perfil
                            ? 'Modifica la información del perfil profesional'
                            : 'Crea un nuevo perfil profesional para tu equipo'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                            Nombre del Perfil *
                        </Label>
                        <div className="relative">
                            <Type className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Ej: Fotógrafo, Editor, Coordinador"
                                className="pl-10 bg-zinc-800 border-zinc-600 text-white"
                                required
                                disabled={saving || loading}
                            />
                        </div>
                        {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
                    </div>


                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={saving || loading}
                            className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isFormValid}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {perfil ? 'Actualizando...' : 'Creando...'}
                                </>
                            ) : (
                                perfil ? 'Actualizar Perfil' : 'Crear Perfil'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}