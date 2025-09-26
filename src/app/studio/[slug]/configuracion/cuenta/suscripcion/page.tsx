import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { CreditCard, Calendar, DollarSign, Settings } from 'lucide-react';

interface SuscripcionPageProps {
  params: {
    slug: string;
  };
}

export default async function SuscripcionPage({ params }: SuscripcionPageProps) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Suscripción</h1>
        <p className="text-zinc-400">
          Gestiona tu plan de ZENPro y ve tu historial de pagos
        </p>
      </div>

      {/* Suscripción principal */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Plan Actual
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Gestiona tu plan de ZENPro y actualiza tu método de pago
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CreditCard className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
            <h3 className="text-lg font-medium text-white mb-2">
              Suscripción
            </h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Gestiona tu plan de ZENPro, ve tu historial de pagos y actualiza tu método de pago.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Gestionar Suscripción
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuraciones adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historial de Pagos
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Ve tu historial de pagos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
              <p className="text-sm text-zinc-400">Sin historial disponible</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Método de Pago
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Actualiza tu método de pago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <DollarSign className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
              <p className="text-sm text-zinc-400">Sin método configurado</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}