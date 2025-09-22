'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users, UserCheck, UserX, Building2 } from 'lucide-react';

export default function PersonalPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestión de Personal</h1>
          <p className="text-zinc-400 mt-1">
            Administra empleados, proveedores y agentes de tu negocio
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Persona
        </Button>
      </div>

      {/* Contenido Principal */}
      <div className="grid gap-6">
        {/* Empleados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Empleados
            </CardTitle>
            <CardDescription>
              Gestiona el personal empleado de tu estudio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-2">
                No hay empleados registrados
              </h3>
              <p className="text-zinc-500 mb-4">
                Agrega empleados para gestionar el personal de tu estudio
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Empleado
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Proveedores */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Proveedores
            </CardTitle>
            <CardDescription>
              Gestiona proveedores y servicios externos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-2">
                No hay proveedores registrados
              </h3>
              <p className="text-zinc-500 mb-4">
                Agrega proveedores para gestionar servicios externos
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Proveedor
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Agentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Agentes
            </CardTitle>
            <CardDescription>
              Gestiona agentes y representantes de ventas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-2">
                No hay agentes registrados
              </h3>
              <p className="text-zinc-500 mb-4">
                Agrega agentes para gestionar el equipo de ventas
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Agente
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Información Adicional */}
        <Card>
          <CardHeader>
            <CardTitle>Información</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-zinc-400">
              <p>
                La gestión de personal te permite administrar:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Empleados:</strong> Personal contratado del estudio</li>
                <li><strong>Proveedores:</strong> Servicios externos y colaboradores</li>
                <li><strong>Agentes:</strong> Representantes de ventas y marketing</li>
              </ul>
              <p className="mt-4">
                Cada tipo de personal puede tener diferentes permisos y accesos al sistema.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
