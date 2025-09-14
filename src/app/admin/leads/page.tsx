import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Search,
    Filter,
    User,
    Phone,
    Mail,
    Calendar,
    Target
} from 'lucide-react';

export default function LeadsPage() {
    // Mock data para desarrollo
    const leads = [
        {
            id: '1',
            nombre: 'María González',
            email: 'maria@email.com',
            telefono: '+52 55 1234 5678',
            estado: 'nuevo',
            fechaCreacion: '2024-01-15',
            agente: null
        },
        {
            id: '2',
            nombre: 'Carlos Rodríguez',
            email: 'carlos@email.com',
            telefono: '+52 55 9876 5432',
            estado: 'contactado',
            fechaCreacion: '2024-01-14',
            agente: 'Ana Martínez'
        },
        {
            id: '3',
            nombre: 'Laura Sánchez',
            email: 'laura@email.com',
            telefono: '+52 55 5555 1234',
            estado: 'calificado',
            fechaCreacion: '2024-01-13',
            agente: 'Carlos Rodríguez'
        }
    ];

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'nuevo':
                return 'bg-blue-100 text-blue-800';
            case 'contactado':
                return 'bg-yellow-100 text-yellow-800';
            case 'calificado':
                return 'bg-green-100 text-green-800';
            case 'propuesta':
                return 'bg-purple-100 text-purple-800';
            case 'cerrado':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getEstadoLabel = (estado: string) => {
        switch (estado) {
            case 'nuevo':
                return 'Nuevo';
            case 'contactado':
                return 'Contactado';
            case 'calificado':
                return 'Calificado';
            case 'propuesta':
                return 'Propuesta';
            case 'cerrado':
                return 'Cerrado';
            default:
                return estado;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="border-b border-gray-200 pb-6">
                <h1 className="text-3xl font-bold text-gray-900">Gestión de Leads</h1>
                <p className="text-gray-600 mt-2">
                    Administra y sigue el progreso de todos los leads
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
                        <User className="h-5 w-5 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">{leads.length}</div>
                        <p className="text-sm text-green-600 mt-1">
                            +3 esta semana
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Nuevos</CardTitle>
                        <Target className="h-5 w-5 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                            {leads.filter(l => l.estado === 'nuevo').length}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            Sin asignar
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Contactados</CardTitle>
                        <Phone className="h-5 w-5 text-yellow-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                            {leads.filter(l => l.estado === 'contactado').length}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            En proceso
                        </p>
                    </CardContent>
                </Card>

                <Card className="border border-gray-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                        <CardTitle className="text-sm font-medium text-gray-600">Calificados</CardTitle>
                        <Target className="h-5 w-5 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-gray-900">
                            {leads.filter(l => l.estado === 'calificado').length}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                            Listos para propuesta
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-lg font-semibold text-gray-900">Filtros y Búsqueda</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Buscar por nombre, email o teléfono..."
                                    className="pl-10 border-gray-300"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-gray-300">
                                <Filter className="mr-2 h-4 w-4" />
                                Filtros
                            </Button>
                            <Button variant="outline" size="sm" className="border-gray-300">
                                Nuevos
                            </Button>
                            <Button variant="outline" size="sm" className="border-gray-300">
                                Sin Asignar
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Leads List */}
            <Card className="border border-gray-200 shadow-sm">
                <CardHeader className="border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold text-gray-900">Lista de Leads</CardTitle>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Lead
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        {leads.map((lead) => (
                            <div
                                key={lead.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <User className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-gray-900">{lead.nombre}</h3>
                                            <Badge className={getEstadoColor(lead.estado)}>
                                                {getEstadoLabel(lead.estado)}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Mail className="h-3 w-3" />
                                                {lead.email}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                {lead.telefono}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {lead.fechaCreacion}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="text-right space-y-1">
                                        <div className="text-sm font-medium text-gray-900">
                                            {lead.agente || 'Sin asignar'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            Agente asignado
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="border-gray-300">
                                        Ver Detalles
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}