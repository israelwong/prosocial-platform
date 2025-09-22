'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Edit, Trash2 } from 'lucide-react';

export default function CondicionesComercialesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Condiciones Comerciales</h1>
          <p className="text-zinc-400 mt-1">
            Define los términos y condiciones comerciales de tu negocio
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Condición
        </Button>
      </div>

      {/* Contenido Principal */}
      <div className="grid gap-6">
        {/* Condiciones Existentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Condiciones Comerciales
            </CardTitle>
            <CardDescription>
              Gestiona los términos y condiciones de tu negocio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
              <h3 className="text-lg font-medium text-zinc-300 mb-2">
                No hay condiciones comerciales configuradas
              </h3>
              <p className="text-zinc-500 mb-4">
                Define los términos y condiciones comerciales para tu negocio
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Condición
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
                Las condiciones comerciales te permiten definir términos específicos para:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Términos de pago y facturación</li>
                <li>Políticas de cancelación y reembolso</li>
                <li>Condiciones de entrega y servicios</li>
                <li>Términos de uso y privacidad</li>
                <li>Políticas de garantía y soporte</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
