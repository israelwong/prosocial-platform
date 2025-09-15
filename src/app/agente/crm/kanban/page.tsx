'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Plus,
    Search,
    Filter,
    Users,
    Phone,
    Mail,
    MessageSquare,
    Calendar,
    DollarSign,
    Star,
    MoreVertical,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    studio: string;
    stage: string;
    value: number;
    priority: 'high' | 'medium' | 'low';
    lastActivity: string;
    assignedAgent: string;
    source: string;
    notes: string;
    nextFollowUp?: string;
}

interface KanbanColumn {
    id: string;
    title: string;
    leads: Lead[];
    color: string;
}

export default function AgentKanbanPage() {
    const [columns, setColumns] = useState<KanbanColumn[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStudio, setFilterStudio] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simular carga de datos
        const loadKanbanData = async () => {
            setLoading(true);

            // Simular delay de API
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockLeads: Lead[] = [
                {
                    id: 'lead-1',
                    name: 'María González',
                    email: 'maria@estudiofoto.com',
                    phone: '+52 55 1234 5678',
                    studio: 'Estudio Fotográfico Luna',
                    stage: 'Nuevo',
                    value: 15000,
                    priority: 'high',
                    lastActivity: 'Hace 2 horas',
                    assignedAgent: 'Agente Actual',
                    source: 'Google Ads',
                    notes: 'Interesada en plan Pro, necesita demo',
                    nextFollowUp: '2024-01-15T10:00:00Z'
                },
                {
                    id: 'lead-2',
                    name: 'Carlos Rodríguez',
                    email: 'carlos@fotografiapro.com',
                    phone: '+52 55 9876 5432',
                    studio: 'Fotografía Profesional',
                    stage: 'Calificado',
                    value: 25000,
                    priority: 'medium',
                    lastActivity: 'Hace 4 horas',
                    assignedAgent: 'Agente Actual',
                    source: 'Referido',
                    notes: 'Estudio grande, presupuesto aprobado',
                    nextFollowUp: '2024-01-16T14:00:00Z'
                },
                {
                    id: 'lead-3',
                    name: 'Ana Martínez',
                    email: 'ana@retratos.com',
                    phone: '+52 55 5555 1234',
                    studio: 'Retratos & Más',
                    stage: 'Propuesta',
                    value: 8000,
                    priority: 'low',
                    lastActivity: 'Ayer',
                    assignedAgent: 'Agente Actual',
                    source: 'Facebook',
                    notes: 'Esperando respuesta sobre propuesta',
                    nextFollowUp: '2024-01-17T09:00:00Z'
                },
                {
                    id: 'lead-4',
                    name: 'Luis Fernández',
                    email: 'luis@eventos.com',
                    phone: '+52 55 7777 8888',
                    studio: 'Eventos Fotográficos',
                    stage: 'Negociación',
                    value: 12000,
                    priority: 'high',
                    lastActivity: 'Hace 1 día',
                    assignedAgent: 'Agente Actual',
                    source: 'LinkedIn',
                    notes: 'Negociando precio, muy interesado',
                    nextFollowUp: '2024-01-15T16:00:00Z'
                },
                {
                    id: 'lead-5',
                    name: 'Sofia López',
                    email: 'sofia@fotografia.com',
                    phone: '+52 55 3333 4444',
                    studio: 'Fotografía Creativa',
                    stage: 'Convertido',
                    value: 18000,
                    priority: 'medium',
                    lastActivity: 'Hace 3 días',
                    assignedAgent: 'Agente Actual',
                    source: 'Website',
                    notes: 'Cliente satisfecho, posible referido',
                    nextFollowUp: '2024-01-20T10:00:00Z'
                }
            ];

            const mockColumns: KanbanColumn[] = [
                {
                    id: 'nuevo',
                    title: 'Nuevo',
                    color: 'bg-blue-500',
                    leads: mockLeads.filter(lead => lead.stage === 'Nuevo')
                },
                {
                    id: 'calificado',
                    title: 'Calificado',
                    color: 'bg-green-500',
                    leads: mockLeads.filter(lead => lead.stage === 'Calificado')
                },
                {
                    id: 'propuesta',
                    title: 'Propuesta',
                    color: 'bg-yellow-500',
                    leads: mockLeads.filter(lead => lead.stage === 'Propuesta')
                },
                {
                    id: 'negociacion',
                    title: 'Negociación',
                    color: 'bg-orange-500',
                    leads: mockLeads.filter(lead => lead.stage === 'Negociación')
                },
                {
                    id: 'convertido',
                    title: 'Convertido',
                    color: 'bg-purple-500',
                    leads: mockLeads.filter(lead => lead.stage === 'Convertido')
                }
            ];

            setColumns(mockColumns);
            setLoading(false);
        };

        loadKanbanData();
    }, []);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high': return 'Alta';
            case 'medium': return 'Media';
            case 'low': return 'Baja';
            default: return 'Sin prioridad';
        }
    };

    const filteredColumns = columns.map(column => ({
        ...column,
        leads: column.leads.filter(lead => {
            const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.studio.toLowerCase().includes(searchTerm.toLowerCase()) ||
                lead.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStudio = filterStudio === 'all' || lead.studio === filterStudio;
            const matchesPriority = filterPriority === 'all' || lead.priority === filterPriority;

            return matchesSearch && matchesStudio && matchesPriority;
        })
    }));

    const studios = Array.from(new Set(columns.flatMap(col => col.leads.map(lead => lead.studio))));

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">CRM Kanban</h1>
                        <p className="text-muted-foreground">Gestiona tus leads de manera visual</p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-pulse text-muted-foreground">Cargando CRM...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">CRM Kanban</h1>
                    <p className="text-muted-foreground">Gestiona tus leads de manera visual</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Lead
                </Button>
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar leads por nombre, estudio o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={filterStudio} onValueChange={setFilterStudio}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filtrar por estudio" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos los estudios</SelectItem>
                                {studios.map(studio => (
                                    <SelectItem key={studio} value={studio}>{studio}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filtrar por prioridad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las prioridades</SelectItem>
                                <SelectItem value="high">Alta prioridad</SelectItem>
                                <SelectItem value="medium">Media prioridad</SelectItem>
                                <SelectItem value="low">Baja prioridad</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Kanban Board */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {filteredColumns.map((column) => (
                    <Card key={column.id} className="min-h-[600px]">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${column.color}`} />
                                    <CardTitle className="text-sm font-medium">{column.title}</CardTitle>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                    {column.leads.length}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {column.leads.length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground">
                                    <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No hay leads en esta etapa</p>
                                </div>
                            ) : (
                                column.leads.map((lead) => (
                                    <Card key={lead.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="space-y-3">
                                            {/* Header del lead */}
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">{lead.name}</h4>
                                                    <p className="text-xs text-muted-foreground">{lead.studio}</p>
                                                </div>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                            <MoreVertical className="h-3 w-3" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>
                                                            <Eye className="h-4 w-4 mr-2" />
                                                            Ver detalles
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem>
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Editar
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="text-red-600">
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Eliminar
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                            {/* Información del lead */}
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Mail className="h-3 w-3" />
                                                    <span className="truncate">{lead.email}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Phone className="h-3 w-3" />
                                                    <span>{lead.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <DollarSign className="h-3 w-3" />
                                                    <span className="font-medium text-green-600">${lead.value.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            {/* Prioridad y fuente */}
                                            <div className="flex items-center justify-between">
                                                <Badge variant="outline" className={getPriorityColor(lead.priority)}>
                                                    {getPriorityLabel(lead.priority)}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">{lead.source}</span>
                                            </div>

                                            {/* Notas */}
                                            {lead.notes && (
                                                <div className="text-xs text-muted-foreground bg-gray-50 p-2 rounded">
                                                    {lead.notes}
                                                </div>
                                            )}

                                            {/* Próximo seguimiento */}
                                            {lead.nextFollowUp && (
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    <span>
                                                        Próximo: {new Date(lead.nextFollowUp).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}

                                            {/* Última actividad */}
                                            <div className="text-xs text-muted-foreground">
                                                {lead.lastActivity}
                                            </div>

                                            {/* Acciones rápidas */}
                                            <div className="flex gap-1 pt-2 border-t">
                                                <Button variant="outline" size="sm" className="flex-1 text-xs">
                                                    <Phone className="h-3 w-3 mr-1" />
                                                    Llamar
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1 text-xs">
                                                    <Mail className="h-3 w-3 mr-1" />
                                                    Email
                                                </Button>
                                                <Button variant="outline" size="sm" className="flex-1 text-xs">
                                                    <MessageSquare className="h-3 w-3 mr-1" />
                                                    Chat
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Resumen */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Resumen del Pipeline</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {filteredColumns.map((column) => {
                            const totalValue = column.leads.reduce((sum, lead) => sum + lead.value, 0);
                            return (
                                <div key={column.id} className="text-center">
                                    <div className="text-2xl font-bold">{column.leads.length}</div>
                                    <div className="text-sm text-muted-foreground">{column.title}</div>
                                    <div className="text-xs text-green-600 font-medium">
                                        ${totalValue.toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}