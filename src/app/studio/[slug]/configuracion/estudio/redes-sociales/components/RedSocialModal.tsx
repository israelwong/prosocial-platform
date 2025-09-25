'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Plus, Edit } from 'lucide-react';
import { Plataforma, RedSocial, NuevaRed } from '../types';

interface RedSocialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: { plataformaId: string; url: string; activo: boolean }) => Promise<void>;
    plataformas: Plataforma[];
    redSocial?: RedSocial | null; // null = crear nueva, objeto = editar existente
    loading?: boolean;
}

export function RedSocialModal({
    isOpen,
    onClose,
    onSave,
    plataformas,
    redSocial,
    loading = false
}: RedSocialModalProps) {
    const [formData, setFormData] = useState({
        plataformaId: '',
        url: '',
        activo: true
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const isEditing = redSocial !== null;
    const modalTitle = isEditing ? 'Editar Red Social' : 'Agregar Nueva Red Social';
    const modalDescription = isEditing
        ? 'Modifica los datos de tu red social'
        : 'Añade una nueva red social a tu perfil';

    // Resetear formulario cuando se abre/cierra el modal o cambia la red social
    useEffect(() => {
        if (isOpen) {
            if (isEditing && redSocial) {
                setFormData({
                    plataformaId: redSocial.plataformaId || '',
                    url: redSocial.url || '',
                    activo: redSocial.activo
                });
            } else {
                setFormData({
                    plataformaId: '',
                    url: '',
                    activo: true
                });
            }
            setErrors({});
        }
    }, [isOpen, isEditing, redSocial]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.plataformaId) {
            newErrors.plataformaId = 'Selecciona una plataforma';
        }

        if (!formData.url.trim()) {
            newErrors.url = 'La URL es requerida';
        } else {
            try {
                new URL(formData.url.trim());
            } catch {
                newErrors.url = 'Por favor ingresa una URL válida (ej: https://www.ejemplo.com)';
            }
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
            await onSave({
                plataformaId: formData.plataformaId,
                url: formData.url.trim(),
                activo: formData.activo
            });
            onClose();
        } catch (error) {
            console.error('Error saving red social:', error);
        }
    };

    const handleClose = () => {
        setFormData({
            plataformaId: '',
            url: '',
            activo: true
        });
        setErrors({});
        onClose();
    };

    const getPlataformaInfo = (plataformaId: string) => {
        return plataformas.find(p => p.id === plataformaId);
    };

    const plataformaInfo = getPlataformaInfo(formData.plataformaId);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px] bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        {isEditing ? (
                            <>
                                <Edit className="h-5 w-5" />
                                {modalTitle}
                            </>
                        ) : (
                            <>
                                <Plus className="h-5 w-5" />
                                {modalTitle}
                            </>
                        )}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {modalDescription}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        {/* Plataforma */}
                        <div className="space-y-2">
                            <Label htmlFor="plataforma" className="text-white">
                                Plataforma *
                            </Label>
                            <Select
                                value={formData.plataformaId}
                                onValueChange={(value) => {
                                    setFormData(prev => ({ ...prev, plataformaId: value }));
                                    if (errors.plataformaId) {
                                        setErrors(prev => ({ ...prev, plataformaId: '' }));
                                    }
                                }}
                                disabled={loading || isEditing}
                            >
                                <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-white">
                                    <SelectValue placeholder="Selecciona una plataforma" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    {plataformas.map((plataforma) => (
                                        <SelectItem
                                            key={plataforma.id}
                                            value={plataforma.id}
                                            className="text-white hover:bg-zinc-700"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-4 h-4 rounded"
                                                    style={{ backgroundColor: plataforma.color || '#6B7280' }}
                                                />
                                                {plataforma.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.plataformaId && (
                                <p className="text-sm text-red-400">{errors.plataformaId}</p>
                            )}
                        </div>

                        {/* URL */}
                        <div className="space-y-2">
                            <Label htmlFor="url" className="text-white">
                                URL *
                            </Label>
                            <Input
                                id="url"
                                value={formData.url}
                                onChange={(e) => {
                                    setFormData(prev => ({ ...prev, url: e.target.value }));
                                    if (errors.url) {
                                        setErrors(prev => ({ ...prev, url: '' }));
                                    }
                                }}
                                placeholder="https://..."
                                disabled={loading}
                            />
                            {errors.url && (
                                <p className="text-sm text-red-400">{errors.url}</p>
                            )}
                            {plataformaInfo?.baseUrl && (
                                <p className="text-xs text-zinc-500">
                                    URL base: {plataformaInfo.baseUrl}
                                </p>
                            )}
                        </div>

                        {/* Estado activo */}
                        <div className="flex items-center justify-between">
                            <Label htmlFor="activo" className="text-white">
                                Red social activa
                            </Label>
                            <Switch
                                id="activo"
                                checked={formData.activo}
                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, activo: checked }))}
                                disabled={loading}
                            />
                        </div>

                        {/* Vista previa */}
                        {plataformaInfo && formData.url && (
                            <div className="p-3 bg-zinc-900 rounded-lg border border-zinc-700">
                                <p className="text-sm text-zinc-400 mb-2">Vista previa:</p>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                                        style={{ backgroundColor: plataformaInfo.color || '#6B7280' }}
                                    >
                                        {plataformaInfo.name.charAt(0)}
                                    </div>
                                    <span className="text-white text-sm">{plataformaInfo.name}</span>
                                    <span className="text-zinc-400 text-sm">•</span>
                                    <a
                                        href={formData.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 text-sm underline"
                                    >
                                        {formData.url}
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={loading}
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {isEditing ? 'Actualizando...' : 'Agregando...'}
                                </>
                            ) : (
                                isEditing ? 'Actualizar' : 'Agregar'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
