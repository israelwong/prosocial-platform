'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Filter, BarChart3, TrendingUp, TrendingDown, DollarSign, Users, Target, Calendar, Eye, Download, Archive, Trash2, Copy, MoreVertical } from 'lucide-react';
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
    { value: 'finalizada', label: 'Finalizada', color: 'bg-red-500' },
    { value: 'pausada', label: 'Pausada', color: 'bg-yellow-500' },
    { value: 'planificada', label: 'Planificada', color: 'bg-gray-500' }
];

const periodOptions = [
    { value: 'all', label: 'Todos los períodos' },
    { value: 'last-month', label: 'Último mes' },
    { value: 'last-3-months', label: 'Últimos 3 meses' },
    { value: 'last-6-months', label: 'Últimos 6 meses' },
    { value: 'last-year', label: 'Último año' }
];

export default function CampanasHistorialPage() {
    const [campanas, setCampanas] = useState<Campaña[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedPeriod, setSelectedPeriod] = useState<string>('all');
    const [selectedCampaña, setSelectedCampaña] = useState<Campaña | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

    useEffect(() => {
        fetchCampanas();
    }, []);

    const fetchCampanas = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/campanas?isActive=false');
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

    const handleViewDetails = (campaña: Campaña) => {
        setSelectedCampaña(campaña);
        setIsDetailModalOpen(true);
    };

    const handleArchive = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres archivar esta campaña?')) return;

        try {
            const response = await fetch(`/api/campanas/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isActive: false, status: 'finalizada' }),
            });

            if (!response.ok) {
                throw new Error('Error al archivar la campaña');
            }
            toast.success('Campaña archivada exitosamente');
            fetchCampanas();
        } catch (error) {
            console.error('Error archiving campaña:', error);
            toast.error('Error al archivar la campaña');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar permanentemente esta campaña? Esta acción no se puede deshacer.')) return;

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

    const handleDuplicate = async (campaña: Campaña) => {
        try {
            const campañaDuplicada = {
                nombre: `${campaña.nombre} (Copia)`,
                descripcion: campaña.descripcion,
                presupuestoTotal: campaña.presupuestoTotal,
                fechaInicio: new Date(),
                fechaFin: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días desde ahora
                status: 'planificada',
                isActive: true,
                leadsGenerados: 0,
                leadsSuscritos: 0,
                gastoReal: 0,
                plataformas: campaña.plataformas.map(p => ({
                    plataformaId: p.plataforma.id,
                    presupuesto: p.presupuesto,
                    gastoReal: 0,
                    leads: 0,
                    conversiones: 0
                }))
            };

            const response = await fetch('/api/campanas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(campañaDuplicada),
            });

            if (!response.ok) {
                throw new Error('Error al duplicar la campaña');
            }
            toast.success('Campaña duplicada exitosamente');
            fetchCampanas();
        } catch (error) {
            console.error('Error duplicating campaña:', error);
            toast.error('Error al duplicar la campaña');
        }
    };

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
        const roi = campaña.presupuestoTotal > 0 ? ((campaña.gastoReal / campaña.presupuestoTotal) * 100) : 0;
        
        return { costoAdquisicion, costoConversion, tasaConversion, roi };
    };

    const getPerformanceIndicator = (campaña: Campaña) => {
        const metrics = calculateMetrics(campaña);
        const tasaConversion = metrics.tasaConversion;
        
        if (tasaConversion >= 20) {
            return { icon: TrendingUp, color: 'text-green-500', label: 'Excelente' };
        } else if (tasaConversion >= 10) {
            return { icon: TrendingUp, color: 'text-blue-500', label: 'Buena' };
        } else if (tasaConversion >= 5) {
            return { icon: TrendingDown, color: 'text-yellow-500', label: 'Regular' };
        } else {
            return { icon: TrendingDown, color: 'text-red-500', label: 'Baja' };
        }
    };

    const filterCampanas = (campanas: Campaña[]) => {
        let filtered = campanas;

        // Filtro por búsqueda
        if (searchTerm) {
            filtered = filtered.filter(campaña => 
                campaña.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                campaña.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por estado
        if (selectedStatus !== 'all') {
            filtered = filtered.filter(campaña => campaña.status === selectedStatus);
        }

        // Filtro por período
        if (selectedPeriod !== 'all') {
            const now = new Date();
            let startDate: Date;

            switch (selectedPeriod) {
                case 'last-month':
                    startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                    break;
                case 'last-3-months':
                    startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
                    break;
                case 'last-6-months':
                    startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                    break;
                case 'last-year':
                    startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                    break;
                default:
                    startDate = new Date(0);
            }

            filtered = filtered.filter(campaña => 
                new Date(campaña.fechaInicio) >= startDate
            );
        }

        return filtered;
    };

    const filteredCampanas = filterCampanas(campanas);

    // Calcular estadísticas generales
    const totalCampanas = filteredCampanas.length;
    const totalPresupuesto = filteredCampanas.reduce((sum, c) => sum + c.presupuestoTotal, 0);
    const totalGasto = filteredCampanas.reduce((sum, c) => sum + c.gastoReal, 0);
    const totalLeads = filteredCampanas.reduce((sum, c) => sum + c.leadsGenerados, 0);
    const totalConversiones = filteredCampanas.reduce((sum, c) => sum + c.leadsSuscritos, 0);
    const promedioConversion = totalLeads > 0 ? (totalConversiones / totalLeads) * 100 : 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-zinc-400">Cargando historial de campañas...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Historial de Campañas</h1>
                    <p className="text-zinc-400">Análisis y métricas de campañas pasadas</p>
                </div>
                <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Reporte
                </Button>
            </div>

            {/* Estadísticas Generales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-zinc-900 border-zinc-700">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <BarChart3 className="h-5 w-5 text-blue-500" />
                            <div>
                                <p className="text-xs text-zinc-500">Total Campañas</p>
                                <p className="text-lg font-semibold text-white">{totalCampanas}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-700">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <DollarSign className="h-5 w-5 text-green-500" />
                            <div>
                                <p className="text-xs text-zinc-500">Presupuesto Total</p>
                                <p className="text-lg font-semibold text-white">${totalPresupuesto.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-700">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Users className="h-5 w-5 text-purple-500" />
                            <div>
                                <p className="text-xs text-zinc-500">Total Leads</p>
                                <p className="text-lg font-semibold text-white">{totalLeads.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-700">
                    <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                            <Target className="h-5 w-5 text-orange-500" />
                            <div>
                                <p className="text-xs text-zinc-500">Tasa Conversión</p>
                                <p className="text-lg font-semibold text-white">{promedioConversion.toFixed(1)}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
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
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los estados</SelectItem>
                        {statusOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por período" />
                    </SelectTrigger>
                    <SelectContent>
                        {periodOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Lista de Campañas */}
            <div className="space-y-4">
                {filteredCampanas.map(campaña => {
                    const metrics = calculateMetrics(campaña);
                    const performance = getPerformanceIndicator(campaña);
                    const PerformanceIcon = performance.icon;

                    return (
                        <Card key={campaña.id} className="bg-zinc-900 border-zinc-700">
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-white">{campaña.nombre}</h3>
                                            {getStatusBadge(campaña.status)}
                                            <div className={`flex items-center space-x-1 ${performance.color}`}>
                                                <PerformanceIcon className="h-4 w-4" />
                                                <span className="text-sm font-medium">{performance.label}</span>
                                            </div>
                                        </div>
                                        
                                        {campaña.descripcion && (
                                            <p className="text-zinc-400 text-sm mb-4">{campaña.descripcion}</p>
                                        )}

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-zinc-500">Presupuesto</p>
                                                <p className="text-sm font-medium text-white">${campaña.presupuestoTotal.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Gasto Real</p>
                                                <p className="text-sm font-medium text-white">${campaña.gastoReal.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Leads Generados</p>
                                                <p className="text-sm font-medium text-white">{campaña.leadsGenerados}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Conversiones</p>
                                                <p className="text-sm font-medium text-white">{campaña.leadsSuscritos}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-zinc-500">Costo Adquisición</p>
                                                <p className="text-sm font-medium text-white">${metrics.costoAdquisicion.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Costo Conversión</p>
                                                <p className="text-sm font-medium text-white">${metrics.costoConversion.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-zinc-500">Tasa Conversión</p>
                                                <p className="text-sm font-medium text-white">{metrics.tasaConversion.toFixed(1)}%</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-4 text-sm text-zinc-400">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="h-4 w-4" />
                                                <span>{campaña.fechaInicio.toLocaleDateString()} - {campaña.fechaFin.toLocaleDateString()}</span>
                                            </div>
                                            {campaña.plataformas.length > 0 && (
                                                <div className="flex items-center space-x-1">
                                                    <span>{campaña.plataformas.length} plataforma(s)</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleViewDetails(campaña)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Ver Detalles
                                        </Button>
                                        
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="outline" size="sm">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleDuplicate(campaña)}>
                                                    <Copy className="h-4 w-4 mr-2" />
                                                    Duplicar
                                                </DropdownMenuItem>
                                                {campaña.status !== 'finalizada' && (
                                                    <DropdownMenuItem onClick={() => handleArchive(campaña.id)}>
                                                        <Archive className="h-4 w-4 mr-2" />
                                                        Archivar
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem 
                                                    onClick={() => handleDelete(campaña.id)}
                                                    className="text-red-400 focus:text-red-300"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {filteredCampanas.length === 0 && (
                <div className="text-center py-12">
                    <BarChart3 className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-400 mb-2">
                        {campanas.length === 0 ? 'No hay campañas en el historial' : 'No se encontraron campañas'}
                    </h3>
                    <p className="text-zinc-500">
                        {campanas.length === 0 
                            ? 'Las campañas finalizadas, pausadas y planificadas aparecerán aquí'
                            : 'Ajusta los filtros para ver más resultados'
                        }
                    </p>
                </div>
            )}

            {/* Modal de Detalles */}
            <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
                <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Detalles de la Campaña</DialogTitle>
                        <DialogDescription>
                            Análisis completo de la campaña seleccionada
                        </DialogDescription>
                    </DialogHeader>
                    
                    {selectedCampaña && (
                        <div className="space-y-6">
                            {/* Información General */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Información General</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-zinc-400">Nombre</Label>
                                        <p className="text-white">{selectedCampaña.nombre}</p>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Estado</Label>
                                        <div className="mt-1">{getStatusBadge(selectedCampaña.status)}</div>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Período</Label>
                                        <p className="text-white">
                                            {selectedCampaña.fechaInicio.toLocaleDateString()} - {selectedCampaña.fechaFin.toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Duración</Label>
                                        <p className="text-white">
                                            {Math.ceil((selectedCampaña.fechaFin.getTime() - selectedCampaña.fechaInicio.getTime()) / (1000 * 60 * 60 * 24))} días
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Métricas Financieras */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Métricas Financieras</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-zinc-400">Presupuesto Total</Label>
                                        <p className="text-white text-lg font-semibold">${selectedCampaña.presupuestoTotal.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Gasto Real</Label>
                                        <p className="text-white text-lg font-semibold">${selectedCampaña.gastoReal.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Costo de Adquisición</Label>
                                        <p className="text-white text-lg font-semibold">${calculateMetrics(selectedCampaña).costoAdquisicion.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Costo de Conversión</Label>
                                        <p className="text-white text-lg font-semibold">${calculateMetrics(selectedCampaña).costoConversion.toFixed(2)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Métricas de Conversión */}
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">Métricas de Conversión</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-zinc-400">Leads Generados</Label>
                                        <p className="text-white text-lg font-semibold">{selectedCampaña.leadsGenerados}</p>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Leads Suscritos</Label>
                                        <p className="text-white text-lg font-semibold">{selectedCampaña.leadsSuscritos}</p>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">Tasa de Conversión</Label>
                                        <p className="text-white text-lg font-semibold">{calculateMetrics(selectedCampaña).tasaConversion.toFixed(1)}%</p>
                                    </div>
                                    <div>
                                        <Label className="text-zinc-400">ROI</Label>
                                        <p className="text-white text-lg font-semibold">{calculateMetrics(selectedCampaña).roi.toFixed(1)}%</p>
                                    </div>
                                </div>
                            </div>

                            {/* Plataformas */}
                            {selectedCampaña.plataformas.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-3">Plataformas Utilizadas</h3>
                                    <div className="space-y-3">
                                        {selectedCampaña.plataformas.map(plataforma => (
                                            <div key={plataforma.id} className="flex items-center justify-between p-3 bg-zinc-800 rounded-lg">
                                                <div>
                                                    <p className="text-white font-medium">{plataforma.plataforma.nombre}</p>
                                                    <p className="text-zinc-400 text-sm">{plataforma.plataforma.tipo}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white">${plataforma.presupuesto.toLocaleString()}</p>
                                                    <p className="text-zinc-400 text-sm">{plataforma.leads} leads</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                            Cerrar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
