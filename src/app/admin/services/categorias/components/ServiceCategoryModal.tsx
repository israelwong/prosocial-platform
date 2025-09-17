'use client';

import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ServiceCategory, CreateServiceCategoryData } from '../types';

interface ServiceCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: ServiceCategory | null;
    onSave: (category: ServiceCategory) => void;
    existingCategories?: ServiceCategory[];
}

export function ServiceCategoryModal({
    isOpen,
    onClose,
    category,
    onSave,
    existingCategories = []
}: ServiceCategoryModalProps) {
    const [formData, setFormData] = useState<CreateServiceCategoryData>({
        name: '',
        description: '',
        icon: '',
        posicion: 0,
        active: true
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (category) {
            setFormData({
                name: category.name,
                description: category.description,
                icon: category.icon,
                posicion: category.posicion,
                active: category.active
            });
        } else {
            // Para nuevas categorías, calcular posición automáticamente
            const nextPosition = existingCategories.length + 1;
            setFormData({
                name: '',
                description: '',
                icon: '',
                posicion: nextPosition,
                active: true
            });
        }
    }, [category, existingCategories.length]);

    const handleInputChange = (field: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            toast.error('El nombre es requerido');
            return;
        }

        if (!formData.description.trim()) {
            toast.error('La descripción es requerida');
            return;
        }

        if (!formData.icon.trim()) {
            toast.error('El icono es requerido');
            return;
        }

        // Verificar si el nombre ya existe
        const isNameDuplicate = existingCategories.some(c =>
            c.name.toLowerCase() === formData.name.toLowerCase() && c.id !== category?.id
        );

        if (isNameDuplicate) {
            toast.error('Ya existe una categoría con ese nombre');
            return;
        }

        setIsLoading(true);
        try {
            const url = category ? `/api/service-categories/${category.id}` : '/api/service-categories';
            const method = category ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Error al guardar categoría');
            }

            const savedCategory = await response.json();
            onSave(savedCategory);
        } catch (error) {
            console.error('Error saving category:', error);
            toast.error(error instanceof Error ? error.message : 'Error al guardar categoría');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {category ? 'Editar Categoría' : 'Nueva Categoría'}
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <Label htmlFor="name">Nombre *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Ej: Gestión de Clientes y Leads"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="description">Descripción *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Descripción detallada de la categoría..."
                            rows={3}
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <Label htmlFor="icon">Icono *</Label>
                        <Input
                            id="icon"
                            value={formData.icon}
                            onChange={(e) => handleInputChange('icon', e.target.value)}
                            placeholder="Ej: Users, DollarSign, Calendar"
                            disabled={isLoading}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Nombre del icono de Lucide React (ej: Users, DollarSign, Calendar)
                        </p>
                    </div>

                    {/* Información sobre ordenamiento */}
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                        <p className="text-xs text-blue-800 dark:text-blue-200">
                            <strong>Ordenamiento:</strong> {category ? 'El orden se mantiene igual' : 'La nueva categoría se colocará al final. Puedes reordenar arrastrando las categorías en la lista principal.'}
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {category ? 'Actualizar' : 'Crear'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
