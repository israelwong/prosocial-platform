"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter 
} from "@/components/ui/dialog";
import { 
    Plus, 
    Edit, 
    Trash2, 
    Save, 
    X,
    AlertCircle,
    CheckCircle
} from "lucide-react";
import { toast } from "sonner";

interface PlanLimit {
    limite: number | null;
    descripcion: string;
    unidad?: string;
}

interface LimitsModalProps {
    isOpen: boolean;
    onClose: () => void;
    limits: Record<string, unknown>;
    onSave: (limits: Record<string, PlanLimit>) => void;
}

export function LimitsModal({ isOpen, onClose, limits, onSave }: LimitsModalProps) {
    const [localLimits, setLocalLimits] = useState<Record<string, PlanLimit>>({});
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [newLimit, setNewLimit] = useState<PlanLimit>({
        limite: null,
        descripcion: '',
        unidad: ''
    });

    // Convertir límites existentes al formato correcto
    useEffect(() => {
        if (isOpen) {
            const convertedLimits: Record<string, PlanLimit> = {};
            
            Object.entries(limits).forEach(([key, value]) => {
                if (typeof value === 'object' && value !== null) {
                    // Si ya está en el formato correcto
                    convertedLimits[key] = value as PlanLimit;
                } else {
                    // Si es un valor simple, convertirlo al formato correcto
                    convertedLimits[key] = {
                        limite: typeof value === 'number' ? value : null,
                        descripcion: `Límite para ${key}`,
                        unidad: ''
                    };
                }
            });
            
            setLocalLimits(convertedLimits);
        }
    }, [isOpen, limits]);

    const handleAddNew = () => {
        setIsAddingNew(true);
        setNewLimit({
            limite: null,
            descripcion: '',
            unidad: ''
        });
    };

    const handleSaveNew = () => {
        const key = prompt('Nombre del límite (ej: catalogos, proyectos_aprobados):');
        if (!key) return;
        
        if (localLimits[key]) {
            toast.error('Ya existe un límite con ese nombre');
            return;
        }

        if (!newLimit.descripcion.trim()) {
            toast.error('La descripción es requerida');
            return;
        }

        setLocalLimits(prev => ({
            ...prev,
            [key]: { ...newLimit }
        }));
        
        setIsAddingNew(false);
        setNewLimit({
            limite: null,
            descripcion: '',
            unidad: ''
        });
        
        toast.success('Límite agregado exitosamente');
    };

    const handleEdit = (key: string) => {
        setEditingKey(key);
    };

    const handleSaveEdit = (key: string) => {
        if (!localLimits[key].descripcion.trim()) {
            toast.error('La descripción es requerida');
            return;
        }

        setEditingKey(null);
        toast.success('Límite actualizado exitosamente');
    };

    const handleDelete = (key: string) => {
        if (confirm(`¿Estás seguro de que quieres eliminar el límite "${key}"?`)) {
            const updatedLimits = { ...localLimits };
            delete updatedLimits[key];
            setLocalLimits(updatedLimits);
            toast.success('Límite eliminado exitosamente');
        }
    };

    const handleSave = () => {
        onSave(localLimits);
        onClose();
        toast.success('Límites guardados exitosamente');
    };

    const updateLimit = (key: string, field: keyof PlanLimit, value: string | number | null) => {
        setLocalLimits(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    };

    const updateNewLimit = (field: keyof PlanLimit, value: string | number | null) => {
        setNewLimit(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5" />
                        Gestión de Límites del Plan
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Información */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Información</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                                <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                <div className="text-sm text-blue-800 dark:text-blue-200">
                                    <p className="font-medium mb-1">Configuración de Límites</p>
                                    <ul className="list-disc list-inside space-y-1">
                                        <li><strong>Límite null:</strong> Acceso ilimitado a la funcionalidad</li>
                                        <li><strong>Límite 0:</strong> Sin acceso a la funcionalidad</li>
                                        <li><strong>Límite > 0:</strong> Número máximo permitido</li>
                                        <li><strong>Sin límite definido:</strong> No tiene acceso a la funcionalidad</li>
                                    </ul>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lista de límites existentes */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg">Límites Configurados</CardTitle>
                                <Button onClick={handleAddNew} size="sm">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Agregar Límite
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {Object.keys(localLimits).length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No hay límites configurados</p>
                                    <p className="text-sm">Agrega límites para controlar el acceso a funcionalidades</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {Object.entries(localLimits).map(([key, limit]) => (
                                        <div key={key} className="border rounded-lg p-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="outline" className="font-mono">
                                                        {key}
                                                    </Badge>
                                                    {limit.limite === null ? (
                                                        <Badge variant="default" className="bg-green-600">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Ilimitado
                                                        </Badge>
                                                    ) : limit.limite === 0 ? (
                                                        <Badge variant="destructive">
                                                            Sin acceso
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="secondary">
                                                            Límite: {limit.limite}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleEdit(key)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDelete(key)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {editingKey === key ? (
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <Label htmlFor={`limite-${key}`}>Límite</Label>
                                                            <Input
                                                                id={`limite-${key}`}
                                                                type="number"
                                                                placeholder="null para ilimitado"
                                                                value={limit.limite === null ? '' : limit.limite}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    updateLimit(key, 'limite', value === '' ? null : parseInt(value));
                                                                }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <Label htmlFor={`unidad-${key}`}>Unidad (opcional)</Label>
                                                            <Input
                                                                id={`unidad-${key}`}
                                                                placeholder="ej: MB, GB, días"
                                                                value={limit.unidad || ''}
                                                                onChange={(e) => updateLimit(key, 'unidad', e.target.value)}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Label htmlFor={`descripcion-${key}`}>Descripción</Label>
                                                        <Textarea
                                                            id={`descripcion-${key}`}
                                                            placeholder="Descripción del límite"
                                                            value={limit.descripcion}
                                                            onChange={(e) => updateLimit(key, 'descripcion', e.target.value)}
                                                            rows={2}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => handleSaveEdit(key)}
                                                        >
                                                            <Save className="h-4 w-4 mr-2" />
                                                            Guardar
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setEditingKey(null)}
                                                        >
                                                            <X className="h-4 w-4 mr-2" />
                                                            Cancelar
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    <p className="text-sm text-muted-foreground">
                                                        {limit.descripcion}
                                                    </p>
                                                    {limit.unidad && (
                                                        <p className="text-xs text-muted-foreground">
                                                            Unidad: {limit.unidad}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Formulario para agregar nuevo límite */}
                    {isAddingNew && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Agregar Nuevo Límite</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <Label htmlFor="new-limite">Límite</Label>
                                            <Input
                                                id="new-limite"
                                                type="number"
                                                placeholder="null para ilimitado"
                                                value={newLimit.limite === null ? '' : newLimit.limite}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    updateNewLimit('limite', value === '' ? null : parseInt(value));
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="new-unidad">Unidad (opcional)</Label>
                                            <Input
                                                id="new-unidad"
                                                placeholder="ej: MB, GB, días"
                                                value={newLimit.unidad || ''}
                                                onChange={(e) => updateNewLimit('unidad', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="new-descripcion">Descripción</Label>
                                        <Textarea
                                            id="new-descripcion"
                                            placeholder="Descripción del límite"
                                            value={newLimit.descripcion}
                                            onChange={(e) => updateNewLimit('descripcion', e.target.value)}
                                            rows={2}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleSaveNew}>
                                            <Save className="h-4 w-4 mr-2" />
                                            Agregar Límite
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setIsAddingNew(false)}
                                        >
                                            <X className="h-4 w-4 mr-2" />
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button onClick={handleSave}>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar Límites
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
