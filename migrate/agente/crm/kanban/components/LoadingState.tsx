import React from 'react';
import { KanbanHeader } from './KanbanHeader';

export function LoadingState() {
    return (
        <div className="space-y-6">
            <KanbanHeader />
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <div className="text-muted-foreground">Cargando CRM...</div>
                </div>
            </div>
        </div>
    );
}
