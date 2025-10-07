'use client';

import React from 'react';
import { useIsClient } from '@/hooks/useIsClient';
import { PlanCard } from './PlanCard';
import { PlanCardStatic } from './PlanCardStatic';
import { Plan } from '../types';

interface PlanCardWrapperProps {
    plan: Plan;
    onEdit: (plan: Plan) => void;
    onDelete: (plan: Plan) => void;
    onDuplicate: (plan: Plan) => void;
    onToggleActive: (planId: string) => void;
    onTogglePopular: (planId: string) => void;
}

export function PlanCardWrapper(props: PlanCardWrapperProps) {
    const isClient = useIsClient();

    // Render static version during SSR and initial hydration
    if (!isClient) {
        return <PlanCardStatic {...props} />;
    }

    // Render draggable version after hydration
    return <PlanCard {...props} />;
}
