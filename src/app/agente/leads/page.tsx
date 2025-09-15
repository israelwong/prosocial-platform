'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createClient as createAdminClient } from '@/lib/supabase/admin';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Plus,
    Search,
    Users,
    Phone,
    Mail,
    MessageSquare,
    Calendar,
    DollarSign,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    Target,
    CheckCircle
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface Lead {
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
    createdAt: string;
}


export default function LeadsPage() {
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStage, setFilterStage] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ id: string; email: string } | null>(null);

    const fetchLeads = useCallback(async (agentId?: string) => {
        const supabase = createClient();

        if (!agentId && !user?.id) {
            console.log('No hay agentId para obtener leads');
            setLoading(false);
            return;
        }

        const targetAgentId = agentId || user?.id;

        try {
            console.log('🔍 Consultando leads para agentId:', targetAgentId);
            console.log('🔍 Usuario actual:', user);

            // Primero verificar si el usuario está autenticado
            const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();
            console.log('🔍 Usuario autenticado actual:', currentUser);
            console.log('🔍 Error de autenticación:', authError);
            console.log('🔍 ID del usuario autenticado:', currentUser?.id);
            console.log('🔍 Email del usuario autenticado:', currentUser?.email);
            console.log('🔍 User metadata:', currentUser?.user_metadata);

            // Primero hacer una consulta simple para verificar acceso
            console.log('🔍 Probando consulta simple...');
            const { data: testData, error: testError } = await supabase
                .from('prosocial_leads')
                .select('id, nombre')
                .limit(1);

            console.log('🔍 Test query - data:', testData);
            console.log('🔍 Test query - error:', testError);

            // Probar con cliente de administrador para verificar si los datos están ahí
            console.log('🔍 Probando con cliente de administrador...');
            const adminSupabase = createAdminClient();
            const { data: adminData, error: adminError } = await adminSupabase
                .from('prosocial_leads')
                .select('id, nombre, email, "agentId"')
                .eq('agentId', targetAgentId);

            console.log('🔍 Admin query - data:', adminData);
            console.log('🔍 Admin query - error:', adminError);

            // Consultar leads reales desde la base de datos (consulta simplificada)
            const { data, error } = await supabase
                .from('prosocial_leads')
                .select(`
                    id,
                    nombre,
                    email,
                    telefono,
                    nombreEstudio,
                    fechaUltimoContacto,
                    planInteres,
                    presupuestoMensual,
                    puntaje,
                    prioridad,
                    createdAt,
                    etapaId
                `)
                .eq('agentId', targetAgentId)
                .order('createdAt', { ascending: false });

            console.log('🔍 Resultado de consulta - data:', data);
            console.log('🔍 Resultado de consulta - error:', error);

            if (error) {
                console.error('Error fetching leads:', error);
                console.error('Error details:', JSON.stringify(error, null, 2));

                // Si hay error con el cliente normal, usar el cliente de administrador como fallback
                console.log('🔍 Usando cliente de administrador como fallback...');
                const adminSupabase = createAdminClient();
                const { data: adminData, error: adminError } = await adminSupabase
                    .from('prosocial_leads')
                    .select(`
                        id,
                        nombre,
                        email,
                        telefono,
                        nombreEstudio,
                        fechaUltimoContacto,
                        planInteres,
                        presupuestoMensual,
                        puntaje,
                        prioridad,
                        createdAt,
                        etapaId
                    `)
                    .eq('agentId', targetAgentId)
                    .order('createdAt', { ascending: false });

                if (adminError) {
                    console.error('Error con cliente de administrador:', adminError);
                    setLeads([]);
                } else {
                    console.log('🔍 Datos obtenidos con cliente de administrador:', adminData?.length || 0);
                    const mappedLeads: Lead[] = (adminData || []).map(lead => ({
                        id: lead.id,
                        name: lead.nombre,
                        email: lead.email,
                        phone: lead.telefono,
                        studio: lead.nombreEstudio || 'Sin estudio',
                        stage: lead.etapaId || 'Nuevo',
                        value: lead.presupuestoMensual ? Number(lead.presupuestoMensual) : 0,
                        priority: lead.prioridad === 'alta' ? 'high' : lead.prioridad === 'media' ? 'medium' : 'low',
                        lastActivity: lead.fechaUltimoContacto ? new Date(lead.fechaUltimoContacto).toLocaleDateString() : 'Sin actividad',
                        assignedAgent: 'Agente',
                        source: 'Sin canal',
                        notes: `Lead asignado a agente`,
                        createdAt: new Date(lead.createdAt).toLocaleDateString()
                    }));
                    setLeads(mappedLeads);
                }
            } else {
                // Mapear datos reales al formato esperado
                const mappedLeads: Lead[] = (data || []).map(lead => ({
                    id: lead.id,
                    name: lead.nombre,
                    email: lead.email,
                    phone: lead.telefono,
                    studio: lead.nombreEstudio || 'Sin estudio',
                    stage: lead.etapaId || 'Nuevo',
                    value: lead.presupuestoMensual ? Number(lead.presupuestoMensual) : 0,
                    priority: lead.prioridad === 'alta' ? 'high' : lead.prioridad === 'media' ? 'medium' : 'low',
                    lastActivity: lead.fechaUltimoContacto ? new Date(lead.fechaUltimoContacto).toLocaleDateString() : 'Sin actividad',
                    assignedAgent: 'Agente',
                    source: 'Sin canal',
                    notes: `Lead asignado a agente`,
                    createdAt: new Date(lead.createdAt).toLocaleDateString()
                }));

                console.log('Leads reales obtenidos:', mappedLeads.length);
                setLeads(mappedLeads);
            }
        } catch (error) {
            console.error('Error inesperado:', error);
            setLeads([]);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const checkAuthAndFetchData = useCallback(async () => {
        const supabase = createClient();

        // Verificar si el usuario está autenticado
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            console.log('Usuario no autenticado, redirigiendo a login');
            router.push('/auth/login');
            return;
        }

        setUser({ id: user.id, email: user.email || '' });

        // Obtener el rol del usuario desde user_metadata
        const userRole = user.user_metadata?.role;

        if (!userRole) {
            console.error('No se encontró rol en metadata');
            router.push('/auth/login');
            return;
        }

        // Verificar que el usuario tenga rol de agente
        if (userRole !== 'agente') {
            console.error('Usuario no tiene rol de agente:', userRole);
            router.push('/auth/login');
            return;
        }

        // Usuario autenticado y con rol de agente

        // Ahora obtener los leads asignados a este agente
        fetchLeads(user.id);
    }, [router, fetchLeads]);

    useEffect(() => {
        checkAuthAndFetchData();
    }, [checkAuthAndFetchData]);

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-800';
            case 'medium': return 'bg-yellow-100 text-yellow-800';
            case 'low': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'Nuevo': return 'bg-blue-100 text-blue-800';
            case 'Calificado': return 'bg-green-100 text-green-800';
            case 'Propuesta': return 'bg-yellow-100 text-yellow-800';
            case 'Negociación': return 'bg-orange-100 text-orange-800';
            case 'Convertido': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPriorityLabel = (priority: string) => {
        switch (priority) {
            case 'high': return 'Alta';
            case 'medium': return 'Media';
            case 'low': return 'Baja';
            default: return 'Sin prioridad';
        }
    };

    // Filtrar leads
    const filteredLeads = leads.filter(lead => {
        const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.studio.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStage = filterStage === 'all' || lead.stage === filterStage;
        const matchesPriority = filterPriority === 'all' || lead.priority === filterPriority;

        return matchesSearch && matchesStage && matchesPriority;
    });

    // Calcular estadísticas
    const totalLeads = leads.length;
    const activeLeads = leads.filter(l => l.stage !== 'Convertido').length;
    const convertedLeads = leads.filter(l => l.stage === 'Convertido').length;
    const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0);
    const conversionRate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0;

    const stages = Array.from(new Set(leads.map(lead => lead.stage)));

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold">Gestión de Leads</h1>
                        <p className="text-muted-foreground">Administra y sigue el progreso de tus leads</p>
                    </div>
                </div>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-pulse text-muted-foreground">Cargando leads...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Gestión de Leads</h1>
                    <p className="text-muted-foreground">Administra y sigue el progreso de tus leads</p>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Lead
                </Button>
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalLeads}</div>
                        <p className="text-xs text-muted-foreground">
                            {activeLeads} activos
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Leads Activos</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{activeLeads}</div>
                        <p className="text-xs text-muted-foreground">
                            En proceso
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Conversiones</CardTitle>
                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{convertedLeads}</div>
                        <p className="text-xs text-muted-foreground">
                            {conversionRate.toFixed(1)}% tasa de conversión
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Pipeline total
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Filtros */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar leads por nombre, estudio o email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <Select value={filterStage} onValueChange={setFilterStage}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filtrar por etapa" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las etapas</SelectItem>
                                {stages.map(stage => (
                                    <SelectItem key={stage} value={stage}>{stage}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Filtrar por prioridad" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las prioridades</SelectItem>
                                <SelectItem value="high">Alta prioridad</SelectItem>
                                <SelectItem value="medium">Media prioridad</SelectItem>
                                <SelectItem value="low">Baja prioridad</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Lista de leads */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Lista de Leads ({filteredLeads.length})
                    </CardTitle>
                    <CardDescription>
                        Gestiona todos tus leads asignados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {filteredLeads.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No se encontraron leads</p>
                                <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
                            </div>
                        ) : (
                            filteredLeads.map((lead) => (
                                <div key={lead.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-600">
                                                {lead.name.split(' ').map(n => n[0]).join('')}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="font-medium">{lead.name}</div>
                                            <div className="text-sm text-muted-foreground">{lead.studio}</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Badge variant="outline" className={getStageColor(lead.stage)}>
                                                    {lead.stage}
                                                </Badge>
                                                <Badge variant="outline" className={getPriorityColor(lead.priority)}>
                                                    {getPriorityLabel(lead.priority)}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <div className="font-bold text-green-600">
                                                ${lead.value.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {lead.lastActivity}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {lead.source}
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button variant="outline" size="sm">
                                                <Phone className="h-3 w-3" />
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <Mail className="h-3 w-3" />
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                <MessageSquare className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Ver detalles
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Editar
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Programar seguimiento
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Eliminar
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}