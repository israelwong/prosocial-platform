import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Plus, Star, DollarSign } from 'lucide-react';

interface PaquetesPageProps {
    params: {
        slug: string;
    };
}

export default async function PaquetesPage({ params }: PaquetesPageProps) {
    const { slug } = await params;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-2xl font-bold text-white">Paquetes</h1>
                <p className="text-zinc-400">
                    Crea y combina servicios para ofrecer paquetes atractivos
                </p>
            </div>

            {/* Paquetes principales */}
            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Paquetes de Servicios
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                        Combina servicios para crear paquetes como "Paquete Boda Oro", "Paquete XV Años Premium"
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8">
                        <Package className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            Paquetes
                        </h3>
                        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
                            Crea paquetes atractivos combinando servicios individuales con precios especiales.
                        </p>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Crear Paquete
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Configuraciones adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <Star className="h-5 w-5" />
                            Paquetes Destacados
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Paquetes más populares
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <Star className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Sin paquetes configurados</p>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900 border-zinc-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Precios Especiales
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Descuentos en paquetes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center py-6">
                            <DollarSign className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
                            <p className="text-sm text-zinc-400">Sin precios configurados</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
