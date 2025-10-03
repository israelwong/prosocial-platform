import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Bell, Mail, Smartphone, Settings } from 'lucide-react';

interface NotificacionesPageProps {
    params: {
        slug: string;
    };
}

export default async function NotificacionesPage({ params }: NotificacionesPageProps) {
    const { slug } = await params;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Notificaciones</h1>
                <p className="text-zinc-400">
                    Elige cómo y cuándo quieres recibir notificaciones
                </p>
            </div>

            {/* Notificaciones principales */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Configuración de Notificaciones
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Elige cómo y cuándo quieres recibir notificaciones de la plataforma
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Bell className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Notificaciones
                        </h3>
                        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                            Configura cómo y cuándo quieres recibir notificaciones de la plataforma.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Settings className="h-4 w-4 mr-2" />
                            Configurar Notificaciones
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Tipos de notificaciones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Correo Electrónico
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Notificaciones por correo
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <Mail className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Sin configuración</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Smartphone className="h-5 w-5" />
                            Notificaciones Push
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Notificaciones en tiempo real
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <Smartphone className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Sin configuración</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
