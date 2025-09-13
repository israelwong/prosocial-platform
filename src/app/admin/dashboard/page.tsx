'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    TrendingUp,
    Building2,
    DollarSign,
    Activity,
    Target,
    Calendar,
    Settings,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Edit,
    Plus
} from 'lucide-react'

interface DashboardStats {
    totalStudios: number
    activeStudios: number
    totalLeads: number
    convertedLeads: number
    monthlyRevenue: number
    conversionRate: number
    newStudiosThisMonth: number
    revenueGrowth: number
}

interface RecentActivity {
    id: string
    type: 'studio_created' | 'lead_converted' | 'payment_received' | 'subscription_updated'
    description: string
    timestamp: Date
    studioName?: string
    amount?: number
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalStudios: 0,
        activeStudios: 0,
        totalLeads: 0,
        convertedLeads: 0,
        monthlyRevenue: 0,
        conversionRate: 0,
        newStudiosThisMonth: 0,
        revenueGrowth: 0
    })

    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchDashboardData()
    }, [])

    const fetchDashboardData = async () => {
        // Simular carga de datos
        setTimeout(() => {
            setStats({
                totalStudios: 25,
                activeStudios: 20,
                totalLeads: 150,
                convertedLeads: 45,
                monthlyRevenue: 125000,
                conversionRate: 30.0,
                newStudiosThisMonth: 5,
                revenueGrowth: 12.5
            })

            setRecentActivity([
                {
                    id: '1',
                    type: 'studio_created',
                    description: 'Nuevo estudio registrado',
                    timestamp: new Date(Date.now() - 1000 * 60 * 30),
                    studioName: 'Fotografía María'
                },
                {
                    id: '2',
                    type: 'lead_converted',
                    description: 'Lead convertido a estudio',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
                    studioName: 'Eventos Carlos'
                },
                {
                    id: '3',
                    type: 'payment_received',
                    description: 'Pago recibido',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
                    amount: 1490
                },
                {
                    id: '4',
                    type: 'subscription_updated',
                    description: 'Suscripción actualizada',
                    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
                    studioName: 'Diseño Ana'
                }
            ])

            setLoading(false)
        }, 1000)
    }

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'studio_created': return <Building2 className="h-4 w-4 text-green-500" />
            case 'lead_converted': return <Target className="h-4 w-4 text-blue-500" />
            case 'payment_received': return <DollarSign className="h-4 w-4 text-emerald-500" />
            case 'subscription_updated': return <Settings className="h-4 w-4 text-purple-500" />
            default: return <Activity className="h-4 w-4 text-gray-500" />
        }
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(amount)
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
                    <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Resumen general de la plataforma ProSocial
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        Este mes
                    </Button>
                    <Button size="sm">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Lead
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Estudios</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalStudios}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-500">+{stats.newStudiosThisMonth}</span>
                            <span className="ml-1">este mes</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Estudios Activos</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.activeStudios}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span>{((stats.activeStudios / stats.totalStudios) * 100).toFixed(1)}%</span>
                            <span className="ml-1">del total</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Revenue Mensual</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-500">+{stats.revenueGrowth}%</span>
                            <span className="ml-1">vs mes anterior</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.conversionRate.toFixed(1)}%</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span>{stats.convertedLeads} de {stats.totalLeads} leads</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Recent Activity */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                        <CardDescription>
                            Últimas acciones en la plataforma
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium">
                                            {activity.description}
                                        </p>
                                        {activity.studioName && (
                                            <p className="text-sm text-muted-foreground">
                                                {activity.studioName}
                                            </p>
                                        )}
                                        {activity.amount && (
                                            <p className="text-sm text-muted-foreground">
                                                {formatCurrency(activity.amount)}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex-shrink-0 text-xs text-muted-foreground">
                                        {activity.timestamp.toLocaleTimeString('es-MX', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Acciones Rápidas</CardTitle>
                        <CardDescription>
                            Herramientas de administración
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <Button variant="outline" className="w-full justify-start">
                            <Users className="mr-2 h-4 w-4" />
                            Gestionar Leads
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <Building2 className="mr-2 h-4 w-4" />
                            Ver Estudios
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <BarChart3 className="mr-2 h-4 w-4" />
                            Reportes
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                            <Settings className="mr-2 h-4 w-4" />
                            Configuración
                        </Button>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Overview */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Conversión de Leads</CardTitle>
                        <CardDescription>
                            Progreso de leads por etapa
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Nuevos</span>
                                <Badge variant="secondary">45</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">En Seguimiento</span>
                                <Badge variant="secondary">23</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Promesa</span>
                                <Badge variant="secondary">12</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Convertidos</span>
                                <Badge className="bg-green-500">8</Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Estudios por Plan</CardTitle>
                        <CardDescription>
                            Distribución de suscripciones
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Básico</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">15</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Negocio</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">20</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Agencia</span>
                                <div className="flex items-center space-x-2">
                                    <div className="w-20 bg-gray-200 rounded-full h-2">
                                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                                    </div>
                                    <span className="text-sm text-muted-foreground">5</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}