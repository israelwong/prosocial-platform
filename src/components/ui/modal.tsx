'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    showCloseButton?: boolean;
}

const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
};

export function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    className,
    maxWidth = '2xl',
    showCloseButton = false // Cambiar a false por defecto para evitar duplicado
}: ModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className={cn(
                    "bg-zinc-900 border-zinc-800 text-white max-h-[90vh] overflow-y-auto",
                    maxWidthClasses[maxWidth],
                    className
                )}
            >
                <DialogHeader className="space-y-0 pb-4">
                    <DialogTitle className="text-xl font-semibold text-white">
                        {title}
                    </DialogTitle>
                    {description && (
                        <p className="text-zinc-400 text-sm mt-1">
                            {description}
                        </p>
                    )}
                </DialogHeader>
                <div className="space-y-6">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
