'use client';

import React from 'react';
import { Bell } from 'lucide-react';
import { BreadcrumbHeader } from './BreadcrumbHeader';
import { ZenButton } from '@/components/ui/zen';

interface AppHeaderProps {
    studioSlug: string;
}

export function AppHeader({ studioSlug }: AppHeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-zinc-900/50 px-6 backdrop-blur-sm">
            <div className="flex items-center">
                <BreadcrumbHeader studioSlug={studioSlug} />
            </div>
            <div className="flex items-center gap-4">
                <ZenButton variant="ghost" size="icon" className="rounded-full">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notificaciones</span>
                </ZenButton>
            </div>
        </header>
    );
}
