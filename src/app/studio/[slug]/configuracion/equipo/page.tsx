'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Building2, UserPlus, Plus, ArrowRight, Tag, Settings } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PersonalStats } from './components/PersonalStats';
import { obtenerEstadisticasPersonal } from '@/lib/actions/studio/config/personal.actions';
import type { PersonalStats as PersonalStatsType } from './types';

export default function PersonalPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [stats, setStats] = useState<PersonalStatsType>({
        totalEmpleados: 0,
        totalProveedores: 0,
        totalPersonal: 0,
        totalActivos: 0,
        totalInactivos: 0,
        perfilesProfesionales: {},
    });
    const [loading, setLoading] = useState(true);

    // Cargar estadísticas
    const loadStats = async () => {
        try {
            setLoading(true);
            const statsData = await obtenerEstadisticasPersonal(slug);
            setStats(statsData);
        } catch (error) {
            console.error('Error loading stats:', error);
            toast.error('Error al cargar las estadísticas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, [slug]);

    const navigateToEmpleados = () => {
        router.push(`/studio/${slug}/configuracion/negocio/personal/empleados`);
    };

    const navigateToProveedores = () => {
        router.push(`/studio/${slug}/configuracion/negocio/personal/proveedores`);
    };

    const navigateToPerfiles = () => {
        router.push(`/studio/${slug}/configuracion/negocio/personal/perfiles`);
    };

    return (
        <div className="space-y-6">
            {/* Estadísticas generales */}
            <PersonalStats stats={stats} loading={loading} />

            {/* Acciones rápidas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Card de Empleados */}
                <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Users className="h-5 w-5 text-blue-400" />
                                Empleados
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Gestiona tu equipo de trabajo interno
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-blue-400">
                                {loading ? '...' : stats.totalEmpleados}
                            </div>
                            <div className="text-xs text-zinc-500">
                                {loading ? '...' : `${stats.totalActivos} activos`}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Button
                                onClick={navigateToEmpleados}
                                className="bg-blue-600 hover:bg-blue-700 flex-1"
                                disabled={loading}
                            >
                                <Users className="h-4 w-4 mr-2" />
                                Ver Empleados
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                            <Button
                                onClick={() => {
                                    navigateToEmpleados();
                                    // El modal se abrirá en la página de empleados
                                }}
                                variant="outline"
                                className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                                disabled={loading}
                            >
                                <UserPlus className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Card de Proveedores */}
                <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-green-400" />
                                Proveedores
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Gestiona tus colaboradores externos
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-green-400">
                                {loading ? '...' : stats.totalProveedores}
                            </div>
                            <div className="text-xs text-zinc-500">
                                {loading ? '...' : `${stats.totalActivos} activos`}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Button
                                onClick={navigateToProveedores}
                                className="bg-green-600 hover:bg-green-700 flex-1"
                                disabled={loading}
                            >
                                <Building2 className="h-4 w-4 mr-2" />
                                Ver Proveedores
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                            <Button
                                onClick={() => {
                                    navigateToProveedores();
                                    // El modal se abrirá en la página de proveedores
                                }}
                                variant="outline"
                                className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                                disabled={loading}
                            >
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Card de Perfiles Profesionales */}
                <Card className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors cursor-pointer">
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Tag className="h-5 w-5 text-purple-400" />
                                Perfiles Profesionales
                            </CardTitle>
                            <CardDescription className="text-zinc-400">
                                Gestiona perfiles como etiquetas personalizables
                            </CardDescription>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold text-purple-400">
                                {loading ? '...' : Object.keys(stats.perfilesProfesionales).length}
                            </div>
                            <div className="text-xs text-zinc-500">
                                perfiles activos
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                            <Button
                                onClick={navigateToPerfiles}
                                className="bg-purple-600 hover:bg-purple-700 flex-1"
                                disabled={loading}
                            >
                                <Tag className="h-4 w-4 mr-2" />
                                Gestionar Perfiles
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                            <Button
                                onClick={navigateToPerfiles}
                                variant="outline"
                                className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                                disabled={loading}
                            >
                                <Settings className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Información adicional */}
            {!loading && stats.totalPersonal === 0 && (
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardContent className="p-8 text-center">
                        <Users className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            ¡Comienza a construir tu equipo!
                        </h3>
                        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                            Agrega empleados y proveedores para organizar mejor tu estudio.
                            Puedes asignarles perfiles profesionales como fotógrafo, editor, coordinador, etc.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={navigateToEmpleados}
                                className="bg-blue-600 hover:bg-blue-700"
                            >
                                <UserPlus className="h-4 w-4 mr-2" />
                                Agregar Empleado
                            </Button>
                            <Button
                                onClick={navigateToProveedores}
                                variant="outline"
                                className="border-zinc-600 text-zinc-300 hover:bg-zinc-800"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Agregar Proveedor
                            </Button>
                            <Button
                                onClick={navigateToPerfiles}
                                variant="outline"
                                className="border-purple-600 text-purple-300 hover:bg-purple-800"
                            >
                                <Tag className="h-4 w-4 mr-2" />
                                Configurar Perfiles
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}