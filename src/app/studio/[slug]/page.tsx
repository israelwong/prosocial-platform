'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Calendar,
    Users,
    DollarSign,
    Camera,
    Plus,
    Eye,
    Edit,
    Settings
} from 'lucide-react'

interface Studio {
    id: string
    name: string
    slug: string
    email: string
    phone: string
    address: string
    website: string
    subscriptionStatus: string
    plan: {
        name: string
        priceMonthly: number
    }
    _count: {
        eventos: number
        clientes: number
    }
}

interface Evento {
    id: string
    nombre: string
    fecha_evento: string
    status: string
    cliente: {
        nombre: string
        email: string
    }
}

interface Cliente {
    id: string
    nombre: string
    email: string
    telefono: string
    status: string
}

export default function StudioDashboard() {
    const params = useParams()
    const studioSlug = params.slug as string

    const [studio, setStudio] = useState<Studio | null>(null)
    const [eventos, setEventos] = useState<Evento[]>([])
    const [clientes, setClientes] = useState<Cliente[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (studioSlug) {
            fetchStudioData()
        }
    }, [studioSlug])

    const fetchStudioData = async () => {
        const supabase = createClient()

        try {
            // Obtener información del studio
            const { data: studioData, error: studioError } = await supabase
                .from('studios')
                .select(`
          *,
          plan:plans(name, priceMonthly)
        `)
                .eq('slug', studioSlug)
                .single()

            if (studioError) {
                console.error('Error fetching studio:', studioError)
                return
            }

            setStudio(studioData)

            // Obtener eventos recientes
            const { data: eventosData, error: eventosError } = await supabase
                .from('eventos')
                .select(`
          id,
          nombre,
          fecha_evento,
          status,
          cliente:clientes(nombre, email)
        `)
                .eq('studioId', studioData.id)
                .order('fecha_evento', { ascending: false })
                .limit(5)

            if (!eventosError) {
                setEventos(eventosData || [])
            }

            // Obtener clientes recientes
            const { data: clientesData, error: clientesError } = await supabase
                .from('clientes')
                .select('id, nombre, email, telefono, status')
                .eq('studioId', studioData.id)
                .order('createdAt', { ascending: false })
                .limit(5)

            if (!clientesError) {
                setClientes(clientesData || [])
            }

        } catch (error) {
            console.error('Error fetching studio data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-green-100 text-green-800'
            case 'pending': return 'bg-yellow-100 text-yellow-800'
            case 'completed': return 'bg-blue-100 text-blue-800'
            case 'cancelled': return 'bg-red-100 text-red-800'
            default: return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Activo'
            case 'pending': return 'Pendiente'
            case 'completed': return 'Completado'
            case 'cancelled': return 'Cancelado'
            default: return status
        }
    }

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

    if (!studio) {
        return (
            <div className="container mx-auto py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Studio no encontrado</h1>
                    <p className="text-gray-600 mt-2">El studio que buscas no existe o no tienes acceso.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 space-y-8">
            {/* Header */}
            <div className="space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">{studio.name}</h1>
                        <p className="text-gray-600 mt-1">Dashboard del estudio</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline">
                            <Settings className="mr-2 h-4 w-4" />
                            Configuración
                        </Button>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Evento
                        </Button>
                    </div>
                </div>

                {/* Información del Studio */}
                <Card>
                    <CardHeader>
                        <CardTitle>Información del Studio</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600">Email</p>
                                <p className="font-medium">{studio.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Teléfono</p>
                                <p className="font-medium">{studio.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Plan</p>
                                <p className="font-medium">{studio.plan.name} - ${studio.plan.priceMonthly}/mes</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">Estado</p>
                                <Badge className={getStatusColor(studio.subscriptionStatus)}>
                                    {getStatusText(studio.subscriptionStatus)}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Métricas */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{studio._count.eventos}</div>
                            <p className="text-xs text-muted-foreground">
                                Eventos registrados
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{studio._count.clientes}</div>
                            <p className="text-xs text-muted-foreground">
                                Clientes registrados
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Revenue Mensual</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">$0</div>
                            <p className="text-xs text-muted-foreground">
                                Este mes
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Eventos Activos</CardTitle>
                            <Camera className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {eventos.filter(e => e.status === 'active').length}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                En progreso
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Contenido Principal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Eventos Recientes */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Eventos Recientes</CardTitle>
                            <Button variant="outline" size="sm">
                                Ver todos
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {eventos.length > 0 ? (
                                eventos.map((evento) => (
                                    <div key={evento.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{evento.nombre}</h4>
                                            <p className="text-sm text-gray-600">
                                                {evento.cliente.nombre} • {new Date(evento.fecha_evento).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(evento.status)}>
                                                {getStatusText(evento.status)}
                                            </Badge>
                                            <Button size="sm" variant="outline">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay eventos</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Comienza creando tu primer evento.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Clientes Recientes */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Clientes Recientes</CardTitle>
                            <Button variant="outline" size="sm">
                                Ver todos
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {clientes.length > 0 ? (
                                clientes.map((cliente) => (
                                    <div key={cliente.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1">
                                            <h4 className="font-medium">{cliente.nombre}</h4>
                                            <p className="text-sm text-gray-600">{cliente.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge className={getStatusColor(cliente.status)}>
                                                {getStatusText(cliente.status)}
                                            </Badge>
                                            <Button size="sm" variant="outline">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay clientes</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Comienza agregando tu primer cliente.
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
