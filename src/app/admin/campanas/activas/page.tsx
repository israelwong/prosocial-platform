'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Play, Pause, Square, Search, DollarSign, Users, Target, Calendar } from 'lucide-react';
import { toast } from 'sonner';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

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

const statusOptions = [
    { value: 'planificada', label: 'Planificada', color: 'bg-gray-500' },
    { value: 'activa', label: 'Activa', color: 'bg-green-500' },
    { value: 'pausada', label: 'Pausada', color: 'bg-yellow-500' },
    { value: 'finalizada', label: 'Finalizada', color: 'bg-red-500' }
];

export default function CampanasActivasPage() {
    const [campanas, setCampanas] = useState<Campaña[]>([]);
    const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCampaña, setEditingCampaña] = useState<Campaña | null>(null);
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

    useEffect(() => {
        fetchCampanas();
        fetchPlataformas();
    }, []);

    const fetchCampanas = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/campanas?isActive=true');
            if (!response.ok) {
                // Si es error 500, probablemente no hay datos, no mostrar error
                if (response.status === 500) {
                    setCampanas([]);
                    return;
                }
                throw new Error('Error al cargar las campañas');
            }
            const data = await response.json();
            setCampanas(data || []);
        } catch (error) {
            console.error('Error fetching campanas:', error);
            // Solo mostrar error si no es por falta de datos
            if (error instanceof Error && !error.message.includes('fetch')) {
                toast.error('Error al cargar las campañas');
            }
            setCampanas([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchPlataformas = async () => {
        try {
            const response = await fetch('/api/plataformas');
            if (!response.ok) {
                // Si es error 500, probablemente no hay datos, no mostrar error
                if (response.status === 500) {
                    setPlataformas([]);
                    return;
                }
                throw new Error('Error al cargar las plataformas');
            }
            const data = await response.json();
            setPlataformas(data || []);
        } catch (error) {
            console.error('Error fetching plataformas:', error);
            // Solo mostrar error si no es por falta de datos
            if (error instanceof Error && !error.message.includes('fetch')) {
                toast.error('Error al cargar las plataformas');
            }
            setPlataformas([]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const campañaData = {
                ...formData,
                presupuestoTotal: parseFloat(formData.presupuestoTotal.toString()),
                fechaInicio: new Date(formData.fechaInicio),
                fechaFin: new Date(formData.fechaFin),
                leadsGenerados: parseInt(formData.leadsGenerados.toString()),
                leadsSuscritos: parseInt(formData.leadsSuscritos.toString()),
                gastoReal: parseFloat(formData.gastoReal.toString())
            };

            if (editingCampaña) {
                const response = await fetch(`/api/campanas/${editingCampaña.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(campañaData),
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar la campaña');
                }
                toast.success('Campaña actualizada exitosamente');
            } else {
                const response = await fetch('/api/campanas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(campañaData),
                });

                if (!response.ok) {
                    throw new Error('Error al crear la campaña');
                }
                toast.success('Campaña creada exitosamente');
            }

            setIsModalOpen(false);
            setEditingCampaña(null);
            resetForm();
            fetchCampanas();
        } catch (error) {
            console.error('Error saving campaña:', error);
            toast.error('Error al guardar la campaña');
        }
    };

    const handleEdit = (campaña: Campaña) => {
        setEditingCampaña(campaña);
        setFormData({
            nombre: campaña.nombre,
            descripcion: campaña.descripcion || '',
            presupuestoTotal: campaña.presupuestoTotal,
            fechaInicio: campaña.fechaInicio.toISOString().split('T')[0],
            fechaFin: campaña.fechaFin.toISOString().split('T')[0],
            status: campaña.status,
            isActive: campaña.isActive,
            leadsGenerados: campaña.leadsGenerados,
            leadsSuscritos: campaña.leadsSuscritos,
            gastoReal: campaña.gastoReal,
            plataformas: campaña.plataformas.map(p => ({
                plataformaId: p.plataforma.id,
                presupuesto: p.presupuesto,
                gastoReal: p.gastoReal,
                leads: p.leads,
                conversiones: p.conversiones
            }))
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta campaña?')) return;

        try {
            const response = await fetch(`/api/campanas/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la campaña');
            }
            toast.success('Campaña eliminada exitosamente');
            fetchCampanas();
        } catch (error) {
            console.error('Error deleting campaña:', error);
            toast.error('Error al eliminar la campaña');
        }
    };

    const resetForm = () => {
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
    };

    const filteredCampanas = campanas.filter(campaña => 
        campaña.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaña.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const statusOption = statusOptions.find(s => s.value === status);
        return (
            <Badge className={`${statusOption?.color} text-white`}>
                {statusOption?.label}
            </Badge>
        );
    };

    const calculateMetrics = (campaña: Campaña) => {
        const costoAdquisicion = campaña.leadsGenerados > 0 ? campaña.gastoReal / campaña.leadsGenerados : 0;
        const costoConversion = campaña.leadsSuscritos > 0 ? campaña.gastoReal / campaña.leadsSuscritos : 0;
        const tasaConversion = campaña.leadsGenerados > 0 ? (campaña.leadsSuscritos / campaña.leadsGenerados) * 100 : 0;
        
        return { costoAdquisicion, costoConversion, tasaConversion };
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-zinc-400">Cargando campañas...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Campañas Activas</h1>
                    <p className="text-zinc-400">Gestiona las campañas de marketing activas</p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setEditingCampaña(null); resetForm(); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nueva Campaña
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>
                                {editingCampaña ? 'Editar Campaña' : 'Crear Nueva Campaña'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingCampaña ? 'Modifica los datos de la campaña' : 'Crea una nueva campaña de marketing'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nombre">Nombre *</Label>
                                    <Input
                                        id="nombre"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="status">Estado</Label>
                                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar estado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map(option => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    value={formData.descripcion}
                                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                                    rows={3}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="presupuestoTotal">Presupuesto Total *</Label>
                                    <Input
                                        id="presupuestoTotal"
                                        type="number"
                                        step="0.01"
                                        value={formData.presupuestoTotal}
                                        onChange={(e) => setFormData({ ...formData, presupuestoTotal: parseFloat(e.target.value) || 0 })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="fechaInicio">Fecha Inicio *</Label>
                                    <Input
                                        id="fechaInicio"
                                        type="date"
                                        value={formData.fechaInicio}
                                        onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="fechaFin">Fecha Fin *</Label>
                                    <Input
                                        id="fechaFin"
                                        type="date"
                                        value={formData.fechaFin}
                                        onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="leadsGenerados">Leads Generados</Label>
                                    <Input
                                        id="leadsGenerados"
                                        type="number"
                                        value={formData.leadsGenerados}
                                        onChange={(e) => setFormData({ ...formData, leadsGenerados: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="leadsSuscritos">Leads Suscritos</Label>
                                    <Input
                                        id="leadsSuscritos"
                                        type="number"
                                        value={formData.leadsSuscritos}
                                        onChange={(e) => setFormData({ ...formData, leadsSuscritos: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="gastoReal">Gasto Real</Label>
                                    <Input
                                        id="gastoReal"
                                        type="number"
                                        step="0.01"
                                        value={formData.gastoReal}
                                        onChange={(e) => setFormData({ ...formData, gastoReal: parseFloat(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    {editingCampaña ? 'Actualizar' : 'Crear'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filtros */}
            <div className="flex items-center space-x-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
                    <Input
                        placeholder="Buscar campañas..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Campañas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampanas.map(campaña => {
                    const metrics = calculateMetrics(campaña);
                    return (
                        <Card key={campaña.id} className="bg-zinc-900 border-zinc-700">
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-white text-lg">
                                        {campaña.nombre}
                                    </CardTitle>
                                    {getStatusBadge(campaña.status)}
                                </div>
                                {campaña.descripcion && (
                                    <CardDescription className="text-zinc-400">
                                        {campaña.descripcion}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Métricas principales */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="h-4 w-4 text-green-500" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Presupuesto</p>
                                            <p className="text-sm font-medium text-white">
                                                ${campaña.presupuestoTotal.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-blue-500" />
                                        <div>
                                            <p className="text-xs text-zinc-500">Leads</p>
                                            <p className="text-sm font-medium text-white">
                                                {campaña.leadsGenerados}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Métricas calculadas */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-400">Costo Adquisición:</span>
                                        <span className="text-white">${metrics.costoAdquisicion.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-400">Costo Conversión:</span>
                                        <span className="text-white">${metrics.costoConversion.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-zinc-400">Tasa Conversión:</span>
                                        <span className="text-white">{metrics.tasaConversion.toFixed(1)}%</span>
                                    </div>
                                </div>

                                {/* Período */}
                                <div className="flex items-center space-x-2 text-sm text-zinc-400">
                                    <Calendar className="h-4 w-4" />
                                    <span>
                                        {campaña.fechaInicio.toLocaleDateString()} - {campaña.fechaFin.toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Plataformas */}
                                {campaña.plataformas.length > 0 && (
                                    <div>
                                        <p className="text-xs text-zinc-500 mb-2">Plataformas:</p>
                                        <div className="flex flex-wrap gap-1">
                                            {campaña.plataformas.slice(0, 3).map(plataforma => (
                                                <Badge key={plataforma.id} variant="secondary" className="text-xs">
                                                    {plataforma.plataforma.nombre}
                                                </Badge>
                                            ))}
                                            {campaña.plataformas.length > 3 && (
                                                <Badge variant="secondary" className="text-xs">
                                                    +{campaña.plataformas.length - 3}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Acciones */}
                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEdit(campaña)}
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(campaña.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        {campaña.status === 'activa' && (
                                            <Button variant="ghost" size="sm">
                                                <Pause className="h-4 w-4" />
                                            </Button>
                                        )}
                                        {campaña.status === 'pausada' && (
                                            <Button variant="ghost" size="sm">
                                                <Play className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredCampanas.length === 0 && (
                <div className="text-center py-12">
                    <Target className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-400 mb-2">
                        {campanas.length === 0 ? 'No hay campañas activas' : 'No se encontraron campañas'}
                    </h3>
                    <p className="text-zinc-500">
                        {campanas.length === 0 
                            ? 'Crea tu primera campaña para comenzar'
                            : 'Ajusta los filtros para ver más resultados'
                        }
                    </p>
                </div>
            )}
        </div>
    );
}
