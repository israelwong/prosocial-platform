'use client';

import React, { useState, useEffect } from 'react';
import { Stats } from './Stats';
import { PlansContainer } from './PlansContainer';
import { Plan } from '../types';

interface PlansPageClientProps {
    initialPlans: Plan[];
}

export function PlansPageClient({ initialPlans }: PlansPageClientProps) {
    const [plans, setPlans] = useState<Plan[]>(initialPlans);

    useEffect(() => {
        setPlans(initialPlans);
    }, [initialPlans]);

    const handlePlanDelete = (planId: string) => {
        setPlans(prevPlans => prevPlans.filter(plan => plan.id !== planId));
    };

    const handlePlanUpdate = (updatedPlan: Plan) => {
        setPlans(prevPlans =>
            prevPlans.map(plan =>
                plan.id === updatedPlan.id ? updatedPlan : plan
            )
        );
    };

    const handlePlanCreate = (newPlan: Plan) => {
        setPlans(prevPlans => [newPlan, ...prevPlans]);
    };

    return (
        <>
            {/* Stats Cards */}
            <Stats plans={plans} />

            {/* Filters and Plans List */}
            <PlansContainer
                plans={plans}
                onPlanDelete={handlePlanDelete}
                onPlanUpdate={handlePlanUpdate}
            />
        </>
    );
}
