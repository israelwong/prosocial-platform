'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Users,
    Calendar,
    DollarSign,
    TrendingUp,
    Clock,
    CheckCircle
} from 'lucide-react';

export default function StudioDashboard() {
    // Datos demo hardcodeados
    const stats = [
        {
            title: 'Leads Totales',
            value: '150',
            change: '+12%',
            changeType: 'positive',
            icon: Users,
            description: 'Leads generados este mes'
        },
        {
            title: 'Eventos Programados',
            value: '25',
            change: '+8%',
            changeType: 'positive',
            icon: Calendar,
            description: 'Eventos confirmados'
        },
        {
            title: 'Revenue',
            value: '$12,500',
            change: '+15%',
            changeType: 'positive',
            icon: DollarSign,
            description: 'Ingresos del mes'
        },
        {
            title: 'Tasa de Conversión',
            value: '18%',
            change: '+3%',
            changeType: 'positive',
            icon: TrendingUp,
            description: 'Leads convertidos'
        }
    ];

    const recentActivities = [
        {
            id: 1,
            type: 'lead',
            message: 'Nuevo lead: María González - Boda',
            time: 'Hace 2 horas',
            icon: Users
        },
        {
            id: 2,
            type: 'event',
            message: 'Evento confirmado: Quinceañera de Ana',
            time: 'Hace 4 horas',
            icon: CheckCircle
        },
        {
            id: 3,
            type: 'payment',
            message: 'Pago recibido: $2,500 - Boda de Carlos',
            time: 'Hace 6 horas',
            icon: DollarSign
        },
        {
            id: 4,
            type: 'appointment',
            message: 'Cita programada: Consulta con Juan',
            time: 'Mañana 10:00 AM',
            icon: Clock
        }
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-zinc-400 mt-1">
                    Bienvenido a tu panel de control
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title} className="bg-zinc-900 border-zinc-800">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-zinc-400">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-zinc-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <p className="text-xs text-zinc-400 mt-1">
                                <span className={`inline-flex items-center ${stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                                    }`}>
                                    {stat.change}
                                </span>
                                {' '}vs mes anterior
                            </p>
                            <p className="text-xs text-zinc-500 mt-1">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Activities */}
            <div className="grid gap-6 lg:grid-cols-2">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Actividad Reciente</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Últimas acciones en tu estudio
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-start space-x-3">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center">
                                            <activity.icon className="h-4 w-4 text-zinc-400" />
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white">{activity.message}</p>
                                        <p className="text-xs text-zinc-500 mt-1">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white">Accesos Rápidos</CardTitle>
                        <CardDescription className="text-zinc-400">
                            Acciones más utilizadas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3">
                            <button className="flex items-center justify-between p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <Users className="h-5 w-5 text-blue-400" />
                                    <span className="text-white">Nuevo Lead</span>
                                </div>
                                <span className="text-zinc-400 text-sm">+</span>
                            </button>

                            <button className="flex items-center justify-between p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <Calendar className="h-5 w-5 text-green-400" />
                                    <span className="text-white">Nuevo Evento</span>
                                </div>
                                <span className="text-zinc-400 text-sm">+</span>
                            </button>

                            <button className="flex items-center justify-between p-3 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition-colors">
                                <div className="flex items-center space-x-3">
                                    <DollarSign className="h-5 w-5 text-yellow-400" />
                                    <span className="text-white">Registrar Pago</span>
                                </div>
                                <span className="text-zinc-400 text-sm">+</span>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
