'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Users,
    Building2,
    Target,
    Calendar,
    Download,
    Filter,
    PieChart,
    Activity
} from 'lucide-react'

interface AnalyticsData {
    conversionFunnel: Array<{
        stage: string
        count: number
        percentage: number
    }>
    monthlyGrowth: Array<{
        month: string
        studios: number
        leads: number
        revenue: number
    }>
    topPerformingAgents: Array<{
        id: string
        name: string
        leads: number
        conversions: number
        conversionRate: number
    }>
    studioRetention: {
        month1: number
        month3: number
        month6: number
        month12: number
    }
}

export default function AnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
        conversionFunnel: [],
        monthlyGrowth: [],
        topPerformingAgents: [],
        studioRetention: { month1: 0, month3: 0, month6: 0, month12: 0 }
    })
    const [loading, setLoading] = useState(true)
    const [timeRange, setTimeRange] = useState('6months')

    useEffect(() => {
        fetchAnalyticsData()
    }, [timeRange])

    const fetchAnalyticsData = async () => {
        const supabase = createClient()

        try {
            // Obtener datos de leads por etapa
            const { data: leads } = await supabase
                .from('prosocial_leads')
                .select('etapa')

            // Obtener datos de estudios
            const { data: studios } = await supabase
                .from('studios')
                .select('createdAt, subscriptionStatus')

            // Obtener datos de agentes
            const { data: agents } = await supabase
                .from('prosocial_agents')
                .select(`
          id,
          nombre,
          leads:prosocial_leads(count)
        `)

            // Calcular funnel de conversión
            const totalLeads = leads?.length || 0
            const conversionFunnel = [
                { stage: 'Nuevos', count: leads?.filter(l => l.etapa === 'nuevo').length || 0, percentage: 100 },
                { stage: 'Seguimiento', count: leads?.filter(l => l.etapa === 'seguimiento').length || 0, percentage: 0 },
                { stage: 'Promesa', count: leads?.filter(l => l.etapa === 'promesa').length || 0, percentage: 0 },
                { stage: 'Convertidos', count: leads?.filter(l => l.etapa === 'suscrito').length || 0, percentage: 0 }
            ]

            // Calcular porcentajes
            conversionFunnel.forEach((stage, index) => {
                if (index > 0) {
                    stage.percentage = totalLeads > 0 ? (stage.count / totalLeads) * 100 : 0
                }
            })

            // Mock data para crecimiento mensual
            const monthlyGrowth = [
                { month: 'Ene', studios: 12, leads: 45, revenue: 45000 },
                { month: 'Feb', studios: 15, leads: 52, revenue: 52000 },
                { month: 'Mar', studios: 18, leads: 48, revenue: 48000 },
                { month: 'Abr', studios: 22, leads: 61, revenue: 61000 },
                { month: 'May', studios: 25, leads: 55, revenue: 55000 },
                { month: 'Jun', studios: 28, leads: 67, revenue: 67000 }
            ]

            // Mock data para agentes top
            const topPerformingAgents = [
                { id: '1', name: 'María González', leads: 25, conversions: 8, conversionRate: 32 },
                { id: '2', name: 'Carlos López', leads: 22, conversions: 6, conversionRate: 27 },
                { id: '3', name: 'Ana Martínez', leads: 18, conversions: 5, conversionRate: 28 },
                { id: '4', name: 'Luis Rodríguez', leads: 15, conversions: 4, conversionRate: 27 }
            ]

            setAnalyticsData({
                conversionFunnel,
                monthlyGrowth,
                topPerformingAgents,
                studioRetention: { month1: 95, month3: 87, month6: 78, month12: 65 }
            })

        } catch (error) {
            console.error('Error fetching analytics data:', error)
        } finally {
            setLoading(false)
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Analytics</h1>
                    <p className="text-muted-foreground mt-1">
                        Análisis profundo del rendimiento de la plataforma
                    </p>
                </div>
                <div className="flex space-x-2">
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="3months">Últimos 3 meses</option>
                        <option value="6months">Últimos 6 meses</option>
                        <option value="year">Último año</option>
                    </select>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {analyticsData.conversionFunnel[3]?.percentage.toFixed(1) || 0}%
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                            <span className="text-green-500">+2.3%</span>
                            <span className="ml-1">vs mes anterior</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Retención 6M</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{analyticsData.studioRetention.month6}%</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span>Estudios activos</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Crecimiento Mensual</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+12.5%</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span>Nuevos estudios</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">LTV Promedio</CardTitle>
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(45000)}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <span>Valor de vida</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Conversion Funnel */}
            <Card>
                <CardHeader>
                    <CardTitle>Embudo de Conversión</CardTitle>
                    <CardDescription>
                        Progreso de leads a través del proceso de ventas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {analyticsData.conversionFunnel.map((stage, index) => (
                            <div key={stage.stage} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="font-medium">{stage.stage}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {stage.count} leads
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full"
                                            style={{ width: `${stage.percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="text-sm font-medium w-12 text-right">
                                        {stage.percentage.toFixed(1)}%
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Growth Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Crecimiento Mensual</CardTitle>
                        <CardDescription>
                            Evolución de estudios, leads y revenue
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analyticsData.monthlyGrowth.map((month) => (
                                <div key={month.month} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">{month.month}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {formatCurrency(month.revenue)}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-sm">
                                        <div className="flex justify-between">
                                            <span>Estudios:</span>
                                            <span className="font-medium">{month.studios}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Leads:</span>
                                            <span className="font-medium">{month.leads}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Revenue:</span>
                                            <span className="font-medium">{formatCurrency(month.revenue)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Agentes</CardTitle>
                        <CardDescription>
                            Rendimiento de agentes comerciales
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analyticsData.topPerformingAgents.map((agent, index) => (
                                <div key={agent.id} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs font-bold text-green-600">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium">{agent.name}</div>
                                            <div className="text-sm text-muted-foreground">
                                                {agent.leads} leads, {agent.conversions} conversiones
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-medium">{agent.conversionRate}%</div>
                                        <div className="text-sm text-muted-foreground">conversión</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Retention Analysis */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Retención de Estudios</CardTitle>
                        <CardDescription>
                            Porcentaje de estudios que permanecen activos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Mes 1:</span>
                                <span className="font-medium">{analyticsData.studioRetention.month1}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Mes 3:</span>
                                <span className="font-medium">{analyticsData.studioRetention.month3}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Mes 6:</span>
                                <span className="font-medium">{analyticsData.studioRetention.month6}%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Mes 12:</span>
                                <span className="font-medium">{analyticsData.studioRetention.month12}%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Análisis de Churn</CardTitle>
                        <CardDescription>
                            Razones principales de cancelación
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between">
                                <span className="text-sm">Precio:</span>
                                <span className="font-medium">35%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Funcionalidad:</span>
                                <span className="font-medium">28%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Soporte:</span>
                                <span className="font-medium">20%</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Otros:</span>
                                <span className="font-medium">17%</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Predicciones</CardTitle>
                        <CardDescription>
                            Proyecciones basadas en tendencias
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-500">+25%</div>
                                <div className="text-sm text-muted-foreground">Crecimiento esperado</div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Próximo mes:</span>
                                    <span className="font-medium">32 estudios</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Próximo trimestre:</span>
                                    <span className="font-medium">95 estudios</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Próximo año:</span>
                                    <span className="font-medium">380 estudios</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
