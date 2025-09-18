'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Plataforma {
    id: string;
    nombre: string;
    tipo: string;
    color: string | null;
    icono: string | null;
}

interface CampañaPlataforma {
    id: string;
    presupuesto: number;
    gastoReal: number;
    leads: number;
    conversiones: number;
    plataforma: Plataforma;
}

interface Campaña {
    id: string;
    nombre: string;
    descripcion: string | null;
    presupuestoTotal: number;
    fechaInicio: Date;
    fechaFin: Date;
    status: string;
    isActive: boolean;
    leadsGenerados: number;
    leadsSuscritos: number;
    gastoReal: number;
    createdAt: Date;
    updatedAt: Date;
    plataformas: CampañaPlataforma[];
    _count: {
        leads: number;
    };
}

interface CampanaModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (campañaData: any) => Promise<void>;
    editingCampaña: Campaña | null;
}

const statusOptions = [
    { value: 'planificada', label: 'Planificada', color: 'bg-gray-500' },
    { value: 'activa', label: 'Activa', color: 'bg-green-500' },
    { value: 'pausada', label: 'Pausada', color: 'bg-yellow-500' },
    { value: 'finalizada', label: 'Finalizada', color: 'bg-red-500' }
];

export function CampanaModal({ isOpen, onClose, onSave, editingCampaña }: CampanaModalProps) {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        presupuestoTotal: 0,
        fechaInicio: '',
        fechaFin: '',
        status: 'planificada',
        isActive: true,
        leadsGenerados: 0,
        leadsSuscritos: 0,
        gastoReal: 0,
        plataformas: [] as Array<{
            id: string;
            plataforma: {
                id: string;
                nombre: string;
            };
            presupuesto: number;
            gastoReal: number;
            leads: number;
            conversiones: number;
        }>
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Actualizar formulario cuando cambie la campaña a editar
    useEffect(() => {
        if (editingCampaña) {
            setFormData({
                nombre: editingCampaña.nombre,
                descripcion: editingCampaña.descripcion || '',
                presupuestoTotal: editingCampaña.presupuestoTotal,
                fechaInicio: editingCampaña.fechaInicio.toISOString().split('T')[0],
                fechaFin: editingCampaña.fechaFin.toISOString().split('T')[0],
                status: editingCampaña.status,
                isActive: editingCampaña.isActive,
                leadsGenerados: editingCampaña.leadsGenerados,
                leadsSuscritos: editingCampaña.leadsSuscritos,
                gastoReal: editingCampaña.gastoReal,
                plataformas: editingCampaña.plataformas.map(p => ({
                    id: p.plataforma.id,
                    plataforma: {
                        id: p.plataforma.id,
                        nombre: p.plataforma.nombre
                    },
                    presupuesto: p.presupuesto,
                    gastoReal: p.gastoReal,
                    leads: p.leads,
                    conversiones: p.conversiones
                }))
            });
        } else {
            // Reset form for new campaign
            setFormData({
                nombre: '',
                descripcion: '',
                presupuestoTotal: 0,
                fechaInicio: '',
                fechaFin: '',
                status: 'planificada',
                isActive: true,
                leadsGenerados: 0,
                leadsSuscritos: 0,
                gastoReal: 0,
                plataformas: []
            });
        }
    }, [editingCampaña, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setIsSubmitting(true);
            
            const campañaData = {
                ...formData,
                presupuestoTotal: parseFloat(formData.presupuestoTotal.toString()),
                fechaInicio: new Date(formData.fechaInicio),
                fechaFin: new Date(formData.fechaFin),
                leadsGenerados: parseInt(formData.leadsGenerados.toString()),
                leadsSuscritos: parseInt(formData.leadsSuscritos.toString()),
                gastoReal: parseFloat(formData.gastoReal.toString())
            };

            await onSave(campañaData);
            onClose();
        } catch (error) {
            console.error('Error saving campaña:', error);
            toast.error('Error al guardar la campaña');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        if (!isSubmitting) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingCampaña ? 'Editar Campaña' : 'Crear Nueva Campaña'}
                    </DialogTitle>
                    <DialogDescription>
                        {editingCampaña ? 'Modifica los datos de la campaña' : 'Crea una nueva campaña de marketing'}
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="nombre" className="mb-2 block">Nombre *</Label>
                            <Input
                                id="nombre"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                required
                                disabled={isSubmitting}
                                className="bg-zinc-900 border-zinc-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="status" className="mb-2 block">Estado</Label>
                            <Select 
                                value={formData.status} 
                                onValueChange={(value) => setFormData({ ...formData, status: value })}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger className="bg-zinc-900 border-zinc-700 text-white">
                                    <SelectValue placeholder="Seleccionar estado" />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-700">
                                    {statusOptions.map(option => (
                                        <SelectItem 
                                            key={option.value} 
                                            value={option.value}
                                            className="text-white hover:bg-zinc-800"
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="descripcion" className="mb-2 block">Descripción</Label>
                        <Textarea
                            id="descripcion"
                            value={formData.descripcion}
                            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                            rows={3}
                            disabled={isSubmitting}
                            className="bg-zinc-900 border-zinc-700 text-white"
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="presupuestoTotal" className="mb-2 block">Presupuesto Total *</Label>
                            <Input
                                id="presupuestoTotal"
                                type="number"
                                step="0.01"
                                value={formData.presupuestoTotal}
                                onChange={(e) => setFormData({ ...formData, presupuestoTotal: parseFloat(e.target.value) || 0 })}
                                required
                                disabled={isSubmitting}
                                className="bg-zinc-900 border-zinc-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="fechaInicio" className="mb-2 block">Fecha Inicio *</Label>
                            <Input
                                id="fechaInicio"
                                type="date"
                                value={formData.fechaInicio}
                                onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                required
                                disabled={isSubmitting}
                                className="bg-zinc-900 border-zinc-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="fechaFin" className="mb-2 block">Fecha Fin *</Label>
                            <Input
                                id="fechaFin"
                                type="date"
                                value={formData.fechaFin}
                                onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                required
                                disabled={isSubmitting}
                                className="bg-zinc-900 border-zinc-700 text-white"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Label htmlFor="leadsGenerados" className="mb-2 block">Leads Generados</Label>
                            <Input
                                id="leadsGenerados"
                                type="number"
                                value={formData.leadsGenerados}
                                onChange={(e) => setFormData({ ...formData, leadsGenerados: parseInt(e.target.value) || 0 })}
                                disabled={isSubmitting}
                                className="bg-zinc-900 border-zinc-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="leadsSuscritos" className="mb-2 block">Leads Suscritos</Label>
                            <Input
                                id="leadsSuscritos"
                                type="number"
                                value={formData.leadsSuscritos}
                                onChange={(e) => setFormData({ ...formData, leadsSuscritos: parseInt(e.target.value) || 0 })}
                                disabled={isSubmitting}
                                className="bg-zinc-900 border-zinc-700 text-white"
                            />
                        </div>
                        <div>
                            <Label htmlFor="gastoReal" className="mb-2 block">Gasto Real</Label>
                            <Input
                                id="gastoReal"
                                type="number"
                                step="0.01"
                                value={formData.gastoReal}
                                onChange={(e) => setFormData({ ...formData, gastoReal: parseFloat(e.target.value) || 0 })}
                                disabled={isSubmitting}
                                className="bg-zinc-900 border-zinc-700 text-white"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            {isSubmitting ? 'Guardando...' : (editingCampaña ? 'Actualizar' : 'Crear')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
