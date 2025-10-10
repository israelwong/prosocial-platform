'use client';

import React, { useState, useEffect } from 'react';
import { ZenButton } from '@/components/ui/zen';
import { ZenInput } from '@/components/ui/zen';
import { ZenLabel } from '@/components/ui/zen';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/shadcn/select';
import { Switch } from '@/components/ui/shadcn/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/shadcn/dialog';
import { Phone, CheckCircle } from 'lucide-react';
import { Telefono, TelefonoCreate, TIPOS_TELEFONO } from '../types';

type TipoTelefono = TelefonoCreate['type']; // Actualizado: tipo → type

interface ContactoModalZenProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: TelefonoCreate, editingTelefono?: Telefono) => Promise<void>;
    editingTelefono?: Telefono | null;
}

export function ContactoModalZen({ isOpen, onClose, onSave, editingTelefono }: ContactoModalZenProps) {
    const [formData, setFormData] = useState<TelefonoCreate>({
        number: '', // Actualizado: numero → number
        type: 'principal', // Actualizado: tipo → type
        is_active: true // Actualizado: activo → is_active
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingTelefono) {
            setFormData({
                number: editingTelefono.number, // Actualizado: numero → number
                type: editingTelefono.type as 'principal' | 'whatsapp' | 'emergencia' | 'oficina', // Actualizado: tipo → type
                is_active: editingTelefono.is_active // Actualizado: activo → is_active
            });
        } else {
            setFormData({
                number: '', // Actualizado: numero → number
                type: 'principal', // Actualizado: tipo → type
                is_active: true // Actualizado: activo → is_active
            });
        }
    }, [editingTelefono, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.number.trim()) { // Actualizado: numero → number
            return;
        }

        setSaving(true);
        try {
            await onSave(formData, editingTelefono || undefined);
        } catch (error) {
            console.error('Error saving telefono:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        if (!saving) {
            onClose();
        }
    };

    const isEditing = !!editingTelefono;
    const tipoInfo = TIPOS_TELEFONO.find(t => t.value === formData.type); // Actualizado: tipo → type

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-900/20 flex items-center justify-center">
                            <Phone className="h-4 w-4 text-blue-400" />
                        </div>
                        {isEditing ? 'Editar Teléfono' : 'Agregar Teléfono'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {isEditing
                            ? 'Modifica la información del teléfono seleccionado'
                            : 'Agrega un nuevo número de teléfono para tu estudio'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        {/* Número de teléfono */}
                        <div className="space-y-2">
                            <ZenLabel htmlFor="numero" variant="required">
                                Número de Teléfono
                            </ZenLabel>
                            <ZenInput
                                id="number" // Actualizado: numero → number
                                label=""
                                value={formData.number} // Actualizado: numero → number
                                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))} // Actualizado: numero → number
                                placeholder="+52 55 1234 5678"
                                disabled={saving}
                                className="w-full"
                            />
                        </div>

                        {/* Tipo de teléfono */}
                        <div className="space-y-2">
                            <ZenLabel htmlFor="tipo" variant="required">
                                Tipo de Teléfono
                            </ZenLabel>
                            <Select
                                value={formData.type} // Actualizado: tipo → type
                                onValueChange={(value: TipoTelefono) => setFormData(prev => ({ ...prev, type: value }))} // Actualizado: tipo → type
                                disabled={saving}
                            >
                                <SelectTrigger className="w-full bg-zinc-800 border-zinc-700 text-white">
                                    <SelectValue placeholder="Selecciona el tipo de teléfono" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-800 border-zinc-700">
                                    {TIPOS_TELEFONO.map((tipo) => (
                                        <SelectItem
                                            key={tipo.value}
                                            value={tipo.value}
                                            className="text-white hover:bg-zinc-700"
                                        >
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${tipo.color}`}></div>
                                                {tipo.label}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {tipoInfo && (
                                <p className="text-xs text-zinc-500">
                                    {tipoInfo.label === 'Principal' && 'Número principal de contacto'}
                                    {tipoInfo.label === 'WhatsApp' && 'Número para mensajes de WhatsApp'}
                                    {tipoInfo.label === 'Emergencia' && 'Número para situaciones urgentes'}
                                    {tipoInfo.label === 'Oficina' && 'Número de la oficina o sede'}
                                </p>
                            )}
                        </div>

                        {/* Estado activo */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <ZenLabel htmlFor="activo" className="text-sm font-medium">
                                        Teléfono activo
                                    </ZenLabel>
                                    <p className="text-xs text-zinc-500">
                                        Los teléfonos inactivos no aparecerán en tu perfil público
                                    </p>
                                </div>
                                <Switch
                                    id="is_active" // Actualizado: activo → is_active
                                    checked={formData.is_active} // Actualizado: activo → is_active
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))} // Actualizado: activo → is_active
                                    disabled={saving}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="flex gap-2">
                        <ZenButton
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={saving}
                            className="hover:bg-zinc-700"
                        >
                            Cancelar
                        </ZenButton>
                        <ZenButton
                            type="submit"
                            variant="primary"
                            loading={saving}
                            disabled={!formData.number.trim() || saving} // Actualizado: numero → number
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {!saving && (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    {isEditing ? 'Actualizar' : 'Agregar'}
                                </>
                            )}
                        </ZenButton>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
