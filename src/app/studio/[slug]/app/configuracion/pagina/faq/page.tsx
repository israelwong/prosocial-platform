import React from 'react';
import { ZenCard } from '@/components/ui/zen';

export default function FAQPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    FAQ
                </h1>
                <p className="text-zinc-400">
                    Preguntas frecuentes
                </p>
            </div>

            <ZenCard className="p-6">
                <div className="text-center py-8">
                    <div className="text-zinc-400 mb-4">
                        <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">
                        Preguntas Frecuentes
                    </h3>
                    <p className="text-zinc-400 mb-4">
                        Gestiona las preguntas frecuentes
                    </p>
                    <div className="text-sm text-zinc-500">
                        Funcionalidad en desarrollo
                    </div>
                </div>
            </ZenCard>
        </div>
    );
}
