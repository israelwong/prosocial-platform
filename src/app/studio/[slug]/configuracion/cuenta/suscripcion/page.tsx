'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Calendar, Download, Settings, Crown, Zap, Star } from 'lucide-react';

export default function SuscripcionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Suscripción</h1>
          <p className="text-zinc-400 mt-1">
            Gestiona tu plan de suscripción y facturación
          </p>
        </div>
        <Button>
          <Settings className="mr-2 h-4 w-4" />
          Cambiar Plan
        </Button>
      </div>

      {/* Contenido Principal */}
      <div className="grid gap-6">
        {/* Plan Actual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Plan Actual
            </CardTitle>
            <CardDescription>
              Información sobre tu plan de suscripción actual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">Plan Desarrollo</h3>
                  <p className="text-zinc-400">Plan gratuito para desarrollo</p>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Activo
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-zinc-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">$0</div>
                  <div className="text-sm text-zinc-400">Precio Mensual</div>
                </div>
                <div className="text-center p-4 bg-zinc-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-sm text-zinc-400">Eventos</div>
                </div>
                <div className="text-center p-4 bg-zinc-800 rounded-lg">
                  <div className="text-2xl font-bold text-white">∞</div>
                  <div className="text-sm text-zinc-400">Clientes</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Planes Disponibles */}
        <Card>
          <CardHeader>
            <CardTitle>Planes Disponibles</CardTitle>
            <CardDescription>
              Elige el plan que mejor se adapte a tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Plan Básico */}
              <div className="border border-zinc-700 rounded-lg p-6">
                <div className="text-center">
                  <Zap className="mx-auto h-8 w-8 text-blue-500 mb-2" />
                  <h3 className="text-lg font-semibold text-white">Plan Básico</h3>
                  <div className="text-3xl font-bold text-white mt-2">$29</div>
                  <div className="text-sm text-zinc-400">por mes</div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li>✓ Hasta 50 eventos</li>
                  <li>✓ Hasta 100 clientes</li>
                  <li>✓ Soporte básico</li>
                  <li>✓ Reportes básicos</li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  Seleccionar
                </Button>
              </div>

              {/* Plan Profesional */}
              <div className="border border-blue-500 rounded-lg p-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Recomendado</Badge>
                </div>
                <div className="text-center">
                  <Star className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
                  <h3 className="text-lg font-semibold text-white">Plan Profesional</h3>
                  <div className="text-3xl font-bold text-white mt-2">$79</div>
                  <div className="text-sm text-zinc-400">por mes</div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li>✓ Eventos ilimitados</li>
                  <li>✓ Clientes ilimitados</li>
                  <li>✓ Soporte prioritario</li>
                  <li>✓ Reportes avanzados</li>
                  <li>✓ Integraciones</li>
                </ul>
                <Button className="w-full mt-4">
                  Seleccionar
                </Button>
              </div>

              {/* Plan Empresarial */}
              <div className="border border-zinc-700 rounded-lg p-6">
                <div className="text-center">
                  <Crown className="mx-auto h-8 w-8 text-purple-500 mb-2" />
                  <h3 className="text-lg font-semibold text-white">Plan Empresarial</h3>
                  <div className="text-3xl font-bold text-white mt-2">$199</div>
                  <div className="text-sm text-zinc-400">por mes</div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-zinc-300">
                  <li>✓ Todo del Plan Profesional</li>
                  <li>✓ Múltiples usuarios</li>
                  <li>✓ Soporte 24/7</li>
                  <li>✓ API personalizada</li>
                  <li>✓ White label</li>
                </ul>
                <Button className="w-full mt-4" variant="outline">
                  Seleccionar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Facturación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Facturación
            </CardTitle>
            <CardDescription>
              Historial de facturas y método de pago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div>
                  <h4 className="font-medium text-zinc-300">Método de Pago</h4>
                  <p className="text-sm text-zinc-400">No configurado</p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
              <div className="text-center py-8">
                <Calendar className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                <h3 className="text-lg font-medium text-zinc-300 mb-2">
                  No hay facturas disponibles
                </h3>
                <p className="text-zinc-500 mb-4">
                  Las facturas aparecerán aquí una vez que tengas un plan de pago
                </p>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Facturas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
