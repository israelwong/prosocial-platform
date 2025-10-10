import React from 'react';
import { ZenCard, ZenCardContent, ZenButton } from '@/components/ui/zen';
import { RefreshCw, AlertCircle } from 'lucide-react';

interface ProfileErrorProps {
    error: string;
    onRetry?: () => void;
}

/**
 * ProfileError - Error state for profile page
 * Shows error message with retry option
 * Uses ZEN Design System components
 */
export function ProfileError({ error, onRetry }: ProfileErrorProps) {
    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
            <ZenCard className="max-w-md w-full">
                <ZenCardContent className="p-8 text-center space-y-6">
                    {/* Error Icon */}
                    <div className="flex justify-center">
                        <div className="h-16 w-16 bg-red-500/20 rounded-full flex items-center justify-center">
                            <AlertCircle className="h-8 w-8 text-red-400" />
                        </div>
                    </div>

                    {/* Error Message */}
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-zinc-100">
                            Error al cargar el perfil
                        </h2>
                        <p className="text-sm text-zinc-400">
                            {error}
                        </p>
                    </div>

                    {/* Retry Button */}
                    {onRetry && (
                        <ZenButton
                            onClick={onRetry}
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <RefreshCw className="h-4 w-4" />
                            Intentar de nuevo
                        </ZenButton>
                    )}

                    {/* Additional Help */}
                    <div className="text-xs text-zinc-500">
                        Si el problema persiste, contacta al soporte técnico
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
