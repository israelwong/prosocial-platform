"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, User, Search, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { AgentCard } from './AgentCard';

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

interface AgentsContainerProps {
    agents: Agent[];
}

export function AgentsContainer({ agents }: AgentsContainerProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const filteredAgents = useMemo(() => {
        let filtered = agents;

        // Filtrar por estado
        if (activeFilter === 'active') {
            filtered = filtered.filter(agent => agent.activo);
        } else if (activeFilter === 'inactive') {
            filtered = filtered.filter(agent => !agent.activo);
        }

        // Filtrar por término de búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(agent =>
                agent.nombre.toLowerCase().includes(term) ||
                agent.email.toLowerCase().includes(term) ||
                agent.telefono.includes(term)
            );
        }

        return filtered;
    }, [agents, searchTerm, activeFilter]);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const handleFilterChange = (filter: 'all' | 'active' | 'inactive') => {
        setActiveFilter(filter);
    };

    const handleDelete = (agentId: string) => {
        // TODO: Implementar eliminación de agente
        console.log('Eliminar agente:', agentId);
    };

    return (
        <>
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
                                    className="pl-8 pr-8"
                                    value={searchTerm}
                                    onChange={(e) => handleSearch(e.target.value)}
                                />
                                {searchTerm && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-1 top-1 h-6 w-6 p-0"
                                        onClick={clearSearch}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFilterChange('all')}
                                className={activeFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}
                            >
                                <Filter className="mr-2 h-4 w-4" />
                                Todos
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFilterChange('active')}
                                className={activeFilter === 'active' ? 'bg-primary text-primary-foreground' : ''}
                            >
                                Activos
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFilterChange('inactive')}
                                className={activeFilter === 'inactive' ? 'bg-primary text-primary-foreground' : ''}
                            >
                                Inactivos
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Agents List */}
            <Card>
                <CardHeader>
                    <CardTitle>Lista de Agentes</CardTitle>
                    <CardDescription>
                        Gestiona todos los agentes comerciales del sistema
                        {searchTerm && (
                            <span className="block text-xs text-muted-foreground mt-1">
                                Mostrando {filteredAgents.length} de {agents.length} agentes
                            </span>
                        )}
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
                    ) : filteredAgents.length === 0 ? (
                        <div className="text-center py-8">
                            <User className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-sm font-semibold">No se encontraron agentes</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                No hay agentes que coincidan con los filtros aplicados.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredAgents.map((agent) => (
                                <AgentCard
                                    key={agent.id}
                                    agent={agent}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}
