'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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


export function CampanaModal({ isOpen, onClose, onSave, editingCampaña }: CampanaModalProps) {
    const [formData, setFormData] = useState({
        nombre: '',
        fechaInicio: '',
        fechaFin: '',
        isActive: true
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Actualizar formulario cuando cambie la campaña a editar
    useEffect(() => {
        if (editingCampaña) {
            setFormData({
                nombre: editingCampaña.nombre,
                fechaInicio: editingCampaña.fechaInicio.toISOString().split('T')[0],
                fechaFin: editingCampaña.fechaFin.toISOString().split('T')[0],
                isActive: editingCampaña.isActive
            });
        } else {
            // Reset form for new campaign
            setFormData({
                nombre: '',
                fechaInicio: '',
                fechaFin: '',
                isActive: true
            });
        }
    }, [editingCampaña, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            setIsSubmitting(true);
            
            const campañaData = {
                ...formData,
                fechaInicio: new Date(formData.fechaInicio),
                fechaFin: new Date(formData.fechaFin),
                // Valores por defecto para campos no incluidos en el formulario simplificado
                descripcion: editingCampaña?.descripcion || '',
                presupuestoTotal: editingCampaña?.presupuestoTotal || 0,
                status: editingCampaña?.status || 'planificada',
                leadsGenerados: editingCampaña?.leadsGenerados || 0,
                leadsSuscritos: editingCampaña?.leadsSuscritos || 0,
                gastoReal: editingCampaña?.gastoReal || 0,
                plataformas: editingCampaña?.plataformas || []
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
                    <div>
                        <Label htmlFor="nombre" className="mb-2 block">Nombre de la Campaña *</Label>
                        <Input
                            id="nombre"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            placeholder="Ej: Campaña de Verano 2024"
                            required
                            disabled={isSubmitting}
                            className="bg-zinc-900 border-zinc-700 text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="fechaInicio" className="mb-2 block">Período Inicial *</Label>
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
                            <Label htmlFor="fechaFin" className="mb-2 block">Período Final *</Label>
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

                    <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-700 rounded-lg">
                        <div>
                            <Label htmlFor="isActive" className="text-sm font-medium">Estado de la Campaña</Label>
                            <p className="text-xs text-zinc-500">La campaña estará activa y disponible para uso</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className={`text-sm ${formData.isActive ? 'text-green-400' : 'text-red-400'}`}>
                                {formData.isActive ? 'Activa' : 'Inactiva'}
                            </span>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                disabled={isSubmitting}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                    formData.isActive ? 'bg-blue-600' : 'bg-zinc-600'
                                }`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                        formData.isActive ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                                />
                            </button>
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
