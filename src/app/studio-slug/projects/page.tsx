'use client'

import { useState } from 'react'
import { StudioNavigation } from '@/components/studio/studio-navigation'
import { useProjects } from '@/hooks/use-projects'
import { useClients } from '@/hooks/use-clients'
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
import { Textarea } from '@/components/ui/textarea'
import {
    Plus,
    Search,
    Calendar,
    MapPin,
    User,
    DollarSign,
    Eye,
    Edit,
    Trash2
} from 'lucide-react'

export default function ProjectsPage() {
    const { projects, loading, createProject, deleteProject } = useProjects()
    const { clients } = useClients()
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        event_date: '',
        location: '',
        event_type: '',
        client_id: '',
        // Para nuevo cliente
        client_name: '',
        client_email: '',
        client_phone: ''
    })
    const [isNewClient, setIsNewClient] = useState(false)

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.Cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'completed': return 'bg-blue-100 text-blue-800'
            case 'archived': return 'bg-gray-100 text-gray-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Activo'
            case 'completed': return 'Completado'
            case 'archived': return 'Archivado'
            case 'cancelled': return 'Cancelado'
            default: return status
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const projectData = {
            nombre: formData.name,
            fechaEvento: formData.event_date,
            sede: formData.location,
            ...(isNewClient ? {
                clienteNombre: formData.client_name,
                clienteEmail: formData.client_email,
                clienteTelefono: formData.client_phone
            } : {
                clienteId: formData.client_id
            })
        }

        const result = await createProject(projectData)
        if (result) {
            setIsCreateDialogOpen(false)
            setFormData({
                name: '',
                description: '',
                event_date: '',
                location: '',
                event_type: '',
                client_id: '',
                client_name: '',
                client_email: '',
                client_phone: ''
            })
            setIsNewClient(false)
        }
    }

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`¿Estás seguro de que quieres archivar el proyecto "${name}"?`)) {
            await deleteProject(id)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <StudioNavigation />
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <div className="px-4 sm:px-0">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="space-y-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-32 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <StudioNavigation />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 sm:px-0">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Proyectos</h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Gestiona todos tus proyectos y eventos
                            </p>
                        </div>

                        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Proyecto
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Crear Nuevo Proyecto</DialogTitle>
                                    <DialogDescription>
                                        Agrega un nuevo proyecto a tu estudio
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre del Proyecto *</Label>
                                            <Input
                                                id="name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="Ej: Boda María & Juan"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="event_date">Fecha del Evento</Label>
                                            <Input
                                                id="event_date"
                                                type="date"
                                                value={formData.event_date}
                                                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Descripción</Label>
                                        <Textarea
                                            id="description"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe los detalles del proyecto..."
                                            rows={3}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="event_type">Tipo de Evento</Label>
                                            <Select onValueChange={(value) => setFormData({ ...formData, event_type: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="boda">Boda</SelectItem>
                                                    <SelectItem value="xv-anos">XV Años</SelectItem>
                                                    <SelectItem value="aniversario">Aniversario</SelectItem>
                                                    <SelectItem value="cumpleanos">Cumpleaños</SelectItem>
                                                    <SelectItem value="corporativo">Evento Corporativo</SelectItem>
                                                    <SelectItem value="otro">Otro</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="location">Ubicación</Label>
                                            <Input
                                                id="location"
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                placeholder="Ej: Salón Las Flores, CDMX"
                                            />
                                        </div>
                                    </div>

                                    {/* Cliente */}
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-4">
                                            <Label>Cliente</Label>
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="radio"
                                                    id="existing-client"
                                                    name="client-type"
                                                    checked={!isNewClient}
                                                    onChange={() => setIsNewClient(false)}
                                                />
                                                <Label htmlFor="existing-client">Cliente existente</Label>

                                                <input
                                                    type="radio"
                                                    id="new-client"
                                                    name="client-type"
                                                    checked={isNewClient}
                                                    onChange={() => setIsNewClient(true)}
                                                />
                                                <Label htmlFor="new-client">Nuevo cliente</Label>
                                            </div>
                                        </div>

                                        {!isNewClient ? (
                                            <Select onValueChange={(value) => setFormData({ ...formData, client_id: value })}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Selecciona un cliente" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {clients.map((client) => (
                                                        <SelectItem key={client.id} value={client.id}>
                                                            {client.nombre} {client.email && `(${client.email})`}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <div className="grid grid-cols-1 gap-4">
                                                <Input
                                                    placeholder="Nombre del cliente *"
                                                    value={formData.client_name}
                                                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                                                    required={isNewClient}
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Input
                                                        placeholder="Email"
                                                        type="email"
                                                        value={formData.client_email}
                                                        onChange={(e) => setFormData({ ...formData, client_email: e.target.value })}
                                                    />
                                                    <Input
                                                        placeholder="Teléfono"
                                                        value={formData.client_phone}
                                                        onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                                            Cancelar
                                        </Button>
                                        <Button type="submit">
                                            Crear Proyecto
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Buscar proyectos o clientes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filtrar por estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estados</SelectItem>
                                <SelectItem value="ACTIVE">Activos</SelectItem>
                                <SelectItem value="COMPLETED">Completados</SelectItem>
                                <SelectItem value="ARCHIVED">Archivados</SelectItem>
                                <SelectItem value="CANCELLED">Cancelados</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Projects Grid */}
                    {filteredProjects.length === 0 ? (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Calendar className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {searchTerm || statusFilter !== 'all' ? 'No se encontraron proyectos' : 'No hay proyectos aún'}
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {searchTerm || statusFilter !== 'all'
                                        ? 'Intenta cambiar los filtros de búsqueda'
                                        : 'Comienza creando tu primer proyecto'
                                    }
                                </p>
                                {!searchTerm && statusFilter === 'all' && (
                                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear Primer Proyecto
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {filteredProjects.map((project) => (
                                <Card key={project.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg font-semibold line-clamp-1">
                                                    {project.nombre}
                                                </CardTitle>
                                                <CardDescription className="flex items-center mt-1">
                                                    <User className="mr-1 h-3 w-3" />
                                                    {project.Cliente.nombre}
                                                </CardDescription>
                                            </div>
                                            <Badge className={getStatusColor(project.status)}>
                                                {getStatusText(project.status)}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardContent>
                                        <div className="space-y-3">
                                            {project.fecha_evento && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <Calendar className="mr-2 h-4 w-4" />
                                                    {new Date(project.fecha_evento).toLocaleDateString('es-ES', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                            )}

                                            {project.sede && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <MapPin className="mr-2 h-4 w-4" />
                                                    {project.sede}
                                                </div>
                                            )}

                                            {project.Cotizacion.length > 0 && (
                                                <div className="flex items-center text-sm text-gray-600">
                                                    <DollarSign className="mr-2 h-4 w-4" />
                                                    {project.Cotizacion.length} cotización{project.Cotizacion.length !== 1 ? 'es' : ''}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex justify-end space-x-2 mt-4">
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button size="sm" variant="outline">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDelete(project.id, project.nombre)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}
