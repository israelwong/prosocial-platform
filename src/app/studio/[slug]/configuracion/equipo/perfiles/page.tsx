import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Tag } from 'lucide-react';
import type { ProfessionalProfile, ProfessionalProfileStats } from './types';

interface ProfessionalProfilesPageProps {
    params: {
        slug: string;
    };
}

export default async function ProfessionalProfilesPage({ params }: ProfessionalProfilesPageProps) {
    // TODO: Implementar Server Actions cuando el schema esté listo
    const { slug } = await params;
    console.log('Studio slug:', slug);
    const perfiles: ProfessionalProfile[] = [];
    const estadisticas: ProfessionalProfileStats = {
        totalPerfiles: 0,
        perfilesActivos: 0,
        perfilesPorDefecto: 0,
        perfilesPersonalizados: 0,
        asignacionesPorPerfil: [],
    };

    return (
        <div className="space-y-6 mt-16 max-w-screen-lg mx-auto mb-16">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Perfiles Profesionales</h1>
                    <p className="text-zinc-400">
                        Gestiona los perfiles profesionales de tu equipo como etiquetas personalizables
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" className="border-zinc-600 text-zinc-300 hover:bg-zinc-800">
                        <Settings className="h-4 w-4 mr-2" />
                        Configurar
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Nuevo Perfil
                    </Button>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Total Perfiles</CardTitle>
                        <Tag className="h-4 w-4 text-blue-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{estadisticas.totalPerfiles}</div>
                        <p className="text-xs text-zinc-500">
                            {estadisticas.perfilesActivos} activos
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Sistema</CardTitle>
                        <Tag className="h-4 w-4 text-yellow-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{estadisticas.perfilesPorDefecto}</div>
                        <p className="text-xs text-zinc-500">
                            Perfiles del sistema
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Personalizados</CardTitle>
                        <Tag className="h-4 w-4 text-purple-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">{estadisticas.perfilesPersonalizados}</div>
                        <p className="text-xs text-zinc-500">
                            Creados por ti
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-400">Asignaciones</CardTitle>
                        <Tag className="h-4 w-4 text-green-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-white">
                            {estadisticas.asignacionesPorPerfil.length}
                        </div>
                        <p className="text-xs text-zinc-500">
                            En uso activo
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Lista de perfiles */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Tag className="h-5 w-5" />
                        Perfiles Profesionales
                        <Badge variant="secondary" className="bg-zinc-700 text-zinc-200">
                            {perfiles.length} perfiles
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Tag className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Perfiles Profesionales
                        </h3>
                        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                            Gestiona los perfiles profesionales de tu equipo como etiquetas personalizables.
                            Crea perfiles como &quot;Fotógrafo&quot;, &quot;Editor&quot;, &quot;Coordinador&quot;, etc.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Primer Perfil
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
