'use client';

import React, { useState } from 'react';
import { SectionLayout } from '@/components/layouts/section-layout';
import { Plus } from 'lucide-react';
import { RedesSocialesPageClient } from './RedesSocialesPageClient';
import { PlataformaModal } from './PlataformaModal';

interface PlataformaRedSocial {
    id: string;
    nombre: string;
    slug: string;
    descripcion: string | null;
    color: string | null;
    icono: string | null;
    urlBase: string | null;
    orden: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface RedesSocialesWrapperProps {
    plataformas: PlataformaRedSocial[];
}

export function RedesSocialesWrapper({ plataformas }: RedesSocialesWrapperProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlataforma, setEditingPlataforma] = useState<PlataformaRedSocial | null>(null);

    const handleCreatePlataforma = () => {
        setEditingPlataforma(null);
        setIsModalOpen(true);
    };

    const handleEditPlataforma = (plataforma: PlataformaRedSocial) => {
        setEditingPlataforma(plataforma);
        setIsModalOpen(true);
    };

    return (
        <SectionLayout
            title="Redes Sociales"
            description="Gestiona las plataformas de redes sociales que los estudios pueden configurar"
            actionButton={{
                label: "Nueva Plataforma",
                onClick: handleCreatePlataforma,
                icon: Plus
            }}
        >
            <RedesSocialesPageClient
                plataformas={plataformas}
                onCreatePlataforma={handleCreatePlataforma}
                onEditPlataforma={handleEditPlataforma}
            />

            <PlataformaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                plataforma={editingPlataforma}
                onSuccess={() => {
                    setIsModalOpen(false);
                    // Recargar la página para ver los cambios
                    window.location.reload();
                }}
            />
        </SectionLayout>
    );
}
