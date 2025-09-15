"use client";

import React, { useState, useEffect } from 'react';
import { Stats } from './Stats';
import { AgentsContainer } from './AgentsContainer';
import { Agent } from '../types';

interface AgentsPageClientProps {
    initialAgents: Agent[];
    loading?: boolean;
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
