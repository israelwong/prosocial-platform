import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Camera, Plus, Settings, DollarSign } from 'lucide-react';

interface ServiciosPageProps {
    params: Promise<{ slug: string }>;
}

export default async function ServiciosPage({ params }: ServiciosPageProps) {
    const { slug } = await params;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Servicios</h1>
                <p className="text-zinc-400">
                    La lista detallada de todos tus servicios individuales
                </p>
            </div>

            {/* Servicios principales */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Camera className="h-5 w-5" />
                        Servicios Individuales
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Gestiona todos tus servicios como &quot;Sesión de fotos 1hr&quot;, &quot;Video con dron&quot;, &quot;Álbum impreso&quot;
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Camera className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Servicios
                        </h3>
                        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                            Crea y gestiona todos tus servicios individuales con precios, descripciones y categorías.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Servicio
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Configuraciones adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Precios
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Configura precios por servicio
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <DollarSign className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Sin servicios configurados</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Categorías
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Organiza servicios por categorías
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <Settings className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Sin categorías configuradas</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
