'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Plus,
    GripVertical,
    Eye
} from 'lucide-react';
import { PipelineStageModal } from './PipelineStageModal';
import { DraggablePipelineStages } from './DraggablePipelineStages';

interface PipelineStage {
    id: string;
    name: string;
    description: string | null;
    color: string;
    order: number;
    isActive: boolean;
    leadCount: number;
}

interface PipelinePageClientProps {
    stages: PipelineStage[];
}

export function PipelinePageClient({ stages }: PipelinePageClientProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStage, setEditingStage] = useState<PipelineStage | null>(null);
    const router = useRouter();

    const handleCreateStage = () => {
        setEditingStage(null);
        setIsModalOpen(true);
    };

    const handleEditStage = (stage: PipelineStage) => {
        setEditingStage(stage);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingStage(null);
    };

    const handleModalSuccess = () => {
        // Refrescar la página para obtener los datos actualizados
        router.refresh();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gestión de Pipeline</h1>
                    <p className="text-zinc-400 mt-1 text-sm">
                        Configura las etapas del pipeline de ventas
                    </p>
                </div>
                <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={handleCreateStage}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Nueva Etapa
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border border-zinc-800 bg-zinc-900 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-400">Total Etapas</p>
                                <p className="text-xl font-bold text-white">{stages.length}</p>
                            </div>
                            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">E</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-400">Etapas Activas</p>
                                <p className="text-xl font-bold text-white">
                                    {stages.filter(stage => stage.isActive).length}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                                <Eye className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-zinc-800 bg-zinc-900 shadow-sm">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium text-zinc-400">Total Leads</p>
                                <p className="text-xl font-bold text-white">
                                    {stages.reduce((sum, stage) => sum + stage.leadCount, 0)}
                                </p>
                            </div>
                            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">L</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Pipeline Stages List with Drag & Drop */}
            <DraggablePipelineStages
                stages={stages}
                onEdit={handleEditStage}
            />

            {/* Instructions */}
            <Card className="border border-zinc-800 bg-zinc-900 shadow-sm">
                <CardContent className="p-4">
                    <h3 className="font-medium text-white mb-2">Instrucciones</h3>
                    <ul className="text-sm text-zinc-400 space-y-1">
                        <li>• Arrastra las etapas para reordenar el pipeline</li>
                        <li>• Las etapas activas se muestran en el Kanban CRM</li>
                        <li>• Las etapas inactivas no aparecen en el flujo de trabajo</li>
                        <li>• El orden de las etapas determina el flujo de los leads</li>
                        <li>• No se pueden eliminar etapas que contengan leads</li>
                    </ul>
                </CardContent>
            </Card>

            {/* Modal */}
            <PipelineStageModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                stage={editingStage}
                onSuccess={handleModalSuccess}
            />
        </div>
    );
}
