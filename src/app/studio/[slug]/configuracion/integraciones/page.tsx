import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plug, Plus, Settings, Shield } from 'lucide-react';

interface IntegracionesPageProps {
    params: {
        slug: string;
    };
}

export default async function IntegracionesPage({ params }: IntegracionesPageProps) {
    const { slug } = await params;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Integraciones</h1>
                <p className="text-zinc-400">
                    Conecta ZENPro con otras herramientas y servicios
                </p>
            </div>

            {/* Integraciones principales */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Plug className="h-5 w-5" />
                        Integraciones Disponibles
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Conecta ZENPro con otras herramientas y servicios
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Plug className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Integraciones
                        </h3>
                        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                            Conecta ZENPro con otras herramientas y servicios para mejorar tu flujo de trabajo.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Agregar Integración
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tipos de integraciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Settings className="h-5 w-5" />
                            Herramientas de Productividad
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Integraciones con herramientas de trabajo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <Settings className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Sin integraciones configuradas</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Servicios de Pago
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Integraciones con procesadores de pago
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <Shield className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Sin integraciones configuradas</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}