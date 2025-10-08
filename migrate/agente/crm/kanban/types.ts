export interface Lead {
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
    etapaId?: string | null;
    hasSubscription?: boolean;
    subscriptionPrice?: number | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface PipelineStage {
    id: string;
    nombre: string;
    descripcion?: string;
    color: string;
    orden: number;
    isActive: boolean;
}

export interface KanbanColumn {
    id: string;
    title: string;
    leads: Lead[];
    color: string;
    stage: PipelineStage;
    totalSubscriptionValue?: number;
}
