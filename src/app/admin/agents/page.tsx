import React from 'react';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Edit,
    Trash2,
    User,
    Phone,
    Mail,
    Target,
    TrendingUp
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface Agent {
    id: string;
    nombre: string;
    email: string;
    telefono: string;
    activo: boolean;
    metaMensualLeads: number;
    comisionConversion: number;
    createdAt: Date;
    _count: {
        leads: number;
    };
}

async function getAgents(): Promise<Agent[]> {
    try {
        // Verificar conexión a la base de datos
        await prisma.$connect();

        const agents = await prisma.proSocialAgent.findMany({
            include: {
                _count: {
                    select: {
                        leads: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return agents.map(agent => ({
            ...agent,
            comisionConversion: Number(agent.comisionConversion)
        }));
    } catch (error) {
        console.error('Error fetching agents:', error);
        // Retornar datos mock para desarrollo
        return [
            {
                id: '1',
                nombre: 'Carlos Rodríguez',
                email: 'carlos@prosocial.com',
                telefono: '+52 55 1234 5678',
                activo: true,
                metaMensualLeads: 50,
                comisionConversion: 0.15,
                createdAt: new Date(),
                _count: { leads: 12 }
            },
            {
                id: '2',
                nombre: 'Ana Martínez',
                email: 'ana@prosocial.com',
                telefono: '+52 55 9876 5432',
                activo: true,
                metaMensualLeads: 40,
                comisionConversion: 0.12,
                createdAt: new Date(),
                _count: { leads: 8 }
            }
        ];
    }
}

export default async function AgentsPage() {
    const agents = await getAgents();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestión de Agentes</h1>
                    <p className="text-muted-foreground">
                        Administra los agentes comerciales y su rendimiento
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/agents/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Agente
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Agentes</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{agents.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {agents.filter(a => a.activo).length} activos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Leads Asignados</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {agents.reduce((sum, agent) => sum + agent._count.leads, 0)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Total de leads en gestión
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Meta Promedio</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {agents.length > 0
                                ? Math.round(agents.reduce((sum, agent) => sum + agent.metaMensualLeads, 0) / agents.length)
                                : 0
                            }
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Leads mensuales por agente
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Comisión Promedio</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {agents.length > 0
                                ? `${Math.round(agents.reduce((sum, agent) => sum + Number(agent.comisionConversion), 0) / agents.length * 100)}%`
                                : '0%'
                            }
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Por conversión exitosa
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Filtros y Búsqueda</CardTitle>
                    <CardDescription>
                        Encuentra agentes específicos usando los filtros
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4 md:flex-row">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar por nombre, email o teléfono..."
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Filter className="mr-2 h-4 w-4" />
                                Filtros
                            </Button>
                            <Button variant="outline" size="sm">
                                Activos
                            </Button>
                            <Button variant="outline" size="sm">
                                Inactivos
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Agents Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Agentes</CardTitle>
                    <CardDescription>
                        Gestiona todos los agentes comerciales del sistema
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {agents.length === 0 ? (
                        <div className="text-center py-8">
                            <User className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-semibold">No hay agentes</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Comienza creando tu primer agente comercial.
                            </p>
                            <div className="mt-6">
                                <Button asChild>
                                    <Link href="/admin/agents/new">
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear Agente
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {agents.map((agent) => (
                                <div
                                    key={agent.id}
                                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <User className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{agent.nombre}</h3>
                                                <Badge variant={agent.activo ? "default" : "secondary"}>
                                                    {agent.activo ? "Activo" : "Inactivo"}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {agent.email}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Phone className="h-3 w-3" />
                                                    {agent.telefono}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-right space-y-1">
                                            <div className="text-sm font-medium">
                                                {agent._count.leads} leads asignados
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Meta: {agent.metaMensualLeads}/mes
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                Comisión: {Number(agent.comisionConversion) * 100}%
                                            </div>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/agents/${agent.id}/edit`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/agents/${agent.id}`}>
                                                        <User className="mr-2 h-4 w-4" />
                                                        Ver Detalles
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
