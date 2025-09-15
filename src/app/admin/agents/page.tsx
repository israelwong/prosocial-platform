import React from 'react';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { AgentsPageClient } from './components';
import { Agent } from './types';

async function getAgents(): Promise<Agent[]> {
    try {
        // Consulta optimizada con include para obtener el conteo de leads en una sola query
        const agents = await prisma.prosocial_agents.findMany({
            include: {
                _count: {
                    select: {
                        prosocial_leads: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // Convertir Decimal a number para el frontend
        return agents.map(agent => ({
            ...agent,
            comisionConversion: Number(agent.comisionConversion)
        }));
    } catch (error) {
        console.error('Error fetching agents:', error);

        // Proporcionar información más específica del error
        let errorMessage = 'Error de conexión a la base de datos';

        if (error instanceof Error) {
            if (error.message.includes('permission denied')) {
                errorMessage = 'Permisos insuficientes para acceder a los datos. Verifica las políticas RLS de Supabase.';
            } else if (error.message.includes('Tenant or user not found')) {
                errorMessage = 'Credenciales de base de datos incorrectas. Verifica la configuración de Supabase.';
            } else if (error.message.includes('timeout')) {
                errorMessage = 'Tiempo de espera agotado. La base de datos podría estar sobrecargada.';
            } else {
                errorMessage = `Error de base de datos: ${error.message}`;
            }
        }

        throw new Error(errorMessage);
    }
}

export default async function AgentsPage() {
    let agents: Agent[] = [];
    let error: string | null = null;

    try {
        agents = await getAgents();
    } catch (err) {
        error = err instanceof Error ? err.message : 'Error desconocido al cargar los agentes';
    }

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

            {/* Error State */}
            {error && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-red-400 font-medium mb-2">Error al cargar agentes</h3>
                            <p className="text-red-300 text-sm mb-3">{error}</p>
                            <div className="text-red-300 text-sm space-y-1">
                                <p><strong>Posibles soluciones:</strong></p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li>Verifica que las variables de entorno estén configuradas correctamente</li>
                                    <li>Confirma que el proyecto de Supabase esté activo</li>
                                    <li>Revisa las políticas RLS en la tabla prosocial_agents</li>
                                    <li>Intenta recargar la página</li>
                                </ul>
                            </div>
                            <Link
                                href="/admin/agents"
                                className="mt-4 inline-block px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md transition-colors"
                            >
                                Recargar página
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Client Components with State Management */}
            {!error && <AgentsPageClient initialAgents={agents} />}
        </div>
    );
}
