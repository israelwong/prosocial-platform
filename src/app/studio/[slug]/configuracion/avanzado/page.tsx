import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Database, Code, Shield } from 'lucide-react';

interface AvanzadoPageProps {
    params: {
        slug: string;
    };
}

export default async function AvanzadoPage({ params }: AvanzadoPageProps) {
    const { slug } = await params;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Configuración Avanzada</h1>
                <p className="text-zinc-400">
                    Herramientas adicionales para usuarios avanzados
                </p>
            </div>

            {/* Configuración avanzada principal */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Herramientas Avanzadas
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Configuraciones avanzadas para usuarios experimentados
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Settings className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Configuración Avanzada
                        </h3>
                        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                            Herramientas adicionales para usuarios avanzados que necesitan más control.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Settings className="h-4 w-4 mr-2" />
                            Acceder a Herramientas
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Herramientas avanzadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Base de Datos
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Herramientas de base de datos
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <Database className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Herramientas no disponibles</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Code className="h-5 w-5" />
                            API y Desarrolladores
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Herramientas para desarrolladores
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <Code className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Herramientas no disponibles</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
