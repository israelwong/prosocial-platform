'use client';

import { X, AlertTriangle } from 'lucide-react';
import { ZenButton, ZenCard, ZenCardContent } from '@/components/ui/zen';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    itemName?: string;
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
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <ZenCard className="w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-red-500/10">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-zinc-400 hover:text-white transition-colors"
                        disabled={loading}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Contenido */}
                <ZenCardContent className="p-6">
                    <div className="space-y-4">
                        <p className="text-zinc-300">{message}</p>

                        {itemName && (
                            <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
                                <p className="text-sm text-zinc-400 mb-1">Elemento a eliminar:</p>
                                <p className="text-white font-medium">{itemName}</p>
                            </div>
                        )}

                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                            <p className="text-sm text-red-300">
                                <strong>Advertencia:</strong> Esta acción no se puede deshacer.
                            </p>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-zinc-800">
                        <ZenButton
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancelar
                        </ZenButton>
                        <ZenButton
                            type="button"
                            variant="destructive"
                            onClick={onConfirm}
                            loading={loading}
                            disabled={loading}
                        >
                            Eliminar
                        </ZenButton>
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
