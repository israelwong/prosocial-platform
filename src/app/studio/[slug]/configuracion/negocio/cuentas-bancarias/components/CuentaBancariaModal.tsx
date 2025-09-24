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
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { CuentaBancaria } from '../types';

interface CuentaBancariaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: CuentaBancariaFormData) => Promise<void>;
    editingCuenta?: CuentaBancaria | null;
    loading?: boolean;
}

interface CuentaBancariaFormData {
    banco: string;
    numeroCuenta: string;
    titular: string;
    activo: boolean;
}

export function CuentaBancariaModal({
    isOpen,
    onClose,
    onSave,
    editingCuenta,
    loading = false
}: CuentaBancariaModalProps) {
    const [formData, setFormData] = useState({
        banco: '',
        numeroCuenta: '',
        titular: '',
        activo: true
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (editingCuenta) {
            setFormData({
                banco: editingCuenta.banco || '',
                numeroCuenta: editingCuenta.numeroCuenta || '',
                titular: editingCuenta.titular || '',
                activo: editingCuenta.activo ?? true
            });
        } else {
            setFormData({
                banco: '',
                numeroCuenta: '',
                titular: '',
                activo: true
            });
        }
    }, [editingCuenta, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-700">
                <DialogHeader>
                    <DialogTitle className="text-white">
                        {editingCuenta ? 'Editar Cuenta Bancaria' : 'Agregar Cuenta Bancaria'}
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        {editingCuenta
                            ? 'Modifica los datos de la cuenta bancaria'
                            : 'Completa la información de la nueva cuenta bancaria'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="banco" className="text-zinc-300">
                            Banco *
                        </Label>
                        <Input
                            id="banco"
                            value={formData.banco}
                            onChange={(e) => setFormData(prev => ({ ...prev, banco: e.target.value }))}
                            placeholder="Ej: Banco de Chile, Santander, etc."
                            className="bg-zinc-800 border-zinc-600 text-white"
                            required
                            disabled={saving}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="numeroCuenta" className="text-zinc-300">
                            CLABE (18 dígitos) *
                        </Label>
                        <Input
                            id="numeroCuenta"
                            value={formData.numeroCuenta}
                            onChange={(e) => {
                                // Solo permitir números y máximo 18 dígitos
                                const value = e.target.value.replace(/\D/g, '').slice(0, 18);
                                setFormData(prev => ({ ...prev, numeroCuenta: value }));
                            }}
                            placeholder="123456789012345678"
                            className="bg-zinc-800 border-zinc-600 text-white"
                            maxLength={18}
                            required
                            disabled={saving}
                        />
                        <p className="text-xs text-zinc-500">
                            Ingresa la CLABE de 18 dígitos (solo números)
                        </p>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="titular" className="text-zinc-300">
                            Titular *
                        </Label>
                        <Input
                            id="titular"
                            value={formData.titular}
                            onChange={(e) => setFormData(prev => ({ ...prev, titular: e.target.value }))}
                            placeholder="Nombre del titular de la cuenta"
                            className="bg-zinc-800 border-zinc-600 text-white"
                            required
                            disabled={saving}
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Switch
                            id="activo"
                            checked={formData.activo}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, activo: checked }))}
                            disabled={saving}
                        />
                        <Label htmlFor="activo" className="text-zinc-300">
                            Cuenta Activa
                        </Label>
                    </div>


                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={saving}
                            className="w-full sm:w-auto border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={saving || !formData.banco.trim() || !formData.numeroCuenta.trim() || !formData.titular.trim()}
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    {editingCuenta ? 'Actualizando...' : 'Creando...'}
                                </>
                            ) : (
                                editingCuenta ? 'Actualizar' : 'Crear'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
