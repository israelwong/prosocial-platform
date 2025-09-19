'use client';

import React, { useState } from 'react';
import { SectionLayout } from '@/components/layouts/section-layout';
import { Plus } from 'lucide-react';
import { PipelinePageClient } from './PipelinePageClient';
import { PipelineStageModal } from './PipelineStageModal';

interface PipelineType {
    id: string;
    nombre: string;
    descripcion: string | null;
    color: string;
    stages: any[];
}

interface PipelineWrapperProps {
    pipelineTypes: PipelineType[];
}

export function PipelineWrapper({ pipelineTypes }: PipelineWrapperProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStage, setEditingStage] = useState<any>(null);

    const handleCreateStage = () => {
        setEditingStage(null);
        setIsModalOpen(true);
    };

    return (
        <SectionLayout
            title="Gestión de Pipeline"
            description="Configura las etapas del pipeline de ventas"
            // ✅ Sin navigationItems - solo header simple
            actionButton={{
                label: "Nueva Etapa",
                onClick: handleCreateStage, // ✅ Función onClick
                icon: Plus
            }}
        >
            <PipelinePageClient
                pipelineTypes={pipelineTypes}
                onCreateStage={handleCreateStage}
            />

            <PipelineStageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={() => {
                    setIsModalOpen(false);
                    // Recargar la página para ver los cambios
                    window.location.reload();
                }}
                editingStage={editingStage}
            />
        </SectionLayout>
    );
}
