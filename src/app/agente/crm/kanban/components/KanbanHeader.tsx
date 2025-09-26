import React from 'react';
import { Button } from '@/components/ui/shadcn/button';
import { Plus } from 'lucide-react';

interface KanbanHeaderProps {
    onNewLead?: () => void;
}

export function KanbanHeader({ onNewLead }: KanbanHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold">CRM Kanban</h1>
                <p className="text-muted-foreground">Gestiona tus leads de manera visual</p>
            </div>
            <Button onClick={onNewLead}>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Lead
            </Button>
        </div>
    );
}
