import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, Key, History, Lock } from 'lucide-react';

interface SeguridadPageProps {
    params: {
        slug: string;
    };
}

export default async function SeguridadPage({ params }: SeguridadPageProps) {
    const { slug } = await params;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Seguridad</h1>
                <p className="text-zinc-400">
                    Autenticación de dos factores e historial de sesiones
                </p>
            </div>

            {/* Seguridad principal */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Configuración de Seguridad
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Autenticación de dos factores, historial de sesiones y más
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Shield className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Seguridad
                        </h3>
                        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                            Configura la autenticación de dos factores y revisa tu historial de sesiones.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Shield className="h-4 w-4 mr-2" />
                            Configurar Seguridad
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Configuraciones de seguridad */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Key className="h-5 w-5" />
                            Autenticación de Dos Factores
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Añade una capa extra de seguridad
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <Key className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">No configurado</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <History className="h-5 w-5" />
                            Historial de Sesiones
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Revisa tus sesiones activas
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <History className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Sin historial disponible</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
