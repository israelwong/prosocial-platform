'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, Banknote, Shield, Eye, EyeOff } from 'lucide-react';

export default function CuentasBancariasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Cuentas Bancarias</h1>
          <p className="text-zinc-400 mt-1">
            Gestiona las cuentas bancarias y métodos de pago de tu negocio
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Cuenta
        </Button>
      </div>

      {/* Contenido Principal */}
      <div className="grid gap-6">
        {/* Cuentas Bancarias */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Cuentas Bancarias
            </CardTitle>
            <CardDescription>
              Gestiona las cuentas CLABE y bancarias para recibir pagos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-2">
                No hay cuentas bancarias configuradas
              </h3>
              <p className="text-zinc-500 mb-4">
                Agrega cuentas bancarias para recibir pagos de tus clientes
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Cuenta Bancaria
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Métodos de Pago */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="h-5 w-5" />
              Métodos de Pago
            </CardTitle>
            <CardDescription>
              Configura los métodos de pago aceptados por tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Transferencia Bancaria */}
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-zinc-300">Transferencia Bancaria</h4>
                    <p className="text-sm text-zinc-400">Pagos por transferencia directa</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Efectivo */}
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Banknote className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium text-zinc-300">Efectivo</h4>
                    <p className="text-sm text-zinc-400">Pagos en efectivo</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Tarjeta de Crédito/Débito */}
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium text-zinc-300">Tarjeta de Crédito/Débito</h4>
                    <p className="text-sm text-zinc-400">Pagos con tarjeta (Stripe)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Shield className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seguridad
            </CardTitle>
            <CardDescription>
              Información sobre la seguridad de tus datos bancarios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-zinc-400">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-zinc-300">Encriptación de Datos</h4>
                  <p>Todos los datos bancarios están encriptados y protegidos</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-zinc-300">Cumplimiento PCI DSS</h4>
                  <p>Cumplimos con los estándares de seguridad PCI DSS</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-zinc-300">Acceso Restringido</h4>
                  <p>Solo tú puedes ver y gestionar tus cuentas bancarias</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
