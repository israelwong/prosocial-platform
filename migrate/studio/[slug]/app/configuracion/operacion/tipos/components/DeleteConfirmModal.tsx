'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { ZenButton } from '@/components/ui/zen';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/shadcn/dialog';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName?: string | null;
    loading?: boolean;
}

export function DeleteConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    itemName,
    loading = false,
}: DeleteConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px] bg-zinc-900 text-white border-zinc-700">
                <DialogHeader>
                    <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                    <DialogTitle className="text-center text-xl font-bold text-red-400">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-400">
                        {message}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-4 text-center">
                    {itemName && (
                        <p className="text-lg font-semibold text-white mb-4">
                            <span className="text-zinc-500">Tipo de evento:</span>{' '}
                            <span className="text-red-400">{itemName}</span>
                        </p>
                    )}

                    <p className="text-sm text-red-300 mb-6">
                        ⚠️ Esta acción no se puede deshacer.
                    </p>

                    <div className="flex justify-center gap-4">
                        <ZenButton
                            variant="ghost"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </ZenButton>
                        <ZenButton
                            variant="destructive"
                            onClick={onConfirm}
                            loading={loading}
                        >
                            Eliminar
                        </ZenButton>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
