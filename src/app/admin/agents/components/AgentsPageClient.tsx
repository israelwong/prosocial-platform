"use client";

import React, { useState, useEffect } from 'react';
import { Stats } from './Stats';
import { AgentsContainer } from './AgentsContainer';

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

interface AgentsPageClientProps {
    initialAgents: Agent[];
}

export function AgentsPageClient({ initialAgents }: AgentsPageClientProps) {
    const [agents, setAgents] = useState<Agent[]>(initialAgents);

    // Sincronizar con los datos iniciales cuando cambien
    useEffect(() => {
        setAgents(initialAgents);
    }, [initialAgents]);

    const handleAgentDelete = (agentId: string) => {
        setAgents(prevAgents => prevAgents.filter(agent => agent.id !== agentId));
    };

    return (
        <>
            {/* Stats Cards */}
            <Stats agents={agents} />

            {/* Filters and Agents List */}
            <AgentsContainer
                agents={agents}
                onAgentDelete={handleAgentDelete}
            />
        </>
    );
}
