'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Tag, Palette, Type, Hash } from 'lucide-react';
import { ProfessionalProfile, ProfessionalProfileCreateForm, ProfessionalProfileUpdateForm } from '../types';

interface ProfessionalProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProfessionalProfileCreateForm | ProfessionalProfileUpdateForm) => Promise<void>;
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
    'Heart', 'Zap', 'Target', 'Award', 'Shield', 'Book', 'Code', 'Palette'
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
        slug: '',
        description: '',
        color: '#3B82F6',
        icon: 'Tag',
        isActive: true,
        order: 0,
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
                    slug: perfil.slug,
                    description: perfil.description || '',
                    color: perfil.color || '#3B82F6',
                    icon: perfil.icon || 'Tag',
                    isActive: perfil.isActive,
                    order: perfil.order,
                });
            } else {
                // Modo creación
                setFormData({
                    name: '',
                    slug: '',
                    description: '',
                    color: '#3B82F6',
                    icon: 'Tag',
                    isActive: true,
                    order: 0,
                });
            }
            setErrors({});
        }
    }, [isOpen, perfil]);

    const handleInputChange = (field: keyof ProfessionalProfileCreateForm, value: string | boolean | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        
        // Auto-generar slug desde el nombre
        if (field === 'name' && typeof value === 'string') {
            const slug = value
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '') // Remover acentos
                .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
                .replace(/\s+/g, '-') // Espacios a guiones
                .replace(/-+/g, '-') // Múltiples guiones a uno
                .trim();
            
            setFormData(prev => ({ ...prev, slug }));
        }
        
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

        if (!formData.slug.trim()) {
            newErrors.slug = 'El slug es requerido';
        } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
            newErrors.slug = 'El slug solo puede contener letras minúsculas, números y guiones';
        }

        if (formData.color && !/^#[0-9A-F]{6}$/i.test(formData.color)) {
            newErrors.color = 'El color debe ser un código hex válido (ej: #3B82F6)';
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

    const isFormValid = formData.name.trim() && formData.slug.trim() && !saving && !loading;

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

                    {/* Slug */}
                    <div className="space-y-2">
                        <Label htmlFor="slug" className="text-white">
                            Slug (URL) *
                        </Label>
                        <div className="relative">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => handleInputChange('slug', e.target.value)}
                                placeholder="fotografo, editor, coordinador"
                                className="pl-10 bg-zinc-800 border-zinc-600 text-white"
                                required
                                disabled={saving || loading}
                            />
                        </div>
                        {errors.slug && <p className="text-red-400 text-xs">{errors.slug}</p>}
                        <p className="text-xs text-zinc-500">
                            Se genera automáticamente desde el nombre. Solo letras minúsculas, números y guiones.
                        </p>
                    </div>

                    {/* Descripción */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">
                            Descripción
                        </Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Describe las responsabilidades de este perfil..."
                            className="bg-zinc-800 border-zinc-600 text-white"
                            rows={3}
                            disabled={saving || loading}
                        />
                    </div>

                    {/* Color */}
                    <div className="space-y-2">
                        <Label className="text-white">Color del perfil</Label>
                        <div className="flex items-center space-x-2">
                            <div className="flex space-x-1">
                                {COLORES_PREDEFINIDOS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => handleInputChange('color', color)}
                                        className={`w-8 h-8 rounded-full border-2 ${
                                            formData.color === color 
                                                ? 'border-white' 
                                                : 'border-zinc-600 hover:border-zinc-400'
                                        }`}
                                        style={{ backgroundColor: color }}
                                        disabled={saving || loading}
                                    />
                                ))}
                            </div>
                            <div className="flex-1">
                                <Input
                                    value={formData.color}
                                    onChange={(e) => handleInputChange('color', e.target.value)}
                                    placeholder="#3B82F6"
                                    className="bg-zinc-800 border-zinc-600 text-white"
                                    disabled={saving || loading}
                                />
                            </div>
                        </div>
                        {errors.color && <p className="text-red-400 text-xs">{errors.color}</p>}
                    </div>

                    {/* Icono */}
                    <div className="space-y-2">
                        <Label className="text-white">Icono</Label>
                        <div className="grid grid-cols-8 gap-2">
                            {ICONOS_PREDEFINIDOS.map((icono) => (
                                <button
                                    key={icono}
                                    type="button"
                                    onClick={() => handleInputChange('icon', icono)}
                                    className={`p-2 rounded-lg border ${
                                        formData.icon === icono
                                            ? 'border-blue-500 bg-blue-900/20'
                                            : 'border-zinc-600 hover:border-zinc-400'
                                    }`}
                                    disabled={saving || loading}
                                >
                                    <Tag className="h-4 w-4 text-zinc-400" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Estado activo */}
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-white">Perfil Activo</Label>
                            <p className="text-xs text-zinc-500">
                                Los perfiles inactivos no aparecerán en las opciones de asignación
                            </p>
                        </div>
                        <Switch
                            checked={formData.isActive}
                            onCheckedChange={(checked) => handleInputChange('isActive', checked)}
                            disabled={saving || loading}
                        />
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