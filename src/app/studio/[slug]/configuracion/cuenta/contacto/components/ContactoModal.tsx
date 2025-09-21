'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';
import { Telefono, TelefonoCreate, TIPOS_TELEFONO } from '../types';

interface ContactoModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: TelefonoCreate) => Promise<void>;
    editingTelefono?: Telefono | null;
    loading?: boolean;
}

export function ContactoModal({ isOpen, onClose, onSave, editingTelefono, loading }: ContactoModalProps) {
    const [formData, setFormData] = useState<TelefonoCreate>({
        numero: '',
        tipo: 'principal',
        activo: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingTelefono) {
            setFormData({
                numero: editingTelefono.numero,
                tipo: editingTelefono.tipo,
                activo: editingTelefono.activo
            });
        } else {
            setFormData({
                numero: '',
                tipo: 'principal',
                activo: true
            });
        }
    }, [editingTelefono, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.numero.trim()) {
            return;
        }

        setSaving(true);
        try {
            await onSave(formData);
            onClose();
        } catch (error) {
            // El error ya se maneja en la función padre
        } finally {
            setSaving(false);
        }
    };

    const handleClose = () => {
        if (!saving) {
            onClose();
        }
    };

    const validatePhone = (phone: string) => {
        // Validación básica de teléfono
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        return phoneRegex.test(phone);
    };

    const isFormValid = formData.numero.trim() && validatePhone(formData.numero);

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-800 border-zinc-700">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {editingTelefono ? 'Editar Teléfono' : 'Agregar Teléfono'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {editingTelefono ? 'Modifica la información del teléfono' : 'Agrega un nuevo número de teléfono'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="numero" className="text-zinc-300">
                            Número de Teléfono
                        </Label>
                        <Input
                            id="numero"
                            value={formData.numero}
                            onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                            className="bg-zinc-700 border-zinc-600 text-white"
                            placeholder="+52 55 1234 5678"
                            disabled={saving}
                        />
                        {formData.numero && !validatePhone(formData.numero) && (
                            <p className="text-xs text-red-400">
                                Formato de teléfono inválido
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="tipo" className="text-zinc-300">
                            Tipo de Teléfono
                        </Label>
                        <Select
                            value={formData.tipo}
                            onValueChange={(value: any) => setFormData(prev => ({ ...prev, tipo: value }))}
                            disabled={saving}
                        >
                            <SelectTrigger className="bg-zinc-700 border-zinc-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {TIPOS_TELEFONO.map((tipo) => (
                                    <SelectItem key={tipo.value} value={tipo.value}>
                                        {tipo.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={saving}
                            className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={!isFormValid || saving}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingTelefono ? 'Actualizar' : 'Agregar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
