import React from 'react';
import { prisma } from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { AgentsPageClient } from './components';

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
        // Retornar array vacío en caso de error
        return [];
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

            {/* Client Components with State Management */}
            <AgentsPageClient initialAgents={agents} />
        </div>
    );
}
