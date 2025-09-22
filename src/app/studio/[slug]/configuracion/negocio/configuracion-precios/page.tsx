'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Percent, Settings, Save } from 'lucide-react';

export default function ConfiguracionPreciosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Precios</h1>
          <p className="text-zinc-400 mt-1">
            Define los porcentajes de utilidad para servicios y productos
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Guardar Configuración
        </Button>
      </div>

      {/* Contenido Principal */}
      <div className="grid gap-6">
        {/* Configuración de Utilidad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Percent className="h-5 w-5" />
              Porcentajes de Utilidad
            </CardTitle>
            <CardDescription>
              Configura los márgenes de utilidad para tus servicios y productos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Utilidad en Servicios */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Utilidad en Servicios (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue="30"
                    className="w-32 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-zinc-400">
                    Margen de utilidad para servicios fotográficos
                  </span>
                </div>
              </div>

              {/* Utilidad en Productos */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Utilidad en Productos (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue="40"
                    className="w-32 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-zinc-400">
                    Margen de utilidad para productos físicos
                  </span>
                </div>
              </div>

              {/* Utilidad en Paquetes */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">
                  Utilidad en Paquetes (%)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    defaultValue="35"
                    className="w-32 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-zinc-400">
                    Margen de utilidad para paquetes combinados
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Configuración Avanzada */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Configuración Avanzada
            </CardTitle>
            <CardDescription>
              Opciones adicionales para el cálculo de precios
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-zinc-300">Incluir IVA en precios</h4>
                  <p className="text-sm text-zinc-400">
                    Los precios mostrados incluirán el IVA correspondiente
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-zinc-300">Redondear precios</h4>
                  <p className="text-sm text-zinc-400">
                    Redondear los precios calculados al múltiplo más cercano
                  </p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-zinc-300">Aplicar descuentos automáticos</h4>
                  <p className="text-sm text-zinc-400">
                    Aplicar descuentos automáticos en paquetes grandes
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
