"use client";

import React from 'react';
import { usePlatformConfig } from '@/hooks/usePlatformConfig';

export function PlatformConfigDebug() {
    const { config, loading, error } = usePlatformConfig();

    if (process.env.NODE_ENV !== 'development') {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
            <h3 className="font-bold mb-2">Platform Config Debug</h3>
            <div className="space-y-1">
                <div>Loading: {loading ? 'true' : 'false'}</div>
                <div>Error: {error || 'none'}</div>
                <div>Config: {config ? 'loaded' : 'null'}</div>
                {config && (
                    <div>
                        <div>Nombre: {config.nombre_empresa}</div>
                        <div>Logo: {config.logo_url || 'none'}</div>
                    </div>
                )}
            </div>
        </div>
    );
}
