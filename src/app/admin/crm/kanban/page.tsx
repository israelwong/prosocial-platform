import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    UserPlus,
    Phone,
    CheckCircle,
    DollarSign,
    Calendar,
    Mail,
    Plus
} from 'lucide-react';
import { prisma } from '@/lib/prisma';

// Etapas del CRM (según el esquema de la base de datos)
const crmStages = [
    {
        id: 'nuevo',
        title: 'Nuevos Leads',
        color: 'bg-blue-500',
        description: 'Leads recién capturados'
    },
    {
        id: 'seguimiento',
        title: 'En Seguimiento',
        color: 'bg-yellow-500',
        description: 'Leads contactados y en proceso'
    },
    {
        id: 'promesa',
        title: 'Promesa de Compra',
        color: 'bg-purple-500',
        description: 'Leads que prometieron comprar'
    },
    {
        id: 'suscrito',
        title: 'Suscritos',
        color: 'bg-green-500',
        description: 'Leads convertidos en clientes'
    },
    {
        id: 'cancelado',
        title: 'Cancelados',
        color: 'bg-red-500',
        description: 'Leads que cancelaron'
    },
    {
        id: 'perdido',
        title: 'Perdidos',
        color: 'bg-gray-500',
        description: 'Leads perdidos'
    }
];

