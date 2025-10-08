import React from 'react';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import { obtenerTiposEvento } from '@/lib/actions/studio/negocio/tipos-evento.actions';
import { obtenerPaquetes } from '@/lib/actions/studio/manager/paquetes.actions';
import { TiposEventoList } from './components/TiposEventoList';

interface PaquetesPageProps {
    params: Promise<{ slug: string }>;
}

export default async function PaquetesPage({ params }: PaquetesPageProps) {
    const { slug } = await params;

    // Obtener tipos de evento
    const tiposResult = await obtenerTiposEvento(slug);
    const tiposEvento = tiposResult.success ? tiposResult.data || [] : [];

    // Obtener paquetes
    const paquetesResult = await obtenerPaquetes(slug);
    const paquetes = paquetesResult.success ? paquetesResult.paquetes || [] : [];

    return (
        <div className="space-y-6 max-w-screen-xl mx-auto mb-16">
            {/* Header sin botones */}
            <HeaderNavigation
                title="Paquetes"
                description="Crea y gestiona paquetes de servicios organizados por tipo de evento"
            />

            <TiposEventoList
                tiposEvento={tiposEvento}
                studioSlug={slug}
                paquetes={paquetes}
            />
        </div>
    );
}
