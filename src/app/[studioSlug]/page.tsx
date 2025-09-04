'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { StudioNavigation } from '@/components/studio/studio-navigation'
import { useStudioAuth } from '@/hooks/use-studio-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Camera,
    Users,
    DollarSign,
    TrendingUp,
    Plus,
    FileText,
    Calendar
} from 'lucide-react'

export default function StudioDashboard() {
    const params = useParams()
    const studioSlug = params.studioSlug as string
    const { user, studioUser, loading } = useStudioAuth()

    const [stats, setStats] = useState({
        totalProjects: 0,
        totalClients: 0,
        totalRevenue: 0,
        pendingQuotations: 0
    })

    useEffect(() => {
        if (studioUser) {
            // Aquí podrías cargar las estadísticas reales del studio
            setStats({
                totalProjects: 12,
                totalClients: 8,
                totalRevenue: 125000,
                pendingQuotations: 3
            })
        }
    }, [studioUser])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Acceso requerido</CardTitle>
                        <CardDescription>
                            Necesitas iniciar sesión para acceder a este studio.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={() => window.location.href = `/auth/signin?studio=${studioSlug}`}
                            className="w-full"
                        >
                            Iniciar Sesión
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!studioUser) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Studio no encontrado</CardTitle>
                        <CardDescription>
                            No tienes acceso a este studio o no existe.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <StudioNavigation />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                ¡Bienvenido, {studioUser.name}!
                            </h1>
                            <p className="mt-2 text-sm text-gray-600">
                                Panel de control de {studioUser.studioName}
                            </p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Badge variant="secondary">
                                Plan {studioUser.plan.name}
                            </Badge>
                            <Badge variant={studioUser.role === 'ADMIN' ? 'default' : 'outline'}>
                                {studioUser.role}
                            </Badge>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="px-4 sm:px-0 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Proyectos Activos
                            </CardTitle>
                            <Camera className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalProjects}</div>
                            <p className="text-xs text-muted-foreground">
                                +2 este mes
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Clientes
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalClients}</div>
                            <p className="text-xs text-muted-foreground">
                                +1 este mes
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Ingresos Totales
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${stats.totalRevenue.toLocaleString()} MXN
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +15% vs mes anterior
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Cotizaciones Pendientes
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.pendingQuotations}</div>
                            <p className="text-xs text-muted-foreground">
                                Requieren seguimiento
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <div className="px-4 sm:px-0 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Acciones Rápidas</CardTitle>
                            <CardDescription>
                                Gestiona tu studio de manera eficiente
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button asChild className="w-full justify-start" variant="outline">
                                <Link href={`/${studioUser.studioSlug}/projects`}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nuevo Proyecto
                                </Link>
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <Users className="mr-2 h-4 w-4" />
                                Agregar Cliente
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <FileText className="mr-2 h-4 w-4" />
                                Crear Cotización
                            </Button>
                            <Button className="w-full justify-start" variant="outline">
                                <Calendar className="mr-2 h-4 w-4" />
                                Ver Calendario
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Resumen de Ingresos</CardTitle>
                            <CardDescription>
                                Distribución de ingresos ProSocial Platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Tu parte (70%)</span>
                                    <span className="font-semibold">
                                        ${(stats.totalRevenue * 0.7).toLocaleString()} MXN
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">ProSocial Platform (30%)</span>
                                    <span className="font-semibold">
                                        ${(stats.totalRevenue * 0.3).toLocaleString()} MXN
                                    </span>
                                </div>
                                <div className="pt-3 border-t">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Total Facturado</span>
                                        <span className="font-bold">
                                            ${stats.totalRevenue.toLocaleString()} MXN
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Implementation Status */}
                <div className="px-4 sm:px-0 mt-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <TrendingUp className="mr-2 h-5 w-5" />
                                Estado de Implementación
                            </CardTitle>
                            <CardDescription>
                                Progreso de desarrollo de ProSocial Platform
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span>✅ Base de datos multi-tenant</span>
                                    <Badge variant="default">Completado</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>✅ Autenticación con Supabase</span>
                                    <Badge variant="default">Completado</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>🚧 Dashboard básico</span>
                                    <Badge variant="secondary">En progreso</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>⏳ CRUD de proyectos</span>
                                    <Badge variant="outline">Pendiente</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>⏳ Sistema de cotizaciones</span>
                                    <Badge variant="outline">Pendiente</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>⏳ Integración con Stripe</span>
                                    <Badge variant="outline">Pendiente</Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
