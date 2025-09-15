'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    BarChart3,
    TrendingUp,
    Users,
    Target,
    DollarSign,
    Calendar,
    Download,
    RefreshCw
} from 'lucide-react';

// Importar componentes de marketing
import {
    LeadsByPeriodChart,
    PipelineStagesChart,
    ArchivedLeadsCard,
    CampaignPerformanceTable
} from './components/marketing';

// Importar componentes de sales
import {
    AgentsPerformanceTable,
    MoneyInPlayCard,
    ConversionsAndPendingCard
} from './components/sales';

// Importar componentes de billing
import {
    SubscriptionsChart,
    BillingStatusCard,
    SubscriptionTrendsCard
} from './components/billing';

// Importar componentes de finances
import {
    BalanceCard,
    ExpensesManager,
    FinancialProjections
} from './components/finances';

// Importar tipos
import { MarketingAnalytics, AnalyticsData } from './types';

export default function AnalyticsPage() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('marketing');

    // Datos mock para desarrollo
    const mockMarketingData: MarketingAnalytics = {
        leadsByPeriod: [
            {
                period: 'current',
                total: 1250,
                byStage: {
                    'Nuevo': 450,
                    'Calificado': 320,
                    'Propuesta': 280,
                    'Negociación': 150,
                    'Convertido': 50
                }
            },
            {
                period: 'last-7-days',
                total: 980,
                byStage: {
                    'Nuevo': 350,
                    'Calificado': 280,
                    'Propuesta': 220,
                    'Negociación': 100,
                    'Convertido': 30
                }
            },
            {
                period: 'last-30-days',
                total: 4200,
                byStage: {
                    'Nuevo': 1500,
                    'Calificado': 1200,
                    'Propuesta': 900,
                    'Negociación': 500,
                    'Convertido': 100
                }
            }
        ],
        pipelineStages: [
            {
                stage: 'Nuevo',
                count: 450,
                financialValue: 45000,
                percentage: 36.0
            },
            {
                stage: 'Calificado',
                count: 320,
                financialValue: 64000,
                percentage: 25.6
            },
            {
                stage: 'Propuesta',
                count: 280,
                financialValue: 84000,
                percentage: 22.4
            },
            {
                stage: 'Negociación',
                count: 150,
                financialValue: 75000,
                percentage: 12.0
            },
            {
                stage: 'Convertido',
                count: 50,
                financialValue: 50000,
                percentage: 4.0
            }
        ],
        archivedLeads: {
            total: 125,
            trend: 'down'
        },
        campaignPerformance: [
            {
                campaignId: 'CAMP-001',
                campaignName: 'Campaña Facebook Q1',
                leads: 450,
                conversions: 45,
                conversionRate: 10.0,
                cost: 5000,
                roi: 25.5
            },
            {
                campaignId: 'CAMP-002',
                campaignName: 'Google Ads Fotografía',
                leads: 320,
                conversions: 32,
                conversionRate: 10.0,
                cost: 3500,
                roi: 18.2
            },
            {
                campaignId: 'CAMP-003',
                campaignName: 'Instagram Stories',
                leads: 280,
                conversions: 14,
                conversionRate: 5.0,
                cost: 2000,
                roi: -5.0
            },
            {
                campaignId: 'CAMP-004',
                campaignName: 'Email Marketing',
                leads: 200,
                conversions: 20,
                conversionRate: 10.0,
                cost: 800,
                roi: 35.0
            }
        ]
    };

    const mockAnalyticsData: AnalyticsData = {
        marketing: mockMarketingData,
        sales: {
            totalAgents: 5,
            agentsPerformance: [
                {
                    agentId: 'AGENT-001',
                    name: 'María González',
                    leadsManaged: 120,
                    moneyInPlay: 45000,
                    converted: 18,
                    pending: 25,
                    conversionRate: 15.0
                },
                {
                    agentId: 'AGENT-002',
                    name: 'Carlos Rodríguez',
                    leadsManaged: 95,
                    moneyInPlay: 38000,
                    converted: 12,
                    pending: 15,
                    conversionRate: 12.6
                },
                {
                    agentId: 'AGENT-003',
                    name: 'Ana Martínez',
                    leadsManaged: 110,
                    moneyInPlay: 42000,
                    converted: 8,
                    pending: 35,
                    conversionRate: 7.3
                },
                {
                    agentId: 'AGENT-004',
                    name: 'Luis Fernández',
                    leadsManaged: 85,
                    moneyInPlay: 32000,
                    converted: 14,
                    pending: 12,
                    conversionRate: 16.5
                },
                {
                    agentId: 'AGENT-005',
                    name: 'Sofia López',
                    leadsManaged: 75,
                    moneyInPlay: 28000,
                    converted: 6,
                    pending: 20,
                    conversionRate: 8.0
                }
            ],
            conversionRates: [
                { stage: 'Nuevo', rate: 5.2, trend: 'up' },
                { stage: 'Calificado', rate: 12.8, trend: 'stable' },
                { stage: 'Propuesta', rate: 18.5, trend: 'down' },
                { stage: 'Negociación', rate: 25.0, trend: 'up' }
            ],
            moneyInPlay: {
                total: 185000,
                byAgent: {
                    'AGENT-001': 45000,
                    'AGENT-002': 38000,
                    'AGENT-003': 42000,
                    'AGENT-004': 32000,
                    'AGENT-005': 28000
                },
                byStage: {
                    'Nuevo': 46250,
                    'Calificado': 55500,
                    'Propuesta': 46250,
                    'Negociación': 27750,
                    'Convertido': 9250
                }
            }
        },
        billing: {
            subscriptions: [
                {
                    planId: 'PLAN-001',
                    planName: 'Plan Básico',
                    subscriberCount: 45,
                    monthlyRevenue: 26955, // 45 * 599
                    yearlyRevenue: 269550, // 45 * 5990
                    priceMonthly: 599,
                    priceYearly: 5990,
                    churnRate: 2.1,
                    retentionRate: 97.9
                },
                {
                    planId: 'PLAN-002',
                    planName: 'Plan Pro',
                    subscriberCount: 28,
                    monthlyRevenue: 33572, // 28 * 1199
                    yearlyRevenue: 335720, // 28 * 11990
                    priceMonthly: 1199,
                    priceYearly: 11990,
                    churnRate: 1.8,
                    retentionRate: 98.2
                },
                {
                    planId: 'PLAN-003',
                    planName: 'Plan Enterprise',
                    subscriberCount: 12,
                    monthlyRevenue: 23988, // 12 * 1999
                    yearlyRevenue: 239880, // 12 * 19990
                    priceMonthly: 1999,
                    priceYearly: 19990,
                    churnRate: 1.2,
                    retentionRate: 98.8
                }
            ],
            billing: {
                invoiced: 125000,
                pending: 25000,
                trends: {
                    monthly: 0,
                    yearly: 0
                }
            },
            revenueByPlan: []
        },
        finances: {
            balance: {
                totalIncome: 150000,
                totalExpenses: 95000,
                netProfit: 55000
            },
            expenses: [
                {
                    id: 'expense-1',
                    name: 'Licencia de Supabase',
                    amount: 2500,
                    category: 'infrastructure',
                    recurrence: 'monthly',
                    description: 'Licencia mensual de Supabase Pro',
                    nextDue: new Date('2024-02-01')
                },
                {
                    id: 'expense-2',
                    name: 'Vercel Pro',
                    amount: 2000,
                    category: 'infrastructure',
                    recurrence: 'monthly',
                    description: 'Plan Pro de Vercel para hosting',
                    nextDue: new Date('2024-02-01')
                },
                {
                    id: 'expense-3',
                    name: 'Google Ads',
                    amount: 15000,
                    category: 'marketing',
                    recurrence: 'monthly',
                    description: 'Campañas de Google Ads',
                    nextDue: new Date('2024-02-01')
                },
                {
                    id: 'expense-4',
                    name: 'Facebook Ads',
                    amount: 12000,
                    category: 'marketing',
                    recurrence: 'monthly',
                    description: 'Campañas de Facebook e Instagram',
                    nextDue: new Date('2024-02-01')
                },
                {
                    id: 'expense-5',
                    name: 'Figma Professional',
                    amount: 150,
                    category: 'software',
                    recurrence: 'monthly',
                    description: 'Licencia de Figma para diseño',
                    nextDue: new Date('2024-02-01')
                },
                {
                    id: 'expense-6',
                    name: 'Notion Pro',
                    amount: 80,
                    category: 'software',
                    recurrence: 'monthly',
                    description: 'Plan Pro de Notion para documentación',
                    nextDue: new Date('2024-02-01')
                },
                {
                    id: 'expense-7',
                    name: 'Viaje a conferencia',
                    amount: 8500,
                    category: 'travel',
                    recurrence: 'one-time',
                    description: 'Viaje a conferencia de tecnología'
                },
                {
                    id: 'expense-8',
                    name: 'Material de oficina',
                    amount: 2000,
                    category: 'office',
                    recurrence: 'monthly',
                    description: 'Suministros de oficina y material',
                    nextDue: new Date('2024-02-01')
                }
            ],
            projections: [
                { month: 'Enero', projectedIncome: 140000, projectedExpenses: 90000 },
                { month: 'Febrero', projectedIncome: 150000, projectedExpenses: 95000 },
                { month: 'Marzo', projectedIncome: 160000, projectedExpenses: 100000 },
                { month: 'Abril', projectedIncome: 170000, projectedExpenses: 105000 },
                { month: 'Mayo', projectedIncome: 180000, projectedExpenses: 110000 },
                { month: 'Junio', projectedIncome: 190000, projectedExpenses: 115000 }
            ],
            expenseCategories: [
                { category: 'Infraestructura', amount: 4500, percentage: 4.7 },
                { category: 'Marketing', amount: 27000, percentage: 28.4 },
                { category: 'Software', amount: 230, percentage: 0.2 },
                { category: 'Viajes', amount: 8500, percentage: 8.9 },
                { category: 'Oficina', amount: 2000, percentage: 2.1 },
                { category: 'Otros', amount: 0, percentage: 0 }
            ]
        }
    };

    useEffect(() => {
        // Simular carga de datos
        const loadAnalyticsData = async () => {
            setLoading(true);
            try {
                // Aquí iría la llamada real a la API
                await new Promise(resolve => setTimeout(resolve, 1000));
                setAnalyticsData(mockAnalyticsData);
            } catch (error) {
                console.error('Error loading analytics data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadAnalyticsData();
    }, []);

    const handleRefresh = () => {
        setLoading(true);
        // Simular refresh
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    if (loading && !analyticsData) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                        <p className="text-muted-foreground">
                            Dashboard estratégico para super administrador
                        </p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p className="text-muted-foreground">Cargando datos de analytics...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">
                        Dashboard estratégico para super administrador
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Exportar
                    </Button>
                </div>
            </div>

            {/* Tabs de Analytics */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="marketing" className="flex items-center gap-2">
                        <Target className="h-4 w-4" />
                        Marketing
                    </TabsTrigger>
                    <TabsTrigger value="sales" className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Ventas
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Facturación
                    </TabsTrigger>
                    <TabsTrigger value="finances" className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Finanzas
                    </TabsTrigger>
                </TabsList>

                {/* Tab de Marketing */}
                <TabsContent value="marketing" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <LeadsByPeriodChart
                            data={analyticsData?.marketing.leadsByPeriod || []}
                            loading={loading}
                        />
                        <ArchivedLeadsCard
                            data={analyticsData?.marketing.archivedLeads || { total: 0, trend: 'stable' }}
                            loading={loading}
                        />
                    </div>

                    <PipelineStagesChart
                        data={analyticsData?.marketing.pipelineStages || []}
                        loading={loading}
                    />

                    <CampaignPerformanceTable
                        data={analyticsData?.marketing.campaignPerformance || []}
                        loading={loading}
                    />
                </TabsContent>

                {/* Tab de Ventas */}
                <TabsContent value="sales" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <MoneyInPlayCard
                            data={analyticsData?.sales.moneyInPlay || { total: 0, byAgent: {}, byStage: {} }}
                            agentsPerformance={analyticsData?.sales.agentsPerformance || []}
                            loading={loading}
                        />
                        <ConversionsAndPendingCard
                            data={analyticsData?.sales.agentsPerformance || []}
                            loading={loading}
                        />
                    </div>

                    <AgentsPerformanceTable
                        data={analyticsData?.sales.agentsPerformance || []}
                        totalAgents={analyticsData?.sales.totalAgents || 0}
                        loading={loading}
                    />
                </TabsContent>

                {/* Tab de Facturación */}
                <TabsContent value="billing" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <BillingStatusCard
                            data={analyticsData?.billing.billing || { invoiced: 0, pending: 0, trends: { monthly: 0, yearly: 0 } }}
                            loading={loading}
                        />
                        <SubscriptionTrendsCard
                            data={analyticsData?.billing.subscriptions || []}
                            loading={loading}
                        />
                    </div>

                    <SubscriptionsChart
                        data={analyticsData?.billing.subscriptions || []}
                        loading={loading}
                    />
                </TabsContent>

                {/* Tab de Finanzas */}
                <TabsContent value="finances" className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <BalanceCard
                            data={analyticsData?.finances.balance || { totalIncome: 0, totalExpenses: 0, netProfit: 0 }}
                            loading={loading}
                        />
                        <FinancialProjections
                            data={analyticsData?.finances.projections || []}
                            balance={analyticsData?.finances.balance || { totalIncome: 0, totalExpenses: 0, netProfit: 0 }}
                            loading={loading}
                        />
                    </div>

                    <ExpensesManager
                        data={analyticsData?.finances.expenses || []}
                        onExpenseUpdate={(expenses) => {
                            // En una implementación real, esto actualizaría la base de datos
                            console.log('Expenses updated:', expenses);
                        }}
                        loading={loading}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}