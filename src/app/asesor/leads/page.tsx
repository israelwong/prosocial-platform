'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Users,
    Search,
    BarChart3,
    Target,
    TrendingUp,
    Clock
} from 'lucide-react';
import { KanbanBoard } from '@/app/components/shared/kanban/KanbanBoard';
import { Lead } from '@/types/lead';

export default function AsesorLeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState('');
    const [currentAgentId] = useState('agent-1'); // TODO: Obtener del contexto de autenticación

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            // Simular datos por ahora
            const mockLeads: Lead[] = [
                {
                    id: '1',
                    nombre: 'María González',
                    email: 'maria@fotografia.com',
                    telefono: '+52 55 1234 5678',
                    nombreEstudio: 'Fotografía María',
                    etapaId: 'nuevos-leads-id', // ID temporal para "Nuevos Leads"
                    prioridad: 'alta',
                    planInteres: 'Pro',
                    presupuestoMensual: 500,
                    createdAt: new Date('2024-01-15'),
                    fechaUltimoContacto: new Date(Date.now() - 1000 * 60 * 30),
                    notasConversacion: 'Interesada en plan de negocio para su estudio de fotografía'
                },
                {
                    id: '2',
                    nombre: 'Carlos Rodríguez',
                    email: 'carlos@eventos.com',
                    telefono: '+52 55 2345 6789',
                    nombreEstudio: 'Eventos Carlos',
                    etapaId: 'en-seguimiento-id', // ID temporal para "En Seguimiento"
                    prioridad: 'media',
                    planInteres: 'Básico',
                    presupuestoMensual: 200,
                    agentId: 'agent-1',
                    agent: {
                        id: 'agent-1',
                        nombre: 'Juan Pérez',
                        email: 'juan@prosocial.com'
                    },
                    createdAt: new Date('2024-02-20'),
                    fechaUltimoContacto: new Date(Date.now() - 1000 * 60 * 60 * 2),
                    notasConversacion: 'Necesita más información sobre las funcionalidades del plan básico'
                },
                {
                    id: '3',
                    nombre: 'Ana Martínez',
                    email: 'ana@diseno.com',
                    telefono: '+52 55 3456 7890',
                    nombreEstudio: 'Diseño Ana',
                    etapaId: 'promesa-compra-id', // ID temporal para "Promesa de Compra"
                    prioridad: 'alta',
                    planInteres: 'Enterprise',
                    presupuestoMensual: 1000,
                    agentId: 'agent-1',
                    agent: {
                        id: 'agent-1',
                        nombre: 'Juan Pérez',
                        email: 'juan@prosocial.com'
                    },
                    createdAt: new Date('2024-03-10'),
                    fechaUltimoContacto: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
                    notasConversacion: 'Muy interesada, está evaluando la propuesta comercial'
                }
            ];
            setLeads(mockLeads);
        } catch (error) {
            console.error('Error fetching leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLeadUpdate = async (leadId: string, newStage: string) => {
        try {
            // TODO: Implementar API call
            setLeads(prev => prev.map(lead =>
                lead.id === leadId ? { ...lead, etapa: newStage as any } : lead
            ));
        } catch (error) {
            console.error('Error updating lead:', error);
        }
    };

    const handleLeadAssign = async (leadId: string, agentId: string) => {
        try {
            // TODO: Implementar API call
            setLeads(prev => prev.map(lead =>
                lead.id === leadId ? {
                    ...lead,
                    agentId,
                    agent: {
                        id: agentId,
                        nombre: 'Juan Pérez', // TODO: Obtener del contexto
                        email: 'juan@prosocial.com'
                    }
                } : lead
            ));
        } catch (error) {
            console.error('Error assigning lead:', error);
        }
    };

    const handleLeadView = (leadId: string) => {
        // TODO: Implementar modal de detalles del lead
        console.log('View lead:', leadId);
    };

    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.telefono.includes(searchTerm);
        const matchesStage = !filterStage || lead.etapa === filterStage;
        return matchesSearch && matchesStage;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando leads...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Mis Leads</h1>
                    <p className="text-gray-600 mt-2">
                        Gestiona y da seguimiento a tus leads asignados
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Mis Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {leads.filter(l => l.agentId === currentAgentId).length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Asignados a mí
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">En Seguimiento</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {leads.filter(l => l.agentId === currentAgentId && l.etapa === 'seguimiento').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Activos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Promesas</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {leads.filter(l => l.agentId === currentAgentId && l.etapa === 'promesa').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            En negociación
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Convertidos</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {leads.filter(l => l.agentId === currentAgentId && l.etapa === 'suscrito').length}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Este mes
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
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Buscar por nombre, email o teléfono..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <div className="md:w-48">
                            <select
                                value={filterStage}
                                onChange={(e) => setFilterStage(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Todas las etapas</option>
                                <option value="nuevo">Nuevos</option>
                                <option value="seguimiento">En Seguimiento</option>
                                <option value="promesa">Promesa</option>
                                <option value="suscrito">Suscritos</option>
                                <option value="cancelado">Cancelados</option>
                                <option value="perdido">Perdidos</option>
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Kanban Board */}
            <KanbanBoard
                leads={filteredLeads}
                onLeadUpdate={handleLeadUpdate}
                onLeadAssign={handleLeadAssign}
                onLeadView={handleLeadView}
                currentAgentId={currentAgentId}
                showAssignButton={true}
            />
        </div>
    );
}
