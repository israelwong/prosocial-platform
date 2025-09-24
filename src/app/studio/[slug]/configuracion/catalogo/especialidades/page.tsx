import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Plus, Calendar, Tag } from 'lucide-react';

interface EspecialidadesPageProps {
    params: {
        slug: string;
    };
}

export default async function EspecialidadesPage({ params }: EspecialidadesPageProps) {
    const { slug } = await params;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Especialidades</h1>
                <p className="text-zinc-400">
                    Organiza tus servicios y paquetes por tipo de evento
                </p>
            </div>

            {/* Especialidades principales */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Tipos de Evento
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Organiza tus servicios y paquetes por especialidad: Bodas, XV Años, Bautizos, Corporativo
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Heart className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Especialidades
                        </h3>
                        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                            Organiza tus servicios y paquetes por el tipo de evento al que pertenecen.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Especialidad
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tipos de especialidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Eventos Sociales
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Bodas, XV Años, Bautizos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <Calendar className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Sin especialidades configuradas</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Tag className="h-5 w-5" />
                            Eventos Corporativos
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Empresas, conferencias, eventos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <Tag className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Sin especialidades configuradas</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
