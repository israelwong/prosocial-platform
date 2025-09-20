'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function KanbanPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Kanban</h1>
                <p className="text-zinc-400 mt-1">
                    Gestión de leads y eventos en pipeline
                </p>
            </div>

            <Card className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">Pipeline de Leads</CardTitle>
                    <CardDescription className="text-zinc-400">
                        Organiza tus leads por etapas del proceso de ventas
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-64 flex items-center justify-center text-zinc-500">
                        Kanban Board - En desarrollo
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
