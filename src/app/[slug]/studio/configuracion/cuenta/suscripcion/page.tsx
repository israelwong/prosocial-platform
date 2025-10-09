import React from 'react';
import { CreditCard } from 'lucide-react';
import { SubscriptionDataLoader } from './components';

interface SuscripcionPageProps {
  params: {
    slug: string;
  };
}

export default async function SuscripcionPage({ params }: SuscripcionPageProps) {
  const { slug: studioSlug } = await params;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <CreditCard className="h-8 w-8 text-green-400" />
          <h1 className="text-3xl font-bold text-white">Suscripción</h1>
        </div>
        <p className="text-zinc-400 text-lg">
          Gestiona tu plan de suscripción y revisa el historial de facturación.
        </p>
      </div>

      {/* Subscription Data Loader */}
      <SubscriptionDataLoader studioSlug={studioSlug} />
    </div>
  );
}
