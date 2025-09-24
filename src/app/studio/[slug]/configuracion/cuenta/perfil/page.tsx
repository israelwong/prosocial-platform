import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Mail, Lock, Settings } from 'lucide-react';

interface PerfilPageProps {
  params: {
    slug: string;
  };
}

export default async function PerfilPage({ params }: PerfilPageProps) {
  const { slug } = await params;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-white">Perfil</h1>
        <p className="text-zinc-400">
          Tu nombre, correo de inicio de sesión y contraseña
        </p>
      </div>

      {/* Perfil principal */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5" />
            Información Personal
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Gestiona tu información personal y de contacto
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <User className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
            <h3 className="text-lg font-medium text-white mb-2">
              Perfil de Usuario
            </h3>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Actualiza tu nombre, correo de inicio de sesión y contraseña.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Settings className="h-4 w-4 mr-2" />
              Editar Perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuraciones adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Correo Electrónico
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Cambia tu correo de inicio de sesión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Mail className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
              <p className="text-sm text-zinc-400">Correo no configurado</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Contraseña
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Cambia tu contraseña
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-6">
              <Lock className="h-8 w-8 mx-auto mb-2 text-zinc-600" />
              <p className="text-sm text-zinc-400">Contraseña configurada</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}