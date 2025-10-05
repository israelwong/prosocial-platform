'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CondicionesComercialesList } from './components/CondicionesComercialesList';

export default function CondicionesComercialesPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="space-y-6">
      {/* Contenido principal con ZEN Design System */}
      <CondicionesComercialesList studioSlug={slug} />
    </div>
  );
}
