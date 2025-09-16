'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { createPipelineStage, updatePipelineStage } from '../actions';

interface PipelineStageModalProps {
    isOpen: boolean;
    onClose: () => void;
    stage?: {
        id: string;
        name: string;
        description: string | null;
        color: string;
    } | null;
    onSuccess?: () => void;
}

export function PipelineStageModal({ isOpen, onClose, stage, onSuccess }: PipelineStageModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        color: '#3B82F6'
    });

    // Actualizar el formulario cuando cambie la etapa a editar
    useEffect(() => {
        if (stage) {
            setFormData({
                nombre: stage.name || '',
                descripcion: stage.description || '',
                color: stage.color || '#3B82F6'
            });
        } else {
            setFormData({
                nombre: '',
                descripcion: '',
                color: '#3B82F6'
            });
        }
    }, [stage, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const form = new FormData();
            form.append('nombre', formData.nombre);
            form.append('descripcion', formData.descripcion);
            form.append('color', formData.color);

            let result;
            if (stage) {
                result = await updatePipelineStage(stage.id, form);
            } else {
                result = await createPipelineStage(form);
            }

            if (result.success) {
                onClose();
                setFormData({ nombre: '', descripcion: '', color: '#3B82F6' });
                // Llamar al callback de éxito para actualizar la lista
                if (onSuccess) {
                    onSuccess();
                }
            } else {
                console.error('Error:', result.error);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ nombre: '', descripcion: '', color: '#3B82F6' });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {stage ? 'Editar Etapa' : 'Nueva Etapa'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {stage
                            ? 'Modifica los datos de la etapa del pipeline'
                            : 'Crea una nueva etapa para el pipeline de ventas'
                        }
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nombre" className="text-white">
                                Nombre *
                            </Label>
                            <Input
                                id="nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                className="bg-zinc-800 border-zinc-700 text-white"
                                placeholder="Ej: Calificación Inicial"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="descripcion" className="text-white">
                                Descripción
                            </Label>
                            <Textarea
                                id="descripcion"
                                value={formData.descripcion}
                                onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                                className="bg-zinc-800 border-zinc-700 text-white"
                                placeholder="Descripción de la etapa..."
                                rows={3}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="color" className="text-white">
                                Color
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="color"
                                    type="color"
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="w-16 h-10 bg-zinc-800 border-zinc-700"
                                />
                                <Input
                                    value={formData.color}
                                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                                    className="bg-zinc-800 border-zinc-700 text-white"
                                    placeholder="#3B82F6"
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isLoading ? 'Guardando...' : (stage ? 'Actualizar' : 'Crear')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
