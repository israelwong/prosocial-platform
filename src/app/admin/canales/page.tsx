'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Eye, EyeOff, Target, Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

// Forzar renderizado dinámico
export const dynamic = 'force-dynamic';

interface CanalAdquisicion {
    id: string;
    nombre: string;
    descripcion: string | null;
    categoria: string;
    color: string | null;
    icono: string | null;
    isActive: boolean;
    isVisible: boolean;
    orden: number;
    createdAt: Date;
    updatedAt: Date;
}

const categorias = [
    'Redes Sociales',
    'Pago',
    'Orgánico',
    'Referidos',
    'Otros'
];

const iconos = [
    'Facebook', 'Instagram', 'TikTok', 'Linkedin', 'Twitter',
    'Target', 'Search', 'Globe', 'Mail', 'Users', 'UserCheck',
    'Handshake', 'MessageCircle', 'Calendar', 'Headphones', 'Video',
    'ArrowRight', 'Play'
];

export default function CanalesPage() {
    const [canales, setCanales] = useState<CanalAdquisicion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategoria, setSelectedCategoria] = useState<string>('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCanal, setEditingCanal] = useState<CanalAdquisicion | null>(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        categoria: '',
        color: '#3B82F6',
        icono: 'Target',
        isActive: true,
        isVisible: true,
        orden: 0
    });

    useEffect(() => {
        fetchCanales();
    }, []);

    const fetchCanales = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/canales');
            if (!response.ok) {
                throw new Error('Error al cargar los canales');
            }
            const data = await response.json();
            setCanales(data);
        } catch (error) {
            console.error('Error fetching canales:', error);
            toast.error('Error al cargar los canales');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCanal) {
                // Actualizar canal existente
                const response = await fetch(`/api/canales/${editingCanal.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Error al actualizar el canal');
                }
                toast.success('Canal actualizado exitosamente');
            } else {
                // Crear nuevo canal
                const response = await fetch('/api/canales', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) {
                    throw new Error('Error al crear el canal');
                }
                toast.success('Canal creado exitosamente');
            }

            setIsModalOpen(false);
            setEditingCanal(null);
            resetForm();
            fetchCanales();
        } catch (error) {
            console.error('Error saving canal:', error);
            toast.error('Error al guardar el canal');
        }
    };

    const handleEdit = (canal: CanalAdquisicion) => {
        setEditingCanal(canal);
        setFormData({
            nombre: canal.nombre,
            descripcion: canal.descripcion || '',
            categoria: canal.categoria,
            color: canal.color || '#3B82F6',
            icono: canal.icono || 'Target',
            isActive: canal.isActive,
            isVisible: canal.isVisible,
            orden: canal.orden
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar este canal?')) return;

        try {
            const response = await fetch(`/api/canales/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar el canal');
            }
            toast.success('Canal eliminado exitosamente');
            fetchCanales();
        } catch (error) {
            console.error('Error deleting canal:', error);
            toast.error('Error al eliminar el canal');
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            descripcion: '',
            categoria: '',
            color: '#3B82F6',
            icono: 'Target',
            isActive: true,
            isVisible: true,
            orden: 0
        });
    };

    const filteredCanales = canales.filter(canal => {
        const matchesSearch = canal.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            canal.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategoria = selectedCategoria === 'all' || canal.categoria === selectedCategoria;
        return matchesSearch && matchesCategoria;
    });

    const canalesPorCategoria = categorias.reduce((acc, categoria) => {
        acc[categoria] = filteredCanales.filter(canal => canal.categoria === categoria);
        return acc;
    }, {} as Record<string, CanalAdquisicion[]>);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-zinc-400">Cargando canales...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Canales de Adquisición</h1>
                    <p className="text-zinc-400">Gestiona los canales de adquisición de leads</p>
                </div>
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={() => { setEditingCanal(null); resetForm(); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Canal
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>
                                {editingCanal ? 'Editar Canal' : 'Crear Nuevo Canal'}
                            </DialogTitle>
                            <DialogDescription>
                                {editingCanal ? 'Modifica los datos del canal' : 'Agrega un nuevo canal de adquisición'}
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
                                    <Label htmlFor="categoria">Categoría *</Label>
                                    <Select value={formData.categoria} onValueChange={(value) => setFormData({ ...formData, categoria: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar categoría" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categorias.map(categoria => (
                                                <SelectItem key={categoria} value={categoria}>
                                                    {categoria}
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

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="color">Color</Label>
                                    <Input
                                        id="color"
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="icono">Icono</Label>
                                    <Select value={formData.icono} onValueChange={(value) => setFormData({ ...formData, icono: value })}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar icono" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {iconos.map(icono => (
                                                <SelectItem key={icono} value={icono}>
                                                    {icono}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="orden">Orden</Label>
                                    <Input
                                        id="orden"
                                        type="number"
                                        value={formData.orden}
                                        onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 0 })}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isActive"
                                        checked={formData.isActive}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                                    />
                                    <Label htmlFor="isActive">Activo</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="isVisible"
                                        checked={formData.isVisible}
                                        onCheckedChange={(checked) => setFormData({ ...formData, isVisible: checked })}
                                    />
                                    <Label htmlFor="isVisible">Visible para clientes</Label>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="submit">
                                    {editingCanal ? 'Actualizar' : 'Crear'}
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
                        placeholder="Buscar canales..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={selectedCategoria} onValueChange={setSelectedCategoria}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por categoría" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {categorias.map(categoria => (
                            <SelectItem key={categoria} value={categoria}>
                                {categoria}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Canales por categoría */}
            <div className="space-y-6">
                {categorias.map(categoria => {
                    const canalesCategoria = canalesPorCategoria[categoria];
                    if (canalesCategoria.length === 0) return null;

                    return (
                        <div key={categoria}>
                            <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                                <Target className="h-5 w-5 mr-2" />
                                {categoria}
                                <Badge variant="secondary" className="ml-2">
                                    {canalesCategoria.length}
                                </Badge>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {canalesCategoria.map(canal => (
                                    <Card key={canal.id} className="bg-card border-border">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: canal.color || '#3B82F6' }}
                                                    />
                                                    <CardTitle className="text-white text-base">
                                                        {canal.nombre}
                                                    </CardTitle>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    {canal.isActive ? (
                                                        <Badge variant="default" className="text-xs">Activo</Badge>
                                                    ) : (
                                                        <Badge variant="secondary" className="text-xs">Inactivo</Badge>
                                                    )}
                                                    {canal.isVisible ? (
                                                        <Eye className="h-4 w-4 text-green-500" />
                                                    ) : (
                                                        <EyeOff className="h-4 w-4 text-zinc-500" />
                                                    )}
                                                </div>
                                            </div>
                                            {canal.descripcion && (
                                                <CardDescription className="text-zinc-400 text-sm">
                                                    {canal.descripcion}
                                                </CardDescription>
                                            )}
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm text-zinc-500">
                                                    Orden: {canal.orden}
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEdit(canal)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDelete(canal.id)}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {filteredCanales.length === 0 && (
                <div className="text-center py-12">
                    <Target className="h-12 w-12 text-zinc-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-400 mb-2">No se encontraron canales</h3>
                    <p className="text-zinc-500">Intenta ajustar los filtros de búsqueda</p>
                </div>
            )}
        </div>
    );
}
