'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CondicionesComercialesList } from './components/CondicionesComercialesList';

export default function CondicionesComercialesPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
      {/* Contenido principal */}
      <CondicionesComercialesList studioSlug={slug} />
    </div>
  );
}
