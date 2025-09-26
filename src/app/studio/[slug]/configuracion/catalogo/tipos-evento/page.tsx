'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Button } from '@/components/ui/shadcn/button';
import { Plus, Clock, Calendar, Settings } from 'lucide-react';

export default function TiposEventoPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Tipos de Evento</h1>
          <p className="text-zinc-400 mt-1">
            Configura los tipos de eventos que ofrece tu estudio
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Tipo de Evento
        </Button>
      </div>

      {/* Contenido Principal */}
      <div className="grid gap-6">
        {/* Tipos de Evento Existentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tipos de Evento
            </CardTitle>
            <CardDescription>
              Gestiona los diferentes tipos de eventos que ofreces
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Evento por Día */}
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  <div>
                    <h4 className="font-medium text-zinc-300">Evento por Día</h4>
                    <p className="text-sm text-zinc-400">Servicios que se cobran por día completo</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Evento por Hora */}
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-green-500" />
                  <div>
                    <h4 className="font-medium text-zinc-300">Evento por Hora</h4>
                    <p className="text-sm text-zinc-400">Servicios que se cobran por hora</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Evento por Sesión */}
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  <div>
                    <h4 className="font-medium text-zinc-300">Evento por Sesión</h4>
                    <p className="text-sm text-zinc-400">Servicios que se cobran por sesión</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración de Tipos */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Tipos</CardTitle>
            <CardDescription>
              Personaliza los tipos de eventos según tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Nombre del Tipo
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Evento por Día"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">
                    Unidad de Medida
                  </label>
                  <select className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="dia">Día</option>
                    <option value="hora">Hora</option>
                    <option value="sesion">Sesión</option>
                    <option value="evento">Evento</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Descripción
                </label>
                <textarea
                  placeholder="Describe este tipo de evento..."
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Tipo de Evento
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
                Los tipos de eventos te permiten categorizar tus servicios según:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>Duración:</strong> Por día, hora, sesión, etc.</li>
                <li><strong>Modalidad:</strong> Presencial, virtual, híbrido</li>
                <li><strong>Alcance:</strong> Individual, grupal, empresarial</li>
                <li><strong>Especialización:</strong> Bodas, eventos corporativos, etc.</li>
              </ul>
              <p className="mt-4">
                Cada tipo de evento puede tener diferentes precios y configuraciones.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
