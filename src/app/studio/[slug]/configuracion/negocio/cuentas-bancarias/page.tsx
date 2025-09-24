import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Plus, Shield, CreditCard } from 'lucide-react';

interface CuentasBancariasPageProps {
  params: {
    slug: string;
  };
}

export default async function CuentasBancariasPage({ params }: CuentasBancariasPageProps) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Cuentas Bancarias</h1>
        <p className="text-zinc-400">
          Registra la cuenta donde recibirás los pagos de tus clientes
        </p>
      </div>

      {/* Cuentas principales */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Cuentas Bancarias
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Configura las cuentas donde recibirás los pagos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
            <h3 className="text-lg font-medium text-white mb-2">
              Cuentas Bancarias
            </h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Registra la cuenta donde recibirás los pagos de tus clientes. Puedes agregar múltiples cuentas.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cuenta Bancaria
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información de seguridad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Seguridad
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Tus datos bancarios están protegidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Shield className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
              <p className="text-sm text-zinc-400">Información encriptada</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Métodos de Pago
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Vinculado con métodos de pago
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <CreditCard className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
              <p className="text-sm text-zinc-400">Sin cuentas configuradas</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}