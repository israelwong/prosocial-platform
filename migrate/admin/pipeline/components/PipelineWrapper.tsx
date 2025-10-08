'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PipelinePageClient } from './PipelinePageClient';
import { PipelineStageModal } from './PipelineStageModal';

interface PipelineStage {
    id: string;
    name: string;
    description: string | null;
    color: string;
    order: number;
    isActive: boolean;
    leadCount: number;
    pipelineTypeId?: string | null;
    pipelineType?: {
        id: string;
        nombre: string;
        descripcion: string | null;
        color: string;
    } | null;
}

interface PipelineType {
    id: string;
    nombre: string;
    descripcion: string | null;
    color: string;
    stages: PipelineStage[];
}

interface PipelineWrapperProps {
    pipelineTypes: PipelineType[];
}

export function PipelineWrapper({ pipelineTypes }: PipelineWrapperProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
    const searchParams = useSearchParams();

    const [activeSection, setActiveSection] = useState<'comercial' | 'soporte'>('comercial');

    // Actualizar sección activa cuando cambien los query params
    useEffect(() => {
        const section = searchParams.get('section');
        if (section === 'soporte') {
            setActiveSection('soporte');
        } else {
            // Por defecto o si no hay query param, mostrar comercial
            setActiveSection('comercial');
        }
    }, [searchParams]);

    const handleCreateStage = () => {
        setEditingStage(null);
        setIsModalOpen(true);
    };

    const handleEditStage = (stage: PipelineStage) => {
        setEditingStage(stage);
        setIsModalOpen(true);
    };

    // Escuchar el evento personalizado del layout
    useEffect(() => {
        const handleCreateStageEvent = () => {
            handleCreateStage();
        };

        window.addEventListener('createStage', handleCreateStageEvent);
        return () => {
            window.removeEventListener('createStage', handleCreateStageEvent);
        };
    }, []);

    // Separar pipelines por tipo
    const comercialPipeline = pipelineTypes.find(type => type.id === 'pipeline-comercial');
    const soportePipeline = pipelineTypes.find(type => type.id === 'pipeline-soporte');

    // Obtener el pipeline activo
    const activePipeline = activeSection === 'comercial' ? comercialPipeline : soportePipeline;
    const activePipelineTypes = activePipeline ? [activePipeline] : [];

    return (
        <>
            <PipelinePageClient
                pipelineTypes={activePipelineTypes}
                onCreateStage={handleCreateStage}
                onEditStage={handleEditStage}
                activeSection={activeSection}
            />

            <PipelineStageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                stage={editingStage}
                activeSection={activeSection}
                onSuccess={() => {
                    setIsModalOpen(false);
                    // Recargar la página para ver los cambios
                    window.location.reload();
                }}
            />
        </>
    );
}
