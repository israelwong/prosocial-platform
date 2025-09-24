'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { HeaderNavigation } from '@/components/ui/header-navigation';
import { CondicionesComercialesList } from './components/CondicionesComercialesList';
import { Plus } from 'lucide-react';

export default function CondicionesComercialesPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="space-y-6 mt-16 max-w-screen-lg mx-auto mb-16">
      {/* Header simplificado */}
      <HeaderNavigation
        title="Condiciones Comerciales"
        description="Define los términos y condiciones comerciales de tu negocio, incluyendo descuentos y anticipos"
        actionButton={{
          label: 'Nueva Condición',
          onClick: () => {
            // Esta función se manejará en el componente CondicionesComercialesList
            const event = new CustomEvent('openCondicionForm');
            window.dispatchEvent(event);
          },
          icon: Plus
        }}
      />

      {/* Contenido principal */}
      <CondicionesComercialesList studioSlug={slug} />
    </div>
  );
}
