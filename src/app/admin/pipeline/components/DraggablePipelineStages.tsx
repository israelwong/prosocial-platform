'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    GripVertical,
    Eye
} from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PipelineStageActions } from './PipelineStageActions';
import { reorderPipelineStages } from '../actions';

interface PipelineStage {
    id: string;
    name: string;
    description: string | null;
    color: string;
    order: number;
    isActive: boolean;
    leadCount: number;
}

interface DraggablePipelineStagesProps {
    stages: PipelineStage[];
    onEdit: (stage: PipelineStage) => void;
}

interface SortableStageItemProps {
    stage: PipelineStage;
    index: number;
    onEdit: (stage: PipelineStage) => void;
    canMoveUp: boolean;
    canMoveDown: boolean;
}

function SortableStageItem({ stage, index, onEdit, canMoveUp, canMoveDown }: SortableStageItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: stage.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
        >
            <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                    <div
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing"
                    >
                        <GripVertical className="h-4 w-4 text-zinc-500" />
                    </div>
                    <span className="text-sm font-medium text-zinc-400 w-6">
                        {stage.order}
                    </span>
                </div>

                <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: stage.color }}
                ></div>

                <div className="flex-1">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white">{stage.name}</h3>
                        <Badge
                            variant="outline"
                            className={`text-xs ${stage.isActive
                                ? 'border-green-500 text-green-400'
                                : 'border-red-500 text-red-400'
                                }`}
                        >
                            {stage.isActive ? 'Activa' : 'Inactiva'}
                        </Badge>
                    </div>
                    <p className="text-sm text-zinc-400">{stage.description}</p>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <div className="text-right mr-4">
                    <p className="text-sm font-medium text-white">{stage.leadCount}</p>
                    <p className="text-xs text-zinc-400">leads</p>
                </div>

                <PipelineStageActions
                    stage={stage}
                    onEdit={onEdit}
                    canMoveUp={canMoveUp}
                    canMoveDown={canMoveDown}
                />
            </div>
        </div>
    );
}

export function DraggablePipelineStages({ stages, onEdit }: DraggablePipelineStagesProps) {
    const [localStages, setLocalStages] = useState(stages);

    // Sincronizar el estado local cuando cambien las props
    useEffect(() => {
        setLocalStages(stages);
    }, [stages]);
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = localStages.findIndex((stage) => stage.id === active.id);
            const newIndex = localStages.findIndex((stage) => stage.id === over.id);

            const newStages = arrayMove(localStages, oldIndex, newIndex);
            setLocalStages(newStages);

            // Actualizar el orden en la base de datos
            const stageIds = newStages.map(stage => stage.id);
            const result = await reorderPipelineStages(stageIds);

            if (!result.success) {
                console.error('Error reordering stages:', result.error);
                // Revertir el cambio local si falla
                setLocalStages(stages);
            }
        }
    };

    return (
        <Card className="border border-zinc-800 bg-zinc-900 shadow-sm">
            <CardHeader className="border-b border-zinc-800">
                <CardTitle className="text-lg font-semibold text-white">Etapas del Pipeline</CardTitle>
                <p className="text-sm text-zinc-400">
                    Arrastra para reordenar las etapas del pipeline
                </p>
            </CardHeader>
            <CardContent className="p-0">
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={localStages.map(stage => stage.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="divide-y divide-zinc-800">
                            {localStages.map((stage, index) => (
                                <SortableStageItem
                                    key={stage.id}
                                    stage={stage}
                                    index={index}
                                    onEdit={onEdit}
                                    canMoveUp={index > 0}
                                    canMoveDown={index < localStages.length - 1}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            </CardContent>
        </Card>
    );
}
