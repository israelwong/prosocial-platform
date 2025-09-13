'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Users,
    Search,
    Filter,
    Plus,
    MoreHorizontal,
    Eye,
    Edit,
    Trash2,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react'

interface Lead {
    id: string
    name: string
    email: string
    phone: string
    company: string
    stage: 'nuevo' | 'contactado' | 'seguimiento' | 'promesa' | 'convertido' | 'perdido'
    source: 'web' | 'referido' | 'social' | 'email' | 'evento'
    value: number
    createdAt: Date
    lastContact: Date
    notes: string
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [filteredLeads, setFilteredLeads] = useState<Lead[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [stageFilter, setStageFilter] = useState('')
    const [sourceFilter, setSourceFilter] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchLeads()
    }, [])

    useEffect(() => {
        filterLeads()
    }, [leads, searchTerm, stageFilter, sourceFilter])

    const fetchLeads = async () => {
        // Simular carga de datos
        setTimeout(() => {
            const mockLeads: Lead[] = [
                {
                    id: '1',
                    name: 'María González',
                    email: 'maria@fotografia.com',
                    phone: '+52 55 1234 5678',
                    company: 'Fotografía María',
                    stage: 'convertido',
                    source: 'web',
                    value: 8500,
                    createdAt: new Date('2024-01-15'),
                    lastContact: new Date(Date.now() - 1000 * 60 * 30),
                    notes: 'Interesada en plan de negocio para su estudio de fotografía'
                },
                {
                    id: '2',
                    name: 'Carlos Rodríguez',
                    email: 'carlos@eventos.com',
                    phone: '+52 55 2345 6789',
                    company: 'Eventos Carlos',
                    stage: 'seguimiento',
                    source: 'referido',
                    value: 3200,
                    createdAt: new Date('2024-02-20'),
                    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 2),
                    notes: 'Necesita más información sobre las funcionalidades del plan básico'
                },
                {
                    id: '3',
                    name: 'Ana Martínez',
                    email: 'ana@diseno.com',
                    phone: '+52 55 3456 7890',
                    company: 'Diseño Ana',
                    stage: 'nuevo',
                    source: 'social',
                    value: 0,
                    createdAt: new Date('2024-03-10'),
                    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                    notes: 'Recién registrada, necesita seguimiento inicial'
                },
                {
                    id: '4',
                    name: 'Luis Pérez',
                    email: 'luis@videostudio.com',
                    phone: '+52 55 4567 8901',
                    company: 'Video Studio Pro',
                    stage: 'promesa',
                    source: 'email',
                    value: 6200,
                    createdAt: new Date('2024-01-05'),
                    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 4),
                    notes: 'Muy interesado, está evaluando la propuesta comercial'
                },
                {
                    id: '5',
                    name: 'Sofia García',
                    email: 'sofia@creativeminds.com',
                    phone: '+52 55 5678 9012',
                    company: 'Creative Minds',
                    stage: 'perdido',
                    source: 'evento',
                    value: 0,
                    createdAt: new Date('2024-02-28'),
                    lastContact: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
                    notes: 'No respondió a las últimas comunicaciones'
                }
            ]
            setLeads(mockLeads)
            setLoading(false)
        }, 1000)
    }

    const filterLeads = () => {
        let filtered = leads

        if (searchTerm) {
            filtered = filtered.filter(lead =>
                lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.company.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (stageFilter) {
            filtered = filtered.filter(lead => lead.stage === stageFilter)
        }

        if (sourceFilter) {
            filtered = filtered.filter(lead => lead.source === sourceFilter)
        }

        setFilteredLeads(filtered)
    }

    const getStageIcon = (stage: string) => {
        switch (stage) {
            case 'nuevo': return <Clock className="h-4 w-4 text-blue-500" />
            case 'contactado': return <Phone className="h-4 w-4 text-yellow-500" />
            case 'seguimiento': return <AlertCircle className="h-4 w-4 text-orange-500" />
            case 'promesa': return <CheckCircle className="h-4 w-4 text-green-500" />
            case 'convertido': return <CheckCircle className="h-4 w-4 text-emerald-500" />
            case 'perdido': return <XCircle className="h-4 w-4 text-red-500" />
            default: return <Clock className="h-4 w-4 text-gray-500" />
        }
    }

    const getStageBadge = (stage: string) => {
        switch (stage) {
            case 'nuevo': return <Badge className="bg-blue-500">Nuevo</Badge>
            case 'contactado': return <Badge className="bg-yellow-500">Contactado</Badge>
            case 'seguimiento': return <Badge className="bg-orange-500">Seguimiento</Badge>
            case 'promesa': return <Badge className="bg-green-500">Promesa</Badge>
            case 'convertido': return <Badge className="bg-emerald-500">Convertido</Badge>
            case 'perdido': return <Badge className="bg-red-500">Perdido</Badge>
            default: return <Badge variant="secondary">Desconocido</Badge>
        }
    }

    const getSourceBadge = (source: string) => {
        switch (source) {
            case 'web': return <Badge variant="outline">Web</Badge>
            case 'referido': return <Badge variant="outline">Referido</Badge>
            case 'social': return <Badge variant="outline">Redes Sociales</Badge>
            case 'email': return <Badge variant="outline">Email</Badge>
            case 'evento': return <Badge variant="outline">Evento</Badge>
            default: return <Badge variant="secondary">Desconocido</Badge>
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount)
    }

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        })
    }

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Gestión de Leads</h1>
                    <p className="text-muted-foreground mt-1">
                        Administra todos los leads comerciales de la plataforma
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Lead
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leads.length}</div>
                        <p className="text-xs text-muted-foreground">
                            +5 desde la semana pasada
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Leads Activos</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {leads.filter(l => !['convertido', 'perdido'].includes(l.stage)).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            En proceso de conversión
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Convertidos</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {leads.filter(l => l.stage === 'convertido').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {((leads.filter(l => l.stage === 'convertido').length / leads.length) * 100).toFixed(1)}% de conversión
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(leads.reduce((sum, l) => sum + l.value, 0))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Pipeline de ventas
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar leads..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <select
                            value={stageFilter}
                            onChange={(e) => setStageFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todas las etapas</option>
                            <option value="nuevo">Nuevo</option>
                            <option value="contactado">Contactado</option>
                            <option value="seguimiento">Seguimiento</option>
                            <option value="promesa">Promesa</option>
                            <option value="convertido">Convertido</option>
                            <option value="perdido">Perdido</option>
                        </select>
                        <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Todas las fuentes</option>
                            <option value="web">Web</option>
                            <option value="referido">Referido</option>
                            <option value="social">Redes Sociales</option>
                            <option value="email">Email</option>
                            <option value="evento">Evento</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Leads List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLeads.map((lead) => (
                    <Card key={lead.id}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{lead.name}</CardTitle>
                                    <CardDescription>{lead.company}</CardDescription>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {getStageIcon(lead.stage)}
                                    {getStageBadge(lead.stage)}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{lead.email}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{lead.phone}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Fuente:</span>
                                    {getSourceBadge(lead.source)}
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Valor:</span>
                                    <span className="font-medium">{formatCurrency(lead.value)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Registrado:</span>
                                    <span className="text-sm">{formatDate(lead.createdAt)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-muted-foreground">Último contacto:</span>
                                    <span className="text-sm">{formatDate(lead.lastContact)}</span>
                                </div>
                                {lead.notes && (
                                    <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
                                        <span className="text-muted-foreground">Notas:</span>
                                        <p className="mt-1">{lead.notes}</p>
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-2 mt-4">
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Eye className="mr-2 h-4 w-4" />
                                    Ver
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </Button>
                                <Button variant="outline" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredLeads.length === 0 && (
                <Card>
                    <CardContent className="text-center py-8">
                        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No se encontraron leads</h3>
                        <p className="text-muted-foreground">
                            No hay leads que coincidan con los filtros seleccionados.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}