// Función para obtener leads de la base de datos
async function getLeads() {
    try {
        const leads = await prisma.proSocialLead.findMany({
            include: {
                agent: {
                    select: {
                        nombre: true,
                        email: true
                    }
                },
                etapa: {
                    select: {
                        id: true,
                        nombre: true,
                        descripcion: true
                    }
                },
                canalAdquisicion: {
                    select: {
                        id: true,
                        nombre: true,
                        categoria: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return leads;
    } catch (error) {
        console.error('Error fetching leads:', error);
        return [];
    }
}

// Función para calcular métricas
async function getMetrics() {
    try {
        const totalLeads = await prisma.proSocialLead.count();

        // Buscar la etapa "Suscritos" por nombre
        const etapaSuscritos = await prisma.proSocialPipelineStage.findFirst({
            where: { nombre: 'Suscritos' }
        });

        const suscritos = etapaSuscritos ? await prisma.proSocialLead.count({
            where: { etapaId: etapaSuscritos.id }
        }) : 0;

        const conversionRate = totalLeads > 0 ? (suscritos / totalLeads) * 100 : 0;

        const avgBudget = await prisma.proSocialLead.aggregate({
            where: {
                presupuestoMensual: { not: null }
            },
            _avg: {
                presupuestoMensual: true
            }
        });

        return {
            totalLeads,
            conversionRate,
            avgBudget: avgBudget._avg.presupuestoMensual || 0,
            suscritos
        };
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return {
            totalLeads: 0,
            conversionRate: 0,
            avgBudget: 0,
            suscritos: 0
        };
    }
}

export default async function CRMKanbanPage() {
    const leads = await getLeads();
    const metrics = await getMetrics();

    // Agrupar leads por etapa
    const leadsByStage = crmStages.map(stage => ({
        ...stage,
        leads: leads.filter(lead => {
            // Si el lead tiene una etapa asignada, usar el nombre de la etapa
            if (lead.etapa) {
                return lead.etapa.nombre.toLowerCase().includes(stage.id.toLowerCase()) || 
                       stage.id.toLowerCase().includes(lead.etapa.nombre.toLowerCase());
            }
            // Si no tiene etapa asignada, asignar a "nuevo"
            return stage.id === 'nuevo';
        })
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">CRM Kanban</h1>
                    <p className="text-zinc-400 mt-1 text-sm">
                        Gestión de leads por etapas del ciclo de vida del CRM
                    </p>
                </div>
                <Link href="/admin/leads/new">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Crear Nuevo Lead
                    </Button>
                </Link>
            </div>

            {/* Stats Cards - Más pequeñas */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border border-zinc-800 bg-zinc-900 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-400">Total Leads</p>
                                <p className="text-xl font-bold text-white">{metrics.totalLeads}</p>
                            </div>
                            <UserPlus className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-400">Conversión</p>
                                <p className="text-xl font-bold text-white">{metrics.conversionRate.toFixed(1)}%</p>
                            </div>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-400">Presupuesto Prom.</p>
                                <p className="text-xl font-bold text-white">
                                    ${metrics.avgBudget ? Number(metrics.avgBudget).toLocaleString() : '0'}
                                </p>
                            </div>
                            <DollarSign className="h-4 w-4 text-emerald-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-400">Suscritos</p>
                                <p className="text-xl font-bold text-white">{metrics.suscritos}</p>
                            </div>
                            <Calendar className="h-4 w-4 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Kanban Board */}
            <div className="grid gap-6 lg:grid-cols-6">
                {leadsByStage.map((stage) => (
                    <Card key={stage.id} className="border border-zinc-800 bg-zinc-900 shadow-sm">
                        <CardHeader className="border-b border-zinc-800">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-sm font-semibold text-white flex items-center">
                                    <div className={`w-3 h-3 rounded-full ${stage.color} mr-2`}></div>
                                    {stage.title}
                                </CardTitle>
                                <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-300">
                                    {stage.leads.length}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-3">
                            <div className="space-y-3">
                                {stage.leads.map((lead) => (
                                    <div
                                        key={lead.id}
                                        className="p-3 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors cursor-pointer"
                                    >
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="font-medium text-white text-sm">{lead.nombre}</h4>
                                                <Badge variant="outline" className="text-xs border-zinc-600 text-zinc-300">
                                                    {lead.planInteres || 'Sin plan'}
                                                </Badge>
                                            </div>

                                            <div className="space-y-1 text-xs text-zinc-400">
                                                <div className="flex items-center">
                                                    <Mail className="h-3 w-3 mr-1" />
                                                    {lead.email}
                                                </div>
                                                <div className="flex items-center">
                                                    <Phone className="h-3 w-3 mr-1" />
                                                    {lead.telefono}
                                                </div>
                                                <div className="flex items-center">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                                                </div>
                                                {lead.presupuestoMensual && (
                                                    <div className="flex items-center">
                                                        <DollarSign className="h-3 w-3 mr-1" />
                                                        ${Number(lead.presupuestoMensual).toLocaleString()}
                                                    </div>
                                                )}
                                            </div>

                                            {lead.canalAdquisicion && (
                                                <div className="text-xs">
                                                    <span className="text-zinc-500">Canal: </span>
                                                    <span className="text-zinc-300">{lead.canalAdquisicion.nombre}</span>
                                                </div>
                                            )}

                                            {lead.etapa && (
                                                <div className="text-xs">
                                                    <span className="text-zinc-500">Etapa: </span>
                                                    <span className="text-zinc-300">{lead.etapa.nombre}</span>
                                                </div>
                                            )}

                                            {lead.fechaUltimoContacto && (
                                                <div className="text-xs">
                                                    <span className="text-zinc-500">Último contacto: </span>
                                                    <span className="text-zinc-300">
                                                        {new Date(lead.fechaUltimoContacto).toLocaleDateString('es-ES')}
                                                    </span>
                                                </div>
                                            )}

                                            {lead.agent && (
                                                <div className="text-xs">
                                                    <span className="text-zinc-500">Agente: </span>
                                                    <span className="text-zinc-300">{lead.agent.nombre}</span>
                                                </div>
                                            )}

                                            {lead.prioridad && (
                                                <div className="text-xs">
                                                    <span className="text-zinc-500">Prioridad: </span>
                                                    <Badge
                                                        variant="outline"
                                                        className={`text-xs ${lead.prioridad === 'alta' ? 'border-red-500 text-red-400' :
                                                            lead.prioridad === 'media' ? 'border-yellow-500 text-yellow-400' :
                                                                'border-green-500 text-green-400'
                                                            }`}
                                                    >
                                                        {lead.prioridad}
                                                    </Badge>
                                                </div>
                                            )}

                                            {lead.nombreEstudio && (
                                                <div className="text-xs">
                                                    <span className="text-zinc-500">Estudio: </span>
                                                    <span className="text-zinc-300">{lead.nombreEstudio}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {stage.leads.length === 0 && (
                                    <div className="text-center py-8 text-zinc-500 text-sm">
                                        No hay leads en esta etapa
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
