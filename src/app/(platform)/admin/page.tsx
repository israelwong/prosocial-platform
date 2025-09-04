'use client'

import { useState } from 'react'
import { useStudios } from '@/hooks/admin/use-studios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
    Plus,
    Search,
    Building2,
    DollarSign,
    Calendar,
    Eye,
    Edit,
    Trash2,
    TrendingUp
} from 'lucide-react'

export default function AdminStudiosPage() {
    const { studios, loading, createStudio, deleteStudio } = useStudios()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        email: '',
        phone: '',
        address: '',
        planId: ''
    })

    const filteredStudios = studios.filter(studio => {
        const matchesSearch = studio.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            studio.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || studio.subscriptionStatus === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'trial': return 'bg-blue-100 text-blue-800'
            case 'inactive': return 'bg-gray-100 text-gray-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Activo'
            case 'trial': return 'Prueba'
            case 'inactive': return 'Inactivo'
            case 'cancelled': return 'Cancelado'
            default: return status
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const studioData = {
            name: formData.name,
            slug: formData.slug,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            planId: formData.planId
        }

        const result = await createStudio(studioData)
        if (result) {
            setIsCreateDialogOpen(false)
            setFormData({
                name: '',
                slug: '',
                email: '',
                phone: '',
                address: '',
                planId: ''
            })
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`¿Estás seguro de que quieres eliminar el estudio "${name}"?`)) {
            await deleteStudio(id)
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    // Calcular métricas totales
    const totalStudios = studios.length
    const activeStudios = studios.filter(s => s.subscriptionStatus === 'active').length
    const totalRevenue = studios.reduce((sum, studio) => sum + studio.monthlyRevenue, 0)
    const totalEvents = studios.reduce((sum, studio) => sum + studio._count.eventos, 0)

    return (
        <div className="container mx-auto py-8 space-y-8">
            {/* Header con métricas */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Dashboard Administrador</h1>
                        <p className="text-gray-600 mt-1">Gestión de estudios y métricas de la plataforma</p>
                    </div>
                </div>

                {/* Métricas principales */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Estudios</CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalStudios}</div>
                            <p className="text-xs text-muted-foreground">
                                {activeStudios} activos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenue Mensual</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${totalRevenue.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">
                                30% comisión plataforma
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Eventos Totales</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalEvents}</div>
                            <p className="text-xs text-muted-foreground">
                                En todos los estudios
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversión</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalStudios > 0 ? Math.round((activeStudios / totalStudios) * 100) : 0}%
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Trial a activo
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Sección de Estudios */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Gestión de Estudios</h2>

                    <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Estudio
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle>Crear Nuevo Estudio</DialogTitle>
                                <DialogDescription>
                                    Agrega un nuevo estudio a la plataforma ProSocial
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Nombre del Estudio</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug (URL)</Label>
                                        <Input
                                            id="slug"
                                            value={formData.slug}
                                            onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                            placeholder="estudio-ejemplo"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Teléfono</Label>
                                        <Input
                                            id="phone"
                                            value={formData.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="planId">Plan</Label>
                                    <Select
                                        value={formData.planId}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, planId: value }))}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona un plan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="starter">Starter - $29/mes</SelectItem>
                                            <SelectItem value="professional">Professional - $79/mes</SelectItem>
                                            <SelectItem value="enterprise">Enterprise - $199/mes</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit">
                                        Crear Estudio
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Buscar estudios..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-full sm:w-[180px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los estados</SelectItem>
                            <SelectItem value="active">Activos</SelectItem>
                            <SelectItem value="trial">En prueba</SelectItem>
                            <SelectItem value="inactive">Inactivos</SelectItem>
                            <SelectItem value="cancelled">Cancelados</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Lista de estudios */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredStudios.map((studio) => (
                        <Card key={studio.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-semibold line-clamp-1">
                                            {studio.name}
                                        </CardTitle>
                                        <CardDescription className="flex items-center mt-1">
                                            <Building2 className="mr-1 h-3 w-3" />
                                            {studio.email}
                                        </CardDescription>
                                    </div>
                                    <Badge className={getStatusColor(studio.subscriptionStatus)}>
                                        {getStatusText(studio.subscriptionStatus)}
                                    </Badge>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Plan:</span>
                                        <span className="font-medium">{studio.plan.name}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Eventos:</span>
                                        <span className="font-medium">{studio._count.eventos}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Clientes:</span>
                                        <span className="font-medium">{studio._count.clientes}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Revenue:</span>
                                        <span className="font-medium">${studio.monthlyRevenue.toLocaleString()}</span>
                                    </div>

                                    <div className="flex justify-between pt-2">
                                        <Button size="sm" variant="outline">
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => handleDelete(studio.id, studio.name)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredStudios.length === 0 && (
                    <div className="text-center py-12">
                        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay estudios</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || statusFilter !== 'all'
                                ? 'No hay estudios que coincidan con los filtros aplicados.'
                                : 'Comienza creando un nuevo estudio para la plataforma.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
