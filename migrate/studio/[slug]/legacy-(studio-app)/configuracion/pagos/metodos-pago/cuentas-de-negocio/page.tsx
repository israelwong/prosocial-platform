'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { CuentasBancariasList } from './components/CuentasBancariasList';

export default function CuentasBancariasPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="space-y-6">
      {/* Contenido principal con ZEN Design System */}
      <CuentasBancariasList studioSlug={slug} />
    </div>
  );
}