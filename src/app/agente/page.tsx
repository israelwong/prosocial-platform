'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
    Users,
    TrendingUp,
    Phone,
    Mail,
    Calendar,
    Search,
    Filter,
    Plus
} from 'lucide-react'

interface Lead {
    id: string
    nombre: string
    email: string
    telefono: string
    etapa: string
    puntaje: number
    prioridad: string
    planInteres: string
    presupuestoMensual: number
    fechaUltimoContacto: string | null
    notasConversacion: string | null
}

export default function AgenteDashboard() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterEtapa, setFilterEtapa] = useState('all')

    useEffect(() => {
        fetchLeads()
    }, [])

    const fetchLeads = async () => {
        const supabase = createClient()

        const { data, error } = await supabase
            .from('prosocial_leads')
            .select('*')
            .order('createdAt', { ascending: false })

        if (error) {
            console.error('Error fetching leads:', error)
        } else {
            setLeads(data || [])
        }
        setLoading(false)
    }

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterEtapa === 'all' || lead.etapa === filterEtapa
        return matchesSearch && matchesFilter
    })

    const getEtapaColor = (etapa: string) => {
        switch (etapa) {
            case 'nuevo': return 'bg-blue-100 text-blue-800'
            case 'seguimiento': return 'bg-yellow-100 text-yellow-800'
            case 'promesa': return 'bg-green-100 text-green-800'
            case 'suscrito': return 'bg-green-100 text-green-800'
            case 'cancelado': return 'bg-red-100 text-red-800'
            case 'perdido': return 'bg-gray-100 text-gray-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getEtapaText = (etapa: string) => {
        switch (etapa) {
            case 'nuevo': return 'Nuevo'
            case 'seguimiento': return 'Seguimiento'
            case 'promesa': return 'Promesa'
            case 'suscrito': return 'Suscrito'
            case 'cancelado': return 'Cancelado'
            case 'perdido': return 'Perdido'
            default: return etapa
        }
    }

    const getPrioridadColor = (prioridad: string) => {
        switch (prioridad) {
            case 'alta': return 'bg-red-100 text-red-800'
            case 'media': return 'bg-yellow-100 text-yellow-800'
            case 'baja': return 'bg-green-100 text-green-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    // Calcular métricas
    const totalLeads = leads.length
    const leadsNuevos = leads.filter(l => l.etapa === 'nuevo').length
    const leadsSeguimiento = leads.filter(l => l.etapa === 'seguimiento').length
    const leadsPromesa = leads.filter(l => l.etapa === 'promesa').length
    const conversionRate = totalLeads > 0 ? Math.round((leads.filter(l => l.etapa === 'suscrito').length / totalLeads) * 100) : 0

    if (loading) {
        return (
            <div className="container mx-auto py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-32 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <div>
                    <h1 className="text-3xl font-bold">Dashboard Agente</h1>
                    <p className="text-gray-600 mt-1">Gestión de leads y conversiones</p>
                </div>

                {/* Métricas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{totalLeads}</div>
                            <p className="text-xs text-muted-foreground">
                                {leadsNuevos} nuevos
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">En Seguimiento</CardTitle>
                            <Phone className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{leadsSeguimiento}</div>
                            <p className="text-xs text-muted-foreground">
                                {leadsPromesa} en promesa
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Conversión</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{conversionRate}%</div>
                            <p className="text-xs text-muted-foreground">
                                Tasa de conversión
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Meta Mensual</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">25</div>
                            <p className="text-xs text-muted-foreground">
                                Leads objetivo
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Lista de Leads */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold">Leads Asignados</h2>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Lead
                    </Button>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                            placeholder="Buscar leads..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <select
                        value={filterEtapa}
                        onChange={(e) => setFilterEtapa(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">Todas las etapas</option>
                        <option value="nuevo">Nuevo</option>
                        <option value="seguimiento">Seguimiento</option>
                        <option value="promesa">Promesa</option>
                        <option value="suscrito">Suscrito</option>
                        <option value="cancelado">Cancelado</option>
                        <option value="perdido">Perdido</option>
                    </select>
                </div>

                {/* Lista de leads */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredLeads.map((lead) => (
                        <Card key={lead.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg font-semibold line-clamp-1">
                                            {lead.nombre}
                                        </CardTitle>
                                        <CardDescription className="flex items-center mt-1">
                                            <Mail className="mr-1 h-3 w-3" />
                                            {lead.email}
                                        </CardDescription>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <Badge className={getEtapaColor(lead.etapa)}>
                                            {getEtapaText(lead.etapa)}
                                        </Badge>
                                        <Badge className={getPrioridadColor(lead.prioridad)}>
                                            {lead.prioridad}
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Teléfono:</span>
                                        <span className="font-medium">{lead.telefono}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Plan:</span>
                                        <span className="font-medium">{lead.planInteres}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Presupuesto:</span>
                                        <span className="font-medium">${lead.presupuestoMensual}</span>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Puntaje:</span>
                                        <span className="font-medium">{lead.puntaje}/10</span>
                                    </div>

                                    {lead.notasConversacion && (
                                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                            <strong>Notas:</strong> {lead.notasConversacion}
                                        </div>
                                    )}

                                    <div className="flex justify-between pt-2">
                                        <Button size="sm" variant="outline">
                                            <Phone className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Mail className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="outline">
                                            <Calendar className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredLeads.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No hay leads</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || filterEtapa !== 'all'
                                ? 'No hay leads que coincidan con los filtros aplicados.'
                                : 'Comienza agregando nuevos leads para gestionar.'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}
