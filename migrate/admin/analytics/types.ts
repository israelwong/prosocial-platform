// Tipos de datos para Analytics del Super Admin

export interface MarketingAnalytics {
    leadsByPeriod: {
        period: string;
        total: number;
        byStage: Record<string, number>;
    }[];
    pipelineStages: {
        stage: string;
        count: number;
        financialValue: number;
        percentage: number;
    }[];
    archivedLeads: {
        total: number;
        trend: "up" | "down" | "stable";
    };
    campaignPerformance: {
        campaignId: string;
        campaignName: string;
        leads: number;
        conversions: number;
        conversionRate: number;
        cost: number;
        roi: number;
    }[];
}

export interface SalesAnalytics {
    totalAgents: number;
    agentsPerformance: {
        agentId: string;
        name: string;
        leadsManaged: number;
        moneyInPlay: number;
        converted: number;
        pending: number;
        conversionRate: number;
    }[];
    conversionRates: {
        stage: string;
        rate: number;
        trend: "up" | "down" | "stable";
    }[];
    moneyInPlay: {
        total: number;
        byAgent: Record<string, number>;
        byStage: Record<string, number>;
    };
}

export interface BillingAnalytics {
    subscriptions: {
        planId: string;
        planName: string;
        subscriberCount: number;
        monthlyRevenue: number;
        yearlyRevenue: number;
        priceMonthly: number;
        priceYearly: number;
        churnRate: number;
        retentionRate: number;
    }[];
    billing: {
        invoiced: number;
        pending: number;
        trends: {
            monthly: number;
            yearly: number;
        };
    };
    revenueByPlan: {
        planName: string;
        revenue: number;
        percentage: number;
    }[];
}

export interface FinancialAnalytics {
    balance: {
        totalIncome: number;
        totalExpenses: number;
        netProfit: number;
    };
    expenses: {
        id: string;
        name: string;
        amount: number;
        category: string;
        recurrence: "monthly" | "biweekly" | "one-time";
        description?: string;
        nextDue?: Date;
    }[];
    projections: {
        month: string;
        projectedIncome: number;
        projectedExpenses: number;
    }[];
    expenseCategories: {
        category: string;
        amount: number;
        percentage: number;
    }[];
}

export interface AnalyticsData {
    marketing: MarketingAnalytics;
    sales: SalesAnalytics;
    billing: BillingAnalytics;
    finances: FinancialAnalytics;
}
