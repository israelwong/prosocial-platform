'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Tag,
    Save,
    X,
    Camera,
    Video,
    Scissors,
    Palette as PaletteIcon,
    Zap,
    User,
    Users,
    Briefcase,
    Award,
    Star as StarIcon,
    Heart,
    Shield,
    Target,
    Lightbulb,
    Rocket,
} from 'lucide-react';
import { toast } from 'sonner';
import {
    ProfessionalProfileCreateSchema,
    PROFILE_COLORS,
    type ProfessionalProfileCreateForm,
} from '@/lib/actions/schemas/professional-profiles-schemas';

interface ProfessionalProfile {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    color: string | null;
    icon: string | null;
    isActive: boolean;
    isDefault: boolean;
    order: number;
}

interface ProfessionalProfileModalProps {
    mode: 'create' | 'edit';
    perfil?: ProfessionalProfile | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export function ProfessionalProfileModal({
    mode,
    perfil,
    open,
    onOpenChange,
    trigger
}: ProfessionalProfileModalProps) {
    const [formData, setFormData] = useState<ProfessionalProfileCreateForm>({
        name: '',
        slug: '',
        description: '',
        color: '#3B82F6',
        icon: 'Camera',
        isActive: true,
        order: 0,
    });

    const [isLoading, setIsLoading] = useState(false);

    // Iconos disponibles con componentes
    const iconOptions: Array<{
        value: string;
        label: string;
        icon: React.ComponentType<{ className?: string }>;
    }> = [
            { value: 'Camera', label: 'Cámara', icon: Camera },
            { value: 'Video', label: 'Video', icon: Video },
            { value: 'Scissors', label: 'Tijeras', icon: Scissors },
            { value: 'Palette', label: 'Paleta', icon: PaletteIcon },
            { value: 'Zap', label: 'Rayo', icon: Zap },
            { value: 'User', label: 'Usuario', icon: User },
            { value: 'Users', label: 'Usuarios', icon: Users },
            { value: 'Briefcase', label: 'Maletín', icon: Briefcase },
            { value: 'Award', label: 'Premio', icon: Award },
            { value: 'Star', label: 'Estrella', icon: StarIcon },
            { value: 'Heart', label: 'Corazón', icon: Heart },
            { value: 'Shield', label: 'Escudo', icon: Shield },
            { value: 'Target', label: 'Objetivo', icon: Target },
            { value: 'Lightbulb', label: 'Bombilla', icon: Lightbulb },
            { value: 'Rocket', label: 'Cohete', icon: Rocket },
        ];

    // Inicializar formulario
    useEffect(() => {
        if (mode === 'edit' && perfil) {
            setFormData({
                name: perfil.name,
                slug: perfil.slug,
                description: perfil.description || '',
                color: perfil.color || '#3B82F6',
                icon: perfil.icon || 'Camera',
                isActive: perfil.isActive,
                order: perfil.order,
            });
        } else {
            setFormData({
                name: '',
                slug: '',
                description: '',
                color: '#3B82F6',
                icon: 'Camera',
                isActive: true,
                order: 0,
            });
        }
    }, [mode, perfil, open]);

    // Generar slug automáticamente
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remover acentos
            .replace(/[^a-z0-9\s-]/g, '') // Solo letras, números, espacios y guiones
            .replace(/\s+/g, '-') // Espacios a guiones
            .replace(/-+/g, '-') // Múltiples guiones a uno
            .replace(/^-|-$/g, ''); // Remover guiones al inicio y final
    };

    const handleNameChange = (name: string) => {
        setFormData(prev => ({
            ...prev,
            name,
            slug: prev.slug || generateSlug(name),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validar datos
            const validatedData = ProfessionalProfileCreateSchema.parse(formData);

            // TODO: Implementar llamada a Server Action
            console.log('Datos validados:', validatedData);

            toast.success(
                mode === 'create'
                    ? 'Perfil profesional creado exitosamente'
                    : 'Perfil profesional actualizado exitosamente'
            );

            onOpenChange(false);
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al guardar el perfil profesional');
        } finally {
            setIsLoading(false);
        }
    };

    const getIconComponent = (iconName: string) => {
        const iconOption = iconOptions.find(option => option.value === iconName);
        return iconOption ? <iconOption.icon className="h-4 w-4" /> : <Camera className="h-4 w-4" />;
    };

    return (
        <>
            {trigger}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="bg-zinc-900 border-zinc-700 text-white max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-white flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            {mode === 'create' ? 'Crear Perfil Profesional' : 'Editar Perfil Profesional'}
                        </DialogTitle>
                        <DialogDescription className="text-zinc-400">
                            {mode === 'create'
                                ? 'Crea un nuevo perfil profesional para tu equipo'
                                : 'Modifica la información del perfil profesional'
                            }
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-zinc-300">Nombre del Perfil</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Ej: Fotógrafo, Camarógrafo, Editor..."
                                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                    required
                                />
                            </div>

                            {/* Slug */}
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-zinc-300">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    placeholder="fotografo, camarografo, editor..."
                                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                    required
                                />
                                <p className="text-xs text-zinc-500">
                                    Se genera automáticamente desde el nombre
                                </p>
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="description" className="text-zinc-300">Descripción</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Describe las responsabilidades y habilidades de este perfil..."
                                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
                                    rows={3}
                                />
                            </div>

                            {/* Color */}
                            <div className="space-y-2">
                                <Label className="text-zinc-300">Color del Perfil</Label>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-8 h-8 rounded border border-zinc-600"
                                        style={{ backgroundColor: formData.color }}
                                    />
                                    <Select
                                        value={formData.color}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))}
                                    >
                                        <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-800 border-zinc-700">
                                            {PROFILE_COLORS.map((color) => (
                                                <SelectItem key={color} value={color}>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-4 h-4 rounded"
                                                            style={{ backgroundColor: color }}
                                                        />
                                                        <span>{color}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Icono */}
                            <div className="space-y-2">
                                <Label className="text-zinc-300">Icono del Perfil</Label>
                                <Select
                                    value={formData.icon}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))}
                                >
                                    <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                                        <SelectValue>
                                            <div className="flex items-center gap-2">
                                                {getIconComponent(formData.icon || 'Camera')}
                                                <span>{formData.icon || 'Camera'}</span>
                                            </div>
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-800 border-zinc-700">
                                        {iconOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                <div className="flex items-center gap-2">
                                                    <option.icon className="h-4 w-4" />
                                                    <span>{option.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Estado activo */}
                            <div className="flex items-center justify-between md:col-span-2">
                                <div className="space-y-1">
                                    <Label className="text-zinc-300">Perfil Activo</Label>
                                    <p className="text-xs text-zinc-500">
                                        Los perfiles inactivos no aparecerán en las opciones de asignación
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.isActive}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                                />
                            </div>
                        </div>

                        {/* Vista previa */}
                        <div className="space-y-2">
                            <Label className="text-zinc-300">Vista Previa</Label>
                            <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ backgroundColor: formData.color }}
                                    >
                                        {getIconComponent(formData.icon || 'Camera')}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white">{formData.name || 'Nombre del perfil'}</span>
                                            <Badge
                                                variant="secondary"
                                                className="text-xs"
                                                style={{ backgroundColor: (formData.color || '#3B82F6') + '20', color: formData.color || '#3B82F6' }}
                                            >
                                                {formData.slug || 'slug'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-zinc-400">
                                            {formData.description || 'Descripción del perfil...'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                            >
                                <X className="h-4 w-4 mr-2" />
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {isLoading ? 'Guardando...' : (mode === 'create' ? 'Crear Perfil' : 'Actualizar Perfil')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
