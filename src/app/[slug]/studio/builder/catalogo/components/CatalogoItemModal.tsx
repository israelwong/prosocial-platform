'use client';

import React, { useState, useEffect } from 'react';
import { ZenButton, ZenInput, ZenTextarea, ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/shadcn/dialog';
import { CatalogoItem, CatalogoItemFormData } from '../types';
import { Package, Wrench, DollarSign } from 'lucide-react';

interface CatalogoItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: CatalogoItem | null;
    onSave: (data: CatalogoItemFormData) => void;
}

export function CatalogoItemModal({ isOpen, onClose, item, onSave }: CatalogoItemModalProps) {
    const [formData, setFormData] = useState<CatalogoItemFormData>({
        name: '',
        type: 'PRODUCTO',
        cost: 0,
        description: '',
        image_url: '',
        is_active: true
    });

    const [errors, setErrors] = useState<Partial<CatalogoItemFormData>>({});

    // Cargar datos del item cuando se abre el modal
    useEffect(() => {
        if (item) {
            setFormData({
                name: item.name,
                type: item.type,
                cost: item.cost,
                description: item.description || '',
                image_url: item.image_url || '',
                is_active: item.is_active ?? true
            });
        } else {
            setFormData({
                name: '',
                type: 'PRODUCTO',
                cost: 0,
                description: '',
                image_url: '',
                is_active: true
            });
        }
        setErrors({});
    }, [item, isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        const newErrors: Partial<CatalogoItemFormData> = {};
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }
        if (formData.cost < 0) {
            newErrors.cost = 'El costo no puede ser negativo';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        onSave(formData);
    };

    const handleInputChange = (field: keyof CatalogoItemFormData, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    const handleTypeChange = (type: 'PRODUCTO' | 'SERVICIO') => {
        setFormData(prev => ({ ...prev, type }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        {item ? 'Editar Item' : 'Nuevo Item'}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <ZenInput
                        label="Nombre del Item"
                        name="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        error={errors.name}
                        placeholder="Ej: Sesión de fotos de boda"
                    />

                    {/* Selector de tipo */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-zinc-300">Tipo de Item</label>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => handleTypeChange('PRODUCTO')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${formData.type === 'PRODUCTO'
                                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                        : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600'
                                    }`}
                            >
                                <Package className="h-4 w-4" />
                                Producto
                            </button>
                            <button
                                type="button"
                                onClick={() => handleTypeChange('SERVICIO')}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${formData.type === 'SERVICIO'
                                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                                        : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600'
                                    }`}
                            >
                                <Wrench className="h-4 w-4" />
                                Servicio
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ZenInput
                            label="Costo"
                            name="cost"
                            type="number"
                            value={formData.cost}
                            onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                            required
                            error={errors.cost}
                            placeholder="0"
                            hint="Costo en pesos mexicanos"
                        />

                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => handleInputChange('is_active', e.target.checked)}
                                className="rounded border-zinc-700 bg-zinc-800 text-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor="is_active" className="text-sm text-zinc-300">
                                Item activo
                            </label>
                        </div>
                    </div>

                    <ZenTextarea
                        label="Descripción"
                        name="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        placeholder="Describe tu producto o servicio..."
                        rows={3}
                    />

                    <ZenInput
                        label="URL de Imagen"
                        name="image_url"
                        value={formData.image_url}
                        onChange={(e) => handleInputChange('image_url', e.target.value)}
                        placeholder="https://ejemplo.com/imagen.jpg"
                        hint="URL de la imagen que representará este item"
                    />

                    {/* Preview de la imagen si existe */}
                    {formData.image_url && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-300">Vista Previa</label>
                            <div className="w-full h-32 bg-zinc-800 rounded-lg overflow-hidden">
                                <img
                                    src={formData.image_url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                        <ZenButton
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancelar
                        </ZenButton>
                        <ZenButton
                            type="submit"
                            variant="primary"
                        >
                            {item ? 'Actualizar' : 'Crear'} Item
                        </ZenButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
